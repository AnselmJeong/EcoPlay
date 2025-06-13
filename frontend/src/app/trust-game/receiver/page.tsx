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
import { saveTrustGameResult, generateSessionId } from '@/services/gameService';

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
        <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-300 flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-green-600" />
        </div>
      );
    }

    return (
      <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-blue-300 flex items-center justify-center mb-3">
        <Bot className="w-10 h-10 text-blue-600" />
      </div>
    );
  };

  const displayAmount = showAmount ? amount : "?";
  const roleColor = role === 'sender' ? 'bg-blue-500' : 'bg-green-500';

  return (
    <div className="flex flex-col items-center p-4">
      {getAvatarContent()}
      <div className="bg-white rounded-lg shadow-md p-4 min-w-[100px] text-center border-2 border-gray-200">
        <div className={`w-20 h-20 rounded-full ${roleColor} text-white flex items-center justify-center text-lg font-bold mx-auto mb-2`}>
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
    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
      <h3 className="text-lg font-semibold text-center mb-4 flex items-center justify-center gap-2">
        <TrendingUp className="w-5 h-5" />
        현재 잔액
      </h3>
      
      <div className="flex items-end justify-center gap-8 h-40">
        {/* 송신자 막대 */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-gray-600 mb-2">송신자</div>
          <div className="relative w-16 h-32 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
            <div 
              className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500 ease-out rounded-b-lg flex items-start justify-center"
              style={{ height: `${opponentHeight}%` }}
            >
              <span className="text-gray-800 text-xs font-bold mt-1">{opponentBalance}</span>
            </div>
          </div>
        </div>
        
        {/* 수신자 막대 */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-gray-600 mb-2">수신자</div>
          <div className="relative w-16 h-32 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
            <div 
              className="absolute bottom-0 w-full bg-green-500 transition-all duration-500 ease-out rounded-b-lg flex items-start justify-center"
              style={{ height: `${playerHeight}%` }}
            >
              <span className="text-gray-800 text-xs font-bold mt-1">{playerBalance}</span>
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
    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
      <h3 className="text-lg font-semibold text-center mb-4 flex items-center justify-center gap-2">
        <DollarSign className="w-5 h-5" />
        라운드 결과
      </h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-white rounded border">
          <div className="font-medium text-gray-600">받은 금액</div>
          <div className="text-xl font-bold text-blue-600">{gameResult.received_amount}</div>
        </div>
        <div className="text-center p-3 bg-white rounded border">
          <div className="font-medium text-gray-600">돌려준 금액</div>
          <div className="text-xl font-bold text-green-600">{gameResult.return_amount}</div>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-white rounded border text-center">
        <div className="font-medium text-gray-600">순수익</div>
        <div className="text-2xl font-bold text-purple-600">{gameResult.kept_amount}</div>
      </div>
    </div>
  );
};

export default function TrustGameReceiverPage() {
  const [currentRound, setCurrentRound] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(INITIAL_BALANCE);
  const [opponentBalance, setOpponentBalance] = useState(INITIAL_BALANCE); // 송신자 잔액 추적
  const [returnAmount, setReturnAmount] = useState([0]);
  const [roundResult, setRoundResult] = useState<any | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [receivedFromSender, setReceivedFromSender] = useState(0);
  const [maxReturn, setMaxReturn] = useState(0);
  const [sessionId] = useState(() => generateSessionId());
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { toast } = useToast();
  const { getMedicalRecordNumber } = useAuth();

  const gameTitle = "신뢰 게임 (수신자)";
  const gameRules = [
    "당신은 이 게임에서 수신자 역할을 합니다.",
    `송신자와 수신자 모두 10포인트로 시작합니다.`,
    `총 ${TOTAL_ROUNDS}라운드로 진행됩니다.`,
    "각 라운드에서 송신자가 투자한 금액이 3배로 증가하여 당신에게 전달됩니다.",
    "받은 금액 중 일부 또는 전부를 송신자에게 돌려줄 수 있습니다.",
    "신뢰 관계를 고려하여 현명하게 결정하세요."
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
        title: "잘못된 금액",
        description: `0과 ${maxReturn} 사이의 값을 선택해주세요.`,
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

      // Firebase에 게임 결과 저장
      await saveTrustGameResult({
        medicalRecordNumber,
        gameType: 'trust-game',
        role: 'trustee',
        round: currentRound,
        decision: returnAmountNum,
        receivedAmount: maxReturn,
        multipliedAmount: maxReturn,
        responseTime,
        sessionId
      });

      const keptAmount = maxReturn - returnAmountNum;
      const newBalance = playerBalance + keptAmount;
      
      // 송신자에게 돌려준 금액만큼 송신자의 잔액 증가
      setOpponentBalance(prev => prev + returnAmountNum);
      
      setPlayerBalance(newBalance);
      setRoundResult({
        received_amount: maxReturn,
        return_amount: returnAmountNum,
        kept_amount: keptAmount,
        new_balance: newBalance
      });
      
      toast({
        title: `라운드 ${currentRound} 완료!`,
        description: `${keptAmount}포인트를 획득했습니다. 총 잔액: ${newBalance}포인트`,
      });

      if (currentRound >= TOTAL_ROUNDS) {
        setIsGameFinished(true);
      }
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "오류",
        description: "게임 제출 중 오류가 발생했습니다.",
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
            <p className="font-body text-lg">모든 {TOTAL_ROUNDS}라운드를 완료했습니다.</p>
            <p className="font-body text-lg">최종 잔액: <strong className="font-headline text-3xl text-accent">{playerBalance}포인트</strong></p>
            <p className="font-body text-md text-foreground/80">
              당신의 결정이 송신자와의 신뢰 관계에 어떤 영향을 미쳤는지 생각해보세요.
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

  return (
    <GameLayout title={gameTitle} rules={gameRules} currentRound={currentRound} totalRounds={TOTAL_ROUNDS} playerBalance={playerBalance}>
      <div className="space-y-6">
        {/* Characters Display */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-center text-primary flex items-center justify-center gap-2">
              <HandHeart className="w-6 h-6" />
              라운드 {currentRound} - 신뢰 게임
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Game Flow Visualization */}
            <div className="flex justify-center items-center gap-8 mb-6">
              <Character 
                name="송신자 (Bot)" 
                amount={`보냄 ${Math.floor(receivedFromSender/3)}`} 
                isPlayer={false} 
                role="sender"
                showAmount={true}
              />
              
              <div className="flex flex-col items-center">
                <ArrowLeftRight className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-sm text-gray-600 text-center">
                  <div>받은 금액</div>
                  <div className="font-bold text-3xl text-blue-600">{receivedFromSender}</div>
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

            {/* Game Controls - Slider Section */}
            {!roundResult && (
              <div className="mt-6 w-full max-w-md mx-auto space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{receivedFromSender}포인트</div>
                  <p className="text-sm text-gray-600">송신자로부터 받은 금액</p>
                </div>
                
                <div className="space-y-4">
                  <Label className="font-body text-lg block text-center">
                    돌려줄 금액: <span className="font-bold text-green-600">{returnAmount[0]}포인트</span>
                  </Label>
                  
                  <Slider
                    value={returnAmount}
                    onValueChange={setReturnAmount}
                    max={maxReturn}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <span className="font-medium">수익: {maxReturn - returnAmount[0]}포인트</span>
                    <span>{maxReturn}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit} 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3"
                >
                  결정하기 <Send className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
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
      </div>
    </GameLayout>
  );
}
