import { reportAPI } from "@/lib/api";

export async function hasCompletedAllGames() {
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
