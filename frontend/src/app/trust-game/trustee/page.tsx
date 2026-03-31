"use client";

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, CheckCircle2, ThumbsUp, ArrowRight, User, Bot, Send, DollarSign, TrendingUp, ArrowLeftRight, HandHeart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { matchAPI, trustGameAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const ROUNDS_PER_OPPONENT = 10;
const NUM_OPPONENTS = 4;
const TOTAL_ROUNDS = ROUNDS_PER_OPPONENT * NUM_OPPONENTS;

// 백엔드에서 가져올 personality 타입 정의
interface OpponentPersonality {
  name: string;
  description: string;
  return_rate_range: [number, number];
}

// Character component for trust game
const Character = ({ name, amount, isPlayer = false, role, showAmount = true, opponentIndex = 0 }: { 
  name: string; 
  amount: number | string; 
  isPlayer?: boolean;
  role: 'sender' | 'receiver';
  showAmount?: boolean;
  opponentIndex?: number;
}) => {
  const getAvatarContent = () => {
    if (isPlayer) {
      return (
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full border-4 border-blue-300 bg-blue-100">
          <User className="h-6 w-6 text-blue-600" />
        </div>
      );
    }

    // 상대방마다 다른 아이콘과 색상
    const avatarStyles = [
      { bg: 'bg-green-100', border: 'border-green-300', iconColor: 'text-green-600', icon: Bot },
      { bg: 'bg-purple-100', border: 'border-purple-300', iconColor: 'text-purple-600', icon: TrendingUp },
      { bg: 'bg-orange-100', border: 'border-orange-300', iconColor: 'text-orange-600', icon: DollarSign },
      { bg: 'bg-pink-100', border: 'border-pink-300', iconColor: 'text-pink-600', icon: HandHeart }
    ];
    
    const style = avatarStyles[opponentIndex % avatarStyles.length];
    const IconComponent = style.icon;

    return (
      <div className={`mb-1 flex h-12 w-12 items-center justify-center rounded-full border-4 ${style.border} ${style.bg}`}>
        <IconComponent className={`h-6 w-6 ${style.iconColor}`} />
      </div>
    );
  };

  const displayAmount = showAmount ? amount : "?";
  const roleColor = role === 'sender' ? 'bg-blue-500' : 'bg-green-500';

  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-3 shadow-sm">
      {getAvatarContent()}
      <div className="w-full min-w-[92px] text-center">
        <div className={`mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${roleColor}`}>
          {displayAmount}
        </div>
        <div className="text-sm font-medium text-gray-700">{name}</div>
        <div className="text-xs text-gray-500 capitalize">{role}</div>
      </div>
    </div>
  );
};

