"use client";

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import {
  ArrowRight,
  Handshake,
  Loader2,
} from 'lucide-react';

import { BotAvatar, ParticipantAvatar } from '@/components/GameAvatar';
import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { RTGPostBlockResponse, RTGSubmitTrialResponse, SessionState, rtgAPI } from '@/lib/api';

type PartnerClassification = 'high_return' | 'low_return' | 'unpredictable';

function formatPoints(value: number) {
  return `${Math.round(value)}`;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeSector(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  if (Math.abs(endAngle - startAngle) >= 360) {
    return [
      `M ${cx} ${cy - radius}`,
      `A ${radius} ${radius} 0 1 1 ${cx - 0.01} ${cy - radius}`,
      `A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius}`,
      'Z',
    ].join(' ');
  }

  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

function formatPartnerLabel(label: string) {
  return label.replace(/^Partner\b/, '파트너');
}

function TrialStatusHeader({
  currentTrial,
  trialsPerBlock,
  partnerLabel,
  currentBlock,
  totalBlocks,
}: {
  currentTrial: number;
  trialsPerBlock: number;
  partnerLabel: string;
  currentBlock: number;
  totalBlocks: number;
}) {
  return (
    <section className="mx-auto flex w-full max-w-[820px] items-start justify-between gap-5">
      <div>
        <p className="text-[0.95rem] font-bold tracking-[-0.01em] text-[#8a9ab0]">진행 상황</p>
        <h2 className="mt-1 text-[2.15rem] font-black tracking-[-0.05em] text-[#151b24] md:text-[2.45rem]">
          {currentTrial}회차 <span className="font-semibold text-[#9eb0c7]">/ {trialsPerBlock}</span>
        </h2>
      </div>
      <div className="rounded-[20px] bg-[#e7f7f1] px-6 py-4 text-[1.15rem] font-bold tracking-[-0.02em] text-[#158b67] shadow-[0_10px_22px_rgba(27,168,119,0.08)]">
        {partnerLabel}, {currentBlock}/{totalBlocks}
      </div>
    </section>
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

function InvestmentScene({
  partnerLabel,
  multiplier,
}: {
  partnerLabel: string;
  multiplier: number;
}) {
  return (
    <section className="pt-5">
      <div className="mx-auto grid max-w-[820px] items-center gap-4 md:grid-cols-[auto_minmax(360px,500px)_auto]">
        <div className="flex flex-col items-center gap-3">
          <ParticipantAvatar
            alt="당신 아바타"
            className="h-[72px] w-[72px] shadow-[0_14px_26px_rgba(243,107,44,0.18)]"
          />
          <div className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#98a7bb]">당신</div>
        </div>

        <div className="relative flex h-[86px] items-center justify-center">
          <div className="absolute left-0 right-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#e7edf5]" />
          <div className="absolute right-[7%] top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-[#c6d1dd]">
            <ArrowRight className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="relative rounded-full bg-[#f4ab00] px-7 py-3 text-[1.22rem] font-black tracking-[-0.03em] text-[#6a4300] shadow-[0_12px_24px_rgba(244,171,0,0.22)]">
            {multiplier}배 승수
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <BotAvatar
            alt={`${partnerLabel} 아바타`}
            className="h-[72px] w-[72px] shadow-[0_14px_26px_rgba(29,47,73,0.2)]"
          />
          <div className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#98a7bb]">{partnerLabel}</div>
        </div>
      </div>
    </section>
  );
}

function InvestmentPanel({
  endowment,
  multiplier,
  amountSent,
  onValueChange,
  onSubmit,
  isLoading,
}: {
  endowment: number;
  multiplier: number;
  amountSent: number[];
  onValueChange: (value: number[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  const invested = amountSent[0];
  const partnerReceived = invested * multiplier;

  return (
    <section className="mx-auto mt-8 w-full max-w-[820px] overflow-hidden rounded-[26px] border border-[#d8dde4] bg-white px-6 py-6 shadow-[0_10px_24px_rgba(170,184,198,0.16)] md:mt-9 md:px-10 md:py-8">
      <div className="mx-auto flex w-full max-w-[820px] flex-col">
        <h2 className="text-[2.05rem] font-black tracking-[-0.05em] text-[#121821] md:text-[2.35rem]">투자 금액 선택</h2>
        <p className="mt-3 max-w-[820px] text-[1.06rem] leading-[1.9] text-[#7e8fa4] md:text-[1.14rem]">
          파트너 봇에게 보낼 금액을 선택하세요. 보낸 금액은{' '}
          <span className="font-bold text-[#12af84]">{multiplier}배(x{multiplier})</span>
          {' '}가 되어 파트너 봇에게 전달됩니다.
        </p>

        <div className="mt-10">
          <SliderPrimitive.Root
            min={0}
            max={endowment}
            step={1}
            value={amountSent}
            onValueChange={onValueChange}
            className="relative flex w-full touch-none select-none items-center"
          >
            <SliderPrimitive.Track className="relative h-[20px] w-full overflow-hidden rounded-full bg-[#edf2f8]">
              <SliderPrimitive.Range className="absolute h-full rounded-full bg-transparent" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block h-[34px] w-[34px] rounded-full border-[6px] border-white bg-[#17bf91] shadow-[0_10px_22px_rgba(23,191,145,0.28)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#17bf91]/20" />
          </SliderPrimitive.Root>

          <div className="mt-5 grid grid-cols-3 text-[1rem] font-bold text-[#9caec4] md:text-[1.08rem]">
            <span className="text-left">0 점</span>
            <span className="text-center text-[1.15rem] md:text-[1.28rem]">{Math.round(endowment / 2)} 점</span>
            <span className="text-right">{endowment} 점</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-[20px] border border-[#e3e8ef] bg-[#f6f8fb]">
          <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
            <span className="text-[1rem] font-bold tracking-[-0.02em] text-[#72839a] md:text-[1.1rem]">투자 금액</span>
            <span className="text-[1.7rem] font-black tracking-[-0.05em] text-[#151b24] md:text-[1.95rem]">{formatPoints(invested)} 점</span>
          </div>
          <div className="flex items-center justify-between gap-4 border-l border-[#e1e7ef] px-5 py-4 md:px-6">
            <span className="text-[1rem] font-bold tracking-[-0.02em] text-[#72839a] md:text-[1.1rem]">봇이 받는 금액</span>
            <span className="text-[1.7rem] font-black tracking-[-0.05em] text-[#17b587] md:text-[1.95rem]">{formatPoints(partnerReceived)} 점</span>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="mt-8 h-[70px] w-full rounded-[20px] bg-[#08a573] text-[1.55rem] font-black tracking-[-0.03em] text-white shadow-[0_14px_28px_rgba(8,165,115,0.2)] hover:bg-[#069c6c]"
        >
          {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : null}
          투자 확정
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
}

function ExperimentalAmountCircle({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 text-[1.05rem] font-black tracking-[-0.04em] text-[#334038] md:text-[1.15rem]">{label}</div>
      <div className="relative flex h-[204px] w-[204px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_28%,#ffffff_0%,#f8fbff_38%,#eef4fb_74%,#edf2f8_100%)] shadow-[0_24px_44px_rgba(196,208,220,0.2)]">
        <div className="absolute top-[10px] z-10 rounded-full border-[5px] border-white shadow-[0_16px_24px_rgba(110,154,220,0.18)]">
          <ParticipantAvatar alt="당신 아바타" className="h-[62px] w-[62px]" />
        </div>
        <div className="absolute inset-[18px] rounded-full border border-[#e8eef6]" />
        <div className="absolute inset-[30px] rounded-full border border-[#f1f5fb]" />
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[linear-gradient(180deg,#1d63c7_0%,#0f8a67_100%)] shadow-[0_16px_28px_rgba(29,99,198,0.22)]">
          <span className="text-[3rem] font-black tracking-[-0.09em] text-white">{formatPoints(value)}점</span>
        </div>
      </div>
    </div>
  );
}

function ExperimentalAllocationPie({
  total,
  returned,
  kept,
}: {
  total: number;
  returned: number;
  kept: number;
}) {
  const safeTotal = Math.max(total, 1);
  const returnedShare = (returned / safeTotal) * 100;
  const keptShare = Math.max(100 - returnedShare, 0);
  const returnedAngle = (returned / safeTotal) * 360;
  const chartSize = 188;
  const chartRadius = 94;
  const chartCenter = chartSize / 2;
  const returnedPath = describeSector(chartCenter, chartCenter, chartRadius, 0, returnedAngle);
  const keptPath = describeSector(chartCenter, chartCenter, chartRadius, returnedAngle, 360);
  const dividerPoint = polarToCartesian(chartCenter, chartCenter, chartRadius, returnedAngle);
  const containerCenter = 126;
  const labelRadius = 92;
  const returnedMidAngle = returnedAngle / 2;
  const keptMidAngle = returnedAngle + (360 - returnedAngle) / 2;
  const returnedAnchor = polarToCartesian(containerCenter, containerCenter, labelRadius, returnedMidAngle);
  const keptAnchor = polarToCartesian(containerCenter, containerCenter, labelRadius, keptMidAngle);

  function FloatingValueCard({
    tone,
    value,
    label,
    avatar,
    anchor,
  }: {
    tone: 'returned' | 'kept';
    value: number;
    label: string;
    avatar: ReactNode;
    anchor: { x: number; y: number };
  }) {
    const toneClasses =
      tone === 'returned'
        ? {
            border: 'border-[#7eafff]',
            shadow: 'shadow-[0_20px_34px_rgba(31,99,198,0.14)]',
            text: 'text-[#1f63c6]',
          }
        : {
            border: 'border-[#7fd5bb]',
            shadow: 'shadow-[0_20px_34px_rgba(15,138,103,0.14)]',
            text: 'text-[#0f8a67]',
          };
    const isLeftSide = anchor.x < containerCenter;
    const transform = isLeftSide ? 'translate(-100%, -50%)' : 'translate(0, -50%)';

    return (
      <div
        className="absolute"
        style={{
          left: `${anchor.x}px`,
          top: `${anchor.y}px`,
          transform,
        }}
      >
        <div className={`relative flex h-[92px] w-[72px] flex-col items-center rounded-[18px] border-[4px] bg-white px-2 pt-[28px] text-center ${toneClasses.border} ${toneClasses.shadow}`}>
          <div className="absolute left-1/2 top-[-20px] z-10 -translate-x-1/2 rounded-full border-[4px] border-white bg-white shadow-[0_10px_18px_rgba(110,154,220,0.16)]">
            {avatar}
          </div>
          <div className={`text-[1.65rem] font-black leading-none tracking-[-0.08em] ${toneClasses.text}`}>
            {formatPoints(value)}점
          </div>
          <div className={`mt-1 text-[0.66rem] font-black leading-[1.05] tracking-[-0.03em] ${toneClasses.text}`}>
            {label}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 text-[1.05rem] font-black tracking-[-0.04em] text-[#334038] md:text-[1.15rem]">총 금액 배분</div>
      <div className="relative flex h-[252px] w-[252px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_28%,#ffffff_0%,#f9fbff_38%,#eef4fb_72%,#edf2f8_100%)] shadow-[0_24px_44px_rgba(196,208,220,0.2)]">
        <div className="absolute inset-[16px] rounded-full border border-[#eef2f7]" />
        <svg
          viewBox={`0 0 ${chartSize} ${chartSize}`}
          className="relative h-[188px] w-[188px] rounded-full border-[6px] border-white shadow-[0_16px_28px_rgba(24,45,76,0.14)]"
          aria-label={`반환 ${Math.round(returnedShare)}퍼센트, 보유 ${Math.round(keptShare)}퍼센트`}
        >
          <defs>
            <linearGradient id="mainReturnedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f63c6" />
              <stop offset="100%" stopColor="#3f88f2" />
            </linearGradient>
            <linearGradient id="mainKeptGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f8a67" />
              <stop offset="100%" stopColor="#20b486" />
            </linearGradient>
            <clipPath id="mainPieClip">
              <circle cx={chartCenter} cy={chartCenter} r={chartRadius} />
            </clipPath>
          </defs>
          <circle cx={chartCenter} cy={chartCenter} r={chartRadius} fill="#f7fbff" />
          <path d={returnedPath} fill="url(#mainReturnedGradient)" />
          <path d={keptPath} fill="url(#mainKeptGradient)" />
          <line
            x1={chartCenter}
            y1={chartCenter}
            x2={chartCenter}
            y2={chartCenter - chartRadius}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2"
          />
          <line
            x1={chartCenter}
            y1={chartCenter}
            x2={dividerPoint.x}
            y2={dividerPoint.y}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2"
          />
          <g clipPath="url(#mainPieClip)" opacity="0.22">
            <circle cx="155" cy="72" r="54" fill="#ffffff" />
            <path d="M20 184 L148 92 L228 190 L228 228 L20 228 Z" fill="#103f76" opacity="0.18" />
            <path d="M82 24 L228 148 L228 228 L150 228 L36 112 Z" fill="#ffffff" opacity="0.12" />
          </g>
        </svg>

        <FloatingValueCard
          tone="kept"
          value={kept}
          label="봇 보유"
          anchor={keptAnchor}
          avatar={<BotAvatar alt="봇 아바타" className="h-[36px] w-[36px]" />}
        />
        <FloatingValueCard
          tone="returned"
          value={returned}
          label="반환됨"
          anchor={returnedAnchor}
          avatar={<ParticipantAvatar alt="당신 아바타" className="h-[36px] w-[36px]" />}
        />
      </div>
      <div className="mt-5 text-[1.05rem] font-black tracking-[-0.04em] text-[#647487]">
        보유 {Math.round(keptShare)}% · 반환 {Math.round(returnedShare)}%
      </div>
    </div>
  );
}

function ExperimentalResultPanel({
  amountSent,
  amountReceivedByPartner,
  partnerReturnAmount,
  partnerKept,
}: {
  amountSent: number;
  amountReceivedByPartner: number;
  partnerReturnAmount: number;
  partnerKept: number;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#d5e3db] bg-white px-6 py-8 shadow-[0_18px_36px_rgba(192,205,213,0.14)] md:px-8 md:py-9">
      <div className="mt-2 grid items-center gap-8 md:grid-cols-[240px_132px_252px] md:justify-between md:gap-4 md:-translate-x-4">
        <ExperimentalAmountCircle label="당신의 투자액" value={amountSent} />

        <div className="flex items-center justify-center self-center">
          <div className="relative flex h-[64px] w-[132px] translate-x-2 items-center justify-center">
            <div className="absolute inset-y-[21px] left-0 right-[20px] rounded-full bg-[linear-gradient(90deg,#14d8d8_0%,#3e5ff0_100%)] shadow-[0_10px_16px_rgba(61,110,233,0.18)]" />
            <ArrowRight className="absolute right-0 h-[56px] w-[56px] fill-[#3e5ff0] text-[#3e5ff0] stroke-[1.7]" />
          </div>
        </div>

        <ExperimentalAllocationPie
          total={amountReceivedByPartner}
          returned={partnerReturnAmount}
          kept={partnerKept}
        />
      </div>
    </section>
  );
}

function ResultRevealPanel({
  trial,
  partnerLabel,
  userBalance,
  botBalance,
  onNext,
  showNextButton,
}: {
  trial: RTGSubmitTrialResponse['trial'];
  partnerLabel: string;
  userBalance: number;
  botBalance: number;
  onNext?: () => void;
  showNextButton: boolean;
}) {
  const partnerKept = Math.max(trial.amount_received_by_partner - trial.partner_return_amount, 0);
  const userNet = trial.partner_return_amount - trial.amount_sent;
  const partnerNet = partnerKept;
  const scaleMax = Math.max(80, userBalance, botBalance, 1);
  const userWidth = (userBalance / scaleMax) * 100;
  const botWidth = (botBalance / scaleMax) * 100;
  const roundLabel = `${String(trial.trial_within_partner).padStart(2, '0')} 라운드 종료 후 총액`;

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-5 md:gap-6">
      <ExperimentalResultPanel
        amountSent={trial.amount_sent}
        amountReceivedByPartner={trial.amount_received_by_partner}
        partnerReturnAmount={trial.partner_return_amount}
        partnerKept={partnerKept}
      />

      <section className="grid gap-3 md:grid-cols-2 md:gap-4">
        <div className="rounded-[20px] border border-[#cfe0d6] bg-white px-4 py-4 shadow-[0_10px_20px_rgba(192,205,213,0.12)] md:px-5 md:py-4">
          <div className="flex items-center gap-3">
            <ParticipantAvatar
              alt="당신 아바타"
              className="h-[64px] w-[64px] shadow-[0_10px_18px_rgba(243,107,44,0.14)]"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[0.86rem] font-bold tracking-[-0.02em] text-[#9da7aa]">라운드 수익</div>
              <div className="text-[1.5rem] font-black tracking-[-0.05em] text-[#161b22] md:text-[1.65rem]">당신</div>
            </div>
            <div className="text-right">
              <div className="text-[1.7rem] font-black tracking-[-0.06em] text-[#0e8c68] md:text-[1.9rem]">
                {userNet > 0 ? '+' : ''}{formatPoints(userNet)} 점
              </div>
              <div className="text-[0.84rem] font-semibold text-[#7f8c92]">라운드 수익</div>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#d4deea] bg-white px-4 py-4 shadow-[0_10px_20px_rgba(192,205,213,0.12)] md:px-5 md:py-4">
          <div className="flex items-center gap-3">
            <BotAvatar
              alt={`${partnerLabel} 아바타`}
              className="h-[64px] w-[64px] shadow-[0_10px_18px_rgba(29,47,73,0.15)]"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[0.86rem] font-bold tracking-[-0.02em] text-[#9da7aa]">라운드 수익</div>
              <div className="text-[1.5rem] font-black tracking-[-0.05em] text-[#161b22] md:text-[1.65rem]">{partnerLabel}</div>
            </div>
            <div className="text-right">
              <div className="text-[1.7rem] font-black tracking-[-0.06em] text-[#1f63c6] md:text-[1.9rem]">
                {partnerNet > 0 ? '+' : ''}{formatPoints(partnerNet)} 점
              </div>
              <div className="text-[0.84rem] font-semibold text-[#7f8c92]">라운드 수익</div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-[#d5e3db] bg-white px-4 py-5 shadow-[0_12px_26px_rgba(192,205,213,0.12)] md:px-7 md:py-6">
        <div className="text-[1.45rem] font-black tracking-[-0.05em] text-[#161b22] md:text-[1.65rem]">{roundLabel}</div>

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
              <div className="text-[1.08rem] font-black tracking-[-0.04em] text-[#1f2a24] md:text-[1.18rem]">{partnerLabel} 잔액</div>
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

      {showNextButton && onNext ? (
        <div className="flex justify-center pt-2">
          <Button
            onClick={onNext}
            className="h-[58px] min-w-[260px] rounded-[18px] bg-[#0d7e5f] px-7 text-[1.08rem] font-black tracking-[-0.03em] text-white shadow-[0_12px_22px_rgba(13,126,95,0.18)] hover:bg-[#0b7658] md:h-[62px] md:min-w-[320px] md:text-[1.2rem]"
          >
            다음 라운드 시작
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      ) : null}
    </div>
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
        min={0}
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
  const [confidence, setConfidence] = useState<number[]>([0]);
  const [willingness, setWillingness] = useState<number[]>([0]);
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
      setConfidence([0]);
      setWillingness([0]);
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
  const lastTrialPartnerBalance = Math.round(
    session?.current_partner_balance ?? lastTrial?.trial.partner_balance_after_trial ?? 0
  );
  const lastTrialUserBalance = Math.round(
    session?.current_balance ?? lastTrial?.trial.participant_balance_after_trial ?? 0
  );

  return (
    <GameLayout
      title="Repeated Trust Game"
      rules={rules}
      currentRound={Math.min(currentRound, totalRounds)}
      totalRounds={totalRounds}
      playerBalance={session?.current_balance ?? session?.cumulative_payoff ?? 0}
      balanceLabel="현재 잔액"
      showSidebar={!session}
      contentClassName={session ? 'bg-transparent p-0 shadow-none backdrop-blur-0 min-h-0' : undefined}
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
        <div className="mx-auto flex w-full max-w-[980px] flex-col gap-8 px-2 py-2 md:px-4">
          {isTrialLikePhase && !lastTrial ? (
            <div className="w-full [zoom:0.9]">
              <TrialStatusHeader
                currentTrial={currentTrialWithinBlock}
                trialsPerBlock={trialsPerBlock}
                partnerLabel={partnerLabel}
                currentBlock={currentBlock}
                totalBlocks={totalBlocks}
              />
              <InvestmentScene
                partnerLabel={partnerLabel}
                multiplier={multiplier}
              />

              <InvestmentPanel
                endowment={endowment}
                multiplier={multiplier}
                amountSent={amountSent}
                onValueChange={setAmountSent}
                onSubmit={handleSubmitTrial}
                isLoading={isLoading}
              />
            </div>
          ) : null}

          {lastTrial && !isAwaitingPostBlockPhase ? (
            <div className="w-full [zoom:0.9]">
              <TrialStatusHeader
                currentTrial={lastTrial.trial.trial_within_partner}
                trialsPerBlock={trialsPerBlock}
                partnerLabel={formatPartnerLabel(lastTrial.trial.partner_public_label)}
                currentBlock={lastTrial.trial.rtg_block_index}
                totalBlocks={totalBlocks}
              />
              <ResultRevealPanel
                trial={lastTrial.trial}
                partnerLabel={formatPartnerLabel(lastTrial.trial.partner_public_label)}
                userBalance={lastTrialUserBalance}
                botBalance={lastTrialPartnerBalance}
                onNext={handleNextTrial}
                showNextButton={isTrialLikePhase}
              />
            </div>
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
