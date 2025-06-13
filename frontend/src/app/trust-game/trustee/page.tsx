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
import { matchAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { saveTrustGameResult, generateSessionId } from '@/services/gameService';

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
        <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-blue-300 flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-blue-600" />
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
      <div className={`w-20 h-20 rounded-full ${style.bg} border-4 ${style.border} flex items-center justify-center mb-3`}>
        <IconComponent className={`w-10 h-10 ${style.iconColor}`} />
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
              style={{ height: `${playerHeight}%` }}
            >
              <span className="text-gray-800 text-xs font-bold mt-1">{playerBalance}</span>
            </div>
          </div>
        </div>
        
        {/* 수신자 막대 */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-gray-600 mb-2">수신자</div>
          <div className="relative w-16 h-32 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
            <div 
              className="absolute bottom-0 w-full bg-purple-500 transition-all duration-500 ease-out rounded-b-lg flex items-start justify-center"
              style={{ height: `${opponentHeight}%` }}
            >
              <span className="text-gray-800 text-xs font-bold mt-1">{opponentBalance}</span>
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
    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
      <h3 className="text-lg font-semibold text-center mb-4 flex items-center justify-center gap-2">
        <DollarSign className="w-5 h-5" />
        라운드 결과
      </h3>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-white rounded border">
          <div className="font-medium text-gray-600">투자 금액</div>
          <div className="text-xl font-bold text-blue-600">{investment}</div>
        </div>
        <div className="text-center p-3 bg-white rounded border">
          <div className="font-medium text-gray-600">전송된 금액</div>
          <div className="text-xl font-bold text-purple-600">{investment * 3}</div>
        </div>
        <div className="text-center p-3 bg-white rounded border">
          <div className="font-medium text-gray-600">돌려받은 금액</div>
          <div className="text-xl font-bold text-green-600">{receivedBack}</div>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-white rounded border text-center">
        <div className="font-medium text-gray-600">순손익</div>
        <div className={`text-2xl font-bold ${receivedBack - investment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {receivedBack - investment > 0 ? '+' : ''}{receivedBack - investment}
        </div>
      </div>
    </div>
  );
};

export default function TrustGameTrusteePage() {
  const [currentOverallRound, setCurrentOverallRound] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(10); // Initial starting balance
  const [opponentBalance, setOpponentBalance] = useState(10); // Initial opponent balance
  const [investment, setInvestment] = useState([0]);
  const [roundResult, setRoundResult] = useState<any | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [maxInvestment, setMaxInvestment] = useState(Math.floor(playerBalance / 2));
  const [personalities, setPersonalities] = useState<OpponentPersonality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId] = useState(() => generateSessionId());
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

  const currentOpponentIndex = Math.floor((currentOverallRound - 1) / ROUNDS_PER_OPPONENT);
  const currentOpponent = personalities[currentOpponentIndex % NUM_OPPONENTS];
  const roundWithCurrentOpponent = (currentOverallRound - 1) % ROUNDS_PER_OPPONENT + 1;

  const gameTitle = "신뢰 게임 (송신자)";
  const gameRules = [
    "당신은 이 게임에서 송신자(Trustee) 역할을 합니다.",
    "시작 잔액은 10포인트입니다.",
    `${NUM_OPPONENTS}명의 다른 상대와 각각 ${ROUNDS_PER_OPPONENT}라운드씩 플레이합니다 (총 ${TOTAL_ROUNDS}라운드).`,
    "매 라운드에서 현재 잔액의 0~50%까지 투자할 수 있습니다.",
    "투자 금액은 3배로 증가하여 상대방(수신자)에게 전달됩니다.",
    "수신자는 받은 금액 중 일부를 당신에게 돌려줍니다.",
    "목표: 상대방의 신뢰성을 파악하고 현명하게 투자하여 포인트를 최대화하세요."
  ];
  


  useEffect(() => {
    setMaxInvestment(Math.floor(playerBalance / 2));
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
      const medicalRecordNumber = getMedicalRecordNumber();
      if (!medicalRecordNumber) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      // 응답 시간 계산
      const responseTime = Date.now() - startTime;

      // 상대방의 반환 시뮬레이션 (실제로는 백엔드에서 계산)
      const sentAmount = investmentAmount * 3;
      const returnRate = currentOpponent ? 
        (Math.random() * (currentOpponent.return_rate_range[1] - currentOpponent.return_rate_range[0]) + currentOpponent.return_rate_range[0]) / 100 
        : 0.5;
      const receivedBack = Math.floor(sentAmount * returnRate);
      const newBalance = playerBalance - investmentAmount + receivedBack;

      // Firebase에 게임 결과 저장
      await saveTrustGameResult({
        medicalRecordNumber,
        gameType: 'trust-game',
        role: 'trustor',
        round: currentOverallRound,
        decision: investmentAmount,
        receivedAmount: receivedBack,
        multipliedAmount: sentAmount,
        responseTime,
        sessionId,
        partnerId: `bot_${currentOpponentIndex}_${currentOpponent?.name || 'unknown'}`
      });

      setPlayerBalance(newBalance);
      
      // 수신자의 잔액도 업데이트
      const opponentGain = sentAmount - receivedBack;
      setOpponentBalance(prev => prev + opponentGain);
      
      setRoundResult({
        investment: investmentAmount,
        sent_amount: sentAmount,
        received_back: receivedBack,
        net_gain: newBalance - playerBalance,
        new_balance: newBalance
      });
      
      toast({
        title: `라운드 ${currentOverallRound} 완료!`,
        description: `새로운 잔액: ${newBalance}포인트`,
      });

      if (currentOverallRound >= TOTAL_ROUNDS) {
        setIsGameFinished(true);
      }
    } catch (error: any) {
      console.error('게임 저장 오류:', error);
      toast({
        title: "오류",
        description: error.message || "게임 결과 저장에 실패했습니다.",
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

  return (
    <GameLayout 
      title={gameTitle} 
      rules={gameRules} 
      currentRound={currentOverallRound} 
      totalRounds={TOTAL_ROUNDS} 
      playerBalance={playerBalance}
      currentOpponent={currentOpponent ? `${currentOpponent.name} (라운드 ${roundWithCurrentOpponent}/${ROUNDS_PER_OPPONENT})` : ''}
    >
      <div className="space-y-6">
        {/* Characters Display */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-center text-primary flex items-center justify-center gap-2">
              <HandHeart className="w-6 h-6" />
              라운드 {currentOverallRound} - 신뢰 게임
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Game Flow Visualization */}
            <div className="flex justify-center items-center gap-8 mb-6">
              <Character 
                name="송신자 (You)" 
                amount={roundResult ? `투자: ${roundResult.investment}` : `잔액: ${playerBalance}`} 
                isPlayer={true} 
                role="sender"
                showAmount={true}
              />
              
              <div className="flex flex-col items-center">
                <ArrowLeftRight className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-sm text-gray-600 text-center">
                  <div>투자 × 3</div>
                  <div className="font-bold text-3xl text-blue-600">
                    {roundResult ? roundResult.sent_amount : (investment[0] * 3)}
                  </div>
                  <div className="text-xs">(전송된 금액)</div>
                </div>
              </div>
              
              <Character 
                name="수신자 (Bot)" 
                amount={roundResult ? `반환: ${roundResult.received_back}` : "대기중..."} 
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

            {/* Game Controls - Slider Section */}
            {!roundResult && currentOpponent && (
              <div className="mt-6 w-full max-w-md mx-auto space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{playerBalance}포인트</div>
                  <p className="text-sm text-gray-600">현재 잔액 (최대 투자: {maxInvestment}포인트)</p>
                </div>
                
                <div className="space-y-4">
                  <Label className="font-body text-lg block text-center">
                    투자 금액: <span className="font-bold text-blue-600">{investment[0]}포인트</span>
                  </Label>
                  
                  <Slider
                    value={investment}
                    onValueChange={setInvestment}
                    max={maxInvestment}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <span className="font-medium">전송: {investment[0] * 3}포인트</span>
                    <span>{maxInvestment}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit} 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3"
                >
                  투자하기 <Send className="ml-2 h-5 w-5" />
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
