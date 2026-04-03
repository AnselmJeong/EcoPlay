"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { QuestionnaireFlow, type QuestionnaireSchema } from "questionnaire-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { questionnaireAPI } from "@/lib/api";
import { hasCompletedAllGames } from "@/lib/gameProgress";

type QuestionnaireDefinition = {
  key: string;
  name: string;
  schema: QuestionnaireSchema;
};

type QuestionnaireStagePageProps = {
  mode: "demographic" | "followup";
  questionnaires: QuestionnaireDefinition[];
  previousRoute: string;
  completionRoute: string;
};

type QuestionnaireStatus = {
  completed?: boolean;
  demographic_completed?: boolean;
  saved_questionnaires?: string[];
};

export default function QuestionnaireStagePage({
  mode,
  questionnaires,
  previousRoute,
  completionRoute,
}: QuestionnaireStagePageProps) {
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<
    Record<string, Record<string, unknown>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
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
          return;
        } else {
          if (!status.demographic_completed) {
            router.replace("/questionnaire/demographic");
            return;
          }

          const gamesCompleted = await hasCompletedAllGames();
          if (!gamesCompleted) {
            router.replace("/questionnaire/demographic");
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
  }, [getMedicalRecordNumber, mode, router]);

  const currentQuestionnaire = questionnaires[currentQuestionnaireIndex];

  const handleAnswer = (result: { answers: Record<string, unknown> }) => {
    setQuestionnaireAnswers((prev) => ({
      ...prev,
      [currentQuestionnaire.key]: result.answers,
    }));
  };

  const saveQuestionnaireProgress = async (completed: boolean) => {
    const medicalRecordNumber = getMedicalRecordNumber();
    if (!medicalRecordNumber) {
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    const currentAnswers = questionnaireAnswers[currentQuestionnaire.key];
    if (!currentAnswers || Object.keys(currentAnswers).length === 0) {
      throw new Error("현재 설문 응답을 찾을 수 없습니다.");
    }

    await questionnaireAPI.submitAnswers({
      medicalRecordNumber,
      answers: currentAnswers,
      questionnaireName: currentQuestionnaire.key,
      completed,
    });
  };

  const handlePrevious = () => {
    if (currentQuestionnaireIndex > 0) {
      setCurrentQuestionnaireIndex((prev) => prev - 1);
      return;
    }

    router.push(previousRoute);
  };

  const handleNext = async () => {
    if (currentQuestionnaireIndex >= questionnaires.length - 1) return;

    setIsSubmitting(true);
    try {
      await saveQuestionnaireProgress(false);
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
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await saveQuestionnaireProgress(mode === "followup");
      toast({
        title: "설문 완료",
        description: "설문이 성공적으로 저장되었습니다.",
      });
      router.push(completionRoute);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "설문 저장에 실패했습니다.";
      toast({
        title: "저장 오류",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastQuestionnaire = currentQuestionnaireIndex === questionnaires.length - 1;

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
              />
            </div>

            <div className="mt-8 flex justify-between">
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

              {isLastQuestionnaire ? (
                <Button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      완료
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      다음
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
