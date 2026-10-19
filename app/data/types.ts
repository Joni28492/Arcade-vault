export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type AccentColor = "cyan" | "magenta" | "yellow" | "green";

export interface Game {
  id: string; // slug, p. ej. "bloque-buster"
  title: string;
  short: string;
  long: string;
  cat: Category;
  cover: string; // clase CSS, p. ej. "cover-bricks"
  color: AccentColor;
  best: number; // mejor puntuación global ficticia
  plays: string; // p. ej. "12.4K"
}

export interface ScoreEntry {
  rank: number;
  name: string;
  score: number;
  date: string; // "DD/MM/YYYY"
}

export interface SavedScore {
  game: string; // Game.id
  name: string; // máx. 10 caracteres, mayúsculas
  score: number;
  at: number; // Date.now()
}

export interface SessionUser {
  name: string; // máx. 10 caracteres, mayúsculas
}
