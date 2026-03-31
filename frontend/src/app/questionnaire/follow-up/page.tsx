"use client";

import type { QuestionnaireSchema } from "questionnaire-js";

import QuestionnaireStagePage from "@/components/questionnaire/QuestionnaireStagePage";
import pclK5Data from "@/questionnaires/pcl-k-5.json";

const questionnaires = [
  {
    key: "pcl_k5",
    name: "PTSD 척도",
    schema: pclK5Data as QuestionnaireSchema,
  },
];

export default function FollowUpQuestionnairePage() {
  return (
    <QuestionnaireStagePage
      mode="followup"
      questionnaires={questionnaires}
      previousRoute="/games"
      completionRoute="/report"
    />
  );
}
