import type { SavedScore, SessionUser } from "@/app/data";

const USER_KEY = "av_user";
const SCORES_KEY = "av_scores";

export function readUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed.name === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeUser(user: SessionUser | null): void {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {}
}

export function readScores(): SavedScore[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(SCORES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addScore(entry: Omit<SavedScore, "at">): void {
  try {
    const all = readScores();
    all.push({ ...entry, at: Date.now() });
    localStorage.setItem(SCORES_KEY, JSON.stringify(all));
  } catch {}
}
