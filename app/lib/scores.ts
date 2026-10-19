import type { SavedScore, ScoreEntry } from "@/app/data";

export function formatDate(at: number): string {
  const d = new Date(at);
  const day = String(d.getDate()).padStart(2, "0");
  const mon = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${mon}/${d.getFullYear()}`;
}

/** Mezcla las puntuaciones ficticias con las guardadas de un juego, ordenadas y reenumeradas. */
export function mergeScores(
  seeded: ScoreEntry[],
  saved: SavedScore[],
  gameId: string,
  limit: number,
): ScoreEntry[] {
  const mine: ScoreEntry[] = saved
    .filter((s) => s.game === gameId)
    .map((s) => ({
      rank: 0,
      name: s.name,
      score: s.score,
      date: formatDate(s.at),
    }));
  return [...seeded, ...mine]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
