"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  BarChart3,
  Coins,
  Loader2,
  PiggyBank,
} from 'lucide-react';

import { BotAvatar, ParticipantAvatar } from '@/components/GameAvatar';
import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { PGGSubmitTrialResponse, SessionState, publicGoodsAPI } from '@/lib/api';
import { startSessionWithRestartConfirmation } from '@/lib/start-session';

type ActorStyle = {
  label: string;
  avatarName: string;
  ring: string;
  surface: string;
  badge: string;
  barGradient: string;
};

const ACTOR_STYLES: ActorStyle[] = [
  {
    label: '당신',
    avatarName: 'participant',
    ring: 'border-[#6be39f]',
    surface: 'bg-[#e9fbf0]',
    badge: 'bg-[#27c563]',
    barGradient: 'linear-gradient(180deg, #24c463 0%, #1bb057 100%)',
  },
  {
    label: 'Bot 1',
    avatarName: 'public-goods-1',
    ring: 'border-[#90bcff]',
    surface: 'bg-[#edf5ff]',
    badge: 'bg-[#3f7fe8]',
    barGradient: 'linear-gradient(180deg, #4f88ea 0%, #3d76db 100%)',
  },
  {
    label: 'Bot 2',
    avatarName: 'public-goods-2',
    ring: 'border-[#ffd94d]',
    surface: 'bg-[#fff8d9]',
    badge: 'bg-[#f4bc00]',
    barGradient: 'linear-gradient(180deg, #f8c400 0%, #ebae00 100%)',
  },
  {
    label: 'Bot 3',
    avatarName: 'public-goods-3',
    ring: 'border-[#ca9aff]',
    surface: 'bg-[#f6ecff]',
    badge: 'bg-[#9b4de9]',
    barGradient: 'linear-gradient(180deg, #a857eb 0%, #8f45df 100%)',
  },
  {
    label: 'Bot 4',
    avatarName: 'public-goods-4',
    ring: 'border-[#f3a2d2]',
    surface: 'bg-[#fff0f8]',
    badge: 'bg-[#e43c94]',
    barGradient: 'linear-gradient(180deg, #eb4da3 0%, #d9378c 100%)',
  },
];

function TrialStatusHeader({
  currentTrial,
  totalTrials,
}: {
  currentTrial: number;
  totalTrials: number;
}) {
  return (
    <section className="mx-auto w-full max-w-[720px]">
      <p className="text-[0.95rem] font-bold tracking-[-0.01em] text-[#8a9ab0]">진행 상황</p>
      <h2 className="mt-1 text-[2.15rem] font-black tracking-[-0.05em] text-[#151b24] md:text-[2.45rem]">
        {currentTrial}회차 <span className="font-semibold text-[#9eb0c7]">/ {totalTrials}</span>
      </h2>
    </section>
  );
}

