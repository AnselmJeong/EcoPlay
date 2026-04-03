"use client";

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import {
  ArrowRight,
  ChevronsUpDown,
  Handshake,
  Loader2,
  Shield,
  User,
} from 'lucide-react';

import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { RTGPostBlockResponse, RTGSubmitTrialResponse, SessionState, rtgAPI } from '@/lib/api';

type PartnerClassification = 'high_return' | 'low_return' | 'unpredictable';

function formatPoints(value: number) {
  return `${Math.round(value)}`;
}

function formatPartnerLabel(label: string) {
  return label.replace(/^Partner\b/, '파트너');
}

function TrialStatusHeader({
  currentBlock,
  totalBlocks,
  currentTrial,
  trialsPerBlock,
}: {
  currentBlock: number;
  totalBlocks: number;
  currentTrial: number;
  trialsPerBlock: number;
}) {
  const progressValue = (currentTrial / Math.max(trialsPerBlock, 1)) * 100;

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="text-[0.88rem] font-bold tracking-[0.02em] text-[#5e6d79]">
          현재 블록 {currentBlock} / {totalBlocks}
        </div>
        <div className="text-[0.82rem] font-semibold tracking-[0.02em] text-[#8ca0b4]">
          시도 {currentTrial} / {trialsPerBlock}
        </div>
      </div>
      <Progress
        value={progressValue}
        className="h-[10px] rounded-full bg-[#dfe7ef]"
        indicatorClassName="bg-[linear-gradient(90deg,#145cc3_0%,#20b8ef_100%)]"
      />
    </div>
  );
}

