"use client";

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, CheckCircle2, ThumbsUp, ArrowRight, User, Bot, Gift, Send, DollarSign, HandHeart, ArrowLeftRight, TrendingUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { trustGameAPI } from '@/lib/api';

const TOTAL_ROUNDS = 10;
const INITIAL_BALANCE = 10; // Both sender and receiver start with 10 points

// Character component for trust game
const Character = ({ name, amount, isPlayer = false, role, showAmount = true }: { 
  name: string; 
  amount: number | string; 
  isPlayer?: boolean;
  role: 'sender' | 'receiver';
  showAmount?: boolean;
}) => {
  const getAvatarContent = () => {
    if (isPlayer) {
      return (
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full border-4 border-green-300 bg-green-100">
          <User className="h-6 w-6 text-green-600" />
        </div>
      );
    }

    return (
      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full border-4 border-blue-300 bg-blue-100">
        <Bot className="h-6 w-6 text-blue-600" />
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
              style={{ height: `${opponentHeight}%` }}
            >
              <span className="mt-1 text-[10px] font-bold text-white">{opponentBalance}</span>
            </div>
          </div>
        </div>
        
        {/* 수신자 막대 */}
        <div className="flex flex-col items-center">
          <div className="mb-1 text-xs font-medium text-gray-600">수신자</div>
          <div className="relative h-24 w-11 overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-200">
            <div 
              className="absolute bottom-0 w-full bg-green-500 transition-all duration-500 ease-out rounded-b-lg flex items-start justify-center"
              style={{ height: `${playerHeight}%` }}
            >
              <span className="mt-1 text-[10px] font-bold text-white">{playerBalance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trust game results summary component
const TrustGameResultsSummary = ({ gameResult }: { gameResult: any }) => {
  return (
    <div className="mt-4 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4">
      <h3 className="mb-3 flex items-center justify-center gap-2 text-base font-semibold">
        <DollarSign className="h-4 w-4" />
        라운드 결과
      </h3>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded border bg-white p-2 text-center">
          <div className="font-medium text-gray-600">받은 금액</div>
          <div className="text-xl font-bold text-blue-600">{gameResult.received_amount}</div>
        </div>
        <div className="rounded border bg-white p-2 text-center">
          <div className="font-medium text-gray-600">돌려준 금액</div>
          <div className="text-xl font-bold text-green-600">{gameResult.return_amount}</div>
        </div>
      </div>
      
      <div className="mt-3 rounded border bg-white p-3 text-center">
        <div className="font-medium text-gray-600">순수익</div>
        <div className="text-2xl font-bold text-purple-600">{gameResult.kept_amount}</div>
      </div>
    </div>
  );
};

export default function TrustGameReceiverPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(INITIAL_BALANCE);
  const [opponentBalance, setOpponentBalance] = useState(INITIAL_BALANCE); // 송신자 잔액 추적
  const [returnAmount, setReturnAmount] = useState([0]);
  const [roundResult, setRoundResult] = useState<any | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [receivedFromSender, setReceivedFromSender] = useState(0);
  const [maxReturn, setMaxReturn] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { toast } = useToast();
  const { getMedicalRecordNumber } = useAuth();

  const gameTitle = "Trust Game (Trustee)";
  const gameRules = [
    "You are a trustee in this trust game.",
    "Both trustor and trustee start with 10 points.",
    `There are ${TOTAL_ROUNDS} rounds in total.`,
    "In each round, the trustor's investment is tripled and sent to you.",
    "You can return part or all of the received amount to the trustor.",
    "Consider trust relationships and make wise decisions."
  ];

  useEffect(() => {
    // Simulate sender's investment for the new round (max 50% of current balance)
    const maxInvestment = Math.floor(opponentBalance / 2);
    const senderInvestment = Math.floor(Math.random() * maxInvestment) + 1; // Sender invests 1 to maxInvestment points
    const tripledAmount = senderInvestment * 3;
    
    // 송신자의 잔액에서 투자금액 차감
    setOpponentBalance(prev => prev - senderInvestment);
    
    setReceivedFromSender(tripledAmount);
    setMaxReturn(tripledAmount);
    setReturnAmount([0]);
  }, [currentRound]);
  
  const handleSubmit = async () => {
    const returnAmountNum = returnAmount[0];
    if (returnAmountNum < 0 || returnAmountNum > maxReturn) {
      toast({
        title: "Invalid Amount",
        description: `Please select a value between 0 and ${maxReturn}.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // 백엔드 API 호출
      const response = await trustGameAPI.submitRound({
        round: currentRound,
        role: "trustee",
        current_balance: playerBalance,
        received_amount: receivedFromSender,
        return_amount: returnAmountNum
      });

      // 백엔드에서 계산된 결과 사용
      setPlayerBalance(response.new_balance);
      
      // 송신자의 잔액 업데이트 (돌려준 금액만큼 추가)
      setOpponentBalance(prev => prev + returnAmountNum);
      
      setRoundResult({
        received_amount: receivedFromSender,
        return_amount: returnAmountNum,
        kept_amount: response.payoff,
        new_balance: response.new_balance
      });
      
      toast({
        title: `Round ${currentRound} Completed!`,
        description: response.message || `Your new balance: ${response.new_balance} points`,
      });

      if (currentRound >= TOTAL_ROUNDS) {
        setIsGameFinished(true);
      }
    } catch (error: any) {
      console.error('게임 제출 오류:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit game result.",
        variant: "destructive",
      });
    }
  };

  const handleNextRound = () => {
    setCurrentRound(prev => prev + 1);
    setReturnAmount([0]);
    setRoundResult(null);
    setStartTime(Date.now()); // 다음 라운드 시작 시간 초기화
  };

  const handleStartGame = () => {
    setHasStarted(true);
    setStartTime(Date.now());
  };

  if (isGameFinished) {
    return (
      <GameLayout title={gameTitle} rules={gameRules} playerBalance={playerBalance}>
        <Card className="shadow-lg animate-fadeInUp">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2 text-primary justify-center">
              <ThumbsUp className="h-8 w-8" /> Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="font-body text-lg">You have completed all {TOTAL_ROUNDS} rounds as a receiver.</p>
            <p className="font-body text-lg">Final balance: <strong className="font-headline text-3xl text-accent">{playerBalance} points</strong></p>
            <p className="font-body text-md text-foreground/80">
              How well did you build trust? Trust is a precious asset!
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 px-6">
              <Link href="/games">
                Back to Games <ArrowRight className="ml-2 h-5 w-5" />
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
        currentRound={currentRound}
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
      currentRound={currentRound}
      totalRounds={TOTAL_ROUNDS}
      playerBalance={playerBalance}
      showSidebar={false}
    >
      <div className="space-y-4">
        {/* Characters Display */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="font-headline text-lg text-center text-primary flex items-center justify-center gap-2">
              <HandHeart className="w-5 h-5" />
              라운드 {currentRound} - Trust Game
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Game Flow Visualization */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-5">
              <Character 
                name="송신자 (Bot)" 
                amount={`보냄 ${Math.floor(receivedFromSender/3)}`} 
                isPlayer={false} 
                role="sender"
                showAmount={true}
              />
              
              <div className="flex min-w-[120px] flex-col items-center">
                <ArrowLeftRight className="mb-2 h-7 w-7 text-blue-500" />
                <div className="text-sm text-gray-600 text-center">
                  <div>받은 금액</div>
                  <div className="font-bold text-2xl text-blue-600">{receivedFromSender}</div>
                  <div className="text-xs">(3배 증가)</div>
                </div>
              </div>
              
              <Character 
                name="수신자 (You)" 
                amount={roundResult ? `수익: ${roundResult.kept_amount}` : "결정중..."} 
                isPlayer={true} 
                role="receiver"
                showAmount={true}
              />
            </div>

            {/* Balance Chart */}
            <BalanceChart 
              playerBalance={playerBalance}
              opponentBalance={opponentBalance}
            />

            {/* Game Results Summary */}
            {roundResult && <TrustGameResultsSummary gameResult={roundResult} />}
          </CardContent>
          {roundResult && (
            <CardFooter className="justify-center">
              <Button 
                onClick={handleNextRound} 
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 px-8"
              >
                다음 라운드 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          )}
        </Card>

        {!roundResult && (
          <Card className="shadow-lg animate-fadeIn">
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-center text-lg text-primary">
                Your Decision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-blue-600">{receivedFromSender}포인트</div>
                <p className="text-sm text-gray-600">송신자로부터 받은 금액</p>
              </div>

              <div className="space-y-3">
                <Label className="block text-center font-body text-base leading-relaxed">
                  돌려줄 금액: <span className="font-bold text-green-600">{returnAmount[0]}포인트</span>
                </Label>

                <div className="mx-auto max-w-xl px-4">
                  <Slider
                    value={returnAmount}
                    onValueChange={setReturnAmount}
                    max={maxReturn}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="mx-auto flex max-w-xl justify-between px-4 text-sm text-gray-500">
                  <span>0</span>
                  <span className="font-medium">수익: {maxReturn - returnAmount[0]}포인트</span>
                  <span>{maxReturn}</span>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={handleSubmit} 
                  className="bg-primary px-8 py-2.5 text-base text-primary-foreground hover:bg-primary/90"
                >
                  결정하기 <Send className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GameLayout>
  );
}
