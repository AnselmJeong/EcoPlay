import type { QuestionnaireSchema } from "questionnaire-js";

export type QuestionnaireStage = "demographic" | "followup";

export type QuestionnaireDefinition = {
  key: string;
  slug: string;
  fileName: string;
  name: string;
  stage: QuestionnaireStage;
  schema: QuestionnaireSchema;
};

export type QuestionnaireSummary = Pick<
  QuestionnaireDefinition,
  "key" | "slug" | "name"
>;
