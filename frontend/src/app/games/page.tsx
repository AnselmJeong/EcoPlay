"use client";

import GameCard from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { useRTGAccess } from '@/hooks/use-rtg-access';
import { Brain, Handshake } from 'lucide-react';

export default function HomePage() {
  const { status, refresh } = useRTGAccess();
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-headline font-bold text-primary mb-4 animate-fadeIn">Welcome to EcoPlay!</h2>
        <p className="text-xl font-body text-foreground/80 max-w-2xl mx-auto animate-fadeInUp">
          신뢰 게임 튜토리얼을 완료한 뒤 반복 신뢰 게임 본실험을 진행하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        <GameCard
          title="RTG Tutorial"
          description="본실험 전에 trustee 역할을 짧게 경험하고 이해도 점검을 완료합니다."
          link="/trust-game/tutorial"
          Icon={Handshake}
          ctaText="Start Tutorial"
        />
        <GameCard
          title="Repeated Trust Game"
          description="서로 다른 세 명의 partner와 반복적으로 상호작용하며 투자와 회복 패턴을 측정합니다."
          link="/trust-game/main"
          Icon={Brain}
          ctaText="Start Main Task"
          disabled={status !== 'allowed'}
          disabledReason={status === 'checking'
            ? '튜토리얼 완료 여부를 확인하고 있습니다.'
            : status === 'error'
              ? '완료 여부를 확인하지 못했습니다. 아래 버튼으로 다시 확인해 주세요.'
              : '튜토리얼의 모든 연습과 이해도 점검을 통과하면 열립니다.'}
        />
      </div>
      {status === 'error' && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={refresh}>튜토리얼 완료 여부 다시 확인</Button>
        </div>
      )}
    </div>
  );
}
