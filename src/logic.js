// Pure movement rules for the firefly. No drawing and no DOM access.
// Source of truth: GAME_DESIGN.md section 2.

export const MOVE_LOCK_MS = 150;

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

function isDirection(dir) {
  return Object.prototype.hasOwnProperty.call(DIRECTIONS, dir);
}

// held = direction names in press order. Returns a new array.
// Pressing a direction makes it the last one; an invalid direction changes nothing.
export function pressDirection(held, dir) {
  if (!isDirection(dir)) return held;
  return [...held.filter((d) => d !== dir), dir];
}

export function releaseDirection(held, dir) {
  return held.filter((d) => d !== dir);
}

// The direction the firefly follows: the most recently pressed key still held.
export function activeDirection(held) {
  return held[held.length - 1];
}

// state = { x, y, lockedUntil }
// grid  = { width, height, blocked(x, y) -> boolean }
// Returns a new state. Returns the same state object when nothing moves.
export function requestMove(state, dir, nowMs, grid) {
  if (nowMs < state.lockedUntil) return state;
  if (!isDirection(dir)) return state;
  const { dx, dy } = DIRECTIONS[dir];
  const nx = state.x + dx;
  const ny = state.y + dy;
  if (nx < 0 || ny < 0 || nx >= grid.width || ny >= grid.height) return state;
  if (grid.blocked(nx, ny)) return state;
  return { x: nx, y: ny, lockedUntil: nowMs + MOVE_LOCK_MS };
}
