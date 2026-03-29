"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { questionnaireAPI } from '@/lib/api';

import { QuestionnaireFlow, type QuestionnaireSchema } from 'questionnaire-js';

import demographicData from '@/questionnaires/demographic.json';
import pclK5Data from '@/questionnaires/pcl-k-5.json';

export default function QuestionnairePage() {
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { getMedicalRecordNumber } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkAlreadyCompleted = async () => {
      const medicalRecordNumber = getMedicalRecordNumber();
      if (!medicalRecordNumber) return;
      try {
        const status = await questionnaireAPI.checkStatus(medicalRecordNumber);
        if (status.completed) {
          router.replace('/games');
        }
      } catch {
        // 오류 시 그냥 설문 페이지 유지
      }
    };
    checkAlreadyCompleted();
  }, []);

  const questionnaires: QuestionnaireSchema[] = [demographicData as QuestionnaireSchema, pclK5Data as QuestionnaireSchema];
  const questionnaireNames = ['인구학적 정보', 'PTSD 척도'];
  const currentQuestionnaire = questionnaires[currentQuestionnaireIndex];

  const handleAnswer = (result: { answers: Record<string, unknown> }) => {
    setAnswers(prev => ({ ...prev, ...result.answers }));
  };

  const handleNext = () => {
    if (currentQuestionnaireIndex < questionnaires.length - 1) {
      setCurrentQuestionnaireIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionnaireIndex > 0) {
      setCurrentQuestionnaireIndex(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const medicalRecordNumber = getMedicalRecordNumber();
      if (!medicalRecordNumber) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      await questionnaireAPI.submitAnswers({
        medicalRecordNumber,
        answers,
      });

      toast({
        title: "설문 완료",
        description: "설문이 성공적으로 저장되었습니다.",
      });

      router.push('/games');
    } catch (error: any) {
      console.error('설문 저장 오류:', error);
      toast({
        title: "저장 오류",
        description: error.message || "설문 저장에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastQuestionnaire = currentQuestionnaireIndex === questionnaires.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/consent')}
            className="text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전으로
          </Button>
        </div>

        <Card className="shadow-xl border-2 border-blue-200">
          <CardHeader className="bg-blue-50 border-b border-blue-200 py-4">
            <CardTitle className="text-xl font-bold text-blue-800 text-center">
              {questionnaireNames[currentQuestionnaireIndex]}
            </CardTitle>
            <p className="text-center text-gray-600 mt-1 text-sm">
              설문 {currentQuestionnaireIndex + 1} / {questionnaires.length}
            </p>
          </CardHeader>

          <CardContent className="p-4">
            {currentQuestionnaire && (
              <div className="questionnaire-wrapper">
                <QuestionnaireFlow
                  questionnaire={currentQuestionnaire}
                  onComplete={handleAnswer}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionnaireIndex === 0}
                variant="outline"
                size="lg"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>

              {isLastQuestionnaire ? (
                <Button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      완료
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  다음
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
