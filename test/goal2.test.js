// goal-2 rules: dewdrops, spider, timer. Expected values come from GAME_DESIGN.md
// (9장 수용 9~17 and 2장 rows for 이슬, 거미, 접촉, 제한 시간, 점수).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, advance, pressKey, releaseKey, scoreOf } from '../src/logic.js';
import { LEVEL_1_ROWS, parseLevel } from '../src/levels.js';

const DEWDROPS = 8; // 2장/9장: 이슬방울 8개
const SPIDER_MS = 300; // 2장: 거미 300 ms마다 한 칸
const TIME_S = 60; // 2장: 제한 시간 60초
const DEW_PTS = 100; // 2장 점수: 이슬방울 1개 100점
const SEC_PTS = 10; // 2장 점수: 남은 정수 초 1초당 10점

const level = parseLevel(LEVEL_1_ROWS);

// Press one direction, run one frame at t, then release it (a tap with no hold).
function tap(world, dir, t) {
  let w = pressKey(world, dir);
  w = advance(w, t);
  return releaseKey(w, dir);
}

// Small level helper: rows must be rectangular; P and S are required by parseLevel.
const small = (rows) => parseLevel(rows);

test('9장 수용 9: the level starts with 8 dewdrops and 0 collected', () => {
  const w = createWorld(level, 0);
  assert.equal(w.dewdrops.length, DEWDROPS);
  assert.equal(w.collected, 0);
  assert.equal(w.total, DEWDROPS);
  assert.equal(w.phase, 'play');
});

test('9장 수용 10~11: entering a dewdrop cell removes it and adds 1; revisits add nothing', () => {
  const s = small(['#######', '#P.o.S#', '#######']);
  let w = createWorld(s, 0);
  w = tap(w, 'right', 0); // (2,1)
  assert.equal(w.collected, 0);
  w = tap(w, 'right', 150); // (3,1) holds the dewdrop
  assert.equal(w.collected, 1);
  assert.equal(w.dewdrops.length, 0);
  w = tap(w, 'left', 300); // (2,1): empty cell
  assert.equal(w.collected, 1, 'an empty cell changes nothing');
  w = tap(w, 'right', 450); // (3,1): the dewdrop is already taken
  assert.equal(w.collected, 1, 'a taken cell changes nothing');
});

test('9장 수용 12: the spider moves one tile every 300 ms', () => {
  let w = createWorld(level, 0);
  const row6 = [];
  for (let k = 1; k <= 3; k++) {
    w = advance(w, SPIDER_MS * k);
    row6.push(w.spider.x);
  }
  assert.deepEqual(row6, [12, 11, 10], 'starts at S (13,6) and steps left once per 300 ms');
});

test('9장 수용 12: the spider turns around at the wall (goes 12 tiles left, then back)', () => {
  let w = createWorld(level, 0);
  const xs = [];
  for (let k = 1; k <= 13; k++) {
    w = advance(w, SPIDER_MS * k);
    xs.push(w.spider.x);
  }
  assert.equal(xs[11], 1, 'after 12 steps the spider is at the last floor cell before the wall');
  assert.equal(xs[12], 2, 'at the wall it turns and moves one tile the other way');
  assert.equal(w.spider.dir, 1);
});

test('9장 수용 13: the spider walks over a dewdrop without eating it', () => {
  const s = small(['#######', '#P.o.S#', '#######']);
  let w = createWorld(s, 0);
  w = advance(w, SPIDER_MS); // (4,1)
  w = advance(w, SPIDER_MS * 2); // (3,1): the dewdrop cell
  assert.equal(w.spider.x, 3);
  assert.equal(w.dewdrops.length, 1, 'the dewdrop is still there');
  assert.equal(w.phase, 'play');
});

test('9장 수용 14: firefly steps onto the spider cell -> stops at once (lost, spider)', () => {
  const s = small(['#####', '#P.S#', '#####']);
  let w = createWorld(s, 0);
  w = tap(w, 'right', 0); // (2,1)
  assert.equal(w.phase, 'play');
  w = tap(w, 'right', 150); // (3,1): the spider stands here
  assert.equal(w.phase, 'lost');
  assert.equal(w.reason, 'spider');
});

test('9장 수용 14: the spider steps onto the firefly cell -> stops at once (lost, spider)', () => {
  const s = small(['#####', '#PS.#', '#####']);
  let w = createWorld(s, 0);
  w = advance(w, SPIDER_MS); // spider moves left onto (1,1), the firefly cell
  assert.equal(w.phase, 'lost');
  assert.equal(w.reason, 'spider');
});

test('9장 수용 15: the firefly and the spider swapping cells stops the run (lost, spider)', () => {
  // P at (2,1) and S at (3,1) are adjacent. Each single-cell move is checked for a shared cell,
  // so an exchange is caught when the first of them steps into the other's cell.
  const s = small(['######', '#.PS.#', '######']);
  let w = createWorld(s, 0);
  w = tap(w, 'right', 0); // firefly steps onto the spider's cell: contact before any swap
  assert.equal(w.phase, 'lost');
  assert.equal(w.reason, 'spider');
});

