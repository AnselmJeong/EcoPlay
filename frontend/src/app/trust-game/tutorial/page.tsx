"use client";

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import {
  ArrowRight,
  BookOpenCheck,
  ChevronsUpDown,
  Loader2,
  RotateCcw,
} from 'lucide-react';

import { BotAvatar, ParticipantAvatar } from '@/components/GameAvatar';
import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  SessionState,
  TutorialComprehensionResponse,
  TutorialSubmitResponse,
  rtgTutorialAPI,
} from '@/lib/api';

type ReturnBasis = 'tripled_amount' | 'original_amount' | 'fixed_bonus';
type QuizFeedbackItem = TutorialComprehensionResponse['feedback'][number];

function formatPoints(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function ParticipantCard({
  title,
  points,
  caption,
  tone,
  avatar,
}: {
  title: string;
  points: number;
  caption: string;
  tone: 'bot' | 'user';
  avatar: ReactNode;
}) {
  const toneClasses =
    tone === 'bot'
      ? {
          points: 'text-[#151b24]',
          border: 'border-white/90',
        }
      : {
          points: 'text-[#0b7b53]',
          border: 'border-[#d8ebe3]',
        };

  return (
    <div
      className={`flex w-full max-w-[172px] flex-col items-center rounded-[20px] border bg-white px-5 py-5 text-center shadow-[0_24px_42px_rgba(190,210,220,0.16)] lg:max-w-[182px] lg:px-6 lg:py-6 ${toneClasses.border}`}
    >
      {avatar}
      <div className="mt-3 text-[0.95rem] font-semibold tracking-[-0.01em] text-[#2f3d37] lg:text-[1rem]">
        {title}
      </div>
      <div className={`mt-3 text-[2.05rem] font-black leading-none tracking-[-0.05em] lg:text-[2.25rem] ${toneClasses.points}`}>
        {formatPoints(points)}점
      </div>
      <div className="mt-4 text-[0.8rem] font-medium tracking-[0.01em] text-[#97aac5] lg:text-[0.86rem]">{caption}</div>
    </div>
  );
}

function MultiplierBridge({ multiplier }: { multiplier: number }) {
  return (
    <div className="relative flex h-[84px] w-full items-center justify-center lg:h-[96px]">
      <div className="absolute left-0 right-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#b9efe1]" />
      <div className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full border border-white/90 bg-white text-[1.6rem] font-bold italic tracking-[-0.05em] text-[#0c7c53] shadow-[0_14px_28px_rgba(190,200,210,0.22)] lg:h-[60px] lg:w-[60px] lg:text-[1.75rem]">
        x{multiplier}
      </div>
    </div>
  );
}

function TutorialTransferScene({
  senderInvestment,
  amountReceived,
  multiplier,
}: {
  senderInvestment: number;
  amountReceived: number;
  multiplier: number;
}) {
  return (
    <section className="mx-auto flex w-full max-w-[900px] justify-center">
      <div className="grid items-center gap-2 md:grid-cols-[172px_320px_172px] md:gap-3 lg:grid-cols-[182px_340px_182px]">
        <ParticipantCard
          title="투자자 봇"
          points={senderInvestment}
          caption="당신에게 보냄"
          tone="bot"
          avatar={<BotAvatar alt="투자자 봇 아바타" className="h-14 w-14 lg:h-16 lg:w-16" />}
        />
        <MultiplierBridge multiplier={multiplier} />
        <ParticipantCard
          title="당신"
          points={amountReceived}
          caption="받은 금액"
          tone="user"
          avatar={<ParticipantAvatar alt="당신 아바타" className="h-14 w-14 lg:h-16 lg:w-16" />}
        />
      </div>
    </section>
  );
}

function ReturnSplitPanel({
  totalReceived,
  returnAmount,
  onValueChange,
  onSubmit,
  isLoading,
}: {
  totalReceived: number;
  returnAmount: number[];
  onValueChange: (value: number[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  const returnPoints = returnAmount[0];
  const keepPoints = Math.max(totalReceived - returnPoints, 0);

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.58)_100%)] px-5 py-6 shadow-[0_20px_48px_rgba(198,208,221,0.14)] backdrop-blur-[2px] md:px-8 md:py-7 lg:px-10 lg:py-8">
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center">
        <h2 className="text-center text-[2.35rem] font-black tracking-[-0.06em] text-[#131a22] md:text-[2.7rem]">반환할 금액</h2>

        <div className="mt-5 flex w-full justify-center">
          <div className="w-full max-w-[660px] md:max-w-[720px]">
            <div className="mb-3 grid w-full grid-cols-2 items-end">
              <div className="text-left">
                <div className="text-[0.82rem] font-bold tracking-[0.02em] text-[#304036] md:text-[0.88rem]">반환 포인트</div>
                <div className="mt-1 text-[2.7rem] font-black leading-none tracking-[-0.08em] text-[#0b875d] md:text-[3rem]">
                  {formatPoints(returnPoints)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[0.82rem] font-bold tracking-[0.02em] text-[#304036] md:text-[0.88rem]">보유 포인트</div>
                <div className="mt-1 text-[2.7rem] font-black leading-none tracking-[-0.08em] text-[#121720] md:text-[3rem]">
                  {formatPoints(keepPoints)}
                </div>
              </div>
            </div>

            <SliderPrimitive.Root
              min={0}
              max={totalReceived}
              step={1}
              value={returnAmount}
              onValueChange={onValueChange}
              className="relative flex w-full touch-none select-none items-center py-3"
            >
              <SliderPrimitive.Track className="relative h-[24px] w-full overflow-hidden rounded-full bg-[#dfe5ea] md:h-[26px]">
                <SliderPrimitive.Range className="absolute h-full rounded-full bg-[linear-gradient(90deg,#0f7b53_0%,#19c98d_100%)]" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-[4px] border-[#135ec8] bg-white shadow-[0_14px_28px_rgba(19,94,200,0.18)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#135ec8]/15 md:h-[50px] md:w-[50px]">
                <ChevronsUpDown className="h-4 w-4 text-[#135ec8]" />
              </SliderPrimitive.Thumb>
            </SliderPrimitive.Root>

            <div className="mt-2.5 flex items-center justify-between px-1 text-[0.74rem] font-bold tracking-[0.01em] text-[#92a4bf] md:text-[0.78rem]">
              <span>반환 포인트</span>
              <span>보유 포인트</span>
            </div>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="mt-6 h-[58px] min-w-[240px] rounded-[16px] bg-[linear-gradient(90deg,#0c7b53_0%,#1ac78c_100%)] px-8 text-[0.98rem] font-bold uppercase tracking-[0.01em] text-white shadow-[0_16px_30px_rgba(18,185,129,0.22)] hover:opacity-95 md:min-w-[260px] md:text-[1rem]"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          반환하기
        </Button>
      </div>
    </section>
  );
}

function BalanceSnapshot({
  botBalance,
  userBalance,
}: {
  botBalance: number;
  userBalance: number;
}) {
  const totalBalance = Math.max(botBalance + userBalance, 1);
  const botWidth = Math.max((botBalance / totalBalance) * 100, 18);
  const userWidth = Math.max((userBalance / totalBalance) * 100, 18);

  return (
    <section className="mx-auto w-full max-w-[640px] pt-1">
      <div className="space-y-3">
        <div className="text-[0.82rem] font-bold tracking-[0.02em] text-[#6c766b]">잔액</div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-[24px] overflow-hidden rounded-full bg-white/80 shadow-[inset_0_2px_8px_rgba(210,220,232,0.20)] md:h-[26px]">
            <div
              className="flex h-full items-center justify-start rounded-full bg-[linear-gradient(90deg,#3b82f6_0%,#1db8f4_100%)] px-4 text-[0.68rem] font-bold tracking-[0.08em] text-white transition-[width] duration-300 md:text-[0.72rem]"
              style={{ width: `${Math.min(botWidth, 100)}%` }}
            >
              투자자 봇
            </div>
          </div>
          <div className="w-10 text-right text-[1.9rem] font-black leading-none tracking-[-0.08em] text-[#1562d0] md:w-12 md:text-[2.1rem]">
            {formatPoints(botBalance)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-[24px] overflow-hidden rounded-full bg-white/80 shadow-[inset_0_2px_8px_rgba(210,220,232,0.20)] md:h-[26px]">
            <div
              className="flex h-full items-center justify-start rounded-full bg-[linear-gradient(90deg,#19c98d_0%,#0f7b53_100%)] px-4 text-[0.68rem] font-bold tracking-[0.08em] text-white transition-[width] duration-300 md:text-[0.72rem]"
              style={{ width: `${Math.min(userWidth, 100)}%` }}
            >
              당신
            </div>
          </div>
          <div className="w-10 text-right text-[1.9rem] font-black leading-none tracking-[-0.08em] text-[#0b875d] md:w-12 md:text-[2.1rem]">
            {formatPoints(userBalance)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RTGTutorialPage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [returnAmount, setReturnAmount] = useState<number[]>([0]);
  const [lastResult, setLastResult] = useState<TutorialSubmitResponse | null>(null);
  const [quizResult, setQuizResult] = useState<TutorialComprehensionResponse | null>(null);
  const [multiplierAnswer, setMultiplierAnswer] = useState<string | null>(null);
  const [returnBasisAnswer, setReturnBasisAnswer] = useState<ReturnBasis | null>(null);
  const [repeatedInteractionAnswer, setRepeatedInteractionAnswer] = useState<string | null>(null);
  const [promptStartedAt, setPromptStartedAt] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const rules = [
    '튜토리얼에서는 participant가 trustee 역할을 경험합니다.',
    '상대가 보낸 금액은 3배가 되어 당신에게 전달됩니다.',
    '당신은 받은 금액 안에서 얼마를 돌려줄지 결정합니다.',
    '총 10개의 tutorial trial 후 이해도 점검을 통과해야 본실험을 시작할 수 있습니다.',
  ];

  useEffect(() => {
    if (session?.prompt) {
      const initialReturn = Math.round(session.prompt.amount_received / 2);
      setReturnAmount([initialReturn]);
      setPromptStartedAt(Date.now());
    }
  }, [session?.prompt?.trial_index, session?.prompt?.amount_received]);

  const startTutorial = async () => {
    setIsLoading(true);
    try {
      const response = await rtgTutorialAPI.startSession();
      setSession(response.session);
      setLastResult(null);
      setQuizResult(null);
      setMultiplierAnswer(null);
      setReturnBasisAnswer(null);
      setRepeatedInteractionAnswer(null);
    } catch (error) {
      toast({
        title: '튜토리얼 시작 실패',
        description: error instanceof Error ? error.message : '튜토리얼을 시작하지 못했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitTrial = async () => {
    if (!session?.prompt) return;

    setIsLoading(true);
    try {
      const response = await rtgTutorialAPI.submitTrial({
        session_id: session.session_id,
        return_amount: returnAmount[0],
        response_time_ms: Date.now() - promptStartedAt,
      });
      setSession(response.session);
      setLastResult(response);
      toast({
        title: `Tutorial Trial ${response.trial.trial_index} 완료`,
        description: `${response.trial.amount_kept.toFixed(2)} points를 보유했습니다.`,
      });
    } catch (error) {
      toast({
        title: '제출 실패',
        description: error instanceof Error ? error.message : '튜토리얼 trial 제출에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitComprehension = async () => {
    if (!session) return;
    if (!multiplierAnswer || !returnBasisAnswer || !repeatedInteractionAnswer) {
      toast({
        title: '응답이 필요합니다',
        description: '세 문항 모두 답한 뒤 comprehension check를 제출해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await rtgTutorialAPI.submitComprehensionCheck({
        session_id: session.session_id,
        multiplier_answer: Number(multiplierAnswer),
        return_basis_answer: returnBasisAnswer,
        repeated_interaction_answer: repeatedInteractionAnswer === 'true',
      });
      setSession(response.session);
      setQuizResult(response);
      toast({
        title: response.passed ? '이해도 점검 통과' : '이해도 점검 미통과',
        description: response.passed
          ? '이제 RTG 본실험을 시작할 수 있습니다.'
          : '틀린 문항을 아래에서 확인한 뒤 다시 제출해주세요.',
        variant: response.passed ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: '점검 제출 실패',
        description: error instanceof Error ? error.message : '이해도 점검 제출에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activePrompt = session?.prompt;
  const incorrectFeedback = quizResult?.feedback.filter((item) => !item.is_correct) ?? [];
  const previewEndowment = session?.endowment ?? lastResult?.trial.endowment ?? 10;
  const previewBotBalance = activePrompt
    ? previewEndowment - activePrompt.sender_investment + returnAmount[0]
    : lastResult
      ? lastResult.trial.endowment - lastResult.trial.sender_investment + lastResult.trial.return_amount
      : 0;
  const previewUserBalance = activePrompt
    ? Math.max(activePrompt.amount_received - returnAmount[0], 0)
    : lastResult?.trial.amount_kept ?? 0;

  const feedbackLabel = (item: QuizFeedbackItem) => {
    if (item.is_correct) {
      return '정답';
    }
    return '오답';
  };

  return (
    <GameLayout
      title="RTG Tutorial"
      rules={rules}
      currentRound={activePrompt?.trial_index ?? session?.total_trials ?? 1}
      totalRounds={session?.total_trials ?? 10}
      playerBalance={lastResult?.trial.amount_kept ?? 0}
      balanceLabel="Last Trial Keep Amount"
      showSidebar={!session}
    >
      {!session && (
        <Card className="mx-auto w-full max-w-2xl border-none bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-primary">RTG Tutorial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center text-foreground/80">
            <p>본실험 전에 trustee 역할을 짧게 경험합니다. 튜토리얼을 마친 뒤에는 이해도 점검이 이어집니다.</p>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
              <div className="text-sm text-primary/70">Tutorial Structure</div>
              <div className="mt-1 text-2xl font-bold text-primary">10 Trials + Comprehension Check</div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={startTutorial} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BookOpenCheck className="mr-2 h-4 w-4" />
              )}
              Start Tutorial
            </Button>
          </CardFooter>
        </Card>
      )}

      {session?.phase === 'trial' && activePrompt && (
        <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5 px-1 py-1">
          <TutorialTransferScene
            senderInvestment={activePrompt.sender_investment}
            amountReceived={activePrompt.amount_received}
            multiplier={activePrompt.multiplier}
          />

          <ReturnSplitPanel
            totalReceived={activePrompt.amount_received}
            returnAmount={returnAmount}
            onValueChange={setReturnAmount}
            onSubmit={submitTrial}
            isLoading={isLoading}
          />

          <BalanceSnapshot botBalance={previewBotBalance} userBalance={previewUserBalance} />
        </div>
      )}

      {lastResult && session?.phase !== 'trial' && (
        <div className="mx-auto w-full max-w-[980px]">
          <BalanceSnapshot botBalance={previewBotBalance} userBalance={previewUserBalance} />
        </div>
      )}

      {session?.phase === 'comprehension' && (
        <Card className="mt-4 shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary">Comprehension Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="font-medium">1. 보낸 돈은 몇 배가 되어 trustee에게 전달되나요?</div>
              <RadioGroup value={multiplierAnswer ?? undefined} onValueChange={setMultiplierAnswer}>
                {['2', '3', '4'].map((option) => (
                  <div key={option} className="flex items-center gap-3 rounded-xl border px-4 py-3">
                    <RadioGroupItem value={option} id={`multiplier-${option}`} />
                    <Label htmlFor={`multiplier-${option}`}>{option}배</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="font-medium">2. trustee는 어떤 금액 범위 안에서 돌려줄 수 있나요?</div>
              <RadioGroup
                value={returnBasisAnswer ?? undefined}
                onValueChange={(value) => setReturnBasisAnswer(value as ReturnBasis)}
              >
                <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                  <RadioGroupItem value="tripled_amount" id="basis-tripled" />
                  <Label htmlFor="basis-tripled">3배가 된 뒤 받은 금액 안에서</Label>
                </div>
                <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                  <RadioGroupItem value="original_amount" id="basis-original" />
                  <Label htmlFor="basis-original">처음 trustor가 보낸 원금 안에서만</Label>
                </div>
                <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                  <RadioGroupItem value="fixed_bonus" id="basis-bonus" />
                  <Label htmlFor="basis-bonus">고정 보너스만 반환 가능</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="font-medium">3. 본실험에서는 같은 partner와 반복 상호작용하나요?</div>
              <RadioGroup
                value={repeatedInteractionAnswer ?? undefined}
                onValueChange={setRepeatedInteractionAnswer}
              >
                <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                  <RadioGroupItem value="true" id="repeated-true" />
                  <Label htmlFor="repeated-true">예</Label>
                </div>
                <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
                  <RadioGroupItem value="false" id="repeated-false" />
                  <Label htmlFor="repeated-false">아니오</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={submitComprehension} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Check
            </Button>
          </CardFooter>
        </Card>
      )}

      {quizResult && (
        <Card className="mt-4 shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary">
              {quizResult.passed ? 'Tutorial Passed' : 'Tutorial Needs Retry'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/80">
            <p>
              {quizResult.passed
                ? '이해도 점검을 통과했습니다. 이제 본실험으로 이동할 수 있습니다.'
                : '이해도 점검을 통과하지 못했습니다. 아래 오답 문항을 확인한 뒤 다시 제출하거나, 필요하면 튜토리얼을 다시 진행해주세요.'}
            </p>

            {!quizResult.passed && incorrectFeedback.length > 0 && (
              <div className="space-y-3">
                {incorrectFeedback.map((item) => (
                  <div key={item.question_key} className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="text-sm font-semibold text-red-700">{feedbackLabel(item)}</div>
                    <div className="mt-1 font-medium text-slate-900">{item.prompt}</div>
                    <div className="mt-2 text-sm text-slate-700">정답: {item.correct_answer}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.explanation}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {!quizResult.passed ? (
              <Button variant="outline" onClick={startTutorial}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart Tutorial
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/games">Back to Games</Link>
              </Button>
            )}

            {quizResult.passed && (
              <Button asChild>
                <Link href="/trust-game/main">
                  Continue to Main Task
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </GameLayout>
  );
}
