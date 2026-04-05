"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { questionnaireAPI } from "@/lib/api";
import { hasCompletedAllGames } from "@/lib/gameProgress";
import type { QuestionnaireSummary } from "@/lib/questionnaireTypes";

type QuestionnaireStatus = {
  demographic_completed?: boolean;
  saved_questionnaires?: string[];
};

type FollowUpQuestionnaireHubProps = {
  questionnaires: QuestionnaireSummary[];
};

export default function FollowUpQuestionnaireHub({
  questionnaires,
}: FollowUpQuestionnaireHubProps) {
  const router = useRouter();
  const { getMedicalRecordNumber } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [savedQuestionnaires, setSavedQuestionnaires] = useState<string[]>([]);
  const [gamesCompleted, setGamesCompleted] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const medicalRecordNumber = getMedicalRecordNumber();
      if (!medicalRecordNumber) {
        router.replace("/");
        return;
      }

      try {
        const status = (await questionnaireAPI.checkStatus(
          medicalRecordNumber
        )) as QuestionnaireStatus;

        if (!status.demographic_completed) {
          router.replace("/questionnaire/demographic");
          return;
        }

        const completionStatus = await hasCompletedAllGames();
        setGamesCompleted(completionStatus);
        setSavedQuestionnaires(status.saved_questionnaires ?? []);
      } finally {
        setIsLoading(false);
      }
    };

    void checkAccess();
  }, [getMedicalRecordNumber, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 text-blue-700">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>설문 목록을 준비하고 있습니다.</span>
        </div>
      </div>
    );
  }

  const completedCount = questionnaires.filter((questionnaire) =>
    savedQuestionnaires.includes(questionnaire.key)
  ).length;
  const allCompleted =
    questionnaires.length === 0 || completedCount === questionnaires.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-emerald-50 py-6">
      <div className="container mx-auto max-w-5xl px-4">
        <Card className="border-blue-200 shadow-xl">
          <CardHeader className="border-b border-blue-100 bg-blue-50/80">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-blue-900">
                  후속 설문 선택
                </CardTitle>
                <p className="text-sm text-slate-600">
                  필요한 설문을 원하는 순서대로 작성할 수 있습니다. 완료한 설문은
                  다시 열어 수정할 수도 있습니다.
                </p>
                {!gamesCompleted ? (
                  <p className="text-sm font-medium text-amber-700">
                    후속 설문은 repeated trust game이 끝난 뒤에 열립니다.
                  </p>
                ) : null}
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
                {completedCount} / {questionnaires.length} 완료
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            {questionnaires.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                현재 등록된 후속 설문이 없습니다.
              </div>
            ) : null}

            {questionnaires.map((questionnaire) => {
              const isCompleted = savedQuestionnaires.includes(questionnaire.key);
              const isLocked = !gamesCompleted;

              return (
                <div
                  key={questionnaire.slug}
                  className={`flex flex-col gap-4 rounded-2xl border p-5 shadow-sm md:flex-row md:items-center md:justify-between ${
                    isLocked
                      ? "border-slate-200 bg-slate-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 rounded-full p-2 ${
                        isLocked
                          ? "bg-slate-200 text-slate-500"
                          : isCompleted
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <ClipboardList className="h-5 w-5" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {questionnaire.name}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {isLocked
                          ? "게임 완료 후 작성할 수 있습니다."
                          : isCompleted
                          ? "작성 완료"
                          : "아직 작성하지 않은 설문입니다."}
                      </p>
                    </div>
                  </div>

                  {isLocked ? (
                    <Button disabled className="min-w-32">
                      게임 완료 후 열림
                    </Button>
                  ) : (
                    <Button asChild className="min-w-32">
                      <Link href={`/questionnaire/follow-up/${questionnaire.slug}`}>
                        {isCompleted ? "다시 열기" : "작성 시작"}
                      </Link>
                    </Button>
                  )}
                </div>
              );
            })}

            <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-4">
              <Button asChild variant="outline">
                <Link href="/games">게임으로 돌아가기</Link>
              </Button>
              {allCompleted ? (
                <Button asChild>
                  <Link href="/report">결과 보러 가기</Link>
                </Button>
              ) : (
                <Button disabled>모든 설문 완료 후 결과 보기</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
