"use client";

import { useMemo } from "react";
import type { ScoreEntry } from "@/app/data";
import { mergeScores } from "@/app/lib/scores";
import { useSavedScores } from "@/app/lib/useSavedScores";

export function Leaderboard({
  gameId,
  seeded,
}: {
  gameId: string;
  seeded: ScoreEntry[];
}) {
  const saved = useSavedScores();
  const rows = useMemo(
    () => mergeScores(seeded, saved, gameId, seeded.length),
    [seeded, saved, gameId],
  );

  return (
    <div className="leaderboard">
      <h3>MEJORES PUNTUACIONES</h3>
      {rows.map((r, i) => (
        <div
          key={r.name + i}
          className={
            "lb-row" +
            (i === 0 ? " top1" : i === 1 ? " top2" : i === 2 ? " top3" : "")
          }
        >
          <div className="rk">#{String(r.rank).padStart(2, "0")}</div>
          <div className="pl">
            {r.name}
            <div
              style={{
                fontSize: 10,
                color: "var(--ink-faint)",
                letterSpacing: "0.1em",
              }}
            >
              {r.date}
            </div>
          </div>
          <div className="sc">{r.score.toLocaleString("es-ES")}</div>
        </div>
      ))}
    </div>
  );
}
