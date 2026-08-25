"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { QuestionnaireFlow } from "questionnaire-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { questionnaireAPI } from "@/lib/api";
import { hasCompletedAllGames } from "@/lib/gameProgress";
import type { QuestionnaireDefinition } from "@/lib/questionnaireTypes";

type QuestionnaireStagePageProps = {
  mode: "demographic" | "followup";
  questionnaires: QuestionnaireDefinition[];
  previousRoute: string;
  completionRoute: string;
  markCompleteOnFinish?: boolean;
};

type QuestionnaireStatus = {
  completed?: boolean;
  demographic_completed?: boolean;
  saved_questionnaires?: string[];
};

type QuestionnaireDetail = QuestionnaireStatus & {
  exists?: boolean;
  answers?: Record<string, unknown>;
};

const EMPTY_QUESTIONNAIRE_ANSWERS: Record<string, unknown> = {};

export default function QuestionnaireStagePage({
  mode,
  questionnaires,
  previousRoute,
  completionRoute,
  markCompleteOnFinish = false,
}: QuestionnaireStagePageProps) {
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<
    Record<string, Record<string, unknown>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const submissionInProgress = useRef(false);
  const router = useRouter();
  const { getMedicalRecordNumber } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      const medicalRecordNumber = getMedicalRecordNumber();
      if (!medicalRecordNumber) {
        router.replace("/");
        setIsCheckingAccess(false);
        return;
      }

      try {
        const status = (await questionnaireAPI.checkStatus(
          medicalRecordNumber
        )) as QuestionnaireStatus;

        if (mode === "demographic") {
          if (status.demographic_completed) {
            router.replace(completionRoute);
            return;
          }

          const detail = (await questionnaireAPI.getDetail(
            medicalRecordNumber
          )) as QuestionnaireDetail;
          if (detail.exists && detail.answers && Object.keys(detail.answers).length > 0) {
            setQuestionnaireAnswers({
              [questionnaires[0].key]: detail.answers,
            });
          }
        } else {
          if (!status.demographic_completed) {
            router.replace("/questionnaire/demographic");
            return;
          }

          const gamesCompleted = await hasCompletedAllGames();
          if (!gamesCompleted) {
            router.replace("/games");
            return;
          }
        }
      } catch {
        // 오류 시 현재 페이지 유지
      } finally {
        setIsCheckingAccess(false);
      }
    };

    void checkAccess();
  }, [completionRoute, getMedicalRecordNumber, mode, questionnaires, router]);

  const currentQuestionnaire = questionnaires[currentQuestionnaireIndex];
  const isLastQuestionnaire = currentQuestionnaireIndex === questionnaires.length - 1;
  const initialAnswers =
    questionnaireAnswers[currentQuestionnaire.key] ?? EMPTY_QUESTIONNAIRE_ANSWERS;

  const saveQuestionnaireProgress = async (
    answers: Record<string, unknown>,
    completed: boolean
  ) => {
    const medicalRecordNumber = getMedicalRecordNumber();
    if (!medicalRecordNumber) {
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    if (Object.keys(answers).length === 0) {
      throw new Error("현재 설문 응답을 찾을 수 없습니다.");
    }

    await questionnaireAPI.submitAnswers({
      medicalRecordNumber,
      answers,
      questionnaireName: currentQuestionnaire.key,
      completed,
    });
  };

  const handleAnswer = async (result: {
    answers: Record<string, unknown>;
  }) => {
    if (submissionInProgress.current) return;

    submissionInProgress.current = true;
    setIsSubmitting(true);

    try {
      await saveQuestionnaireProgress(
        result.answers,
        isLastQuestionnaire && markCompleteOnFinish
      );

      if (isLastQuestionnaire) {
        toast({
          title: "설문 완료",
          description: "설문이 자동으로 저장되었습니다.",
        });
        router.push(completionRoute);
        return;
      }

      setQuestionnaireAnswers((prev) => ({
        ...prev,
        [currentQuestionnaire.key]: result.answers,
      }));
      toast({
        title: "임시 저장 완료",
        description: `${currentQuestionnaire.name} 설문이 저장되었습니다.`,
      });
      setCurrentQuestionnaireIndex((prev) => prev + 1);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "설문 저장에 실패했습니다.";
      toast({
        title: "저장 오류",
        description: message,
        variant: "destructive",
      });
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionnaireIndex > 0) {
      setCurrentQuestionnaireIndex((prev) => prev - 1);
      return;
    }

    router.push(previousRoute);
  };

  if (isCheckingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 text-blue-700">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>설문 상태를 확인하고 있습니다.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-6">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push(previousRoute)}
            className="text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            이전으로
          </Button>
        </div>

        <Card className="border-2 border-blue-200 shadow-xl">
          <CardHeader className="border-b border-blue-200 bg-blue-50 py-4">
            <CardTitle className="text-center text-xl font-bold text-blue-800">
              {currentQuestionnaire.name}
            </CardTitle>
            <p className="mt-1 text-center text-sm text-gray-600">
              설문 {currentQuestionnaireIndex + 1} / {questionnaires.length}
            </p>
          </CardHeader>

          <CardContent className="p-4">
            <div className="questionnaire-wrapper">
              <QuestionnaireFlow
                formId={`${mode}-${currentQuestionnaire.key}`}
                questionnaire={currentQuestionnaire.schema}
                onComplete={handleAnswer}
                initialAnswers={initialAnswers}
              />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Button
                onClick={handlePrevious}
                disabled={isSubmitting}
                variant="outline"
                size="lg"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                이전
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>
                  {isSubmitting
                    ? "응답을 저장하고 있습니다."
                    : "마지막 항목을 완료하면 자동으로 저장됩니다."}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
