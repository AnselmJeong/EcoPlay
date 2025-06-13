"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, UserPlus, LogIn, Eye, EyeOff, Key } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // 비밀번호 변경용 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login, register, changePassword, user, isPasswordDefault } = useAuth();
  const { toast } = useToast();

  const resetForm = () => {
    setMedicalRecordNumber('');
    setBirthDate('');
    setShowPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(medicalRecordNumber, birthDate);
      
      // 로그인한 병록번호로 직접 기본 비밀번호 여부 확인
      const passwordChangedKey = `password_changed_${medicalRecordNumber}`;
      const hasChangedPassword = localStorage.getItem(passwordChangedKey) === 'true';
      
      console.log('로그인한 병록번호:', medicalRecordNumber);
      console.log('localStorage 키:', passwordChangedKey);
      console.log('localStorage 값:', localStorage.getItem(passwordChangedKey));
      console.log('비밀번호 변경 여부:', hasChangedPassword);
      
      if (!hasChangedPassword) {
        // 기본 비밀번호인 경우 비밀번호 변경 권장
        toast({
          title: "로그인 성공",
          description: "보안을 위해 비밀번호 변경을 권장합니다.",
          duration: 3000,
        });
        
        // 비밀번호 변경 탭을 활성화하고 폼 초기화
        setMedicalRecordNumber('');
        setBirthDate('');
        setActiveTab('changePassword');
      } else {
        // 이미 비밀번호를 변경한 경우 바로 연구로 진행
        toast({
          title: "로그인 성공",
          description: "연구 참여 페이지로 이동합니다.",
        });
        handleClose();
        onSuccess?.();
      }
    } catch (error: any) {
      toast({
        title: "로그인 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(medicalRecordNumber, birthDate);
      
      // 회원가입은 항상 기본 비밀번호이므로 변경 권장
      toast({
        title: "회원가입 성공",
        description: "보안을 위해 비밀번호 변경을 권장합니다.",
        duration: 3000,
      });
      
      // 비밀번호 변경 탭을 활성화하고 폼 초기화
      setMedicalRecordNumber('');
      setBirthDate('');
      setActiveTab('changePassword');
    } catch (error: any) {
      toast({
        title: "회원가입 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "비밀번호 확인 오류",
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "비밀번호 오류",
        description: "새 비밀번호는 6자리 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      handleClose();
      onSuccess?.(); // 비밀번호 변경 완료 후 연구 진행
      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      });
    } catch (error: any) {
      toast({
        title: "비밀번호 변경 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBirthDate = (value: string) => {
    // 숫자만 허용하고 8자리로 제한
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    setBirthDate(numbers);
  };

  const formatMedicalRecord = (value: string) => {
    // 숫자만 허용하고 8자리로 제한
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    setMedicalRecordNumber(numbers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">
            EcoPlay 연구 참여
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            연구 참여를 위해 로그인하거나 회원가입을 진행해주세요
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              로그인
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              회원가입
            </TabsTrigger>
            <TabsTrigger value="changePassword" className="flex items-center gap-2" disabled={!user}>
              <Key className="w-4 h-4" />
              비밀번호 변경
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">로그인</CardTitle>
                <CardDescription>
                  기존 계정으로 로그인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-medical-record">병록번호</Label>
                    <Input
                      id="login-medical-record"
                      type="text"
                      placeholder="8자리 병록번호를 입력하세요"
                      value={medicalRecordNumber}
                      onChange={(e) => formatMedicalRecord(e.target.value)}
                      disabled={isLoading}
                      maxLength={8}
                      className="text-center text-lg tracking-widest"
                    />
                    <p className="text-xs text-gray-500">예: 12345678</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-birth-date">암호(생년월일)</Label>
                    <div className="relative">
                      <Input
                        id="login-birth-date"
                        type={showPassword ? "text" : "password"}
                        placeholder="YYYYMMDD"
                        value={birthDate}
                        onChange={(e) => formatBirthDate(e.target.value)}
                        disabled={isLoading}
                        maxLength={8}
                        className="text-center text-lg tracking-widest pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
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
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">회원가입</CardTitle>
                <CardDescription>
                  연구 참여를 위한 새 계정을 만드세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-medical-record">병록번호</Label>
                    <Input
                      id="register-medical-record"
                      type="text"
                      placeholder="8자리 병록번호를 입력하세요"
                      value={medicalRecordNumber}
                      onChange={(e) => formatMedicalRecord(e.target.value)}
                      disabled={isLoading}
                      maxLength={8}
                      className="text-center text-lg tracking-widest"
                    />
                    <p className="text-xs text-gray-500">예: 12345678</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-birth-date">생년월일 (초기 비밀번호)</Label>
                    <div className="relative">
                      <Input
                        id="register-birth-date"
                        type={showPassword ? "text" : "password"}
                        placeholder="YYYYMMDD"
                        value={birthDate}
                        onChange={(e) => formatBirthDate(e.target.value)}
                        disabled={isLoading}
                        maxLength={8}
                        className="text-center text-lg tracking-widest pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      예: 19901225 (1990년 12월 25일)<br />
                      가입 후 비밀번호를 변경할 수 있습니다.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <strong>개인정보 보호:</strong> 병록번호는 안전하게 암호화되어 저장되며, 
                      연구 목적으로만 사용됩니다. 개인정보는 철저히 보호됩니다.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={isLoading || medicalRecordNumber.length !== 8 || birthDate.length !== 8}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        가입 중...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        회원가입
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="changePassword">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">비밀번호 변경</CardTitle>
                <CardDescription>
                  기존 비밀번호를 새로운 비밀번호로 변경하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">현재 비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="현재 비밀번호를 입력하세요"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">새 비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="새 비밀번호를 입력하세요 (6자리 이상)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="새 비밀번호를 다시 입력하세요"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
                    )}
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>주의:</strong> 비밀번호 변경 후에는 새로운 비밀번호로 로그인해야 합니다.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          변경 중...
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          비밀번호 변경
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleClose();
                        onSuccess?.();
                      }}
                      disabled={isLoading}
                    >
                      나중에 변경하고 연구 진행하기
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 