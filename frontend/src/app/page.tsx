"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Handshake, Target, LogOut } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout, loading, getMedicalRecordNumber, isPasswordDefault } = useAuth();
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.push('/consent');
  };

  const handleResearchParticipation = async () => {
    if (user) {
      // 이미 로그인된 상태에서 기본 비밀번호인지 확인
      const medicalRecordNumber = getMedicalRecordNumber();
      if (medicalRecordNumber) {
        const passwordChangedKey = `password_changed_${medicalRecordNumber}`;
        const hasChangedPassword = localStorage.getItem(passwordChangedKey) === 'true';
        
        if (!hasChangedPassword) {
          // 기본 비밀번호라면 비밀번호 변경을 위해 모달 열기
          setIsAuthModalOpen(true);
        } else {
          // 이미 비밀번호를 변경했다면 바로 동의서 페이지로
          router.push('/consent');
        }
      } else {
        // 병록번호를 가져올 수 없으면 모달 열기
        setIsAuthModalOpen(true);
      }
    } else {
      // 로그인되지 않은 상태라면 로그인 모달 열기
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  // 로딩 중일 때만 로딩 화면 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-6 space-y-8 max-w-6xl">
        {/* Hero Section */}
        <Card className="overflow-hidden shadow-xl border-2 border-blue-200">
          <div 
            className="relative h-[400px] md:h-[500px] flex items-center justify-center"
            style={{
              backgroundImage: "url('/images/backgrounds/hero.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-amber-800/70"></div>
            
            {/* Main Content */}
            <div className="absolute right-6 md:right-12 top-12 md:top-16 text-right text-white z-30 max-w-md md:max-w-lg">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-loose drop-shadow-lg">
                당신은 과연 <span className="text-yellow-300 drop-shadow-md">타인을</span><br />
                얼마나 신뢰할 수 있나요?
              </h1>
              
              <div className="mt-16 md:mt-20">
                <p className="text-base md:text-xl mb-6 md:mb-8 text-white/90 drop-shadow-md">
                  연구에 참여하여<br />
                  나의 신뢰감각을 시험해보세요
                </p>
                
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-lg shadow-xl transform transition-all duration-200 hover:scale-105"
                >
                  <UserPlus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  회원가입/로그인
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Content Section */}
        <Card className="shadow-xl border-2 border-blue-200">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-8">
              {/* Left Content */}
              <div className="max-w-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">
                  관계의 시작, 신뢰
                </h2>
                
                <ul className="space-y-3 text-gray-700 text-base md:text-lg list-disc pl-5">
                  <li>
                    우리는 모두 타인과 관계를 맺어 함께 살아가고자 합니다. 하지만 누군가에게 관계를 맺는 것이 너무나 어려운 일일 입니다.
                  </li>
                  
                  <li>
                    모든 관계 맺기는 타인에 대한 기본적 신뢰로부터 출발합니다.
                  </li>
                  
                  <li>
                    이에 저희 연구진은 대인관계를 어려워하는 분들을 대상으로 타인에 대한 신뢰 정도를 살펴보고자 합니다.
                  </li>
                </ul>
              </div>

              {/* Right Image */}
              <div className="flex justify-center md:justify-end">
                <div 
                  className="w-full max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-lg bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('/images/backgrounds/trust.png')",
                    aspectRatio: '1024/517'
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Benefits Section */}
        <Card className="bg-blue-50 border-blue-300 border-2 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <Target className="w-6 md:w-8 h-6 md:h-8 text-blue-600" />
              <h3 className="text-xl md:text-2xl font-bold text-blue-800">
                연구 참여를 통해 무엇을 알 수 있나요?
              </h3>
            </div>
            
            <div className="grid md:grid-cols-1 gap-6 text-gray-700 text-lg md:text-base">
              <ul className="space-y-3 list-disc pl-5">
                <li>간단한 심리 게임과 짧은 설문을 통해 나의 신뢰 성향과 반응 패턴을 확인할 수 있습니다.</li>
                <li>여러분의 참여는 심리 정도와 대인 관계 어려움 사이의 관계를 이해하는 단서가 됩니다.</li>
                <li>수집된 자료는 연구 목적으로만 사용되며, 익명 처리로 안전하게 보호됩니다.</li>
                <li>개인 신뢰 정보는 철저히 수집되지 않으며, 참여자 개인 정보는 철저히 보호됩니다.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            onClick={handleResearchParticipation}
            size="lg" 
            className="bg-slate-500 hover:bg-slate-900 text-white px-8 md:px-12 py-3 md:py-4 text-lg md:text-xl font-semibold rounded-full shadow-xl transform transition-all duration-200 hover:scale-105"
          >
            연구 참여하기
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
} 