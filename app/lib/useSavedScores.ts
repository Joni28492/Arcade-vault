"use client";

import { useEffect, useState } from "react";
import type { SavedScore } from "@/app/data";
import { readScores } from "./storage";

/** Puntuaciones de `av_scores`; vacío hasta montar para evitar diferencias de hidratación. */
export function useSavedScores(): SavedScore[] {
  const [saved, setSaved] = useState<SavedScore[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(readScores());
  }, []);

  return saved;
}
