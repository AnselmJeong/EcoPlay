"use client";

import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { questionnaireAPI } from '@/lib/api';

export type ParticipantGender = 'male' | 'female' | null;

const GENDER_STORAGE_PREFIX = 'participant_gender_';
const genderCache = new Map<string, ParticipantGender>();
const inflightRequests = new Map<string, Promise<ParticipantGender>>();

function normalizeGender(value: unknown): ParticipantGender {
  if (typeof value !== 'string') return null;

  const normalized = value.trim().toLowerCase();

  if (['여', '여자', 'female', 'f', 'girl', 'woman'].includes(normalized)) {
    return 'female';
  }

  if (['남', '남자', 'male', 'm', 'boy', 'man'].includes(normalized)) {
    return 'male';
  }

  return null;
}

function findGender(value: unknown): ParticipantGender {
  if (!value) return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findGender(item);
      if (match) return match;
    }
    return null;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const direct = normalizeGender(record.gender);
    if (direct) return direct;

    for (const nestedValue of Object.values(record)) {
      const match = findGender(nestedValue);
      if (match) return match;
    }
  }

  return null;
}

async function loadGender(medicalRecordNumber: string): Promise<ParticipantGender> {
  if (genderCache.has(medicalRecordNumber)) {
    return genderCache.get(medicalRecordNumber) ?? null;
  }

  const storageKey = `${GENDER_STORAGE_PREFIX}${medicalRecordNumber}`;
  const cachedFromStorage = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
  const normalizedStored = normalizeGender(cachedFromStorage);

  if (normalizedStored) {
    genderCache.set(medicalRecordNumber, normalizedStored);
    return normalizedStored;
  }

  const existingRequest = inflightRequests.get(medicalRecordNumber);
  if (existingRequest) {
    return existingRequest;
  }

  const request = questionnaireAPI
    .getDetail(medicalRecordNumber)
    .then((detail) => {
      const detectedGender = findGender(detail);

      if (detectedGender && typeof window !== 'undefined') {
        localStorage.setItem(storageKey, detectedGender);
      }

      genderCache.set(medicalRecordNumber, detectedGender);
      return detectedGender;
    })
    .catch(() => null)
    .finally(() => {
      inflightRequests.delete(medicalRecordNumber);
    });

  inflightRequests.set(medicalRecordNumber, request);
  return request;
}

export function useParticipantGender() {
  const { getMedicalRecordNumber, loading } = useAuth();
  const [gender, setGender] = useState<ParticipantGender>(null);

  useEffect(() => {
    if (loading) return;

    const medicalRecordNumber = getMedicalRecordNumber();
    if (!medicalRecordNumber) {
      setGender(null);
      return;
    }

    let cancelled = false;

    void loadGender(medicalRecordNumber).then((resolvedGender) => {
      if (!cancelled) {
        setGender(resolvedGender);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [getMedicalRecordNumber, loading]);

  return gender;
}
