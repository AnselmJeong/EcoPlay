import QuestionnaireStagePage from "@/components/questionnaire/QuestionnaireStagePage";
import { getDemographicQuestionnaire } from "@/lib/questionnaireRegistry";

export const dynamic = "force-dynamic";

export default async function DemographicQuestionnairePage() {
  const questionnaire = await getDemographicQuestionnaire();
  return (
    <QuestionnaireStagePage
      mode="demographic"
      questionnaires={[questionnaire]}
      previousRoute="/consent"
      completionRoute="/games"
    />
  );
}
