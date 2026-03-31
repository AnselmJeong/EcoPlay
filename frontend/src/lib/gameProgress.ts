import { reportAPI } from "@/lib/api";

const PUBLIC_GOODS_TOTAL_ROUNDS = 10;
const TRUST_GAME_TOTAL_ROUNDS = 50;

export async function hasCompletedAllGames() {
  try {
    const report = await reportAPI.getAllGamesReport();
    const publicGoodsRounds =
      report?.overall_summary?.games_played?.public_goods ?? 0;
    const trustGameRounds =
      report?.overall_summary?.games_played?.trust_game ?? 0;

    return (
      publicGoodsRounds >= PUBLIC_GOODS_TOTAL_ROUNDS &&
      trustGameRounds >= TRUST_GAME_TOTAL_ROUNDS
    );
  } catch {
    return false;
  }
}
