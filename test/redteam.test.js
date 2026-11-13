// Red-team: boundary and failure cases. Expected values come from GAME_DESIGN.md
// sections 2 (movement rules) and 5 (level 1 map). Uses the real level 1 data.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requestMove, pressDirection, releaseDirection, activeDirection } from '../src/logic.js';
import { LEVEL_1_ROWS, parseLevel } from '../src/levels.js';

const LOCK_MS = 150; // GAME_DESIGN.md 2장: 한 칸 이동 시간 150 ms
const level = parseLevel(LEVEL_1_ROWS);
const START = { x: 2, y: 10, lockedUntil: 0 }; // GAME_DESIGN.md 5장: P

const at = (state, dir, nowMs) => requestMove(state, dir, nowMs, level);

test('tap burst: many presses inside one 150 ms lock move exactly one cell', () => {
  let s = START;
  for (let t = 0; t < LOCK_MS; t += 10) s = at(s, 'right', t);
  assert.equal(s.x, 3);
  assert.equal(s.y, 10);
  assert.equal(s.lockedUntil, 150);
});

test('hold: one cell every 150 ms while the key stays pressed', () => {
  let s = START;
  for (const t of [0, 150, 300]) s = at(s, 'right', t);
  assert.equal(s.x, 5);
});

test('blocked presses do not start a lock: a valid press right after moves at once', () => {
  let s = at(START, 'left', 0); // (1,10), locks until 150
  assert.equal(s.x, 1);
  for (const t of [150, 151, 152, 153, 154]) {
    s = at(s, 'left', t); // (0,10) is the border wall: each press is blocked
    assert.equal(s.x, 1, `blocked at ${t}`);
    assert.equal(s.lockedUntil, 150, `lock unchanged at ${t}`);
  }
  s = at(s, 'right', 155);
  assert.equal(s.x, 2, 'valid move at 155 ms is not locked by the blocked presses');
});

test('invalid direction values never move the firefly', () => {
  for (const dir of ['Up', 'ArrowUp', 'UP', 'up ', '', 'diagonal', null]) {
    assert.equal(at(START, dir, 1000), START, JSON.stringify(dir));
  }
});

// GAME_DESIGN.md 2장 "키를 뗀 뒤": 아직 누르고 있는 키가 있으면 그중 가장 나중에 누른 키의 방향으로 이어서 이동한다.
test('releasing the last pressed key resumes the still-held earlier key, and that key moves the firefly', () => {
  let held = pressDirection([], 'right');
  let s = at(START, activeDirection(held), 0); // right: (3,10)
  assert.equal(s.x, 3);
  held = pressDirection(held, 'left');
  s = at(s, activeDirection(held), 200); // left: (2,10)
  assert.equal(s.x, 2);
  held = releaseDirection(held, 'left');
  assert.equal(activeDirection(held), 'right', 'right is active again after left is released');
  s = at(s, activeDirection(held), 400); // right: (3,10), a visible move
  assert.equal(s.x, 3, 'the resumed direction actually moves the firefly');
  assert.equal(s.y, 10);
});

test('malformed level data is rejected: missing start, two starts, ragged rows, bad characters', () => {
  assert.throws(() => parseLevel(['###', '#.#', '###']), /no start cell/);
  assert.throws(() => parseLevel(['#P#', '#.##']), /width mismatch/);
  assert.throws(() => parseLevel(['#P#', '#P#']), /more than one start cell/);
  assert.throws(() => parseLevel(['#P*']), /unknown level char '\*'/);
});
