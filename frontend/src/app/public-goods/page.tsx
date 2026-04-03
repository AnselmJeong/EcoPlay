"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Coins, Loader2, PiggyBank } from 'lucide-react';

import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { PGGSubmitTrialResponse, SessionState, publicGoodsAPI } from '@/lib/api';

export default function PublicGoodsGamePage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [selectedContribution, setSelectedContribution] = useState<number[]>([0]);
  const [lastResult, setLastResult] = useState<PGGSubmitTrialResponse | null>(null);
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
    if (session?.phase === 'trial') {
      setSelectedContribution([0]);
      setPromptStartedAt(Date.now());
    }
  }, [session?.phase, session?.current_trial_index]);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const response = await publicGoodsAPI.startSession();
      setSession(response.session);
      setLastResult(null);
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
      setSession(response.session);
      setLastResult(response);
      toast({
        title: `Trial ${response.trial.pgg_trial_index} 완료`,
        description: `이번 trial payoff는 ${response.trial.participant_total_payoff_this_trial.toFixed(2)} points입니다.`,
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

  const currentRound = session?.current_trial_index ?? session?.total_trials ?? 1;

  return (
    <GameLayout
      title="Public Goods Game"
      rules={rules}
      currentRound={currentRound}
      totalRounds={session?.total_trials ?? 15}
      playerBalance={session?.cumulative_payoff ?? 0}
      balanceLabel="Cumulative Payoff"
      showSidebar={!session}
    >
      {!session && (
        <Card className="mx-auto w-full max-w-2xl border-none bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-primary">Public Goods Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center text-foreground/80">
            <p>
              먼저 협동 성향을 측정하는 PGG를 진행합니다. 각 라운드에서 얼마나 공공 풀에
              기여할지 결정해주세요.
            </p>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
              <div className="text-sm text-primary/70">Protocol</div>
              <div className="mt-1 text-2xl font-bold text-primary">15 Trials / 1 Block</div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={handleStart} disabled={isLoading} className="px-8">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PiggyBank className="mr-2 h-4 w-4" />}
              Start PGG
            </Button>
          </CardFooter>
        </Card>
      )}

      {session && session.phase === 'trial' && (
        <Card className="border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Coins className="h-5 w-5" />
              Trial {session.current_trial_index} / {session.total_trials}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Current Endowment</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{session.endowment} points</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Your Contribution</span>
                <span className="text-lg font-semibold text-primary">{selectedContribution[0]} points</span>
              </div>
              <Slider
                min={0}
                max={session.endowment ?? 10}
                step={1}
                value={selectedContribution}
                onValueChange={setSelectedContribution}
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Keep all</span>
                <span>Contribute all</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Trial
            </Button>
          </CardFooter>
        </Card>
      )}

      {lastResult && (
        <Card className="mt-4 border-emerald-200 bg-emerald-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-emerald-900">Latest Trial Result</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <div className="text-sm text-slate-500">Your Contribution</div>
              <div className="mt-1 text-2xl font-bold">{lastResult.trial.pgg_contribution}</div>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="text-sm text-slate-500">Group Total Contribution</div>
              <div className="mt-1 text-2xl font-bold">{lastResult.trial.pgg_group_total_contribution}</div>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="text-sm text-slate-500">Feedback from Pool</div>
              <div className="mt-1 text-2xl font-bold">{lastResult.trial.pgg_feedback_amount}</div>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="text-sm text-slate-500">Trial Payoff</div>
              <div className="mt-1 text-2xl font-bold">{lastResult.trial.participant_total_payoff_this_trial}</div>
            </div>
          </CardContent>
          {session?.phase !== 'completed' && (
            <CardFooter className="justify-end">
              <Button variant="outline" onClick={handleNext}>
                Next Trial
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {session?.phase === 'completed' && (
        <Card className="mx-auto mt-4 w-full max-w-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">PGG Completed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/80">
            <p>15개의 PGG trial을 모두 완료했습니다.</p>
            <p>
              누적 payoff는 <strong className="text-primary">{session.cumulative_payoff?.toFixed(2)} points</strong>입니다.
            </p>
            <p>이제 RTG tutorial로 넘어가서 trust game 규칙을 익히면 됩니다.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/games">Back to Games</Link>
            </Button>
            <Button asChild>
              <Link href="/trust-game/tutorial">
                Continue to RTG Tutorial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </GameLayout>
  );
}
