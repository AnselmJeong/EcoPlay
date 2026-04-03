'use client';

import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { reportAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type PGGRound = {
  pgg_trial_index: number;
  pgg_contribution: number;
  pgg_feedback_amount: number;
  participant_total_payoff_this_trial: number;
  cumulative_payoff: number;
};

type TutorialRound = {
  trial_index: number;
  amount_received: number;
  return_amount: number;
  amount_kept: number;
};

type RTGRound = {
  rtg_trial_index: number;
  rtg_block_index: number;
  partner_public_label: string;
  amount_sent: number;
  partner_return_amount: number;
  participant_total_payoff_this_trial: number;
  cumulative_payoff: number;
};

type StatsCard = {
  title: string;
  value: string;
  hint: string;
};

function StatsGrid({ items }: { items: StatsCard[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{item.value}</div>
            <div className="mt-1 text-xs text-slate-500">{item.hint}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="py-10 text-center text-slate-500">{message}</CardContent>
    </Card>
  );
}

export default function ReportPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [pggReport, setPggReport] = useState<any>(null);
  const [tutorialReport, setTutorialReport] = useState<any>(null);
  const [rtgReport, setRtgReport] = useState<any>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !user) return;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const [overviewResult, pggResult, tutorialResult, rtgResult] = await Promise.all([
          reportAPI.getAllGamesReport(),
          reportAPI.getPublicGoodsReport(),
          reportAPI.getRTGTutorialReport(),
          reportAPI.getTrustGameReport(),
        ]);

        setOverview(overviewResult);
        setPggReport(pggResult);
        setTutorialReport(tutorialResult);
        setRtgReport(rtgResult);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : '리포트를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    void loadReports();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-10">
        <div className="text-slate-500">리포트를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-10">
        <div className="text-slate-500">리포트를 보려면 먼저 로그인해주세요.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-10">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const pggRounds = (pggReport?.rounds ?? []) as PGGRound[];
  const tutorialRounds = (tutorialReport?.rounds ?? []) as TutorialRound[];
  const rtgRounds = (rtgReport?.rounds ?? []) as RTGRound[];

  const pggStats: StatsCard[] = pggReport?.summary
    ? [
        {
          title: 'Total Contribution',
          value: pggReport.summary.total_contribution.toFixed(2),
          hint: `${pggReport.summary.total_rounds} / ${pggReport.summary.expected_rounds} trials`,
        },
        {
          title: 'Total Feedback',
          value: pggReport.summary.total_feedback.toFixed(2),
          hint: '받아온 공공 풀 보상 합계',
        },
        {
          title: 'Cumulative Payoff',
          value: pggReport.summary.cumulative_payoff.toFixed(2),
          hint: '최종 누적 payoff',
        },
      ]
    : [];

  const tutorialStats: StatsCard[] = tutorialReport?.summary
    ? [
        {
          title: 'Tutorial Trials',
          value: `${tutorialReport.summary.total_rounds}`,
          hint: `${tutorialReport.summary.expected_rounds} expected`,
        },
        {
          title: 'Comprehension',
          value: tutorialReport.summary.comprehension_check_passed ? 'Passed' : 'Pending',
          hint: '이해도 점검 상태',
        },
      ]
    : [];

  const rtgStats: StatsCard[] = rtgReport?.summary
    ? [
        {
          title: 'Main Trials',
          value: `${rtgReport.summary.total_rounds}`,
          hint: `${rtgReport.summary.expected_rounds} expected`,
        },
        {
          title: 'Blocks Logged',
          value: `${rtgReport.summary.total_blocks}`,
          hint: `${rtgReport.summary.expected_blocks} post-block responses`,
        },
        {
          title: 'Mean Amount Sent',
          value: rtgReport.summary.mean_amount_sent.toFixed(2),
          hint: '평균 투자액',
        },
        {
          title: 'Cumulative Payoff',
          value: rtgReport.summary.cumulative_payoff.toFixed(2),
          hint: '최종 누적 payoff',
        },
      ]
    : [];

  const overall = overview?.overall_summary;

  return (
    <div className="container mx-auto space-y-8 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary">Experiment Report</h1>
        <p className="max-w-2xl text-foreground/70">
          가장 최근에 완료한 PGG, RTG tutorial, RTG main session을 기준으로 실험 진행 현황과
          행동 궤적을 보여줍니다.
        </p>
      </div>

      {overall && (
        <StatsGrid
          items={[
            {
              title: 'Overall Progress',
              value: `${overall.overall_percentage}%`,
              hint: `${overall.completed_rounds} / ${overall.expected_rounds} total trials`,
            },
            {
              title: 'PGG Session',
              value: overall.sessions_completed.public_goods ? 'Done' : 'Missing',
              hint: '공공재 게임 완료 여부',
            },
            {
              title: 'Tutorial Session',
              value: overall.sessions_completed.rtg_tutorial ? 'Done' : 'Missing',
              hint: 'RTG tutorial 완료 여부',
            },
            {
              title: 'Main RTG Session',
              value: overall.sessions_completed.trust_game ? 'Done' : 'Missing',
              hint: 'RTG 본실험 완료 여부',
            },
          ]}
        />
      )}

      <Tabs defaultValue="pgg" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pgg">PGG</TabsTrigger>
          <TabsTrigger value="tutorial">RTG Tutorial</TabsTrigger>
          <TabsTrigger value="rtg">RTG Main</TabsTrigger>
        </TabsList>

        <TabsContent value="pgg" className="space-y-6">
          {pggRounds.length === 0 ? (
            <EmptyState message="완료된 PGG 세션이 아직 없습니다." />
          ) : (
            <>
              <StatsGrid items={pggStats} />
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>PGG Trial Trajectory</CardTitle>
                </CardHeader>
                <CardContent className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pggRounds}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pgg_trial_index" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="pgg_contribution" stroke="#2563eb" name="Contribution" strokeWidth={2} />
                      <Line type="monotone" dataKey="pgg_feedback_amount" stroke="#16a34a" name="Feedback" strokeWidth={2} />
                      <Line type="monotone" dataKey="cumulative_payoff" stroke="#f59e0b" name="Cumulative payoff" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="tutorial" className="space-y-6">
          {tutorialRounds.length === 0 ? (
            <EmptyState message="완료된 RTG tutorial 세션이 아직 없습니다." />
          ) : (
            <>
              <StatsGrid items={tutorialStats} />
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Tutorial Return Pattern</CardTitle>
                </CardHeader>
                <CardContent className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tutorialRounds}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="trial_index" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="amount_received" stroke="#2563eb" name="Received" strokeWidth={2} />
                      <Line type="monotone" dataKey="return_amount" stroke="#16a34a" name="Returned" strokeWidth={2} />
                      <Line type="monotone" dataKey="amount_kept" stroke="#f59e0b" name="Kept" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="rtg" className="space-y-6">
          {rtgRounds.length === 0 ? (
            <EmptyState message="완료된 RTG main 세션이 아직 없습니다." />
          ) : (
            <>
              <StatsGrid items={rtgStats} />
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>RTG Main Trial Trajectory</CardTitle>
                </CardHeader>
                <CardContent className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rtgRounds}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rtg_trial_index" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="amount_sent" stroke="#2563eb" name="Amount sent" strokeWidth={2} />
                      <Line type="monotone" dataKey="partner_return_amount" stroke="#16a34a" name="Partner return" strokeWidth={2} />
                      <Line type="monotone" dataKey="cumulative_payoff" stroke="#f59e0b" name="Cumulative payoff" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
