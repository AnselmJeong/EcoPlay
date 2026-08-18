"use client";

import { useState } from 'react';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [medicalRecordNumber, setMedicalRecordNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showBirthDate, setShowBirthDate] = useState(false);

  const { login } = useAuth();
  const { toast } = useToast();

  const resetForm = () => {
    setMedicalRecordNumber('');
    setBirthDate('');
    setShowBirthDate(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await login(medicalRecordNumber, birthDate);
      handleClose();
      onSuccess?.();
    } catch (error: unknown) {
      toast({
        title: '로그인 실패',
        description: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBirthDate = (value: string) => {
    setBirthDate(value.replace(/\D/g, '').slice(0, 8));
  };

  const formatMedicalRecord = (value: string) => {
    setMedicalRecordNumber(value.replace(/\D/g, '').slice(0, 8));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">
            EcoPlay 연구 참여
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            연구진에게 안내받은 정보로 로그인해주세요
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">로그인</CardTitle>
            <CardDescription>
              계정이 등록되지 않았다면 연구진에게 문의해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-medical-record">병록번호</Label>
                <Input
                  id="login-medical-record"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="8자리 병록번호를 입력하세요"
                  value={medicalRecordNumber}
                  onChange={(event) => formatMedicalRecord(event.target.value)}
                  disabled={isLoading}
                  maxLength={8}
                  className="text-center text-lg tracking-widest"
                />
                <p className="text-xs text-gray-500">예: 12345678</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-birth-date">생년월일</Label>
                <div className="relative">
                  <Input
                    id="login-birth-date"
                    type={showBirthDate ? 'text' : 'password'}
                    inputMode="numeric"
                    autoComplete="current-password"
                    placeholder="YYYYMMDD"
                    value={birthDate}
                    onChange={(event) => formatBirthDate(event.target.value)}
                    disabled={isLoading}
                    maxLength={8}
                    className="text-center text-lg tracking-widest pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={showBirthDate ? '생년월일 숨기기' : '생년월일 표시하기'}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowBirthDate((visible) => !visible)}
                  >
                    {showBirthDate ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">예: 19901225 (1990년 12월 25일)</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={isLoading || medicalRecordNumber.length !== 8 || birthDate.length !== 8}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
