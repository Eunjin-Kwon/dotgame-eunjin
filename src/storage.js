// High score persistence. Storage access failures are swallowed: the game keeps running without a saved best.
export const HIGHSCORE_KEY = 'dotgame-eunjin-highscore';

// store = any object with getItem/setItem. Returns the stored integer, or null when none or unreadable.
export function loadHighScore(store) {
  try {
    const raw = store.getItem(HIGHSCORE_KEY);
    if (raw === null || raw === undefined || !/^-?\d+$/.test(raw)) return null;
    return Number(raw);
  } catch {
    return null;
  }
}

// Writes total only when there is no stored best or total beats it.
export function saveHighScore(store, total) {
  try {
    const best = loadHighScore(store);
    if (best === null || total > best) store.setItem(HIGHSCORE_KEY, String(total));
  } catch {
    // Storage unavailable: ignore.
  }
}
