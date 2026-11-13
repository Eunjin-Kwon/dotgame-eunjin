// Expected values come from GAME_DESIGN.md section 2 (confirmed).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { requestMove, MOVE_LOCK_MS } from '../src/logic.js';

const GRID_WIDTH = 16; // 2장: 512 px / 32 px
const GRID_HEIGHT = 12; // 2장: 384 px / 32 px
const LOCK_MS = 150; // 2장: 한 칸 이동 시간 150 ms

// Fixture: start cell and blocked cells are test-only values, not level data.
const START = { x: 5, y: 5, lockedUntil: 0 };
const BLOCKED = new Set(['6,5']);
const GRID = {
  width: GRID_WIDTH,
  height: GRID_HEIGHT,
  blocked: (x, y) => BLOCKED.has(`${x},${y}`),
};

test('lock constant matches 2장 (150 ms)', () => {
  assert.equal(MOVE_LOCK_MS, LOCK_MS);
});

// V-1: 격자 한 칸 단위
test('V-1: each direction moves exactly one cell', () => {
  const cases = [
    ['up', 5, 4],
    ['down', 5, 6],
    ['left', 4, 5],
  ];
  for (const [dir, ex, ey] of cases) {
    const next = requestMove(START, dir, 1000, GRID);
    assert.equal(next.x, ex, dir);
    assert.equal(next.y, ey, dir);
  }
});

// V-2: 방향키 4개만 유효
test('V-2: a direction outside up/down/left/right leaves coordinates unchanged', () => {
  for (const dir of ['upleft', 'diagonal', '', 'toString', undefined]) {
    const next = requestMove(START, dir, 1000, GRID);
    assert.equal(next.x, START.x, String(dir));
    assert.equal(next.y, START.y, String(dir));
  }
});

// V-3: 화면 밖이면 제자리, 막힌 입력은 lockedUntil 불변 (§1-5)
test('V-3: moving off the 16x12 grid keeps position and lockedUntil', () => {
  const edges = [
    [{ x: 0, y: 3, lockedUntil: 0 }, 'left'],
    [{ x: 15, y: 3, lockedUntil: 0 }, 'right'],
    [{ x: 3, y: 0, lockedUntil: 0 }, 'up'],
    [{ x: 3, y: 11, lockedUntil: 0 }, 'down'],
  ];
  for (const [s, dir] of edges) {
    const next = requestMove(s, dir, 1000, GRID);
    assert.deepEqual(next, s, dir);
  }
});

// V-4: 벽이면 제자리, 막힌 입력 직후 유효 입력은 잠금 없이 이동 (§1-5)
test('V-4: moving into a blocked cell keeps state, and a valid input right after is not locked', () => {
  const blockedAttempt = requestMove(START, 'right', 1000, GRID);
  assert.deepEqual(blockedAttempt, START);
  const valid = requestMove(blockedAttempt, 'up', 1000, GRID);
  assert.equal(valid.x, 5);
  assert.equal(valid.y, 4);
  assert.equal(valid.lockedUntil, 1000 + LOCK_MS);
});

// V-5: 150 ms 쿨다운, 잠금 중 입력 무시, 잠금 해제 시점에 1칸
test('V-5: a move locks input for 150 ms; the unlock instant allows exactly one more move', () => {
  const moved = requestMove(START, 'up', 1000, GRID);
  assert.equal(moved.lockedUntil, 1000 + LOCK_MS);

  const during = requestMove(moved, 'up', 1000 + LOCK_MS - 1, GRID);
  assert.equal(during, moved, 'input during lock is ignored');

  const atUnlock = requestMove(moved, 'up', 1000 + LOCK_MS, GRID);
  assert.equal(atUnlock.y, moved.y - 1, 'one cell at unlock instant');
});

// V-6: logic.js는 canvas를 모른다 (AGENTS.md)
test('V-6: src/logic.js does not reference canvas, document, or window', () => {
  const source = readFileSync(new URL('../src/logic.js', import.meta.url), 'utf8');
  for (const token of ['canvas', 'document', 'window']) {
    assert.equal(source.includes(token), false, token);
  }
});
