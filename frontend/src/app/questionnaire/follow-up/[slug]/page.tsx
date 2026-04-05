import { notFound } from "next/navigation";

import QuestionnaireStagePage from "@/components/questionnaire/QuestionnaireStagePage";
import { getFollowUpQuestionnaireBySlug } from "@/lib/questionnaireRegistry";

export const dynamic = "force-dynamic";

type FollowUpQuestionnaireDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function FollowUpQuestionnaireDetailPage({
  params,
}: FollowUpQuestionnaireDetailPageProps) {
  const { slug } = await params;
  const questionnaire = await getFollowUpQuestionnaireBySlug(slug);

  if (!questionnaire) {
    notFound();
  }

  return (
    <QuestionnaireStagePage
      mode="followup"
      questionnaires={[questionnaire]}
      previousRoute="/questionnaire/follow-up"
      completionRoute="/questionnaire/follow-up"
    />
  );
}
