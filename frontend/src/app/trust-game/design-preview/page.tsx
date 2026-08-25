"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { BotAvatar, ParticipantAvatar } from '@/components/GameAvatar';
import { Button } from '@/components/ui/button';

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

function ExperimentalAmountCircle({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 text-[1.2rem] font-black tracking-[-0.04em] text-[#334038] md:text-[1.3rem]">{label}</div>
      <div className="relative flex h-[250px] w-[250px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_28%,#ffffff_0%,#f8fbff_38%,#eef4fb_74%,#edf2f8_100%)] shadow-[0_30px_56px_rgba(196,208,220,0.2)]">
        <div className="absolute top-[12px] z-10 rounded-full border-[6px] border-white shadow-[0_18px_30px_rgba(110,154,220,0.18)]">
          <ParticipantAvatar alt="당신 아바타" className="h-[78px] w-[78px]" />
        </div>
        <div className="absolute inset-[22px] rounded-full border border-[#e8eef6]" />
        <div className="absolute inset-[36px] rounded-full border border-[#f1f5fb]" />
        <div className="flex h-[146px] w-[146px] items-center justify-center rounded-full bg-[linear-gradient(180deg,#1d63c7_0%,#0f8a67_100%)] shadow-[0_18px_34px_rgba(29,99,198,0.22)]">
          <span className="text-[3.6rem] font-black tracking-[-0.09em] text-white">{formatPoints(value)}점</span>
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
  const chartSize = 228;
  const chartRadius = 114;
  const chartCenter = chartSize / 2;
  const returnedPath = describeSector(chartCenter, chartCenter, chartRadius, 0, returnedAngle);
  const keptPath = describeSector(chartCenter, chartCenter, chartRadius, returnedAngle, 360);
  const dividerPoint = polarToCartesian(chartCenter, chartCenter, chartRadius, returnedAngle);
  const containerCenter = 150;
  const labelRadius = 108;
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
    avatar: React.ReactNode;
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
        <div className={`relative flex h-[112px] w-[84px] flex-col items-center rounded-[20px] border-[4px] bg-white px-2 pt-[34px] text-center ${toneClasses.border} ${toneClasses.shadow}`}>
          <div className="absolute left-1/2 top-[-24px] z-10 -translate-x-1/2 rounded-full border-[4px] border-white bg-white shadow-[0_10px_18px_rgba(110,154,220,0.16)]">
            {avatar}
          </div>
          <div className={`text-[2rem] font-black leading-none tracking-[-0.08em] ${toneClasses.text}`}>
            {formatPoints(value)}점
          </div>
          <div className={`mt-1.5 text-[0.72rem] font-black leading-[1.05] tracking-[-0.03em] ${toneClasses.text}`}>
            {label}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 text-[1.2rem] font-black tracking-[-0.04em] text-[#334038] md:text-[1.3rem]">총 금액 배분</div>
      <div className="relative flex h-[300px] w-[300px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_28%,#ffffff_0%,#f9fbff_38%,#eef4fb_72%,#edf2f8_100%)] shadow-[0_30px_56px_rgba(196,208,220,0.2)]">
        <div className="absolute inset-[18px] rounded-full border border-[#eef2f7]" />
        <svg
          viewBox={`0 0 ${chartSize} ${chartSize}`}
          className="relative h-[228px] w-[228px] rounded-full border-[7px] border-white shadow-[0_18px_34px_rgba(24,45,76,0.14)]"
          aria-label={`반환 ${Math.round(returnedShare)}퍼센트, 보유 ${Math.round(keptShare)}퍼센트`}
        >
          <defs>
            <linearGradient id="returnedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f63c6" />
              <stop offset="100%" stopColor="#3f88f2" />
            </linearGradient>
            <linearGradient id="keptGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f8a67" />
              <stop offset="100%" stopColor="#20b486" />
            </linearGradient>
            <clipPath id="pieClip">
              <circle cx={chartCenter} cy={chartCenter} r={chartRadius} />
            </clipPath>
          </defs>
          <circle cx={chartCenter} cy={chartCenter} r={chartRadius} fill="#f7fbff" />
          <path d={returnedPath} fill="url(#returnedGradient)" />
          <path d={keptPath} fill="url(#keptGradient)" />
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
          <g clipPath="url(#pieClip)" opacity="0.22">
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
          avatar={<BotAvatar alt="봇 아바타" name="design-preview-bot" className="h-[42px] w-[42px]" />}
        />
        <FloatingValueCard
          tone="returned"
          value={returned}
          label="반환됨"
          anchor={returnedAnchor}
          avatar={<ParticipantAvatar alt="당신 아바타" className="h-[42px] w-[42px]" />}
        />
      </div>
      <div className="mt-6 text-[1.2rem] font-black tracking-[-0.04em] text-[#647487]">
        보유 {Math.round(keptShare)}% · 반환 {Math.round(returnedShare)}%
      </div>
    </div>
  );
}

function PreviewControls({
  amountSent,
  onAmountSentChange,
  returned,
  onReturnedChange,
  multiplier,
}: {
  amountSent: number;
  onAmountSentChange: (value: number) => void;
  returned: number;
  onReturnedChange: (value: number) => void;
  multiplier: number;
}) {
  const totalReceived = amountSent * multiplier;

  return (
    <section className="rounded-[24px] border border-[#d6e3f0] bg-white/88 px-5 py-5 shadow-[0_16px_32px_rgba(176,198,220,0.12)] md:px-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="amount-sent" className="text-[1rem] font-black tracking-[-0.03em] text-[#334038]">
              투자액
            </label>
            <div className="rounded-full bg-[#eef5ff] px-3 py-1 text-[0.95rem] font-black text-[#1f63c6]">
              {amountSent}점
            </div>
          </div>
          <input
            id="amount-sent"
            type="range"
            min={0}
            max={10}
            step={1}
            value={amountSent}
            onChange={(event) => onAmountSentChange(Number(event.target.value))}
            className="mt-3 h-2.5 w-full cursor-pointer appearance-none rounded-full bg-[#e3ebf5]"
          />
          <div className="mt-2 text-[0.92rem] font-semibold text-[#70839a]">
            전달 총액: {formatPoints(totalReceived)}점
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="returned-amount" className="text-[1rem] font-black tracking-[-0.03em] text-[#334038]">
              반환액
            </label>
            <div className="rounded-full bg-[#e7f7f1] px-3 py-1 text-[0.95rem] font-black text-[#0f8a67]">
              {returned}점
            </div>
          </div>
          <input
            id="returned-amount"
            type="range"
            min={0}
            max={Math.max(totalReceived, 0)}
            step={1}
            value={returned}
            onChange={(event) => onReturnedChange(Number(event.target.value))}
            className="mt-3 h-2.5 w-full cursor-pointer appearance-none rounded-full bg-[#e3ebf5]"
          />
          <div className="mt-2 text-[0.92rem] font-semibold text-[#70839a]">
            봇 보유액: {formatPoints(Math.max(totalReceived - returned, 0))}점
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({
  amountSent,
  multiplier,
  amountReceived,
  returned,
  kept,
}: {
  amountSent: number;
  multiplier: number;
  amountReceived: number;
  returned: number;
  kept: number;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#d5e3db] bg-white px-6 py-8 shadow-[0_18px_36px_rgba(192,205,213,0.14)] md:px-10 md:py-10">
      <div className="flex items-center justify-end gap-4">
        <div className="rounded-full bg-[#eef5ff] px-4 py-2 text-[0.92rem] font-black text-[#1f63c6]">
          비교용 시안
        </div>
      </div>

      <div className="mt-10 grid items-center gap-12 md:grid-cols-[320px_180px_1fr] md:gap-8">
        <ExperimentalAmountCircle label="당신의 투자액" value={amountSent} />

        <div className="flex items-center justify-center self-center">
          <div className="relative flex h-[84px] w-[180px] translate-x-6 items-center justify-center">
            <div className="absolute inset-y-[28px] left-0 right-[26px] rounded-full bg-[linear-gradient(90deg,#14d8d8_0%,#3e5ff0_100%)] shadow-[0_12px_20px_rgba(61,110,233,0.18)]" />
            <ArrowRight className="absolute right-0 h-[74px] w-[74px] fill-[#3e5ff0] text-[#3e5ff0] stroke-[1.6]" />
          </div>
        </div>

        <ExperimentalAllocationPie total={amountReceived} returned={returned} kept={kept} />
      </div>
    </section>
  );
}

export default function TrustGameDesignPreviewPage() {
  const [amountSent, setAmountSent] = useState(4);
  const multiplier = 3;
  const amountReceived = amountSent * multiplier;
  const [returned, setReturned] = useState(8);
  const clampedReturned = Math.min(returned, amountReceived);
  const kept = Math.max(amountReceived - clampedReturned, 0);

  return (
    <main className="min-h-screen bg-[#edf6ff] px-5 py-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="rounded-[28px] border border-[#d6e3f0] bg-[linear-gradient(180deg,#f7fbff_0%,#edf6ff_100%)] px-6 py-7 shadow-[0_24px_50px_rgba(176,198,220,0.18)] md:px-8 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[0.9rem] font-black tracking-[0.1em] text-[#1f63c6]">TRUST GAME PREVIEW</div>
              <h1 className="mt-2 text-[2.2rem] font-black tracking-[-0.06em] text-[#151b24] md:text-[2.8rem]">
                가운데 설명을 뺀 원형 투자 시안
              </h1>
              <p className="mt-3 max-w-[760px] text-[1.05rem] leading-[1.8] text-[#70839a]">
                투자액은 왼쪽 원형 오브제로, 결과 배분은 오른쪽 파이와 떠 있는 라벨로만 보여주는 버전입니다.
                가운데 정보 덩어리는 제거하고, 한 번에 읽히는 방향성을 우선했습니다.
              </p>
            </div>

            <Button asChild className="h-[52px] rounded-[18px] bg-[#08a573] px-6 text-[1rem] font-black text-white hover:bg-[#069c6c]">
              <Link href="/trust-game/main">메인 게임으로 돌아가기</Link>
            </Button>
          </div>

          <div className="mt-8 space-y-8">
            <PreviewControls
              amountSent={amountSent}
              onAmountSentChange={(nextSent) => {
                setAmountSent(nextSent);
                setReturned((currentReturned) => Math.min(currentReturned, nextSent * multiplier));
              }}
              returned={clampedReturned}
              onReturnedChange={setReturned}
              multiplier={multiplier}
            />

            <PreviewCard
              amountSent={amountSent}
              multiplier={multiplier}
              amountReceived={amountReceived}
              returned={clampedReturned}
              kept={kept}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