// Balance chart component
const BalanceChart = ({ playerBalance, opponentBalance }: { 
  playerBalance: number; 
  opponentBalance: number; 
}) => {
  const maxBalance = Math.max(playerBalance, opponentBalance, 100); // 최소 100을 기준으로 설정
  const playerHeight = (playerBalance / maxBalance) * 100;
  const opponentHeight = (opponentBalance / maxBalance) * 100;

  return (
    <div className="mt-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <h3 className="mb-3 flex items-center justify-center gap-2 text-base font-semibold">
        <TrendingUp className="h-4 w-4" />
        현재 잔액
      </h3>
      
      <div className="flex h-28 items-end justify-center gap-6">
        {/* 송신자 막대 */}
        <div className="flex flex-col items-center">
          <div className="mb-1 text-xs font-medium text-gray-600">송신자</div>
          <div className="relative h-24 w-11 overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-200">
            <div 
              className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500 ease-out rounded-b-lg flex items-start justify-center"
              style={{ height: `${playerHeight}%` }}
            >
              <span className="mt-1 text-[10px] font-bold text-white">{playerBalance}</span>
            </div>
          </div>
        </div>
        
        {/* 수신자 막대 */}
        <div className="flex flex-col items-center">
          <div className="mb-1 text-xs font-medium text-gray-600">수신자</div>
          <div className="relative h-24 w-11 overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-200">
            <div 
              className="absolute bottom-0 w-full bg-purple-500 transition-all duration-500 ease-out rounded-b-lg flex items-start justify-center"
              style={{ height: `${opponentHeight}%` }}
            >
              <span className="mt-1 text-[10px] font-bold text-white">{opponentBalance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trust game results summary component
const TrustGameResultsSummary = ({ gameResult, investment, receivedBack }: { 
  gameResult: any; 
  investment: number;
  receivedBack: number;
}) => {
  return (
    <div className="mt-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4">
      <h3 className="mb-3 flex items-center justify-center gap-2 text-base font-semibold">
        <DollarSign className="h-4 w-4" />
        라운드 결과
      </h3>
      
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded border bg-white p-2 text-center">
          <div className="font-medium text-gray-600">투자 금액</div>
          <div className="text-xl font-bold text-blue-600">{investment}</div>
        </div>
        <div className="rounded border bg-white p-2 text-center">
          <div className="font-medium text-gray-600">전송된 금액</div>
          <div className="text-xl font-bold text-purple-600">{investment * 3}</div>
        </div>
        <div className="rounded border bg-white p-2 text-center">
          <div className="font-medium text-gray-600">돌려받은 금액</div>
          <div className="text-xl font-bold text-green-600">{receivedBack}</div>
        </div>
      </div>
      
      <div className="mt-3 rounded border bg-white p-3 text-center">
        <div className="font-medium text-gray-600">순손익</div>
        <div className={`text-2xl font-bold ${receivedBack - investment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {receivedBack - investment > 0 ? '+' : ''}{receivedBack - investment}
        </div>
      </div>
    </div>
  );
};

export default function TrustGameTrusteePage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentOverallRound, setCurrentOverallRound] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(10); // Initial starting balance
  const [opponentBalance, setOpponentBalance] = useState(10); // Initial opponent balance
  const [investment, setInvestment] = useState([0]);
  const [roundResult, setRoundResult] = useState<any | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [maxInvestment, setMaxInvestment] = useState(Math.floor(10 / 2));
  const [personalities, setPersonalities] = useState<OpponentPersonality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { toast } = useToast();
  const { getMedicalRecordNumber } = useAuth();

  // 백엔드에서 personalities 가져오기
  useEffect(() => {
    const loadPersonalities = async () => {
      try {
        const result = await matchAPI.getPersonalities();
        setPersonalities(result.personalities);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load personalities:', error);
        toast({
          title: "오류",
          description: "상대방 성격 데이터를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    loadPersonalities();
  }, [toast]);

  // 현재 상대방 정보 계산
  const currentOpponentIndex = Math.floor((currentOverallRound - 1) / ROUNDS_PER_OPPONENT);
  const roundWithCurrentOpponent = ((currentOverallRound - 1) % ROUNDS_PER_OPPONENT) + 1;
  const currentOpponent = personalities[currentOpponentIndex % personalities.length];

  const gameTitle = "Trust Game (Trustor)";
  const gameRules = [
    "You are a trustor (investor) in this trust game.",
    "You start with 10 points for each game session.",
    "In each round, you can invest up to half of your current balance.",
    "Your investment will be tripled and sent to the trustee.",
    "The trustee will then decide how much to return to you.",
    "Your goal is to build trust and maximize your final balance."
  ];

  useEffect(() => {
    // 현재 잔액의 50%와 최소 투자액 5포인트 중 큰 값을 설정
    const regularMaxInvestment = Math.floor(playerBalance / 2);
    const minimumInvestment = 5;
    setMaxInvestment(Math.max(regularMaxInvestment, minimumInvestment));
  }, [playerBalance]);

  const handleSubmit = async () => {
    const investmentAmount = investment[0];
    if (investmentAmount < 0 || investmentAmount > maxInvestment) {
      toast({
        title: "잘못된 투자 금액",
        description: `0과 ${maxInvestment} 사이의 값을 선택해주세요.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // 백엔드 API 호출
      const response = await trustGameAPI.submitRound({
        round: currentOverallRound,
        role: "trustor",
        current_balance: playerBalance,
        investment: investmentAmount
      });

      // 백엔드에서 계산된 결과 사용
      setPlayerBalance(response.new_balance);
      
      // 라운드 결과 설정
      setRoundResult({
        investment: investmentAmount,
        sent_amount: investmentAmount * 3,
        received_back: response.payoff + investmentAmount, // payoff + 원금 = 총 받은 금액
        net_gain: response.payoff,
        new_balance: response.new_balance
      });
      
      toast({
        title: `라운드 ${currentOverallRound} 완료!`,
        description: response.message || `새로운 잔액: ${response.new_balance}포인트`,
      });

      if (currentOverallRound >= TOTAL_ROUNDS) {
        setIsGameFinished(true);
      }
    } catch (error: any) {
      console.error('게임 제출 오류:', error);
      toast({
        title: "오류",
        description: error.message || "게임 제출에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleNextRound = () => {
    setCurrentOverallRound(prev => prev + 1);
    setInvestment([0]);
    setRoundResult(null);
    setStartTime(Date.now()); // 다음 라운드 시작 시간 초기화
  };

  const handleStartGame = () => {
    setHasStarted(true);
    setStartTime(Date.now());
  };

  // 로딩 중이거나 personalities가 없는 경우
  if (isLoading || personalities.length === 0) {
    return (
      <GameLayout title={gameTitle} rules={gameRules} playerBalance={playerBalance}>
        <Card className="shadow-lg animate-fadeIn">
          <CardContent className="min-h-[150px] flex items-center justify-center">
            <p className="font-body text-lg">게임 데이터를 불러오는 중...</p>
          </CardContent>
        </Card>
      </GameLayout>
    );
  }
  
  if (isGameFinished) {
    return (
      <GameLayout title={gameTitle} rules={gameRules} playerBalance={playerBalance}>
        <Card className="shadow-lg animate-fadeInUp">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2 text-primary justify-center">
              <ThumbsUp className="h-8 w-8" /> 게임 종료!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="font-body text-lg">모든 {TOTAL_ROUNDS}라운드를 송신자로서 완료했습니다.</p>
            <p className="font-body text-lg">최종 잔액: <strong className="font-headline text-3xl text-accent">{playerBalance}포인트</strong></p>
            <p className="font-body text-md text-foreground/80">
              다양한 상대방에게 얼마나 잘 적응했나요? 신뢰는 소중한 자산입니다!
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 px-6">
              <Link href="/games">
                게임 목록으로 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </GameLayout>
    );
  }

  if (!hasStarted) {
    return (
      <GameLayout
        title={gameTitle}
        rules={gameRules}
        currentRound={currentOverallRound}
        totalRounds={TOTAL_ROUNDS}
        playerBalance={playerBalance}
      >
        <Card className="mx-auto w-full max-w-2xl border-none bg-transparent shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-center font-headline text-2xl text-primary">
              Ready to Begin?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-center">
            <p className="mx-auto max-w-xl text-base leading-relaxed text-foreground/80">
              규칙을 확인했다면 게임을 시작하세요. 시작 후에는 설명 영역 없이 게임 화면만 보여 더 집중해서 진행할 수 있습니다.
            </p>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
              <div className="text-sm text-primary/70">Starting Balance</div>
              <div className="mt-1 text-3xl font-bold text-primary">{playerBalance} points</div>
            </div>
            <Button
              onClick={handleStartGame}
              className="bg-primary px-8 py-3 text-base text-primary-foreground hover:bg-primary/90"
            >
              Start Game
            </Button>
          </CardContent>
        </Card>
      </GameLayout>
    );
  }

  return (
    <GameLayout 
      title={gameTitle} 
      rules={gameRules} 
      currentRound={currentOverallRound} 
      totalRounds={TOTAL_ROUNDS} 
      playerBalance={playerBalance}
      currentOpponent={currentOpponent ? `${currentOpponent.name} (라운드 ${roundWithCurrentOpponent}/${ROUNDS_PER_OPPONENT})` : ''}
      showSidebar={false}
    >
      <div className="space-y-4">
        {/* Characters Display */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="font-headline text-lg text-center text-primary flex items-center justify-center gap-2">
              <HandHeart className="w-5 h-5" />
              라운드 {currentOverallRound} - Trust Game
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Game Flow Visualization */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-5">
              <Character 
                name="Trustor (You)" 
                amount={roundResult ? `Investment: ${roundResult.investment}` : `Balance: ${playerBalance}`} 
                isPlayer={true} 
                role="sender"
                showAmount={true}
              />
              
              <div className="flex min-w-[120px] flex-col items-center">
                <ArrowLeftRight className="mb-2 h-7 w-7 text-blue-500" />
                <div className="text-sm text-gray-600 text-center">
                  <div>Investment × 3</div>
                  <div className="font-bold text-2xl text-blue-600">
                    {roundResult ? roundResult.sent_amount : (investment[0] * 3)}
                  </div>
                  <div className="text-xs">(Sent Amount)</div>
                </div>
              </div>
              
              <Character 
                name="Trustee (Bot)" 
                amount={roundResult ? `Return: ${roundResult.received_back}` : "Waiting..."} 
                isPlayer={false} 
                role="receiver"
                showAmount={true}
                opponentIndex={currentOpponentIndex}
              />
            </div>

            {/* Balance Chart */}
            <BalanceChart 
              playerBalance={playerBalance}
              opponentBalance={opponentBalance}
            />

            {/* Game Results Summary */}
            {roundResult && (
              <TrustGameResultsSummary 
                gameResult={roundResult} 
                investment={roundResult.investment}
                receivedBack={roundResult.received_back}
              />
            )}
          </CardContent>
          {roundResult && (
            <CardFooter className="justify-center">
              <Button 
                onClick={handleNextRound} 
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 px-8"
              >
                Next Round <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          )}
        </Card>

        {!roundResult && currentOpponent && (
          <Card className="shadow-lg animate-fadeIn">
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-center text-lg text-primary">
                Your Decision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-blue-600">{playerBalance}포인트</div>
                <p className="text-sm text-gray-600">
                  Current Balance (Max Investment: {maxInvestment} points)
                  {playerBalance <= 10 && maxInvestment === 5 && (
                    <span className="mt-1 block font-medium text-orange-600">
                      Resurrection Chance: Up to 5 points can be invested!
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-3">
                <Label className="block text-center font-body text-base leading-relaxed">
                  Investment Amount: <span className="font-bold text-blue-600">{investment[0]} points</span>
                </Label>

                <div className="mx-auto max-w-xl px-4">
                  <Slider
                    value={investment}
                    onValueChange={setInvestment}
                    max={maxInvestment}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="mx-auto flex max-w-xl justify-between px-4 text-sm text-gray-500">
                  <span>0</span>
                  <span className="font-medium">Sent: {investment[0] * 3} points</span>
                  <span>{maxInvestment}</span>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={handleSubmit} 
                  className="bg-primary px-8 py-2.5 text-base text-primary-foreground hover:bg-primary/90"
                >
                  Invest <Send className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
