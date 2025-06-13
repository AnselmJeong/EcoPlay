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
import { savePublicGoodsResult, generateSessionId } from '@/services/gameService';

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
        <div className="w-16 h-16 rounded-full bg-green-100 border-4 border-green-300 flex items-center justify-center mb-2">
          <User className="w-8 h-8 text-green-600" />
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
      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-2 ${botColors[avatar] || 'bg-gray-100 border-gray-300 text-gray-600'}`}>
        <Bot className="w-8 h-8" />
      </div>
    );
  };

  const displayAmount = showAmount ? amount : "?";

  return (
    <div className="flex flex-col items-center p-4">
      {getAvatarContent()}
      <div className="bg-white rounded-lg shadow-md p-3 min-w-[80px] text-center border-2 border-gray-200">
        <div className={`w-8 h-8 rounded-full ${isPlayer ? 'bg-green-500' : 'bg-orange-500'} text-white flex items-center justify-center text-sm font-bold mx-auto mb-1`}>
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
    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
      <h3 className="text-lg font-semibold text-center mb-4 flex items-center justify-center gap-2">
        <BarChart3 className="w-5 h-5" />
        플레이어별 현재 잔액
      </h3>
      
      <div className="flex items-end justify-center gap-4 h-40">
        {/* 사용자 막대 */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-gray-600 mb-2">You</div>
          <div className="relative w-12 h-32 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
            <div 
              className="absolute bottom-0 w-full bg-green-500 transition-all duration-500 ease-out rounded-b-lg flex items-start justify-center"
              style={{ height: `${playerHeight}%` }}
            >
              <span className="text-white text-xs font-bold mt-1">{Math.round(playerBalance)}</span>
            </div>
          </div>
        </div>
        
        {/* 봇들 막대 */}
        {botBalances.map((balance, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-sm font-medium text-gray-600 mb-2">Bot {index + 1}</div>
            <div className="relative w-12 h-32 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
              <div 
                className={`absolute bottom-0 w-full ${playerColors[index + 1]} transition-all duration-500 ease-out rounded-b-lg flex items-start justify-center`}
                style={{ height: `${botHeights[index]}%` }}
              >
                <span className="text-white text-xs font-bold mt-1">{Math.round(balance)}</span>
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
    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
      <h3 className="text-lg font-semibold text-center mb-4 flex items-center justify-center gap-2">
        <DollarSign className="w-5 h-5" />
        Round Results
      </h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-2 bg-white rounded border">
          <div className="font-medium text-gray-600">Your Share</div>
          <div className="text-xl font-bold text-purple-600">{gameResult.share_per_player?.toFixed(1)}</div>
        </div>
        <div className="text-center p-2 bg-white rounded border">
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
  const [currentRound, setCurrentRound] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(INITIAL_POINTS);
  const [botBalances, setBotBalances] = useState([INITIAL_POINTS, INITIAL_POINTS, INITIAL_POINTS, INITIAL_POINTS]);
  const [donation, setDonation] = useState([0]);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [maxDonation, setMaxDonation] = useState(Math.floor(INITIAL_POINTS / 2));
  const [sessionId] = useState(() => generateSessionId());
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
      const medicalRecordNumber = getMedicalRecordNumber();
      if (!medicalRecordNumber) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      // 응답 시간 계산
      const responseTime = Date.now() - startTime;

      // 다른 플레이어들의 기여 시뮬레이션 (봇들의 현재 잔액 기반)
      const otherDonations = botBalances.map(botBalance => {
        const maxBotDonation = Math.floor(botBalance / 2);
        return Math.floor(Math.random() * maxBotDonation) + Math.floor(maxBotDonation * 0.1);
      });
      
      // 총 기여액 계산
      const totalContribution = donationAmount + otherDonations.reduce((sum, d) => sum + d, 0);
      const multipliedTotal = totalContribution * 1.5;
      const sharePerPlayer = multipliedTotal / NUM_PLAYERS;
      const personalReturn = sharePerPlayer;
      const netGain = personalReturn - donationAmount;
      const newBalance = playerBalance - donationAmount + personalReturn;
      
      // 봇들의 잔액 업데이트
      const newBotBalances = botBalances.map((botBalance, index) => {
        const botDonation = otherDonations[index];
        return botBalance - botDonation + sharePerPlayer;
      });
      setBotBalances(newBotBalances);

      // Firebase에 게임 결과 저장
      await savePublicGoodsResult({
        medicalRecordNumber,
        gameType: 'public-goods',
        round: currentRound,
        contribution: donationAmount,
        groupTotal: totalContribution,
        personalReturn: personalReturn,
        responseTime,
        sessionId,
        groupId: `group_${sessionId}`,
        otherDonations: otherDonations
      });

      const result = {
        user_donation: donationAmount,
        other_donations: otherDonations,
        total_contribution: totalContribution,
        share_per_player: sharePerPlayer,
        payoff: netGain,
        new_balance: newBalance
      };

      setPlayerBalance(newBalance);
      setGameResult(result);
      
      toast({
        title: `Round ${currentRound} Submitted!`,
        description: `Your new balance is ${newBalance.toFixed(1)} points.`,
      });

      if (currentRound >= TOTAL_ROUNDS) {
        setIsGameFinished(true);
      }
    } catch (error: any) {
      console.error('게임 저장 오류:', error);
      toast({
        title: "Error",
        description: error.message || "게임 결과 저장에 실패했습니다.",
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

  return (
    <GameLayout title={gameTitle} rules={gameRules} currentRound={currentRound} totalRounds={TOTAL_ROUNDS} playerBalance={playerBalance}>
      <div className="space-y-6">
        {/* Characters Display */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-center text-primary flex items-center justify-center gap-2">
              <Coins className="w-6 h-6" />
              Players in this Round
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Player Character */}
            <div className="flex justify-center mb-6">
              <Character 
                name="You" 
                amount={gameResult ? gameResult.user_donation : (donation[0] > 0 ? donation[0] : "?")} 
                isPlayer={true} 
                avatar="user"
                showAmount={true}
              />
            </div>
            
            {/* Bot Characters */}
            <div className="flex justify-center items-center gap-4 flex-wrap">
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
          <CardHeader>
            <CardTitle className="font-headline text-xl text-center text-primary">
              Your Decision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!gameResult ? (
              <>
                {/* Donation Slider */}
                <div className="space-y-4">
                  <Label className="font-body text-lg text-center block">
                    How much would you like to donate to the common account?
                  </Label>
                  <div className="px-4 max-w-sm mx-auto">
                    <Slider
                      value={donation}
                      onValueChange={setDonation}
                      max={maxDonation}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-foreground/70 max-w-sm mx-auto px-4">
                    <span>0 points</span>
                    <span className="font-semibold">Current: {donation[0]} points</span>
                    <span>{maxDonation} points (max)</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 px-8"
                  >
                    Submit Donation
                  </Button>
                </div>
              </>
            ) : (
              /* Next Round Button */
              <div className="text-center">
                <Button 
                  onClick={handleNextRound} 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 px-8"
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
