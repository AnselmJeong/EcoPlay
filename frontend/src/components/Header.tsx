"use client";

import Link from 'next/link';
import { Coins, LogOut, User, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout, getMedicalRecordNumber } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header className="bg-primary/80 backdrop-blur-md text-primary-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 transform hover:scale-105 transition-transform duration-200">
          <Coins className="h-10 w-10 text-accent animate-pulse" />
          <h1 className="text-4xl font-headline font-bold tracking-tight">EcoPlay</h1>
        </Link>
        
        {/* 인증된 사용자 정보 표시 */}
        {user && (
          <div className="flex items-center gap-4">
            <Link href="/report" className="flex items-center gap-2 hover:text-accent transition-colors">
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">게임 결과</span>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>병록번호: {getMedicalRecordNumber()}</span>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
