"use client";

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import {
  ArrowRight,
  BookOpenCheck,
  Loader2,
  RotateCcw,
} from 'lucide-react';

import { BotAvatar, ParticipantAvatar } from '@/components/GameAvatar';
import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
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

function TutorialHeader({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: ReactNode;
  detail: string;
}) {
  return (
    <section className="mx-auto flex w-full max-w-[820px] items-start justify-between gap-5">
      <div>
        <p className="text-[0.95rem] font-bold tracking-[-0.01em] text-[#8a9ab0]">{eyebrow}</p>
        <h2 className="mt-1 text-[2.15rem] font-black tracking-[-0.05em] text-[#151b24] md:text-[2.45rem]">
          {title}
        </h2>
      </div>
      <div className="rounded-[20px] bg-[#e7f7f1] px-6 py-4 text-[1.05rem] font-bold tracking-[-0.02em] text-[#158b67] shadow-[0_10px_22px_rgba(27,168,119,0.08)] md:text-[1.15rem]">
        {detail}
      </div>
    </section>
  );
}

function TutorialRoleCard({
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
      className={`flex w-full max-w-[182px] flex-col items-center rounded-[20px] border bg-white px-5 py-5 text-center shadow-[0_24px_42px_rgba(190,210,220,0.16)] lg:px-6 lg:py-6 ${toneClasses.border}`}
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
    <section className="pt-5">
      <div className="mx-auto grid max-w-[820px] items-center gap-4 md:grid-cols-[auto_minmax(360px,500px)_auto]">
        <TutorialRoleCard
          title="투자자 봇"
          points={senderInvestment}
          caption="당신에게 보냄"
          tone="bot"
          avatar={<BotAvatar alt="투자자 봇 아바타" className="h-[72px] w-[72px] shadow-[0_14px_26px_rgba(29,47,73,0.2)]" />}
        />

        <div className="relative flex h-[86px] items-center justify-center">
          <div className="absolute left-0 right-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#e7edf5]" />
          <div className="absolute right-[7%] top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-[#c6d1dd]">
            <ArrowRight className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="relative rounded-full bg-[#f4ab00] px-7 py-3 text-[1.22rem] font-black tracking-[-0.03em] text-[#6a4300] shadow-[0_12px_24px_rgba(244,171,0,0.22)]">
            {multiplier}배 증액
          </div>
        </div>

        <TutorialRoleCard
          title="당신"
          points={amountReceived}
          caption="받은 금액"
          tone="user"
          avatar={<ParticipantAvatar alt="당신 아바타" className="h-[72px] w-[72px] shadow-[0_14px_26px_rgba(243,107,44,0.18)]" />}
        />
      </div>
    </section>
  );
}

function ReturnSummaryColumn({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
      <span className="text-[1rem] font-bold tracking-[-0.02em] text-[#72839a] md:text-[1.1rem]">{label}</span>
      <span className={`text-[1.7rem] font-black tracking-[-0.05em] md:text-[1.95rem] ${valueClassName}`}>
        {formatPoints(value)} 점
      </span>
    </div>
  );
}

