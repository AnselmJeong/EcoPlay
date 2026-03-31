"use client";

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, CheckCircle2, TrendingUp, ThumbsUp, ArrowRight, User, Bot, Coins, DollarSign, BarChart3 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { publicGoodsAPI } from '@/lib/api';

const TOTAL_ROUNDS = 10;
const INITIAL_POINTS = 100;
const NUM_PLAYERS = 5; // Player + 4 AI

// Comic character component
const Character = ({ name, amount, isPlayer = false, avatar, showAmount = true }: { 
  name: string; 
  amount: number | string; 
  isPlayer?: boolean;
  avatar: 'user' | 'bot1' | 'bot2' | 'bot3' | 'bot4';
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

    const botColors: Record<string, string> = {
      bot1: 'bg-blue-100 border-blue-300 text-blue-600',
      bot2: 'bg-yellow-100 border-yellow-300 text-yellow-600', 
      bot3: 'bg-purple-100 border-purple-300 text-purple-600',
      bot4: 'bg-pink-100 border-pink-300 text-pink-600'
    };

    return (
      <div className={`mb-1 flex h-12 w-12 items-center justify-center rounded-full border-4 ${botColors[avatar] || 'bg-gray-100 border-gray-300 text-gray-600'}`}>
        <Bot className="h-6 w-6" />
      </div>
    );
  };

  const displayAmount = showAmount ? amount : "?";

  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-3 shadow-sm">
      {getAvatarContent()}
      <div className="w-full min-w-[72px] text-center">
        <div className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${isPlayer ? 'bg-green-500' : 'bg-orange-500'}`}>
          {displayAmount}
        </div>
        <div className="text-sm font-medium text-gray-700">{name}</div>
      </div>
    </div>
  );
};

// Public Goods Game Balance Chart
const PublicGoodsBalanceChart = ({ playerBalance, botBalances }: { 
  playerBalance: number; 
  botBalances: number[];
}) => {
  const allBalances = [playerBalance, ...botBalances];
  const maxBalance = Math.max(...allBalances, 100); // 최소 100을 기준으로 설정
  
  const playerHeight = (playerBalance / maxBalance) * 100;
  const botHeights = botBalances.map(balance => (balance / maxBalance) * 100);

  const playerColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  const playerNames = ['You', 'Bot 1', 'Bot 2', 'Bot 3', 'Bot 4'];

  return (
    <div className="mt-4 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4">
      <h3 className="mb-3 flex items-center justify-center gap-2 text-base font-semibold">
        <BarChart3 className="h-4 w-4" />
        플레이어별 현재 잔액
      </h3>
      
      <div className="flex h-28 items-end justify-center gap-3">
        {/* 사용자 막대 */}
        <div className="flex flex-col items-center">
          <div className="mb-1 text-xs font-medium text-gray-600">You</div>
          <div className="relative h-24 w-11 overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-200">
            <div 
              className="absolute bottom-0 w-full bg-green-500 transition-all duration-500 ease-out rounded-b-lg flex items-start justify-center"
              style={{ height: `${playerHeight}%` }}
            >
              <span className="mt-1 text-[10px] font-bold text-white">{Math.round(playerBalance)}</span>
            </div>
          </div>
        </div>
        
        {/* 봇들 막대 */}
        {botBalances.map((balance, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="mb-1 text-xs font-medium text-gray-600">Bot {index + 1}</div>
            <div className="relative h-24 w-11 overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-200">
              <div 
                className={`absolute bottom-0 w-full ${playerColors[index + 1]} transition-all duration-500 ease-out rounded-b-lg flex items-start justify-center`}
                style={{ height: `${botHeights[index]}%` }}
              >
                <span className="mt-1 text-[10px] font-bold text-white">{Math.round(balance)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Game results summary component
const GameResultsSummary = ({ gameResult }: { gameResult: any }) => {
  return (
    <div className="mt-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4">
      <h3 className="mb-3 flex items-center justify-center gap-2 text-base font-semibold">
        <DollarSign className="h-4 w-4" />
        Round Results
      </h3>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded border bg-white p-2 text-center">
          <div className="font-medium text-gray-600">Your Share</div>
          <div className="text-xl font-bold text-purple-600">{gameResult.share_per_player?.toFixed(1)}</div>
        </div>
        <div className="rounded border bg-white p-2 text-center">
          <div className="font-medium text-gray-600">Your Payoff</div>
          <div className={`text-xl font-bold ${gameResult.payoff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {gameResult.payoff >= 0 ? '+' : ''}{gameResult.payoff.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PublicGoodsGamePage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(INITIAL_POINTS);
  const [botBalances, setBotBalances] = useState([INITIAL_POINTS, INITIAL_POINTS, INITIAL_POINTS, INITIAL_POINTS]);
  const [donation, setDonation] = useState([0]);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [maxDonation, setMaxDonation] = useState(Math.floor(INITIAL_POINTS / 2));
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { toast } = useToast();
  const { getMedicalRecordNumber } = useAuth();

  const gameTitle = "Public Goods Game";
  const gameRules = [
    `You start with ${INITIAL_POINTS} points.`,
    `There are ${TOTAL_ROUNDS} rounds. In each round, you can donate up to half your current balance (max ${maxDonation} points this round) to a common account.`,
    "The total amount donated by all players is multiplied by 1.5.",
    "This new total is then evenly distributed among all players.",
    "Your goal is to balance personal gain with group benefits."
  ];

  useEffect(() => {
    setMaxDonation(Math.floor(playerBalance / 2));
  }, [playerBalance]);
  
  const handleSubmit = async () => {
    const donationAmount = donation[0];
    if (donationAmount < 0 || donationAmount > maxDonation) {
      toast({
        title: "Invalid Donation",
        description: `Please select a value between 0 and ${maxDonation}.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // 백엔드 API 호출
      const response = await publicGoodsAPI.submitRound({
        round: currentRound,
        donation: donationAmount,
        current_balance: playerBalance
      });

      // 백엔드에서 계산된 결과 사용
      const result = {
        user_donation: response.user_donation,
        other_donations: response.other_donations,
        total_contribution: response.total_donated,
        share_per_player: response.share_per_player,
        payoff: response.payoff,
        new_balance: response.new_balance
      };

      // 봇들의 잔액 계산 (백엔드에서 other_donations 제공)
      const newBotBalances = botBalances.map((botBalance, index) => {
        const botDonation = response.other_donations[index];
        return botBalance - botDonation + response.share_per_player;
      });
      setBotBalances(newBotBalances);

      setPlayerBalance(response.new_balance);
      setGameResult(result);
      
      toast({
        title: `Round ${currentRound} Submitted!`,
        description: response.message || `Your new balance is ${response.new_balance.toFixed(1)} points.`,
      });

      if (currentRound >= TOTAL_ROUNDS) {
        setIsGameFinished(true);
      }
    } catch (error: any) {
      console.error('게임 제출 오류:', error);
      toast({
        title: "Error",
        description: error.message || "게임 제출에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleNextRound = () => {
    setCurrentRound(prev => prev + 1);
    setDonation([0]);
    setGameResult(null);
    setStartTime(Date.now()); // 다음 라운드 시작 시간 초기화
    setMaxDonation(Math.floor(playerBalance / 2)); // 새로운 라운드의 최대 기부액 업데이트
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
            <CardTitle className="font-headline text-3xl flex items-center gap-2 text-primary">
              <ThumbsUp className="h-8 w-8" /> Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-body text-lg">You have completed all {TOTAL_ROUNDS} rounds of the Public Goods Game.</p>
            <p className="font-body text-lg">Your final balance is: <strong className="font-headline text-2xl text-accent">{playerBalance.toFixed(1)} points</strong>.</p>
            <p className="font-body text-md text-foreground/80">Reflect on your strategy. Did you manage to balance your personal interest with the group's benefit?</p>
          </CardContent>
          <CardFooter>
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
        <Card className="mx-auto w-full max-w-2xl border-none shadow-none bg-transparent">
          <CardHeader className="pb-4">
            <CardTitle className="text-center font-headline text-2xl text-primary">
              Ready to Begin?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-center">
            <p className="mx-auto max-w-xl text-base leading-relaxed text-foreground/80">
              규칙을 확인했다면 게임을 시작하세요. 시작 후에는 게임 화면만 표시되어 더 집중해서 진행할 수 있습니다.
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
            <CardTitle className="font-headline flex items-center justify-center gap-2 text-lg text-primary">
              <Coins className="h-5 w-5" />
              Players in this Round
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <Character 
                name="You" 
                amount={gameResult ? gameResult.user_donation : (donation[0] > 0 ? donation[0] : "?")} 
                isPlayer={true} 
                avatar="user"
                showAmount={true}
              />
              <Character 
                name="Bot 1" 
                amount={gameResult ? gameResult.other_donations?.[0] : "?"} 
                avatar="bot1" 
                showAmount={true}
              />
              <Character 
                name="Bot 2" 
                amount={gameResult ? gameResult.other_donations?.[1] : "?"} 
                avatar="bot2" 
                showAmount={true}
              />
              <Character 
                name="Bot 3" 
                amount={gameResult ? gameResult.other_donations?.[2] : "?"} 
                avatar="bot3" 
                showAmount={true}
              />
              <Character 
                name="Bot 4" 
                amount={gameResult ? gameResult.other_donations?.[3] : "?"} 
                avatar="bot4" 
                showAmount={true}
              />
            </div>

            {/* Balance Chart */}
            <PublicGoodsBalanceChart 
              playerBalance={playerBalance}
              botBalances={botBalances}
            />

            {/* Game Results Summary */}
            {gameResult && <GameResultsSummary gameResult={gameResult} />}
          </CardContent>
        </Card>

        {/* Game Controls */}
        <Card className="shadow-lg animate-fadeIn">
          <CardHeader className="pb-4">
            <CardTitle className="font-headline text-center text-lg text-primary">
              Your Decision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {!gameResult ? (
              <>
                <div className="space-y-3">
                  <Label className="block text-center font-body text-base leading-relaxed">
                    How much would you like to donate to the common account?
                  </Label>
                  <div className="mx-auto max-w-xl px-4">
                    <Slider
                      value={donation}
                      onValueChange={setDonation}
                      max={maxDonation}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="mx-auto flex max-w-xl justify-between px-4 text-sm text-foreground/70">
                    <span>0 points</span>
                    <span className="font-semibold">Current: {donation[0]} points</span>
                    <span>{maxDonation} points (max)</span>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-primary px-8 py-2.5 text-base text-primary-foreground hover:bg-primary/90"
                  >
                    Submit Donation
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Button 
                  onClick={handleNextRound} 
                  className="bg-accent px-8 py-2.5 text-base text-accent-foreground hover:bg-accent/90"
                >
                  Next Round <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