function RoleCard({
  title,
  points,
  caption,
  tone,
  icon,
}: {
  title: string;
  points: number;
  caption: string;
  tone: 'player' | 'partner';
  icon: ReactNode;
}) {
  const toneClasses =
    tone === 'player'
      ? {
          icon: 'text-[#145cc3]',
          points: 'text-[#151b24]',
          border: 'border-white/90',
        }
      : {
          icon: 'text-[#0b7b53]',
          points: 'text-[#0b7b53]',
          border: 'border-[#d8ebe3]',
        };

  return (
    <div
      className={`flex w-full max-w-[182px] flex-col items-center rounded-[20px] border bg-white px-5 py-5 text-center shadow-[0_24px_42px_rgba(190,210,220,0.16)] lg:px-6 lg:py-6 ${toneClasses.border}`}
    >
      <div className={`flex h-9 w-9 items-center justify-center lg:h-10 lg:w-10 ${toneClasses.icon}`}>{icon}</div>
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

function PartnerIntroBanner({
  partnerLabel,
  currentBlock,
  totalBlocks,
  previousLabel,
}: {
  partnerLabel: string;
  currentBlock: number;
  totalBlocks: number;
  previousLabel?: string | null;
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#d9efe8] bg-[linear-gradient(90deg,rgba(255,255,255,0.84)_0%,rgba(231,250,243,0.86)_100%)] px-5 py-4 shadow-[0_18px_36px_rgba(198,208,221,0.12)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[0.82rem] font-bold tracking-[0.08em] text-[#0b7b53]">새 블록 시작</div>
          <div className="mt-1 text-[1.2rem] font-black tracking-[-0.03em] text-[#17212c]">
            이번 블록은 <span className="text-[#0b7b53]">{partnerLabel}</span>와 진행합니다.
          </div>
          <div className="mt-1 text-[0.9rem] text-[#5b6a67]">
            Block {currentBlock} / {totalBlocks}에서 15번의 시도를 연속으로 수행합니다.
            {previousLabel ? ` 이전 평가는 ${formatPartnerLabel(previousLabel)}에 대해 저장되었습니다.` : ''}
          </div>
        </div>
        <div className="rounded-full bg-white/90 px-4 py-2 text-[0.82rem] font-semibold text-[#45605b] shadow-sm">
          새로운 파트너와 반복 상호작용
        </div>
      </div>
    </section>
  );
}

function InvestmentScene({
  amountSent,
  partnerReceived,
  partnerLabel,
  multiplier,
}: {
  amountSent: number;
  partnerReceived: number;
  partnerLabel: string;
  multiplier: number;
}) {
  return (
    <section className="mx-auto flex w-full max-w-[900px] justify-center">
      <div className="grid items-center gap-2 md:grid-cols-[182px_340px_182px] md:gap-3">
        <RoleCard
          title="당신"
          points={amountSent}
          caption="투자할 금액"
          tone="player"
          icon={<User className="h-9 w-9 stroke-[1.9] lg:h-10 lg:w-10" />}
        />
        <MultiplierBridge multiplier={multiplier} />
        <RoleCard
          title={partnerLabel}
          points={partnerReceived}
          caption="상대가 받는 금액"
          tone="partner"
          icon={<Shield className="h-9 w-9 stroke-[1.9] lg:h-10 lg:w-10" />}
        />
      </div>
    </section>
  );
}

function InvestmentPanel({
  endowment,
  amountSent,
  onValueChange,
  onSubmit,
  isLoading,
}: {
  endowment: number;
  amountSent: number[];
  onValueChange: (value: number[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  const invested = amountSent[0];
  const keepPoints = Math.max(endowment - invested, 0);

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.58)_100%)] px-5 py-6 shadow-[0_20px_48px_rgba(198,208,221,0.14)] backdrop-blur-[2px] md:px-8 md:py-7 lg:px-10 lg:py-8">
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center">
        <h2 className="text-center text-[2.35rem] font-black tracking-[-0.06em] text-[#131a22] md:text-[2.7rem]">투자할 금액</h2>

        <div className="mt-5 flex w-full justify-center">
          <div className="w-full max-w-[660px] md:max-w-[720px]">
            <div className="mb-3 grid w-full grid-cols-2 items-end">
              <div className="text-left">
                <div className="text-[0.82rem] font-bold tracking-[0.02em] text-[#304036] md:text-[0.88rem]">투자 포인트</div>
                <div className="mt-1 text-[2.7rem] font-black leading-none tracking-[-0.08em] text-[#145cc3] md:text-[3rem]">
                  {formatPoints(invested)}
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
              max={endowment}
              step={1}
              value={amountSent}
              onValueChange={onValueChange}
              className="relative flex w-full touch-none select-none items-center py-3"
            >
              <SliderPrimitive.Track className="relative h-[24px] w-full overflow-hidden rounded-full bg-[#dfe5ea] md:h-[26px]">
                <SliderPrimitive.Range className="absolute h-full rounded-full bg-[linear-gradient(90deg,#145cc3_0%,#20b8ef_100%)]" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-[4px] border-[#145cc3] bg-white shadow-[0_14px_28px_rgba(20,92,195,0.18)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#145cc3]/15 md:h-[50px] md:w-[50px]">
                <ChevronsUpDown className="h-4 w-4 text-[#145cc3]" />
              </SliderPrimitive.Thumb>
            </SliderPrimitive.Root>

            <div className="mt-2.5 flex items-center justify-between px-1 text-[0.74rem] font-bold tracking-[0.01em] text-[#92a4bf] md:text-[0.78rem]">
              <span>적게 투자</span>
              <span>많이 투자</span>
            </div>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="mt-6 h-[58px] min-w-[240px] rounded-[16px] bg-[linear-gradient(90deg,#145cc3_0%,#20b8ef_100%)] px-8 text-[0.98rem] font-bold tracking-[0.01em] text-white shadow-[0_16px_30px_rgba(32,184,239,0.22)] hover:opacity-95 md:min-w-[260px] md:text-[1rem]"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          투자하기
        </Button>
      </div>
    </section>
  );
}

function ResultRevealPanel({
  trial,
  partnerLabel,
  onNext,
  showNextButton,
}: {
  trial: RTGSubmitTrialResponse['trial'];
  partnerLabel: string;
  onNext?: () => void;
  showNextButton: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5">
      <section className="mx-auto flex w-full justify-center">
        <div className="grid items-center gap-2 md:grid-cols-[182px_340px_182px] md:gap-3">
          <RoleCard
            title={partnerLabel}
            points={trial.amount_received_by_partner}
            caption="상대가 받은 금액"
            tone="partner"
            icon={<Shield className="h-9 w-9 stroke-[1.9] lg:h-10 lg:w-10" />}
          />
          <div className="relative flex h-[84px] w-full items-center justify-center lg:h-[96px]">
            <div className="absolute left-0 right-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#b9efe1]" />
            <div className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full border border-white/90 bg-white text-[0.9rem] font-bold tracking-[0.02em] text-[#0c7c53] shadow-[0_14px_28px_rgba(190,200,210,0.22)] lg:h-[60px] lg:w-[60px]">
              반환
            </div>
          </div>
          <RoleCard
            title="당신"
            points={trial.partner_return_amount}
            caption="상대가 돌려준 금액"
            tone="player"
            icon={<User className="h-9 w-9 stroke-[1.9] lg:h-10 lg:w-10" />}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-[#dff0e9] bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(241,253,248,0.72)_100%)] px-5 py-5 shadow-[0_18px_36px_rgba(198,208,221,0.12)]">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-[20px] bg-white/90 px-4 py-4 shadow-sm">
            <div className="text-[0.8rem] font-semibold text-[#6a7874]">투자한 금액</div>
            <div className="mt-2 text-[1.9rem] font-black tracking-[-0.05em] text-[#145cc3]">
              {formatPoints(trial.amount_sent)}점
            </div>
          </div>
          <div className="rounded-[20px] bg-white/90 px-4 py-4 shadow-sm">
            <div className="text-[0.8rem] font-semibold text-[#6a7874]">상대가 받은 금액</div>
            <div className="mt-2 text-[1.9rem] font-black tracking-[-0.05em] text-[#0b7b53]">
              {formatPoints(trial.amount_received_by_partner)}점
            </div>
          </div>
          <div className="rounded-[20px] bg-white/90 px-4 py-4 shadow-sm">
            <div className="text-[0.8rem] font-semibold text-[#6a7874]">돌려받은 금액</div>
            <div className="mt-2 text-[1.9rem] font-black tracking-[-0.05em] text-[#0b7b53]">
              {formatPoints(trial.partner_return_amount)}점
            </div>
          </div>
          <div className="rounded-[20px] bg-white/90 px-4 py-4 shadow-sm">
            <div className="text-[0.8rem] font-semibold text-[#6a7874]">시도 후 내 잔액</div>
            <div className="mt-2 text-[1.9rem] font-black tracking-[-0.05em] text-[#151b24]">
              {formatPoints(trial.participant_total_payoff_this_trial)}점
            </div>
          </div>
        </div>

        {showNextButton && onNext ? (
          <div className="mt-5 flex justify-end">
            <Button
              onClick={onNext}
              className="h-[52px] rounded-[15px] bg-[linear-gradient(90deg,#145cc3_0%,#20b8ef_100%)] px-7 text-[0.98rem] font-bold text-white shadow-[0_14px_28px_rgba(32,184,239,0.24)] hover:opacity-95"
            >
              다음 시도
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function BalanceBars({
  botBalance,
  userBalance,
}: {
  botBalance: number;
  userBalance: number;
}) {
  const scaleMax = Math.max(50, botBalance, userBalance, 1);
  const botWidth = botBalance > 0 ? (botBalance / scaleMax) * 100 : 0;
  const userWidth = userBalance > 0 ? (userBalance / scaleMax) * 100 : 0;

  return (
    <section className="mx-auto w-full max-w-[640px] pt-1">
      <div className="space-y-3">
        <div className="text-[1.08rem] font-black tracking-[-0.02em] text-[#58635f] md:text-[1.16rem]">잔액</div>

        <div className="flex items-center gap-4">
          <div className="w-14 text-[0.82rem] font-bold tracking-[0.02em] text-[#6c766b] md:w-16">
            파트너
          </div>
          <div className="flex-1 h-[24px] overflow-hidden rounded-full bg-white/80 shadow-[inset_0_2px_8px_rgba(210,220,232,0.20)] md:h-[26px]">
            <div
              className="flex h-full items-center justify-start rounded-full bg-[linear-gradient(90deg,#3b82f6_0%,#1db8f4_100%)] px-4 text-[0.68rem] font-bold tracking-[0.08em] text-white transition-[width] duration-300 md:text-[0.72rem]"
              style={{ width: `${Math.min(botWidth, 100)}%` }}
            />
          </div>
          <div className="w-14 text-right text-[1.9rem] font-black leading-none tracking-[-0.08em] text-[#1562d0] md:w-16 md:text-[2.1rem]">
            {formatPoints(botBalance)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 text-[0.82rem] font-bold tracking-[0.02em] text-[#6c766b] md:w-16">
            당신
          </div>
          <div className="flex-1 h-[24px] overflow-hidden rounded-full bg-white/80 shadow-[inset_0_2px_8px_rgba(210,220,232,0.20)] md:h-[26px]">
            <div
              className="flex h-full items-center justify-start rounded-full bg-[linear-gradient(90deg,#19c98d_0%,#0f7b53_100%)] px-4 text-[0.68rem] font-bold tracking-[0.08em] text-white transition-[width] duration-300 md:text-[0.72rem]"
              style={{ width: `${Math.min(userWidth, 100)}%` }}
            />
          </div>
          <div className="w-14 text-right text-[1.9rem] font-black leading-none tracking-[-0.08em] text-[#0b875d] md:w-16 md:text-[2.1rem]">
            {formatPoints(userBalance)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClassificationOption({
  value,
  id,
  label,
  checked,
}: {
  value: PartnerClassification;
  id: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-3 rounded-[18px] border px-4 py-4 transition-colors ${
        checked ? 'border-[#bfe9dc] bg-[#f2fdf8]' : 'border-[#e3ebef] bg-white/88'
      }`}
    >
      <RadioGroupItem value={value} id={id} />
      <span className="text-[0.95rem] font-medium text-[#233038]">{label}</span>
    </label>
  );
}

function RatingSlider({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: number[];
  onValueChange: (value: number[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[0.95rem] font-medium text-[#2a353d]">{label}</span>
        <span className="rounded-full bg-[#e9f6f2] px-3 py-1 text-[0.86rem] font-semibold text-[#0b7b53]">
          {value[0]} / 7
        </span>
      </div>
      <SliderPrimitive.Root
        min={1}
        max={7}
        step={1}
        value={value}
        onValueChange={onValueChange}
        className="relative flex w-full touch-none select-none items-center py-2"
      >
        <SliderPrimitive.Track className="relative h-[16px] w-full overflow-hidden rounded-full bg-[#dfe5ea]">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-[linear-gradient(90deg,#0f7b53_0%,#19c98d_100%)]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] border-[#0f7b53] bg-white shadow-[0_10px_20px_rgba(15,123,83,0.16)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0f7b53]/15" />
      </SliderPrimitive.Root>
      <div className="flex justify-between text-[0.72rem] font-semibold text-[#92a4bf]">
        <span>낮음</span>
        <span>높음</span>
      </div>
    </div>
  );
}

function PostBlockPanel({
  partnerLabel,
  classification,
  onClassificationChange,
  confidence,
  onConfidenceChange,
  willingness,
  onWillingnessChange,
  onSubmit,
  isLoading,
}: {
  partnerLabel: string;
  classification: PartnerClassification;
  onClassificationChange: (value: PartnerClassification) => void;
  confidence: number[];
  onConfidenceChange: (value: number[]) => void;
  willingness: number[];
  onWillingnessChange: (value: number[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.58)_100%)] px-5 py-6 shadow-[0_20px_48px_rgba(198,208,221,0.14)] backdrop-blur-[2px] md:px-8 md:py-7 lg:px-10 lg:py-8">
      <div className="mx-auto flex w-full max-w-[900px] flex-col">
        <div className="text-center">
          <div className="text-[0.84rem] font-bold tracking-[0.08em] text-[#0b7b53]">블록 종료 평가</div>
          <h2 className="mt-2 text-[2.15rem] font-black tracking-[-0.06em] text-[#131a22] md:text-[2.4rem]">
            {partnerLabel}는 어떤 상대였나요?
          </h2>
          <p className="mt-2 text-[0.96rem] text-[#5c6a66]">15번의 상호작용을 바탕으로 가장 가까운 인상을 골라 주세요.</p>
        </div>

        <div className="mt-6 grid gap-3">
          <RadioGroup value={classification} onValueChange={(value) => onClassificationChange(value as PartnerClassification)}>
            <div className="grid gap-3">
              <ClassificationOption
                value="high_return"
                id="class-high"
                label="대체로 많이 돌려주는 편이었다"
                checked={classification === 'high_return'}
              />
              <ClassificationOption
                value="low_return"
                id="class-low"
                label="대체로 적게 돌려주는 편이었다"
                checked={classification === 'low_return'}
              />
              <ClassificationOption
                value="unpredictable"
                id="class-unpredictable"
                label="들쭉날쭉해서 예측하기 어려웠다"
                checked={classification === 'unpredictable'}
              />
            </div>
          </RadioGroup>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <RatingSlider label="이 판단에 대한 확신도" value={confidence} onValueChange={onConfidenceChange} />
          <RatingSlider label="다시 함께 게임하고 싶은 정도" value={willingness} onValueChange={onWillingnessChange} />
        </div>

        <div className="mt-7 flex justify-end">
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="h-[54px] min-w-[220px] rounded-[15px] bg-[linear-gradient(90deg,#0c7b53_0%,#1ac78c_100%)] px-8 text-[0.98rem] font-bold text-white shadow-[0_16px_30px_rgba(18,185,129,0.22)] hover:opacity-95"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            평가 저장
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function RTGMainPage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [amountSent, setAmountSent] = useState<number[]>([0]);
  const [classification, setClassification] = useState<PartnerClassification>('high_return');
  const [confidence, setConfidence] = useState<number[]>([4]);
  const [willingness, setWillingness] = useState<number[]>([4]);
  const [lastTrial, setLastTrial] = useState<RTGSubmitTrialResponse | null>(null);
  const [lastPostBlock, setLastPostBlock] = useState<RTGPostBlockResponse | null>(null);
  const [promptStartedAt, setPromptStartedAt] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const rules = [
    '참가자는 항상 투자자(trustor) 역할입니다.',
    '세 명의 파트너와 각각 15번씩 상호작용합니다.',
    '보낸 금액은 3배가 되어 상대에게 전달됩니다.',
    '각 block이 끝나면 상대 유형과 확신도를 평가합니다.',
  ];

  useEffect(() => {
    if (session?.phase === 'trial') {
      setAmountSent([0]);
      setPromptStartedAt(Date.now());
    }
  }, [session?.phase, session?.overall_trial_index, session?.current_block_index]);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const response = await rtgAPI.startSession();
      setSession(response.session);
      setLastTrial(null);
      setLastPostBlock(null);
    } catch (error) {
      toast({
        title: '본실험 시작 실패',
        description: error instanceof Error ? error.message : 'RTG 본실험을 시작하지 못했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTrial = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      const response = await rtgAPI.submitTrial({
        session_id: session.session_id,
        amount_sent: amountSent[0],
        response_time_ms: Date.now() - promptStartedAt,
      });
      setSession(response.session);
      setLastTrial(response);
      setLastPostBlock(null);
      toast({
        title: `시도 ${response.trial.rtg_trial_index} 완료`,
        description: `${formatPoints(response.trial.partner_return_amount)}점을 돌려받았습니다.`,
      });
    } catch (error) {
      toast({
        title: '제출 실패',
        description: error instanceof Error ? error.message : 'RTG trial 제출에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPostBlock = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      const response = await rtgAPI.submitPostBlock({
        session_id: session.session_id,
        partner_classification_response: classification,
        classification_confidence: confidence[0],
        willingness_to_play_again: willingness[0],
      });
      setSession(response.session);
      setLastPostBlock(response);
      setLastTrial(null);
      setClassification('high_return');
      setConfidence([4]);
      setWillingness([4]);
      toast({
        title: `Block ${response.post_block.rtg_block_index} 저장 완료`,
        description: response.completed ? 'RTG 본실험이 완료되었습니다.' : '다음 파트너 block으로 이동합니다.',
      });
    } catch (error) {
      toast({
        title: 'Post-block 저장 실패',
        description: error instanceof Error ? error.message : 'Post-block 응답 저장에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextTrial = () => {
    setLastTrial(null);
    setAmountSent([0]);
    setPromptStartedAt(Date.now());
  };

  const currentRound = session?.overall_trial_index ?? session?.completed_trials_count ?? 1;
  const totalRounds = (session?.total_blocks ?? 3) * (session?.trials_per_block ?? 15);
  const endowment = session?.current_balance ?? session?.endowment ?? 10;
  const multiplier = session?.multiplier ?? 3;
  const currentBlock = session?.current_block_index ?? 1;
  const totalBlocks = session?.total_blocks ?? 3;
  const currentTrialWithinBlock = session?.current_trial_within_block ?? 1;
  const trialsPerBlock = session?.trials_per_block ?? 15;
  const partnerLabel = formatPartnerLabel(session?.current_partner_label ?? '상대');
  const isCompletedPhase = session?.phase === 'completed';
  const isAwaitingPostBlockPhase =
    session?.phase === 'awaiting_post_block' || session?.awaiting_post_block === true;
  const isTrialLikePhase = Boolean(session) && !isCompletedPhase && !isAwaitingPostBlockPhase;
  const partnerReceivedPreview = Math.round(amountSent[0] * multiplier);
  const lastTrialPartnerBalance = Math.round(
    session?.current_partner_balance ?? lastTrial?.trial.partner_balance_after_trial ?? 0
  );
  const lastTrialUserBalance = Math.round(
    session?.current_balance ?? lastTrial?.trial.participant_balance_after_trial ?? 0
  );
  const showNewPartnerBanner =
    isTrialLikePhase &&
    !lastTrial &&
    ((session?.current_trial_within_block ?? 1) === 1 || Boolean(lastPostBlock));

  return (
    <GameLayout
      title="Repeated Trust Game"
      rules={rules}
      currentRound={Math.min(currentRound, totalRounds)}
      totalRounds={totalRounds}
      playerBalance={session?.current_balance ?? session?.cumulative_payoff ?? 0}
      balanceLabel="현재 잔액"
      showSidebar={!session}
    >
      {!session && (
        <Card className="mx-auto w-full max-w-2xl border-none bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-primary">Repeated Trust Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center text-foreground/80">
            <p>
              본실험에서는 투자자로서 세 명의 파트너와 반복 상호작용합니다. 각 block은 새로운
              상대와 15번의 시도로 구성되며, block이 끝날 때마다 상대 유형과 확신도를 평가합니다.
            </p>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
              <div className="text-sm text-primary/70">Main Task Structure</div>
              <div className="mt-1 text-2xl font-bold text-primary">15 시도 x 3 블록</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/trust-game/tutorial">Tutorial First</Link>
            </Button>
            <Button onClick={handleStart} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Handshake className="mr-2 h-4 w-4" />}
              Start Main Task
            </Button>
          </CardFooter>
        </Card>
      )}

      {session && (
        <div className="mx-auto flex w-full max-w-[920px] flex-col gap-5 px-1 py-1">
          {showNewPartnerBanner && session.current_block_index && session.total_blocks ? (
            <PartnerIntroBanner
              partnerLabel={partnerLabel}
              currentBlock={session.current_block_index}
              totalBlocks={session.total_blocks}
              previousLabel={lastPostBlock?.post_block.partner_public_label}
            />
          ) : null}

          {isTrialLikePhase && !lastTrial ? (
            <>
              <TrialStatusHeader
                currentBlock={currentBlock}
                totalBlocks={totalBlocks}
                currentTrial={currentTrialWithinBlock}
                trialsPerBlock={trialsPerBlock}
              />
              <InvestmentScene
                amountSent={amountSent[0]}
                partnerReceived={partnerReceivedPreview}
                partnerLabel={partnerLabel}
                multiplier={multiplier}
              />

              <InvestmentPanel
                endowment={endowment}
                amountSent={amountSent}
                onValueChange={setAmountSent}
                onSubmit={handleSubmitTrial}
                isLoading={isLoading}
              />
            </>
          ) : null}

          {lastTrial ? (
            <>
              <TrialStatusHeader
                currentBlock={currentBlock}
                totalBlocks={totalBlocks}
                currentTrial={lastTrial.trial.trial_within_partner}
                trialsPerBlock={trialsPerBlock}
              />
              <ResultRevealPanel
                trial={lastTrial.trial}
                partnerLabel={formatPartnerLabel(lastTrial.trial.partner_public_label)}
                onNext={handleNextTrial}
                showNextButton={isTrialLikePhase}
              />
              <BalanceBars
                botBalance={lastTrialPartnerBalance}
                userBalance={lastTrialUserBalance}
              />
            </>
          ) : null}

          {isAwaitingPostBlockPhase ? (
            <PostBlockPanel
              partnerLabel={partnerLabel}
              classification={classification}
              onClassificationChange={setClassification}
              confidence={confidence}
              onConfidenceChange={setConfidence}
              willingness={willingness}
              onWillingnessChange={setWillingness}
              onSubmit={handleSubmitPostBlock}
              isLoading={isLoading}
            />
          ) : null}

          {lastPostBlock && isTrialLikePhase ? (
            <Card className="border-[#d9efe8] bg-[#f4fdf9] shadow-[0_14px_28px_rgba(198,208,221,0.12)]">
              <CardContent className="px-5 py-4 text-[0.95rem] text-[#39514b]">
                {formatPartnerLabel(lastPostBlock.post_block.partner_public_label)}에 대한 평가가 저장되었습니다. 이제 새로운
                파트너와 다음 block을 시작합니다.
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}

      {isCompletedPhase && session && (
        <Card className="mx-auto mt-4 w-full max-w-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">RTG Completed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/80">
            <p>3개 파트너와의 45개 시도를 모두 완료했습니다.</p>
            <p>
              누적 payoff는 <strong className="text-primary">{session.cumulative_payoff?.toFixed(2)} points</strong>입니다.
            </p>
            <p>이제 결과 리포트를 확인하거나 설문 단계로 넘어갈 수 있습니다.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/report">Open Report</Link>
            </Button>
            <Button asChild>
              <Link href="/questionnaire">
                Continue to Questionnaire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </GameLayout>
  );
}
