import { reportAPI } from "@/lib/api";

// TODO(testing): Set this to false before production data collection begins.
export const TEMPORARY_QUESTIONNAIRE_TEST_BYPASS = true;

export async function hasCompletedAllGames() {
  if (TEMPORARY_QUESTIONNAIRE_TEST_BYPASS) {
    return true;
  }

  try {
    const report = await reportAPI.getAllGamesReport();
    const completed = report?.overall_summary?.sessions_completed;
    return Boolean(
      completed?.rtg_tutorial && completed?.trust_game
    );
  } catch {
    return false;
  }
}
