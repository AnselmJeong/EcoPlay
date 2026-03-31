"use client";

import type { QuestionnaireSchema } from "questionnaire-js";

import QuestionnaireStagePage from "@/components/questionnaire/QuestionnaireStagePage";
import demographicData from "@/questionnaires/demographic.json";

const questionnaires = [
  {
    key: "demographic",
    name: "인구학적 정보",
    schema: demographicData as QuestionnaireSchema,
  },
];

export default function DemographicQuestionnairePage() {
  return (
    <QuestionnaireStagePage
      mode="demographic"
      questionnaires={questionnaires}
      previousRoute="/consent"
      completionRoute="/games"
    />
  );
}