function ReturnDecisionPanel({
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
    <section className="mx-auto mt-8 w-full max-w-[820px] overflow-hidden rounded-[26px] border border-[#d8dde4] bg-white px-6 py-6 shadow-[0_10px_24px_rgba(170,184,198,0.16)] md:mt-9 md:px-10 md:py-8">
      <div className="mx-auto flex w-full max-w-[820px] flex-col">
        <h2 className="text-[2.05rem] font-black tracking-[-0.05em] text-[#121821] md:text-[2.35rem]">반환 금액 선택</h2>
        <p className="mt-3 max-w-[820px] text-[1.06rem] leading-[1.9] text-[#7e8fa4] md:text-[1.14rem]">
          투자자 봇이 보낸 금액은{' '}
          <span className="font-bold text-[#12af84]">{formatPoints(totalReceived)}점</span>
          이 되어 당신에게 전달되었습니다. 받은 금액 안에서 얼마를 돌려줄지 선택하세요.
        </p>

        <div className="mt-10">
          <SliderPrimitive.Root
            min={0}
            max={totalReceived}
            step={1}
            value={returnAmount}
            onValueChange={onValueChange}
            className="relative flex w-full touch-none select-none items-center"
          >
            <SliderPrimitive.Track className="relative h-[20px] w-full overflow-hidden rounded-full bg-[#edf2f8]">
              <SliderPrimitive.Range className="absolute h-full rounded-full bg-[linear-gradient(90deg,#15a87b_0%,#23c595_100%)]" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block h-[34px] w-[34px] rounded-full border-[6px] border-white bg-[#17bf91] shadow-[0_10px_22px_rgba(23,191,145,0.28)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#17bf91]/20" />
          </SliderPrimitive.Root>

          <div className="mt-5 grid grid-cols-3 text-[1rem] font-bold text-[#9caec4] md:text-[1.08rem]">
            <span className="text-left">0 점</span>
            <span className="text-center text-[1.15rem] md:text-[1.28rem]">{Math.round(totalReceived / 2)} 점</span>
            <span className="text-right">{formatPoints(totalReceived)} 점</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-[20px] border border-[#e3e8ef] bg-[#f6f8fb]">
          <ReturnSummaryColumn label="반환 금액" value={returnPoints} valueClassName="text-[#151b24]" />
          <div className="border-l border-[#e1e7ef]">
            <ReturnSummaryColumn label="내가 보유할 금액" value={keepPoints} valueClassName="text-[#17b587]" />
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="mt-8 h-[70px] w-full rounded-[20px] bg-[#08a573] text-[1.4rem] font-black tracking-[-0.03em] text-white shadow-[0_14px_28px_rgba(8,165,115,0.2)] hover:bg-[#069c6c] md:text-[1.55rem]"
        >
          {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : null}
          반환 확정
          <ArrowRight className="h-6 w-6" />
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
  const scaleMax = Math.max(50, botBalance, userBalance, 1);
  const botWidth = (botBalance / scaleMax) * 100;
  const userWidth = (userBalance / scaleMax) * 100;

  return (
    <section className="mx-auto w-full max-w-[820px] overflow-hidden rounded-[24px] border border-[#d5e3db] bg-white px-5 py-5 shadow-[0_12px_26px_rgba(192,205,213,0.12)] md:px-7 md:py-6">
      <div className="text-[1.45rem] font-black tracking-[-0.05em] text-[#161b22] md:text-[1.65rem]">현재까지 확정된 잔액</div>

      <div className="mt-7 space-y-6">
        <div>
          <div className="mb-2.5 flex items-center justify-between gap-4">
            <div className="text-[1.08rem] font-black tracking-[-0.04em] text-[#1f2a24] md:text-[1.18rem]">당신의 잔액</div>
            <div className="text-[1.45rem] font-black tracking-[-0.05em] text-[#0e8c68] md:text-[1.6rem]">{formatPoints(userBalance)} 점</div>
          </div>
          <div className="h-[16px] overflow-hidden rounded-full bg-[#eef1f4]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#58c2a4_0%,#47b497_100%)] transition-[width] duration-300"
              style={{ width: `${Math.min(userWidth, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2.5 flex items-center justify-between gap-4">
            <div className="text-[1.08rem] font-black tracking-[-0.04em] text-[#1f2a24] md:text-[1.18rem]">투자자 봇 잔액</div>
            <div className="text-[1.45rem] font-black tracking-[-0.05em] text-[#1f63c6] md:text-[1.6rem]">{formatPoints(botBalance)} 점</div>
          </div>
          <div className="h-[16px] overflow-hidden rounded-full bg-[#eef1f4]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#76aef2_0%,#5e9be9_100%)] transition-[width] duration-300"
              style={{ width: `${Math.min(botWidth, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroPanel({
  onStart,
  isLoading,
}: {
  onStart: () => void;
  isLoading: boolean;
}) {
  const highlights = [
    '튜토리얼에서는 수탁자 역할을 먼저 연습합니다.',
    '투자자 봇이 보낸 금액은 3배가 되어 당신에게 전달됩니다.',
    '받은 금액 안에서 얼마를 돌려줄지 직접 결정합니다.',
    '10회 연습 후 이해도 점검을 통과하면 본실험으로 이동합니다.',
  ];

  return (
    <section className="mx-auto w-full max-w-[820px] overflow-hidden rounded-[26px] border border-[#d8dde4] bg-white px-6 py-7 shadow-[0_10px_24px_rgba(170,184,198,0.16)] md:px-10 md:py-9">
      <div className="inline-flex rounded-full bg-[#e7f7f1] px-4 py-2 text-[0.88rem] font-black tracking-[0.02em] text-[#158b67]">
        TRUST GAME TUTORIAL
      </div>

      <h2 className="mt-4 text-[2.2rem] font-black tracking-[-0.05em] text-[#121821] md:text-[2.55rem]">본실험 전에 수탁자 흐름을 먼저 익혀볼게요</h2>
      <p className="mt-4 max-w-[720px] text-[1.05rem] leading-[1.9] text-[#7e8fa4] md:text-[1.12rem]">
        메인 게임의 화면 언어를 그대로 유지한 채, 반환 의사결정이 어떤 흐름으로 진행되는지 짧게 연습합니다. 아래 핵심 규칙만 이해하면 바로 시작할 수 있어요.
      </p>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {highlights.map((item) => (
          <div key={item} className="rounded-[18px] border border-[#e3e8ef] bg-[#f6f8fb] px-5 py-4 text-[0.98rem] font-medium leading-[1.7] text-[#405063]">
            {item}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button asChild variant="outline" className="h-[56px] rounded-[18px] border-[#d8dde4] px-6 text-[1rem] font-bold text-[#4e5d70]">
          <Link href="/games">게임 목록으로</Link>
        </Button>
        <Button
          onClick={onStart}
          disabled={isLoading}
          className="h-[56px] rounded-[18px] bg-[#08a573] px-7 text-[1rem] font-black tracking-[-0.02em] text-white shadow-[0_14px_28px_rgba(8,165,115,0.2)] hover:bg-[#069c6c]"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <BookOpenCheck className="h-5 w-5" />}
          튜토리얼 시작
        </Button>
      </div>
    </section>
  );
}

function QuestionOption({
  value,
  id,
  checked,
  children,
}: {
  value: string;
  id: string;
  checked: boolean;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-3 rounded-[18px] border px-4 py-4 transition-colors ${
        checked ? 'border-[#bfe9dc] bg-[#f2fdf8]' : 'border-[#e3ebef] bg-white'
      }`}
    >
      <RadioGroupItem value={value} id={id} />
      <span className="text-[0.95rem] font-medium leading-[1.6] text-[#233038]">{children}</span>
    </label>
  );
}

function ComprehensionPanel({
  multiplierAnswer,
  setMultiplierAnswer,
  returnBasisAnswer,
  setReturnBasisAnswer,
  repeatedInteractionAnswer,
  setRepeatedInteractionAnswer,
  onSubmit,
  isLoading,
}: {
  multiplierAnswer: string | null;
  setMultiplierAnswer: (value: string) => void;
  returnBasisAnswer: ReturnBasis | null;
  setReturnBasisAnswer: (value: ReturnBasis) => void;
  repeatedInteractionAnswer: string | null;
  setRepeatedInteractionAnswer: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <section className="mx-auto w-full max-w-[820px] overflow-hidden rounded-[26px] border border-[#d8dde4] bg-white px-6 py-6 shadow-[0_10px_24px_rgba(170,184,198,0.16)] md:px-10 md:py-8">
      <div className="max-w-[720px]">
        <h2 className="text-[2.05rem] font-black tracking-[-0.05em] text-[#121821] md:text-[2.35rem]">이해도 점검</h2>
        <p className="mt-3 text-[1.04rem] leading-[1.85] text-[#7e8fa4] md:text-[1.12rem]">
          튜토리얼에서 확인한 핵심 규칙을 다시 한번 정리합니다. 세 문항에 모두 답한 뒤 제출해 주세요.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div className="rounded-[20px] border border-[#e3e8ef] bg-[#f6f8fb] p-5">
          <div className="text-[1.05rem] font-black tracking-[-0.03em] text-[#121821]">1. 보낸 돈은 몇 배가 되어 trustee에게 전달되나요?</div>
          <RadioGroup value={multiplierAnswer ?? undefined} onValueChange={setMultiplierAnswer} className="mt-4 grid gap-3">
            {['2', '3', '4'].map((option) => (
              <QuestionOption key={option} value={option} id={`multiplier-${option}`} checked={multiplierAnswer === option}>
                {option}배
              </QuestionOption>
            ))}
          </RadioGroup>
        </div>

        <div className="rounded-[20px] border border-[#e3e8ef] bg-[#f6f8fb] p-5">
          <div className="text-[1.05rem] font-black tracking-[-0.03em] text-[#121821]">2. trustee는 어떤 금액 범위 안에서 돌려줄 수 있나요?</div>
          <RadioGroup
            value={returnBasisAnswer ?? undefined}
            onValueChange={(value) => setReturnBasisAnswer(value as ReturnBasis)}
            className="mt-4 grid gap-3"
          >
            <QuestionOption value="tripled_amount" id="basis-tripled" checked={returnBasisAnswer === 'tripled_amount'}>
              3배가 된 뒤 받은 금액 안에서
            </QuestionOption>
            <QuestionOption value="original_amount" id="basis-original" checked={returnBasisAnswer === 'original_amount'}>
              처음 trustor가 보낸 원금 안에서만
            </QuestionOption>
            <QuestionOption value="fixed_bonus" id="basis-bonus" checked={returnBasisAnswer === 'fixed_bonus'}>
              고정 보너스만 반환 가능
            </QuestionOption>
          </RadioGroup>
        </div>

        <div className="rounded-[20px] border border-[#e3e8ef] bg-[#f6f8fb] p-5">
          <div className="text-[1.05rem] font-black tracking-[-0.03em] text-[#121821]">3. 본실험에서는 같은 partner와 반복 상호작용하나요?</div>
          <RadioGroup
            value={repeatedInteractionAnswer ?? undefined}
            onValueChange={setRepeatedInteractionAnswer}
            className="mt-4 grid gap-3"
          >
            <QuestionOption value="true" id="repeated-true" checked={repeatedInteractionAnswer === 'true'}>
              예
            </QuestionOption>
            <QuestionOption value="false" id="repeated-false" checked={repeatedInteractionAnswer === 'false'}>
              아니오
            </QuestionOption>
          </RadioGroup>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={isLoading}
        className="mt-8 h-[62px] min-w-[240px] rounded-[18px] bg-[#08a573] px-7 text-[1.08rem] font-black tracking-[-0.02em] text-white shadow-[0_14px_28px_rgba(8,165,115,0.2)] hover:bg-[#069c6c]"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        점검 제출
      </Button>
    </section>
  );
}

function ResultPanel({
  quizResult,
  incorrectFeedback,
  onRestart,
}: {
  quizResult: TutorialComprehensionResponse;
  incorrectFeedback: QuizFeedbackItem[];
  onRestart: () => void;
}) {
  return (
    <section className="mx-auto w-full max-w-[820px] overflow-hidden rounded-[26px] border border-[#d8dde4] bg-white px-6 py-6 shadow-[0_10px_24px_rgba(170,184,198,0.16)] md:px-10 md:py-8">
      <div className={`inline-flex rounded-full px-4 py-2 text-[0.88rem] font-black tracking-[0.02em] ${
        quizResult.passed ? 'bg-[#e7f7f1] text-[#158b67]' : 'bg-[#fff1f1] text-[#d34b4b]'
      }`}>
        {quizResult.passed ? 'TUTORIAL PASSED' : 'REVIEW REQUIRED'}
      </div>

      <h2 className="mt-4 text-[2.05rem] font-black tracking-[-0.05em] text-[#121821] md:text-[2.35rem]">
        {quizResult.passed ? '이제 본실험으로 이동할 수 있어요' : '핵심 규칙을 한 번 더 확인해 주세요'}
      </h2>
      <p className="mt-3 text-[1.04rem] leading-[1.85] text-[#7e8fa4] md:text-[1.12rem]">
        {quizResult.passed
          ? '이해도 점검을 통과했습니다. 이제 투자자 역할의 메인 게임을 시작하면 됩니다.'
          : '아래 오답 문항을 확인한 뒤 다시 제출하거나, 필요하면 튜토리얼을 처음부터 다시 진행할 수 있습니다.'}
      </p>

      {!quizResult.passed && incorrectFeedback.length > 0 ? (
        <div className="mt-8 space-y-3">
          {incorrectFeedback.map((item) => (
            <div key={item.question_key} className="rounded-[18px] border border-[#f3c9c9] bg-[#fff7f7] p-5">
              <div className="text-[0.86rem] font-black tracking-[0.04em] text-[#d34b4b]">오답 문항</div>
              <div className="mt-2 text-[1.04rem] font-bold tracking-[-0.02em] text-[#121821]">{item.prompt}</div>
              <div className="mt-3 text-[0.95rem] font-semibold text-[#3f4a5a]">정답: {item.correct_answer}</div>
              <div className="mt-1 text-[0.94rem] leading-[1.7] text-[#6e7786]">{item.explanation}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        {!quizResult.passed ? (
          <Button
            variant="outline"
            onClick={onRestart}
            className="h-[56px] rounded-[18px] border-[#d8dde4] px-6 text-[1rem] font-bold text-[#4e5d70]"
          >
            <RotateCcw className="h-4 w-4" />
            튜토리얼 다시 시작
          </Button>
        ) : (
          <Button asChild variant="outline" className="h-[56px] rounded-[18px] border-[#d8dde4] px-6 text-[1rem] font-bold text-[#4e5d70]">
            <Link href="/games">게임 목록으로</Link>
          </Button>
        )}

        {quizResult.passed ? (
          <Button
            asChild
            className="h-[56px] rounded-[18px] bg-[#08a573] px-7 text-[1rem] font-black tracking-[-0.02em] text-white shadow-[0_14px_28px_rgba(8,165,115,0.2)] hover:bg-[#069c6c]"
          >
            <Link href="/trust-game/main">
              메인 게임 시작
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        ) : null}
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
      setReturnAmount([0]);
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
        title: `튜토리얼 ${response.trial.trial_index}회차 완료`,
        description: `${response.trial.amount_kept.toFixed(2)}점을 보유했습니다.`,
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
        description: '세 문항 모두 답한 뒤 이해도 점검을 제출해 주세요.',
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
        title: response.passed ? '이해도 점검 통과' : '이해도 점검 재확인 필요',
        description: response.passed
          ? '이제 RTG 본실험을 시작할 수 있습니다.'
          : '틀린 문항을 확인한 뒤 다시 제출하거나 튜토리얼을 다시 진행해 주세요.',
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
  const confirmedBotBalance = session?.current_partner_balance ?? null;
  const confirmedUserBalance = session?.current_balance ?? null;
  const completedTrials = Math.min(session?.completed_trials_count ?? 0, session?.total_trials ?? 10);

  return (
    <GameLayout
      title="RTG Tutorial"
      rules={rules}
      currentRound={completedTrials || 1}
      totalRounds={session?.total_trials ?? 10}
      playerBalance={lastResult?.trial.amount_kept ?? 0}
      balanceLabel="튜토리얼 최근 보유액"
      showSidebar={!session}
      contentClassName={session ? 'bg-transparent p-0 shadow-none backdrop-blur-0 min-h-0' : undefined}
    >
      {!session ? (
        <IntroPanel onStart={startTutorial} isLoading={isLoading} />
      ) : (
        <div className="mx-auto flex w-full max-w-[980px] flex-col gap-8 px-2 py-2 md:px-4">
          {session.phase === 'trial' && activePrompt ? (
            <div className="w-full [zoom:0.9]">
              <TutorialHeader
                eyebrow="진행 상황"
                title={
                  <>
                    {activePrompt.trial_index}회차 <span className="font-semibold text-[#9eb0c7]">/ {session.total_trials ?? 10}</span>
                  </>
                }
                detail="튜토리얼 · 수탁자 연습"
              />
              <TutorialTransferScene
                senderInvestment={activePrompt.sender_investment}
                amountReceived={activePrompt.amount_received}
                multiplier={activePrompt.multiplier}
              />
              <ReturnDecisionPanel
                totalReceived={activePrompt.amount_received}
                returnAmount={returnAmount}
                onValueChange={setReturnAmount}
                onSubmit={submitTrial}
                isLoading={isLoading}
              />
              {confirmedBotBalance !== null && confirmedUserBalance !== null ? (
                <BalanceSnapshot botBalance={confirmedBotBalance} userBalance={confirmedUserBalance} />
              ) : null}
            </div>
          ) : null}

          {session.phase === 'comprehension' && !quizResult ? (
            <div className="w-full [zoom:0.9]">
              <TutorialHeader
                eyebrow="튜토리얼 완료"
                title="이해도 점검"
                detail="핵심 규칙 3문항"
              />
              {lastResult ? (
                <>
                  <TutorialTransferScene
                    senderInvestment={lastResult.trial.sender_investment}
                    amountReceived={lastResult.trial.amount_received}
                    multiplier={session.multiplier ?? 3}
                  />
                  {confirmedBotBalance !== null && confirmedUserBalance !== null ? (
                    <BalanceSnapshot botBalance={confirmedBotBalance} userBalance={confirmedUserBalance} />
                  ) : null}
                </>
              ) : null}
              <ComprehensionPanel
                multiplierAnswer={multiplierAnswer}
                setMultiplierAnswer={setMultiplierAnswer}
                returnBasisAnswer={returnBasisAnswer}
                setReturnBasisAnswer={setReturnBasisAnswer}
                repeatedInteractionAnswer={repeatedInteractionAnswer}
                setRepeatedInteractionAnswer={setRepeatedInteractionAnswer}
                onSubmit={submitComprehension}
                isLoading={isLoading}
              />
            </div>
          ) : null}

          {quizResult ? (
            <div className="w-full [zoom:0.9]">
              <TutorialHeader
                eyebrow="이해도 점검 결과"
                title={quizResult.passed ? '튜토리얼 통과' : '다시 확인이 필요합니다'}
                detail={quizResult.passed ? '메인 게임으로 이동 가능' : '오답 문항 확인'}
              />
              <ResultPanel quizResult={quizResult} incorrectFeedback={incorrectFeedback} onRestart={startTutorial} />
            </div>
          ) : null}
        </div>
      )}
    </GameLayout>
  );
}
