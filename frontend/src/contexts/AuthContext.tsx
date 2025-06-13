"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (medicalRecordNumber: string, birthDate: string) => Promise<void>;
  register: (medicalRecordNumber: string, birthDate: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  getMedicalRecordNumber: () => string | null;
  isPasswordDefault: () => Promise<boolean>;
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
  if (birthDate.length !== 8) return false;
  const year = parseInt(birthDate.substring(0, 4));
  const month = parseInt(birthDate.substring(4, 6));
  const day = parseInt(birthDate.substring(6, 8));
  
  if (year < 1900 || year > new Date().getFullYear()) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  return true;
}

// 병록번호 형식 검증 (8자리 숫자)
function validateMedicalRecordNumber(medicalRecordNumber: string): boolean {
  return /^\d{8}$/.test(medicalRecordNumber);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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
      await signInWithEmailAndPassword(auth, email, birthDate);
      
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });
    } catch (error: any) {
      console.error('로그인 오류:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('등록되지 않은 병록번호입니다. 회원가입을 먼저 진행해주세요.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('생년월일이 일치하지 않습니다.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('올바르지 않은 병록번호 형식입니다.');
      } else {
        throw new Error(error.message || '로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const register = async (medicalRecordNumber: string, birthDate: string) => {
    try {
      // 입력값 검증
      if (!validateMedicalRecordNumber(medicalRecordNumber)) {
        throw new Error('병록번호는 8자리 숫자여야 합니다.');
      }
      
      if (!validateBirthDate(birthDate)) {
        throw new Error('생년월일은 YYYYMMDD 형식의 8자리 숫자여야 합니다.');
      }

      const email = medicalRecordToEmail(medicalRecordNumber);
      await createUserWithEmailAndPassword(auth, email, birthDate);
      
      toast({
        title: "회원가입 성공",
        description: "계정이 성공적으로 생성되었습니다!",
      });
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('이미 등록된 병록번호입니다. 로그인을 시도해주세요.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('비밀번호는 6자리 이상이어야 합니다.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('올바르지 않은 병록번호 형식입니다.');
      } else {
        throw new Error(error.message || '회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "로그아웃",
        description: "성공적으로 로그아웃되었습니다.",
      });
    } catch (error: any) {
      console.error('로그아웃 오류:', error);
      throw new Error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user || !user.email) {
        throw new Error('로그인이 필요합니다.');
      }

      const medicalRecordNumber = emailToMedicalRecord(user.email);

      // 현재 비밀번호로 재인증
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // 새 비밀번호로 변경
      await updatePassword(user, newPassword);
      
      // localStorage에 비밀번호 변경 완료 기록
      const passwordChangedKey = `password_changed_${medicalRecordNumber}`;
      localStorage.setItem(passwordChangedKey, 'true');
      
      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      });
    } catch (error: any) {
      console.error('비밀번호 변경 오류:', error);
      
      if (error.code === 'auth/wrong-password') {
        throw new Error('현재 비밀번호가 일치하지 않습니다.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('새 비밀번호는 6자리 이상이어야 합니다.');
      } else {
        throw new Error(error.message || '비밀번호 변경 중 오류가 발생했습니다.');
      }
    }
  };

  const getMedicalRecordNumber = (): string | null => {
    if (!user || !user.email) return null;
    return emailToMedicalRecord(user.email);
  };

  const isPasswordDefault = async (): Promise<boolean> => {
    console.log('isPasswordDefault 호출됨');
    console.log('현재 user:', user);
    console.log('user.email:', user?.email);
    
    if (!user || !user.email) {
      console.log('user가 없어서 false 반환');
      return false;
    }
    
    const medicalRecordNumber = emailToMedicalRecord(user.email);
    console.log('추출된 병록번호:', medicalRecordNumber);
    
    try {
      // localStorage에서 비밀번호 변경 여부 확인
      const passwordChangedKey = `password_changed_${medicalRecordNumber}`;
      const hasChangedPassword = localStorage.getItem(passwordChangedKey) === 'true';
      
      console.log('localStorage 키:', passwordChangedKey);
      console.log('localStorage 값:', localStorage.getItem(passwordChangedKey));
      console.log('비밀번호 변경 여부:', hasChangedPassword);
      
      if (hasChangedPassword) {
        console.log('이미 비밀번호 변경됨 - false 반환');
        return false; // 이미 비밀번호를 변경했음
      }
      
      // localStorage에 기록이 없으면 기본 비밀번호로 간주
      console.log('기본 비밀번호로 간주 - true 반환');
      return true;
    } catch (error) {
      console.error('기본 비밀번호 확인 오류:', error);
      // 오류가 발생하면 안전하게 true를 반환하여 비밀번호 변경을 권장
      return true;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    changePassword,
    getMedicalRecordNumber,
    isPasswordDefault,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 