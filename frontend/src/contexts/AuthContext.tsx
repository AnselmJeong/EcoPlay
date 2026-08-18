"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (medicalRecordNumber: string, birthDate: string) => Promise<void>;
  logout: () => Promise<void>;
  getMedicalRecordNumber: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 병록번호를 이메일로 변환
function medicalRecordToEmail(medicalRecordNumber: string): string {
  return `${medicalRecordNumber}@eco.play`;
}

// 이메일에서 병록번호 추출
function emailToMedicalRecord(email: string): string {
  return email.replace('@eco.play', '');
}

// 생년월일 형식 검증 (YYYYMMDD)
function validateBirthDate(birthDate: string): boolean {
  if (!/^\d{8}$/.test(birthDate)) return false;

  const year = Number(birthDate.slice(0, 4));
  const month = Number(birthDate.slice(4, 6));
  const day = Number(birthDate.slice(6, 8));
  const date = new Date(year, month - 1, day);

  return (
    year >= 1900 &&
    year <= new Date().getFullYear() &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// 병록번호 형식 검증 (8자리 숫자)
function validateMedicalRecordNumber(medicalRecordNumber: string): boolean {
  return /^\d{8}$/.test(medicalRecordNumber);
}

function mapFirebaseAuthError(error: unknown): Error {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  const message =
    typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : '';

  switch (code) {
    case 'auth/user-not-found':
      return new Error('등록되지 않은 병록번호입니다. 연구진에게 문의해주세요.');
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return new Error('병록번호 또는 생년월일이 일치하지 않습니다.');
    case 'auth/invalid-email':
      return new Error('올바르지 않은 병록번호 형식입니다.');
    case 'auth/api-key-expired':
    case 'auth/invalid-api-key':
      return new Error(
        'Firebase 인증 설정의 API 키가 만료되었거나 잘못되었습니다. Firebase Console의 웹 앱 설정값으로 NEXT_PUBLIC_FIREBASE_API_KEY를 갱신하고 개발 서버를 다시 시작해주세요.'
      );
    case 'auth/app-not-authorized':
      return new Error(
        '현재 앱이 Firebase Authentication 사용 권한이 없습니다. Firebase Console에서 API 키 제한과 승인 도메인을 확인해주세요.'
      );
    default:
      return new Error(message || '인증 처리 중 오류가 발생했습니다.');
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (medicalRecordNumber: string, birthDate: string) => {
    try {
      // 입력값 검증
      if (!validateMedicalRecordNumber(medicalRecordNumber)) {
        throw new Error('병록번호는 8자리 숫자여야 합니다.');
      }
      
      if (!validateBirthDate(birthDate)) {
        throw new Error('생년월일은 YYYYMMDD 형식의 8자리 숫자여야 합니다.');
      }

      const email = medicalRecordToEmail(medicalRecordNumber);
      if (!auth) {
        throw new Error('인증 서비스가 초기화되지 않았습니다.');
      }
      await signInWithEmailAndPassword(auth, email, birthDate);
      
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });
    } catch (error: unknown) {
      console.error('로그인 오류:', error);
      throw mapFirebaseAuthError(error);
    }
  };

  const logout = async () => {
    try {
      if (!auth) {
        throw new Error('인증 서비스가 초기화되지 않았습니다.');
      }
      await signOut(auth);
      toast({
        title: "로그아웃",
        description: "성공적으로 로그아웃되었습니다.",
      });
    } catch (error: unknown) {
      console.error('로그아웃 오류:', error);
      throw mapFirebaseAuthError(error);
    }
  };

  const getMedicalRecordNumber = (): string | null => {
    if (!user || !user.email) return null;
    return emailToMedicalRecord(user.email);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    getMedicalRecordNumber,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 