test('the spider moving into the firefly while the firefly stands still also stops the run', () => {
  const s = small(['######', '#.PS.#', '######']);
  let w = createWorld(s, 0);
  w = advance(w, SPIDER_MS); // spider steps left from (3,1) onto the firefly at (2,1)
  assert.equal(w.phase, 'lost');
  assert.equal(w.reason, 'spider');
});

test('9장 수용 16: the timer counts 60 down by one integer second per second of play', () => {
  let w = createWorld(level, 0);
  for (let k = 1; k <= 3; k++) {
    w = advance(w, 1000 * k);
    assert.equal(w.timeLeft, TIME_S - k);
  }
});

test('9장 수용 17: at 0 seconds the run stops (lost, timeout)', () => {
  let w = createWorld(level, 0);
  for (let k = 1; k < TIME_S; k++) {
    w = advance(w, 1000 * k);
    assert.equal(w.phase, 'play', `still playing at ${k} s`);
  }
  assert.equal(w.timeLeft, 1);
  w = advance(w, 1000 * TIME_S);
  assert.equal(w.phase, 'lost');
  assert.equal(w.reason, 'timeout');
  assert.equal(w.timeLeft, 0);
});

test('a long frame gap removes every whole second that passed (5 s gap -> 5 s less)', () => {
  const w = advance(createWorld(level, 0), 5000);
  assert.equal(w.timeLeft, TIME_S - 5);
  assert.equal(w.nextSecondAt, 6000);
});

test('a long frame gap re-anchors the spider and it moves no tile in that call', () => {
  const w = advance(createWorld(level, 0), 1000);
  assert.equal(w.spider.x, 13, 'no tile moved in the re-anchor call');
  assert.equal(w.spider.nextStepAt, 1300);
});

test('O3: picking the last collected dewdrop on the same tick as a spider contact -> lost, count +1, score 0', () => {
  // Spider walks onto the dewdrop cell at 300 ms; the firefly enters that cell at 450 ms.
  const s = small(['#######', '#P..oS#', '#######']);
  let w = createWorld(s, 0);
  w = tap(w, 'right', 0); // (2,1)
  w = tap(w, 'right', 150); // (3,1)
  w = advance(w, SPIDER_MS); // spider moves from (5,1) to (4,1) onto the dewdrop
  assert.equal(w.spider.x, 4);
  w = tap(w, 'right', 450); // firefly enters (4,1): pickup and contact in one tick
  assert.equal(w.collected, 1, 'the dewdrop is counted');
  assert.equal(w.phase, 'lost');
  assert.equal(w.reason, 'spider');
  assert.equal(scoreOf(w), 0);
});

test('O2: last dewdrop and timer reaching 0 on the same tick -> won (clear beats the timer)', () => {
  const s = small(['######', '#Po.S#', '######']);
  let w = createWorld(s, 0);
  w = { ...w, timeLeft: 1, nextSecondAt: 1000 };
  w = tap(w, 'right', 1000); // (2,1) picks the only dewdrop at the same tick the timer would hit 0
  assert.equal(w.phase, 'won');
  assert.equal(w.collected, 1);
});

test('9장 수용 20 score: dewdrops x 100 + remaining integer seconds x 10 on clear, 0 on failure', () => {
  const won = { ...createWorld(level, 0), phase: 'won', collected: DEWDROPS, timeLeft: 37 };
  assert.equal(scoreOf(won), DEWDROPS * DEW_PTS + 37 * SEC_PTS);
  const lost = { ...won, phase: 'lost', reason: 'spider' };
  assert.equal(scoreOf(lost), 0);
});

test('9장 수용 25 (goal-2 part): after a stop the run ignores later frames and keys', () => {
  const s = small(['#####', '#P.S#', '#####']);
  let w = createWorld(s, 0);
  w = tap(w, 'right', 0);
  w = tap(w, 'right', 150);
  assert.equal(w.phase, 'lost');
  assert.equal(pressKey(w, 'left'), w, 'keys are ignored after the stop');
  assert.equal(advance(w, 9000), w, 'no frame changes the stopped run');
});

test('O9: a tap pressed during the lock moves at unlock even if the key is released before it', () => {
  let w = createWorld(level, 0);
  w = tap(w, 'left', 0); // (1,10), locks until 150
  assert.equal(w.player.x, 1);
  w = pressKey(w, 'up'); // pressed at 50, during the lock
  w = advance(w, 50);
  assert.equal(w.player.y, 10, 'no move during the lock');
  w = releaseKey(w, 'up'); // released before the unlock
  w = advance(w, 150);
  assert.equal(w.player.y, 9, 'the buffered tap moves once at unlock');
});

test('a blocked tap does not lock the firefly (2장 막힌 입력)', () => {
  let w = createWorld(level, 0);
  w = tap(w, 'left', 0); // (1,10)
  w = tap(w, 'left', 160); // (0,10) is a wall: blocked, no lock
  w = tap(w, 'up', 170); // a valid press right after moves at once
  assert.equal(w.player.y, 9);
});
