// goal-4 rules: levels 2 and 3, per-level time and dewdrops, restart keeps totalScore.
// Expected values come from GAME_DESIGN.md 9장 acceptance 27, 29, 31 and the 5장 레벨별 값 table
// (60/50/45 s, 8/10/12 dewdrops). Score: 2장 / 9장 수용 20 (dewdrops x 100 + remaining seconds x 10).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advance, createTitle, createWorld, enter, scoreOf } from '../src/logic.js';
import { LEVELS, parseLevel } from '../src/levels.js';

const levels = LEVELS.map((e) => parseLevel(e.rows, e.timeLimitS));

function levelScore(dewdrops, secondsLeft) {
  return dewdrops * 100 + secondsLeft * 10;
}

// Plays the level for elapsedS seconds from startMs with the real timer, then reaches the clear frame.
// The dewdrop list is emptied and collected set to the total in place of walking over every dewdrop;
// the clear itself is still decided by advance().
function clearLevel(world, startMs, elapsedS) {
  const nowMs = startMs + elapsedS * 1000;
  const timed = advance(world, nowMs);
  assert.equal(timed.phase, 'play', 'level is still running before the clear frame');
  return advance({ ...timed, dewdrops: [], collected: timed.total }, nowMs);
}

const LEVEL1_CLEAR_S = 30; // 8 x 100 + 30 x 10 = 1100
const LEVEL2_CLEAR_S = 10; // 10 x 100 + 40 x 10 = 1400
const LEVEL3_CLEAR_S = 5; // 12 x 100 + 40 x 10 = 1600
const SCORE_1 = levelScore(8, 30);
const SCORE_2 = levelScore(10, 40);
const T_LEVEL2 = 40_000;
const T_LEVEL3 = 60_000;
const T_TITLE = 80_000;

function startLevel2() {
  const cleared1 = clearLevel(createWorld(levels[0], 0), 0, LEVEL1_CLEAR_S);
  return enter(cleared1, T_LEVEL2, levels);
}

function startLevel3() {
  const cleared2 = clearLevel(startLevel2(), T_LEVEL2, LEVEL2_CLEAR_S);
  return enter(cleared2, T_LEVEL3, levels);
}

test('27: clear level 1, Enter -> level 2 with 10 dewdrops and 50 s', () => {
  const cleared1 = clearLevel(createWorld(levels[0], 0), 0, LEVEL1_CLEAR_S);
  assert.equal(cleared1.phase, 'won');
  assert.equal(scoreOf(cleared1), SCORE_1);

  const l2 = enter(cleared1, T_LEVEL2, levels);
  assert.equal(l2.phase, 'play');
  assert.equal(l2.levelIndex, 1);
  assert.equal(l2.timeLeft, 50);
  assert.equal(l2.total, 10);
  assert.equal(l2.dewdrops.length, 10);
  assert.equal(l2.collected, 0);
  assert.equal(l2.totalScore, SCORE_1, 'level 1 score is carried into the total');
});

test('29: clear level 2, Enter -> level 3 with 12 dewdrops and 45 s', () => {
  const cleared2 = clearLevel(startLevel2(), T_LEVEL2, LEVEL2_CLEAR_S);
  assert.equal(cleared2.phase, 'won');
  assert.equal(scoreOf(cleared2), SCORE_2);

  const l3 = enter(cleared2, T_LEVEL3, levels);
  assert.equal(l3.phase, 'play');
  assert.equal(l3.levelIndex, 2);
  assert.equal(l3.timeLeft, 45);
  assert.equal(l3.total, 12);
  assert.equal(l3.dewdrops.length, 12);
  assert.equal(l3.collected, 0);
  assert.equal(l3.totalScore, SCORE_1 + SCORE_2);
});

test('31: losing level 2 restarts level 2 with 10 dewdrops and 50 s and keeps the level 1 score', () => {
  const l2 = startLevel2();
  // The 50 s limit of level 2 runs out from its own start (time limit rule, 9장 수용 16, 17).
  const lost = advance(l2, T_LEVEL2 + 50_000);
  assert.equal(lost.phase, 'lost');
  assert.equal(lost.reason, 'timeout');

  const again = enter(lost, 100_000, levels);
  assert.equal(again.phase, 'play');
  assert.equal(again.levelIndex, 1, 'same level');
  assert.equal(again.total, 10);
  assert.equal(again.dewdrops.length, 10, 'full dewdrops');
  assert.equal(again.collected, 0);
  assert.equal(again.timeLeft, 50, 'full time');
  assert.equal(again.totalScore, SCORE_1, 'level 1 score kept');
});

test('31: losing level 3 restarts level 3 with 12 dewdrops and 45 s and keeps the earlier scores', () => {
  const l3 = startLevel3();
  const lost = advance(l3, T_LEVEL3 + 45_000);
  assert.equal(lost.phase, 'lost');
  assert.equal(lost.reason, 'timeout');

  const again = enter(lost, 100_000, levels);
  assert.equal(again.phase, 'play');
  assert.equal(again.levelIndex, 2);
  assert.equal(again.total, 12);
  assert.equal(again.dewdrops.length, 12);
  assert.equal(again.collected, 0);
  assert.equal(again.timeLeft, 45);
  assert.equal(again.totalScore, SCORE_1 + SCORE_2);
});

test('clearing level 3 and pressing Enter goes to the final screen (9장 수용 32)', () => {
  const cleared3 = clearLevel(startLevel3(), T_LEVEL3, LEVEL3_CLEAR_S);
  assert.equal(cleared3.phase, 'won');
  assert.equal(scoreOf(cleared3), levelScore(12, 40));

  const final = enter(cleared3, T_TITLE, levels);
  assert.equal(final.phase, 'final');
  assert.equal(final.levelIndex, 2);
  assert.equal(final.totalScore, SCORE_1 + SCORE_2 + levelScore(12, 40));
});

test('createTitle shows level 1 data with the 60 s limit and 8 dewdrops', () => {
  const t = createTitle(levels);
  assert.equal(t.phase, 'title');
  assert.equal(t.timeLeft, 60);
  assert.equal(t.total, 8);
  assert.equal(createWorld(levels[1], 0, 1, 0).total, 10);
});
