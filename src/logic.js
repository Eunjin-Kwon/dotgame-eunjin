// Pure game rules. No drawing and no DOM access.
// Source of truth: GAME_DESIGN.md sections 2, 3 and 9 (goal-2 rules).

export const MOVE_LOCK_MS = 150;
export const SPIDER_STEP_MS = 300;
export const SECOND_MS = 1000;
export const DEWDROP_POINTS = 100;
export const SECOND_POINTS = 10;

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

// ---- goal-2 world -------------------------------------------------------
// world = {
//   phase: 'title' | 'play' | 'won' | 'lost',
//   reason: null | 'spider' | 'timeout',
//   level, levelIndex (0-based), totalScore (sum of cleared levels before this one),
//   player, spider, dewdrops (remaining cells), collected, total,
//   timeLeft (integer seconds), nextSecondAt,
//   held (direction names in press order), tap (one buffered press or null)
// }
// Every rule that depends on time takes nowMs from the frame; nothing reads a clock here.

function sameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function createWorld(level, nowMs, levelIndex = 0, totalScore = 0) {
  return {
    phase: 'play',
    reason: null,
    level,
    levelIndex,
    totalScore,
    player: { x: level.start.x, y: level.start.y, lockedUntil: 0 },
    spider: {
      x: level.spider.x,
      y: level.spider.y,
      dir: -1,
      nextStepAt: nowMs + SPIDER_STEP_MS,
    },
    dewdrops: level.dewdrops.map((d) => ({ x: d.x, y: d.y })),
    collected: 0,
    total: level.dewdrops.length,
    timeLeft: level.timeLimitS,
    nextSecondAt: nowMs + SECOND_MS,
    held: [],
    tap: null,
  };
}

// A key press is kept as the held direction and as one buffered tap.
// The tap is consumed by the next advance() that is not locked (O9).
export function pressKey(world, dir) {
  if (world.phase !== 'play') return world;
  const held = pressDirection(world.held, dir);
  if (held === world.held) return world;
  return { ...world, held, tap: dir };
}

export function releaseKey(world, dir) {
  if (world.phase !== 'play') return world;
  return { ...world, held: releaseDirection(world.held, dir) };
}

export function clearKeys(world) {
  if (world.phase !== 'play') return world;
  return { ...world, held: [], tap: null };
}

function ended(world, reason) {
  return { ...world, phase: reason === 'won' ? 'won' : 'lost', reason: reason === 'won' ? null : reason, held: [], tap: null };
}

// Pickup: the dewdrop on the firefly cell is removed and counted.
function pickUp(world) {
  const index = world.dewdrops.findIndex((d) => sameCell(d, world.player));
  if (index < 0) return world;
  const dewdrops = world.dewdrops.filter((_, i) => i !== index);
  return { ...world, dewdrops, collected: world.collected + 1 };
}

// Spider: one tile per SPIDER_STEP_MS. A long delay re-anchors the clock and moves nothing.
// At a wall it turns around and moves one tile the other way in the same step.
function stepSpider(world, nowMs) {
  const spider = world.spider;
  if (nowMs < spider.nextStepAt) return world;
  if (nowMs >= spider.nextStepAt + SPIDER_STEP_MS) {
    return { ...world, spider: { ...spider, nextStepAt: nowMs + SPIDER_STEP_MS } };
  }
  let dir = spider.dir;
  let nx = spider.x + dir;
  if (world.level.blocked(nx, spider.y)) {
    dir = -dir;
    nx = spider.x + dir;
    if (world.level.blocked(nx, spider.y)) {
      return { ...world, spider: { ...spider, dir, nextStepAt: spider.nextStepAt + SPIDER_STEP_MS } };
    }
  }
  return {
    ...world,
    spider: { x: nx, y: spider.y, dir, nextStepAt: spider.nextStepAt + SPIDER_STEP_MS },
  };
}

// Timer: one integer second per SECOND_MS of play time. Every whole second that has passed
// since the last tick is removed, so a stalled frame loop does not stretch the 60 s limit.
function tickTimer(world, nowMs) {
  if (nowMs < world.nextSecondAt) return world;
  const passed = Math.floor((nowMs - world.nextSecondAt) / SECOND_MS) + 1;
  return {
    ...world,
    timeLeft: world.timeLeft - passed,
    nextSecondAt: world.nextSecondAt + passed * SECOND_MS,
  };
}

// One frame. Order (design rule, fixed by tests):
// 1 firefly move, 2 pickup, 3 contact (contact beats pickup-clear, O3),
// 4 clear when all dewdrops are taken (beats the timer, O2), 5 spider step, 6 contact,
// 7 timer (0 -> lost). Returns the same world object once the run has ended.
export function advance(world, nowMs) {
  if (world.phase !== 'play') return world;

  let next = world;
  const dir = world.tap ?? activeDirection(world.held);
  if (dir) {
    const moved = requestMove(world.player, dir, nowMs, world.level);
    if (moved !== world.player) {
      next = { ...next, player: moved, tap: null };
    } else if (world.tap && nowMs >= world.player.lockedUntil) {
      // A blocked tap is dropped: it did not start a lock (2장 '막힌 입력').
      next = { ...next, tap: null };
    }
  }

  next = pickUp(next);
  if (sameCell(next.player, next.spider)) return ended(next, 'spider');
  if (next.total > 0 && next.collected === next.total) return ended(next, 'won');

  next = stepSpider(next, nowMs);
  if (sameCell(next.player, next.spider)) return ended(next, 'spider');

  next = tickTimer(next, nowMs);
  if (next.timeLeft <= 0) return ended({ ...next, timeLeft: 0 }, 'timeout');
  return next;
}

// ---- goal-3 screens ----------------------------------------------------
// Title: the first level is shown as data only; nothing moves and no timer runs until Enter (O1).
export function createTitle(levels) {
  return { ...createWorld(levels[0], 0, 0, 0), phase: 'title' };
}

// Enter moves between screens. levels = the ordered level list (see src/levels.js).
// title -> start level 1. lost -> restart the same level, keep totalScore (9장 수용 23, 31).
// won on a non-last level -> start the next level, add this level's score (수용 27, 29).
// won on the last level -> title (goal-4 interim; the final screen is goal-5, 수용 24, 32).
// Enter during play does nothing.
export function enter(world, nowMs, levels) {
  if (world.phase === 'title') return createWorld(levels[0], nowMs, 0, 0);
  if (world.phase === 'lost') return createWorld(levels[world.levelIndex], nowMs, world.levelIndex, world.totalScore);
  if (world.phase === 'won') {
    if (world.levelIndex < levels.length - 1) {
      const nextIndex = world.levelIndex + 1;
      return createWorld(levels[nextIndex], nowMs, nextIndex, world.totalScore + scoreOf(world));
    }
    return createTitle(levels);
  }
  return world;
}

// Score (9장 수용 20): dewdrops x 100 + remaining integer seconds x 10. A failed run scores 0.
export function scoreOf(world) {
  if (world.phase !== 'won') return 0;
  return world.collected * DEWDROP_POINTS + world.timeLeft * SECOND_POINTS;
}
