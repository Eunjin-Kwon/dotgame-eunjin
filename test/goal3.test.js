// goal-3 rules: title, play start, clear and fail screens, restart. Expected values come from
// GAME_DESIGN.md 9장 acceptance items 18~26 and 2장/3장 rows.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTitle, createWorld, advance, enter, pressKey, scoreOf } from '../src/logic.js';
import { LEVEL_1_ROWS, LEVELS, parseLevel } from '../src/levels.js';

const LEVEL_1_TIME_S = 60; // 5장 표: 레벨 1 제한 시간 60초
const LEVEL_2_TIME_S = 50; // 5장 표: 레벨 2 제한 시간 50초
const DEWDROPS = 8; // 9장 수용 19, 5장 표: 레벨 1 이슬방울 8개
const LEVEL_2_DEWDROPS = 10; // 5장 표: 레벨 2 이슬방울 10개
const LEVEL_3_DEWDROPS = 12; // 5장 표: 레벨 3 이슬방울 12개
const DEW_PTS = 100; // 2장 점수: 이슬방울 1개 100점
const SEC_PTS = 10; // 2장 점수: 남은 정수 초 1초당 10점

const level = parseLevel(LEVEL_1_ROWS, LEVEL_1_TIME_S);
const levels = LEVELS.map(({ rows, timeLimitS }) => parseLevel(rows, timeLimitS));
// Small test maps use the level 1 time limit; each test sets the state it checks.
const small = (rows) => parseLevel(rows, LEVEL_1_TIME_S);

// 9장 수용 18: the game opens on the title, and Enter starts play
test('18: a new game is on the title screen and nothing moves or ticks there', () => {
  const t = createTitle(levels);
  assert.equal(t.phase, 'title');
  assert.equal(advance(t, 5000), t, 'no time passes on the title');
  assert.equal(pressKey(t, 'right'), t, 'arrows are ignored on the title');
});

test('18: Enter on the title starts play at P and the 60 s timer starts then', () => {
  const started = enter(createTitle(levels), 7000, levels);
  assert.equal(started.phase, 'play');
  assert.equal(started.timeLeft, LEVEL_1_TIME_S);
  assert.equal(started.nextSecondAt, 8000, 'timer anchors at the Enter frame');
  assert.deepEqual({ x: started.player.x, y: started.player.y }, { x: 2, y: 10 });
});

// 9장 수용 19, 20: clear screen and score
test('19: collecting the last dewdrop reaches the won (clear) screen', () => {
  // One dewdrop next to the firefly; the spider is out of reach on the right.
  const s = small(['######', '#Po.S#', '######']);
  let w = createWorld(s, 0);
  w = pressKey(w, 'right');
  w = advance(w, 0);
  assert.equal(w.phase, 'won');
  assert.equal(w.collected, 1);
  assert.equal(w.total, 1);
});

test('19: the level 1 map holds exactly 8 dewdrops to clear', () => {
  assert.equal(createWorld(level, 0).total, DEWDROPS);
});

test('20: clear score is dewdrops x 100 + remaining integer seconds x 10', () => {
  const won = { ...createWorld(level, 0), phase: 'won', collected: DEWDROPS, timeLeft: 42 };
  assert.equal(scoreOf(won), DEWDROPS * 100 + 42 * 10);
});

// 9장 수용 21, 22: fail screens with reasons
test('21: caught by the spider -> lost with reason spider (fail screen text is 거미에게 잡혔어요)', () => {
  // Firefly at (1,1), spider at (3,1). The spider steps left at 300 ms onto (2,1) where the firefly moved.
  const s = small(['#####', '#PSS#'.replace('SS', '.S'), '#####']);
  let w = createWorld(s, 0);
  w = pressKey(w, 'right');
  w = advance(w, 0); // firefly to (2,1)
  assert.equal(w.player.x, 2);
  w = advance(w, 300); // spider steps left from (3,1) onto (2,1)
  assert.equal(w.phase, 'lost');
  assert.equal(w.reason, 'spider');
});

test('22: time reaches 0 -> lost with reason timeout (fail screen text is 밤이 끝났어요)', () => {
  let w = createWorld(level, 0);
  w = advance(w, LEVEL_1_TIME_S * 1000);
  assert.equal(w.phase, 'lost');
  assert.equal(w.reason, 'timeout');
});

// 9장 수용 23: Enter on fail restarts the same level from scratch
test('23: Enter on a fail screen restarts the same level: 8 dewdrops, 60 s, P start', () => {
  let w = createWorld(level, 0);
  w = { ...w, phase: 'lost', reason: 'spider', collected: 3, timeLeft: 20 };
  const again = enter(w, 9000, levels);
  assert.equal(again.phase, 'play');
  assert.equal(again.dewdrops.length, DEWDROPS);
  assert.equal(again.collected, 0);
  assert.equal(again.timeLeft, LEVEL_1_TIME_S);
  assert.deepEqual({ x: again.player.x, y: again.player.y }, { x: 2, y: 10 });
});

// 9장 수용 24, 27: Enter on the level 1 clear screen starts level 2 and keeps the level 1 score
test('24: Enter on the level 1 clear screen starts level 2 with 10 dewdrops, 50 s, and the level 1 score', () => {
  const won = { ...createWorld(level, 0), phase: 'won', collected: DEWDROPS, timeLeft: 42 };
  const next = enter(won, 9000, levels);
  assert.equal(next.phase, 'play');
  assert.equal(next.levelIndex, 1);
  assert.equal(next.dewdrops.length, LEVEL_2_DEWDROPS);
  assert.equal(next.collected, 0);
  assert.equal(next.timeLeft, LEVEL_2_TIME_S);
  assert.equal(next.totalScore, DEWDROPS * DEW_PTS + 42 * SEC_PTS);
  assert.deepEqual({ x: next.player.x, y: next.player.y }, { x: 4, y: 10 }, 'P of 5장 level 2 map');
});

// 9장 수용 24 (goal-4 interim): Enter on the level 3 clear screen returns to the title
test('24: Enter on the level 3 clear screen returns to the title (goal-4 interim)', () => {
  const won = { ...createWorld(levels[2], 0, 2), phase: 'won', collected: LEVEL_3_DEWDROPS };
  const back = enter(won, 9000, levels);
  assert.equal(back.phase, 'title');
});

// 9장 수용 25: after clear or fail, direction keys do nothing
test('25: directional keys are ignored on the clear and fail screens', () => {
  const won = { ...createWorld(level, 0), phase: 'won' };
  const lost = { ...createWorld(level, 0), phase: 'lost', reason: 'spider' };
  assert.equal(pressKey(won, 'up'), won);
  assert.equal(pressKey(lost, 'left'), lost);
  assert.equal(advance(lost, 9000), lost);
});

test('Enter during play does nothing', () => {
  const w = createWorld(level, 0);
  assert.equal(enter(w, 100, levels), w);
});
