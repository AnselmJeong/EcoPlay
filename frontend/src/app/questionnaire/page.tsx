"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { questionnaireAPI } from "@/lib/api";

type QuestionnaireStatus = {
  completed?: boolean;
  demographic_completed?: boolean;
};

export default function QuestionnairePage() {
  const router = useRouter();
  const { getMedicalRecordNumber } = useAuth();

  useEffect(() => {
    const redirectToStage = async () => {
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

        router.replace("/questionnaire/follow-up");
      } catch {
        router.replace("/questionnaire/demographic");
      }
    };

    void redirectToStage();
  }, [getMedicalRecordNumber, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="flex items-center gap-3 text-blue-700">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>설문 화면으로 이동하고 있습니다.</span>
      </div>
    </div>
  );
}