function formatValue(value: number) {
  const rounded = Math.round((value + Number.EPSILON) * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

function roundToOne(value: number) {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function ActorFigure({
  style,
  value,
  concealed,
  isPlayer = false,
  badgeSide = 'right',
}: {
  style: ActorStyle;
  value: number | string;
  concealed?: boolean;
  isPlayer?: boolean;
  badgeSide?: 'left' | 'right';
}) {
  const displayedValue = concealed ? '?' : value;
  const desktopBadgePosition =
    badgeSide === 'left'
      ? 'md:left-auto md:right-full md:mr-2 md:translate-x-0'
      : 'md:left-full md:ml-2 md:translate-x-0';

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center pb-7 md:pb-0">
      {isPlayer ? (
        <ParticipantAvatar
          alt="당신 아바타"
          className={`${style.ring} ${style.surface} h-[80px] w-[80px] md:h-[88px] md:w-[88px]`}
        />
      ) : (
        <BotAvatar
          alt={`${style.label} 아바타`}
          name={style.avatarName}
          className={`${style.ring} ${style.surface} h-[58px] w-[58px] md:h-[60px] md:w-[60px]`}
        />
      )}

      <div
        className={`absolute left-1/2 z-20 mt-1 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-white px-2.5 py-1 font-bold text-white shadow-[0_5px_12px_rgba(51,65,85,0.25)] md:top-1/2 md:mt-0 md:-translate-y-1/2 ${desktopBadgePosition} ${style.badge} ${
          isPlayer ? 'top-[80px] text-[0.76rem] md:text-[0.82rem]' : 'top-[58px] text-[0.66rem] md:text-[0.7rem]'
        }`}
      >
        <span className="tracking-[-0.03em]">{style.label}</span>
        <span aria-hidden="true" className="text-white/55">·</span>
        <span className="font-black tabular-nums">{displayedValue}</span>
      </div>
    </div>
  );
}

function PlayerBoard({
  selectedContribution,
  latestContribution,
  latestBotContributions,
  groupTotalContribution,
}: {
  selectedContribution: number;
  latestContribution?: number;
  latestBotContributions?: number[];
  groupTotalContribution?: number;
}) {
  const playerValue = latestContribution ?? selectedContribution;
  const hasResolvedGroup = typeof groupTotalContribution === 'number' && !!latestBotContributions;

  return (
    <section className="mx-auto w-full max-w-[720px] rounded-[26px] border border-[#dbe8f3] bg-white/92 px-4 py-4 shadow-[0_18px_38px_rgba(190,206,223,0.16)] md:px-5">
      <div className="rounded-[22px] bg-[radial-gradient(circle_at_50%_18%,rgba(233,249,255,0.95)_0%,rgba(255,255,255,0)_48%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-2 py-3">
        <div className="relative mx-auto hidden h-[390px] max-w-[760px] md:block">
          <div className="absolute left-1/2 top-[0%] z-20 -translate-x-1/2">
            <ActorFigure style={ACTOR_STYLES[0]} value={playerValue} isPlayer />
          </div>

          <div className="absolute left-[14%] top-[27%] z-20 -translate-x-1/2 -translate-y-1/2">
            <ActorFigure
              style={ACTOR_STYLES[1]}
              value={latestBotContributions?.[0] ?? '?'}
              concealed={!latestBotContributions}
            />
          </div>

          <div className="absolute left-[27%] top-[82%] z-20 -translate-x-1/2 -translate-y-1/2">
            <ActorFigure
              style={ACTOR_STYLES[2]}
              value={latestBotContributions?.[1] ?? '?'}
              concealed={!latestBotContributions}
            />
          </div>

          <div className="absolute left-[73%] top-[82%] z-20 -translate-x-1/2 -translate-y-1/2">
            <ActorFigure
              style={ACTOR_STYLES[3]}
              value={latestBotContributions?.[2] ?? '?'}
              concealed={!latestBotContributions}
              badgeSide="left"
            />
          </div>

          <div className="absolute left-[86%] top-[27%] z-20 -translate-x-1/2 -translate-y-1/2">
            <ActorFigure
              style={ACTOR_STYLES[4]}
              value={latestBotContributions?.[3] ?? '?'}
              concealed={!latestBotContributions}
              badgeSide="left"
            />
          </div>

          <div className="absolute left-1/2 top-[52%] z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-[98px] w-[254px] flex-col items-center justify-center rounded-full border-[3px] border-[#61df9d] bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#fbfffd_60%,#f4fff8_100%)] shadow-[0_14px_24px_rgba(156,213,181,0.12)]">
              <div className="text-[3.1rem] font-black tracking-[-0.09em] text-[#169164]">
                {hasResolvedGroup ? `${formatValue(groupTotalContribution)}점` : '?'}
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 top-[31%] z-20 -translate-x-1/2 text-[#44c98a]">
            <ArrowDown className="h-6 w-6 stroke-[2.4]" />
          </div>
          <div className="absolute left-[23%] top-[35%] z-20 -translate-x-1/2 text-[#2f70df]">
            <ArrowDownRight className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="absolute left-[37%] top-[70%] z-20 -translate-x-1/2 text-[#2f70df]">
            <ArrowUpRight className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="absolute left-[63%] top-[70%] z-20 -translate-x-1/2 text-[#2f70df]">
            <ArrowUpLeft className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="absolute left-[77%] top-[35%] z-20 -translate-x-1/2 text-[#2f70df]">
            <ArrowDownLeft className="h-6 w-6 stroke-[2.2]" />
          </div>
        </div>

        <div className="space-y-4 md:hidden">
          <div className="flex flex-col items-center">
            <ActorFigure style={ACTOR_STYLES[0]} value={playerValue} isPlayer />
            <div className="mt-1 text-[#44c98a]">
              <ArrowDown className="h-6 w-6 stroke-[2.4]" />
            </div>
            <div className="mt-1 flex h-[82px] w-full max-w-[170px] flex-col items-center justify-center rounded-full border-[3px] border-[#61df9d] bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#fbfffd_60%,#f4fff8_100%)] shadow-[0_14px_24px_rgba(156,213,181,0.12)]">
              <div className="text-[2.1rem] font-black tracking-[-0.08em] text-[#169164]">
                {hasResolvedGroup ? `${formatValue(groupTotalContribution)}점` : '?'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ACTOR_STYLES.slice(1).map((style, index) => (
              <ActorFigure
                key={style.label}
                style={style}
                value={latestBotContributions?.[index] ?? '?'}
                concealed={!latestBotContributions}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BalanceBoard({
  participantBalance,
  botBalances,
  large = false,
}: {
  participantBalance: number;
  botBalances: number[];
  large?: boolean;
}) {
  const balances = [participantBalance, ...botBalances];
  const scaleMax = Math.max(50, ...balances, 1);

  return (
    <section
      className={`mx-auto w-full rounded-[26px] border border-[#caedd6] bg-[linear-gradient(135deg,#eefcf3_0%,#eef6ff_55%,#f8f4ff_100%)] shadow-[0_18px_38px_rgba(190,206,223,0.16)] ${
        large ? 'max-w-[640px] px-4 py-4 md:px-5' : 'max-w-[320px] px-4 py-4 md:px-5'
      }`}
    >
      <div className="flex items-center gap-3 text-[#1f3557]">
        <BarChart3 className="h-6 w-6" />
        <h2 className={`font-black tracking-[-0.05em] text-[#1f3557] ${large ? 'text-[1.32rem]' : 'text-[1.18rem]'}`}>
          플레이어별 현재 잔액
        </h2>
      </div>

      <div className={`flex items-end justify-center ${large ? 'mt-5 gap-3.5 md:gap-4' : 'mt-4 gap-2.5 md:gap-3'}`}>
        {balances.map((balance, index) => {
          const style = ACTOR_STYLES[index];
          const heightPercent = (balance / scaleMax) * 100;

          return (
            <div key={style.label} className="flex min-w-0 flex-col items-center gap-2">
              <div className={`font-semibold tracking-[-0.03em] text-[#4b5563] ${large ? 'text-[0.98rem]' : 'text-[0.8rem]'}`}>
                {style.label}
              </div>
              <div
                className={`relative flex items-end overflow-hidden border-[3px] border-[#cfd8e4] bg-[#eef2f7] shadow-[inset_0_2px_0_rgba(255,255,255,0.7)] ${
                  large ? 'h-[154px] w-[50px] rounded-[16px]' : 'h-[128px] w-[42px] rounded-[14px]'
                }`}
              >
                <div
                  className={`flex w-full items-start justify-center transition-[height] duration-500 ease-out ${
                    large ? 'rounded-[13px]' : 'rounded-[12px]'
                  }`}
                  style={{
                    height: `${Math.min(Math.max(heightPercent, 0), 100)}%`,
                    background: style.barGradient,
                  }}
                >
                  <span className={`font-black text-white ${large ? 'mt-1.5 text-[0.74rem]' : 'mt-1.5 text-[0.66rem]'}`}>
                    {formatValue(balance)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DecisionBoard({
  endowment,
  multiplier,
  contribution,
  onContributionChange,
  onSubmit,
  isLoading,
}: {
  endowment: number;
  multiplier: number;
  contribution: number[];
  onContributionChange: (value: number[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <section className="mx-auto w-full max-w-[720px] rounded-[26px] border border-[#dbe8f3] bg-white/94 px-5 py-5 shadow-[0_18px_38px_rgba(190,206,223,0.16)] md:px-6">
      <div className="flex items-center gap-3 text-[#77b7eb]">
        <Coins className="h-6 w-6" />
        <h2 className="text-[1.6rem] font-black tracking-[-0.05em] text-[#77b7eb]">Your Decision</h2>
      </div>

      <div className="mt-5">
        <div>
          <p className="text-[1.05rem] leading-[1.7] tracking-[-0.02em] text-[#42607b]">
            이번 라운드에는 <span className="font-black text-[#1a4068]">{endowment}점</span>이 주어집니다.
            공공 풀에 기여할 금액을 정하면, 전체 기여금은{' '}
            <span className="font-black text-[#14a56d]">{multiplier}배</span>가 된 뒤 5명에게 균등 분배됩니다.
          </p>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[1rem] font-bold text-[#64748b]">기여할 금액</span>
              <span className="rounded-full bg-[#e8f4ff] px-4 py-1.5 text-[1.1rem] font-black text-[#2f70df]">
                {contribution[0]}점
              </span>
            </div>
            <Slider
              min={0}
              max={endowment}
              step={1}
              value={contribution}
              onValueChange={onContributionChange}
              className="mt-5"
            />
            <div className="mt-3 flex justify-between text-[0.92rem] font-semibold text-[#7a8da6]">
              <span>0 점</span>
              <span>현재 {contribution[0]} 점</span>
              <span>{endowment} 점</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="h-[56px] min-w-[220px] rounded-[18px] bg-[#7fc0ec] px-8 text-[1.15rem] font-black tracking-[-0.03em] text-[#19324a] shadow-[0_12px_22px_rgba(118,188,235,0.28)] hover:bg-[#74b8e7]"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              기여 제출
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultBalanceBoard({
  lastResult,
  participantBalance,
  botBalances,
  onNext,
  showNextButton,
}: {
  lastResult: PGGSubmitTrialResponse;
  participantBalance: number;
  botBalances: number[];
  onNext: () => void;
  showNextButton: boolean;
}) {
  const trial = lastResult.trial;

  return (
    <section className="mx-auto w-full max-w-[720px] rounded-[28px] border border-[#dbe8f3] bg-[linear-gradient(135deg,#f1f7ff_0%,#fff9ef_100%)] px-4 py-4 shadow-[0_18px_38px_rgba(190,206,223,0.16)] md:px-5">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[18px] bg-white px-4 py-3 shadow-[0_10px_22px_rgba(180,196,214,0.16)]">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[0.88rem] font-bold tracking-[-0.02em] text-[#8aa0b8]">1인당 환급</div>
            <div className="text-[1.9rem] font-black tracking-[-0.06em] text-[#9145e8]">{formatValue(lastResult.share_per_player)}점</div>
          </div>
        </div>
        <div className="rounded-[18px] bg-white px-4 py-3 shadow-[0_10px_22px_rgba(180,196,214,0.16)]">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[0.88rem] font-bold tracking-[-0.02em] text-[#8aa0b8]">이번 라운드 수익</div>
            <div className={`text-[1.9rem] font-black tracking-[-0.06em] ${trial.participant_total_payoff_this_trial >= 0 ? 'text-[#16a15b]' : 'text-[#d14b42]'}`}>
              {trial.participant_total_payoff_this_trial >= 0 ? '+' : ''}
              {formatValue(trial.participant_total_payoff_this_trial)}
              점
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <BalanceBoard participantBalance={participantBalance} botBalances={botBalances} large />
      </div>

      {showNextButton ? (
        <div className="mt-5 flex justify-end">
          <Button
            onClick={onNext}
            className="h-[56px] min-w-[220px] rounded-[18px] bg-[#ffb347] text-[1.15rem] font-black tracking-[-0.03em] text-[#5b3510] shadow-[0_12px_22px_rgba(255,179,71,0.28)] hover:bg-[#f7aa39]"
          >
            다음 라운드
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      ) : null}
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
  return (
    <Card className="mx-auto w-full max-w-3xl border-[#d9e7f3] bg-[linear-gradient(180deg,#f8fbff_0%,#f1f9ff_52%,#f7fffb_100%)] shadow-[0_24px_50px_rgba(182,202,223,0.18)]">
      <CardHeader className="text-center">
        <CardTitle className="text-[2.2rem] font-black tracking-[-0.06em] text-[#5ba8e7]">Public Goods Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-center">
        <p className="mx-auto max-w-2xl text-[1.08rem] leading-[1.8] text-[#47637e]">
          협력과 사적 이익 사이에서 의사결정하는 공공재 게임입니다. 매 라운드마다 공공 풀에 얼마를 낼지 결정하면,
          전체 기여금이 증폭되어 모두에게 다시 나뉘어 돌아옵니다.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[20px] bg-white/85 px-4 py-4 shadow-[0_10px_24px_rgba(188,203,223,0.16)]">
            <div className="text-[0.82rem] font-bold tracking-[0.08em] text-[#8aa0b8]">TRIALS</div>
            <div className="mt-1 text-[1.8rem] font-black tracking-[-0.05em] text-[#2f70df]">15</div>
          </div>
          <div className="rounded-[20px] bg-white/85 px-4 py-4 shadow-[0_10px_24px_rgba(188,203,223,0.16)]">
            <div className="text-[0.82rem] font-bold tracking-[0.08em] text-[#8aa0b8]">ENDOWMENT</div>
            <div className="mt-1 text-[1.8rem] font-black tracking-[-0.05em] text-[#16a15b]">10점</div>
          </div>
          <div className="rounded-[20px] bg-white/85 px-4 py-4 shadow-[0_10px_24px_rgba(188,203,223,0.16)]">
            <div className="text-[0.82rem] font-bold tracking-[0.08em] text-[#8aa0b8]">MULTIPLIER</div>
            <div className="mt-1 text-[1.8rem] font-black tracking-[-0.05em] text-[#f09a1a]">x1.5</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center pb-8">
        <Button
          onClick={onStart}
          disabled={isLoading}
          className="h-[58px] rounded-[18px] bg-[#7fc0ec] px-8 text-[1.1rem] font-black tracking-[-0.03em] text-[#19324a] shadow-[0_12px_22px_rgba(118,188,235,0.28)] hover:bg-[#74b8e7]"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <PiggyBank className="h-5 w-5" />}
          게임 시작
        </Button>
      </CardFooter>
    </Card>
  );
}

function CompletedPanel({
  cumulativePayoff,
}: {
  cumulativePayoff: number;
}) {
  return (
    <Card className="mx-auto mt-4 w-full max-w-3xl border-[#d9e7f3] bg-[linear-gradient(180deg,#f8fbff_0%,#f1f9ff_52%,#f7fffb_100%)] shadow-[0_24px_50px_rgba(182,202,223,0.18)]">
      <CardHeader>
        <CardTitle className="text-center text-[2rem] font-black tracking-[-0.06em] text-[#5ba8e7]">PGG Completed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center text-[#47637e]">
        <p>15개의 PGG trial을 모두 완료했습니다.</p>
        <div className="rounded-[20px] bg-white/85 px-6 py-5 shadow-[0_10px_24px_rgba(188,203,223,0.16)]">
          <div className="text-[0.9rem] font-bold tracking-[0.08em] text-[#8aa0b8]">CUMULATIVE PAYOFF</div>
          <div className="mt-2 text-[2.4rem] font-black tracking-[-0.06em] text-[#16a15b]">{formatValue(cumulativePayoff)}점</div>
        </div>
        <p>이제 RTG tutorial로 넘어가서 trust game 규칙을 익히면 됩니다.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link href="/games">Back to Games</Link>
        </Button>
        <Button asChild className="bg-[#7fc0ec] text-[#19324a] hover:bg-[#74b8e7]">
          <Link href="/trust-game/tutorial">
            Continue to RTG Tutorial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PublicGoodsGamePage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [selectedContribution, setSelectedContribution] = useState<number[]>([0]);
  const [lastResult, setLastResult] = useState<PGGSubmitTrialResponse | null>(null);
  const [botCumulativePayoffs, setBotCumulativePayoffs] = useState<number[]>([0, 0, 0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptStartedAt, setPromptStartedAt] = useState<number>(Date.now());
  const { toast } = useToast();

  const rules = [
    '각 trial마다 10포인트가 주어집니다.',
    '총 15번의 trial 동안 공공 풀에 기여할 금액을 결정합니다.',
    '모든 기여금은 1.5배가 된 뒤 5명에게 균등 분배됩니다.',
    '각 trial의 payoff는 개별적으로 계산되고, 총 payoff는 계속 누적됩니다.',
  ];

  useEffect(() => {
    if (session?.phase === 'trial' && !lastResult) {
      setSelectedContribution([0]);
      setPromptStartedAt(Date.now());
    }
  }, [session?.phase, session?.current_trial_index, lastResult]);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const response = await startSessionWithRestartConfirmation(
        publicGoodsAPI.startSession,
        '공공재 게임',
      );
      if (!response) return;
      setSession(response.session);
      setLastResult(null);
      setSelectedContribution([0]);
      setBotCumulativePayoffs([0, 0, 0, 0]);
    } catch (error) {
      toast({
        title: '세션 시작 실패',
        description: error instanceof Error ? error.message : 'PGG 세션을 시작하지 못했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      const response = await publicGoodsAPI.submitTrial({
        session_id: session.session_id,
        contribution: selectedContribution[0],
        response_time_ms: Date.now() - promptStartedAt,
      });

      const endowment = session.endowment ?? 10;
      const botRoundPayoffs = response.trial.pgg_simulated_contributions.map((contribution) =>
        roundToOne(endowment - contribution + response.share_per_player),
      );

      setBotCumulativePayoffs((previous) =>
        previous.map((value, index) => roundToOne(value + (botRoundPayoffs[index] ?? 0))),
      );
      setSession(response.session);
      setLastResult(response);

      toast({
        title: `Trial ${response.trial.pgg_trial_index} 완료`,
        description: `이번 trial payoff는 ${formatValue(response.trial.participant_total_payoff_this_trial)} points입니다.`,
      });
    } catch (error) {
      toast({
        title: '제출 실패',
        description: error instanceof Error ? error.message : 'Trial 제출에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setLastResult(null);
    setSelectedContribution([0]);
    setPromptStartedAt(Date.now());
  };

  const currentRound = lastResult?.trial.pgg_trial_index ?? session?.current_trial_index ?? session?.total_trials ?? 1;
  const participantBalance = roundToOne(session?.cumulative_payoff ?? 0);
  const latestBotContributions = lastResult?.trial.pgg_simulated_contributions;
  const latestContribution = lastResult?.trial.pgg_contribution;
  const resolvedGroupTotalContribution = lastResult?.trial.pgg_group_total_contribution;
  const endowment = session?.endowment ?? 10;
  const multiplier = session?.multiplier ?? 1.5;

  return (
    <GameLayout
      title="Public Goods Game"
      rules={rules}
      currentRound={currentRound}
      totalRounds={session?.total_trials ?? 15}
      playerBalance={participantBalance}
      balanceLabel="Cumulative Payoff"
      showSidebar={!session}
      contentClassName={session ? 'space-y-5 bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_100%)]' : undefined}
    >
      {!session && <IntroPanel onStart={handleStart} isLoading={isLoading} />}

      {session && session.phase === 'trial' && (
        <>
          <TrialStatusHeader
            currentTrial={currentRound}
            totalTrials={session.total_trials ?? 15}
          />

          <PlayerBoard
            selectedContribution={selectedContribution[0]}
            latestContribution={latestContribution}
            latestBotContributions={latestBotContributions}
            groupTotalContribution={resolvedGroupTotalContribution}
          />

          {lastResult ? (
            <ResultBalanceBoard
              lastResult={lastResult}
              participantBalance={participantBalance}
              botBalances={botCumulativePayoffs}
              onNext={handleNext}
              showNextButton
            />
          ) : null}

          {!lastResult ? (
            <DecisionBoard
              endowment={endowment}
              multiplier={multiplier}
              contribution={selectedContribution}
              onContributionChange={setSelectedContribution}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          ) : null}
        </>
      )}

      {session?.phase === 'completed' && (
        <CompletedPanel cumulativePayoff={roundToOne(session.cumulative_payoff ?? 0)} />
      )}
    </GameLayout>
  );
}
