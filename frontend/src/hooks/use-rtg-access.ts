"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { rtgAPI } from '@/lib/api';

type AccessStatus = 'checking' | 'allowed' | 'blocked' | 'error';

export function useRTGAccess() {
  const { user, loading } = useAuth();
  const userId = user?.uid ?? null;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    userId: string | null;
    attempt: number;
    status: AccessStatus;
  } | null>(null);

  useEffect(() => {
    if (loading) return;
    let ignore = false;

    rtgAPI.getAccess().then(
      response => {
        if (!ignore) {
          setResult({ userId, attempt, status: response.allowed === true ? 'allowed' : 'blocked' });
        }
      },
      () => {
        if (!ignore) setResult({ userId, attempt, status: 'error' });
      },
    );

    return () => { ignore = true; };
  }, [userId, loading, attempt]);

  // Never reuse another account's result, or a result from before a retry.
  const status: AccessStatus = !loading && result?.userId === userId && result.attempt === attempt
    ? result.status
    : 'checking';

  return { status, refresh: () => setAttempt(value => value + 1) };
}
