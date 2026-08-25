"use client";

import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  Coins,
  Gamepad2,
  House,
  LogOut,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, logout, getMedicalRecordNumber } = useAuth();
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "초기 화면", icon: House, active: pathname === "/" },
    {
      href: "/games",
      label: "게임 화면",
      icon: Gamepad2,
      active: pathname?.startsWith("/games") || pathname?.startsWith("/trust-game"),
    },
    {
      href: "/questionnaire",
      label: "설문지 작성",
      icon: ClipboardList,
      active: pathname?.startsWith("/questionnaire"),
    },
    {
      href: "/report",
      label: "게임 결과",
      icon: BarChart3,
      active: pathname?.startsWith("/report"),
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-primary/80 px-6 py-4 text-primary-foreground shadow-md backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform duration-200 hover:scale-105"
        >
          <Coins className="h-10 w-10 text-accent animate-pulse" />
          <h1 className="text-4xl font-headline font-bold tracking-tight">EcoPlay</h1>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {navItems.map(({ href, label, icon: Icon, active }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    active ? "text-primary-foreground" : "text-primary-foreground/85 hover:text-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
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
