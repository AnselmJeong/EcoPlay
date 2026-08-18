declare module "questionnaire-js" {
  import type { ComponentType } from "react";

  export type SurveyElement = {
    type: string;
    name?: string;
    title?: string;
    elements?: SurveyElement[];
    [key: string]: unknown;
  };

  export type QuestionnaireSchema = {
    title?: string;
    description?: string;
    pages: Array<{
      name?: string;
      title?: string;
      description?: string;
      elements: SurveyElement[];
    }>;
  };

  export type QuestionnaireResult = {
    answers: Record<string, unknown>;
  };

  export type QuestionnaireFlowProps = {
    questionnaire: QuestionnaireSchema;
    formId: string;
    onComplete: (result: QuestionnaireResult) => void;
    initialAnswers?: Record<string, unknown>;
  };

  export const QuestionnaireFlow: ComponentType<QuestionnaireFlowProps>;
}
