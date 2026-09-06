"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { consentAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ResearchDocuments } from './research-documents';

export default function ConsentPage() {
  const [agreements, setAgreements] = useState({
    participation: false,
    dataCollection: false,
    privacy: false,
    voluntary: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { logout, getMedicalRecordNumber } = useAuth();
  const { toast } = useToast();

  const allAgreed = Object.values(agreements).every(agreed => agreed);

  const handleAgreementChange = (key: keyof typeof agreements, checked: boolean) => {
    setAgreements(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleConsent = async () => {
    if (!allAgreed) return;
    
    setIsLoading(true);
    try {
      const medicalRecordNumber = getMedicalRecordNumber();
      if (!medicalRecordNumber) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      // 백엔드 API 호출
      await consentAPI.submitConsent({
        medicalRecordNumber,
        consentGiven: true,
        consentDetails: {
          researchParticipation: agreements.participation,
          dataCollection: agreements.dataCollection,
          dataSharing: agreements.privacy,
          contactPermission: agreements.voluntary
        }
      });

      // 로컬 스토리지에도 저장 (빠른 접근용)
      localStorage.setItem('consentGiven', 'true');
      localStorage.setItem('consentDate', new Date().toISOString());
      
      toast({
        title: "동의 완료",
        description: "연구 참여 동의가 저장되었습니다.",
      });

      router.push('/questionnaire/demographic');
    } catch (error: any) {
      console.error('동의 저장 오류:', error);
      toast({
        title: "저장 오류",
        description: error.message || "동의 정보 저장에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    // 동의를 거부하면 로그아웃하고 메인 페이지로
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
    router.push('/');
  };

  return (
    <div lang="ko" className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            메인으로 돌아가기
          </Button>
        </div>

        <Card className="shadow-xl border-2 border-blue-200">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <CardTitle className="text-2xl md:text-3xl font-bold leading-snug break-keep text-blue-800 text-center">
              <h1>연구대상자용 설명문 및 동의서</h1>
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              설명문과 동의서를 읽으신 후, 아래의 동의 항목을 확인해 주세요.
            </p>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-6">
            <ResearchDocuments />

            {/* 동의 체크박스 */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4">동의 확인</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="participation"
                    checked={agreements.participation}
                    onCheckedChange={(checked) => handleAgreementChange('participation', checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="participation" className="text-gray-700 cursor-pointer">
                    연구의 목적과 절차에 대해 충분히 설명받았으며 이해하였습니다.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="dataCollection"
                    checked={agreements.dataCollection}
                    onCheckedChange={(checked) => handleAgreementChange('dataCollection', checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="dataCollection" className="text-gray-700 cursor-pointer">
                    연구 자료 수집 및 사용에 동의합니다.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={agreements.privacy}
                    onCheckedChange={(checked) => handleAgreementChange('privacy', checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-gray-700 cursor-pointer">
                    개인정보 처리 방침에 대해 이해하고 동의합니다.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="voluntary"
                    checked={agreements.voluntary}
                    onCheckedChange={(checked) => handleAgreementChange('voluntary', checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="voluntary" className="text-gray-700 cursor-pointer">
                    자발적으로 연구에 참여하며, 언제든지 참여를 중단할 수 있음을 이해합니다.
                  </label>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <Button
                onClick={handleDecline}
                variant="outline"
                size="lg"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              >
                <X className="w-4 h-4 mr-2" />
                참여하지 않겠습니다
              </Button>
              
              <Button
                onClick={handleConsent}
                disabled={!allAgreed || isLoading}
                size="lg"
                className={`flex-1 ${
                  allAgreed && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    동의하고 연구에 참여하겠습니다
                  </>
                )}
              </Button>
            </div>

            {!allAgreed && (
              <p className="text-sm text-gray-500 text-center">
                모든 항목에 동의하셔야 연구에 참여하실 수 있습니다.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
