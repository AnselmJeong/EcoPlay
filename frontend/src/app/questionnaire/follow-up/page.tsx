import FollowUpQuestionnaireHub from "@/components/questionnaire/FollowUpQuestionnaireHub";
import {
  getFollowUpQuestionnaires,
  toQuestionnaireSummary,
} from "@/lib/questionnaireRegistry";

export const dynamic = "force-dynamic";

export default async function FollowUpQuestionnairePage() {
  const questionnaires = await getFollowUpQuestionnaires();

  return (
    <FollowUpQuestionnaireHub
      questionnaires={questionnaires.map(toQuestionnaireSummary)}
    />
  );
}
