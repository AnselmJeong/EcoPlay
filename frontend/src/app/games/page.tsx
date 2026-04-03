import GameCard from '@/components/GameCard';
import { Brain, Handshake, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-headline font-bold text-primary mb-4 animate-fadeIn">Welcome to EcoPlay!</h2>
        <p className="text-xl font-body text-foreground/80 max-w-2xl mx-auto animate-fadeInUp">
          실험 순서에 맞춰 협동 과제와 반복 신뢰 과제를 진행하세요.
          먼저 공공재 게임을 끝내고, 신뢰 게임 튜토리얼과 본실험으로 이어가면 됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        <GameCard
          title="Public Goods Game"
          description="15번의 라운드 동안 공공 풀에 기여하면서 개인 보상과 집단 이익의 균형을 맞춥니다."
          link="/public-goods"
          Icon={Users}
        />
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
        />
      </div>
    </div>
  );
}
