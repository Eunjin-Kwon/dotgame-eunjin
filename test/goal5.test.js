// goal-5 rules: final screen, total score, high score storage, sound events, title after final,
// and failure paths without errors. Expected values come from GAME_DESIGN.md 9장 acceptance 32~37,
// 2장 (150 ms move, 300 ms spider), 3장 (screen flow), 5장 (60/50/45 s, 8/10/12 dewdrops),
// 6장/7장 (sound: square 880 Hz 80 ms; square 523/659/784 Hz 120 ms each; sawtooth 220 -> 110 Hz 300 ms, gain 0.1).
// The clear walks plan a path over the real map characters (src/levels.js) and play it through the real
// game functions; the planner does not decide any expected score.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advance, createTitle, createWorld, enter, pressKey, releaseKey, scoreOf } from '../src/logic.js';
import { LEVELS, parseLevel } from '../src/levels.js';
import { HIGHSCORE_KEY, loadHighScore, saveHighScore } from '../src/storage.js';
import { createAudio } from '../src/audio.js';

const levels = LEVELS.map((e) => parseLevel(e.rows, e.timeLimitS));

const DEW_PTS = 100; // 9장 수용 20: 이슬방울 1개 100점
const SEC_PTS = 10; // 9장 수용 20: 남은 정수 초 1초당 10점
const MOVE_MS = 150; // 2장: 한 칸 이동 150 ms
const SPIDER_MS = 300; // 2장: 거미 300 ms마다 한 칸
const MAX_TICKS = 400; // 60 s / 150 ms: longest possible level 1 run

// ---- clearing a level through the real game ------------------------------------------------

const DIRS = { wait: [0, 0], up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const MOVE_NAMES = Object.keys(DIRS);

// The spider's cell after each 300 ms step, from 9장 수용 12 (wall turns it around, starts left).
function spiderTrack(level, steps) {
  let { x, y } = level.spider;
  let dir = -1;
  const cells = [{ x, y }];
  for (let j = 1; j <= steps; j++) {
    if (level.blocked(x + dir, y)) dir = -dir;
    x += dir;
    cells.push({ x, y });
  }
  return cells;
}

// Space-time search: one firefly action per 150 ms tick (wait or one step). The firefly must not share
// a cell with the spider before or after the spider's step of that tick (9장 수용 14, 15).
// Returns the shortest action list that takes every dewdrop, plus the firefly cell after each tick.
function planClear(level) {
  const track = spiderTrack(level, Math.ceil(MAX_TICKS / 2) + 1);
  const cellOf = (x, y) => y * level.width + x;
  const dewBit = new Map(level.dewdrops.map((d, i) => [cellOf(d.x, d.y), i]));
  const full = (1 << level.dewdrops.length) - 1;
  const span = full + 1;
  const encode = (x, y, mask) => cellOf(x, y) * span + mask;

  const sameCell = (c, x, y) => c.x === x && c.y === y;
  const layers = [];
  let layer = new Map([[encode(level.start.x, level.start.y, 0), null]]);
  layers.push(layer);

  for (let k = 1; k <= MAX_TICKS; k++) {
    const before = track[Math.floor((k - 1) / 2)];
    const after = track[Math.floor(k / 2)];
    const next = new Map();
    for (const key of layer.keys()) {
      const mask = key % span;
      const cell = Math.floor(key / span);
      const x = cell % level.width;
      const y = Math.floor(cell / level.width);
      for (const name of MOVE_NAMES) {
        const [dx, dy] = DIRS[name];
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= level.width || ny >= level.height) continue;
        if (name !== 'wait' && level.blocked(nx, ny)) continue;
        if (sameCell(before, nx, ny) || sameCell(after, nx, ny)) continue;
        const bit = dewBit.get(cellOf(nx, ny));
        const nmask = bit === undefined ? mask : mask | (1 << bit);
        const nkey = encode(nx, ny, nmask);
        if (!next.has(nkey)) next.set(nkey, { prev: key, move: name });
      }
    }
    layers.push(next);
    const done = [...next.keys()].find((key) => key % span === full);
    if (done !== undefined) {
      const moves = [];
      const cells = [];
      let key = done;
      for (let i = k; i >= 1; i--) {
        const info = layers[i].get(key);
        moves.push(info.move);
        cells.push({ x: Math.floor(key / span) % level.width, y: Math.floor(Math.floor(key / span) / level.width) });
        key = info.prev;
      }
      return { moves: moves.reverse(), cells: cells.reverse() };
    }
    layer = next;
  }
  throw new Error('no clearing path within the time limit');
}

const plans = new Map();
function planFor(world) {
  if (!plans.has(world.levelIndex)) plans.set(world.levelIndex, planClear(world.level));
  return plans.get(world.levelIndex);
}

// Plays the planned actions from a fresh play world that started at startMs.
// One key press per 150 ms tick; the firefly must land on the planned cell after every tick.
// Returns the cleared world and the whole seconds left before the clear tick. The clear tick does not
// run the timer (clear beats the timer, O2), so the time left is the one from the tick before it.
function clearLevel(world, startMs) {
  const plan = planFor(world);
  let w = world;
  plan.moves.forEach((move, i) => {
    if (move !== 'wait') w = pressKey(w, move);
    w = advance(w, startMs + (i + 1) * MOVE_MS);
    if (move !== 'wait') w = releaseKey(w, move);
    assert.deepEqual({ x: w.player.x, y: w.player.y }, plan.cells[i], `firefly cell after tick ${i + 1}`);
    if (i < plan.moves.length - 1) assert.equal(w.phase, 'play', `still playing after tick ${i + 1}`);
  });
  assert.equal(w.phase, 'won', 'the planned path clears the level');
  assert.equal(w.collected, w.total, 'every dewdrop is taken');
  const secondsLeft = world.level.timeLimitS - Math.floor(((plan.moves.length - 1) * MOVE_MS) / 1000);
  assert.equal(w.timeLeft, secondsLeft, 'timer shows the whole seconds left before the clear tick');
  return { cleared: w, secondsLeft };
}

// Title -> level 1 -> clear -> ... -> level 3 clear -> Enter. Each level starts 100 s after the last.
function playAllLevels() {
  let w = enter(createTitle(levels), 0, levels);
  const scores = [];
  const seconds = [];
  let start = 0;
  for (let i = 0; i < levels.length; i++) {
    const { cleared, secondsLeft } = clearLevel(w, start);
    scores.push(scoreOf(cleared));
    seconds.push(secondsLeft);
    start += 100_000;
    w = enter(cleared, start, levels);
  }
  return { final: w, scores, seconds };
}

// ---- 9장 수용 32: the final screen after level 3 ------------------------------------------

test('32: clearing level 3 and pressing Enter shows the final screen with the total', () => {
  const { final, scores, seconds } = playAllLevels();
  assert.equal(final.phase, 'final');
  // 7장: the clear melody also plays when the final screen is entered, then the final save runs.
  assert.deepEqual(final.events, ['clear', 'final']);
  assert.equal(final.totalScore, scores[0] + scores[1] + scores[2]);
  assert.equal(scores[0], 8 * DEW_PTS + seconds[0] * SEC_PTS, 'level 1: 8 dewdrops');
  assert.equal(scores[1], 10 * DEW_PTS + seconds[1] * SEC_PTS, 'level 2: 10 dewdrops');
  assert.equal(scores[2], 12 * DEW_PTS + seconds[2] * SEC_PTS, 'level 3: 12 dewdrops');
});

// ---- 9장 수용 33: total = sum of the three level scores -------------------------------

test('33: the total equals the sum of the three level scores (8/10/12 dewdrops, remaining seconds)', () => {
  const { final, seconds } = playAllLevels();
  const expected = 8 * 100 + seconds[0] * 10 + (10 * 100 + seconds[1] * 10) + (12 * 100 + seconds[2] * 10);
  assert.equal(final.totalScore, expected);
  assert.equal(final.levelIndex, 2, 'the final screen stays on level 3');
});

test('33: a lost level scores 0 and the total does not change on loss or re-clear (no double count)', () => {
  const cleared1 = clearLevel(enter(createTitle(levels), 0, levels), 0);
  const score1 = scoreOf(cleared1.cleared);
  const l2 = enter(cleared1.cleared, 100_000, levels);
  assert.equal(l2.totalScore, score1);

  // Level 2 has 50 s; running out of time from its start loses the level.
  const lost = advance(l2, 100_000 + 50_000);
  assert.equal(lost.phase, 'lost');
  assert.equal(scoreOf(lost), 0, 'a failed level scores 0');
  assert.equal(lost.totalScore, score1, 'the total is unchanged by the loss');

  const again = enter(lost, 200_000, levels);
  assert.equal(again.totalScore, score1, 'restarting keeps the total');
  const cleared2 = clearLevel(again, 200_000);
  const l3 = enter(cleared2.cleared, 300_000, levels);
  assert.equal(l3.totalScore, score1 + scoreOf(cleared2.cleared), 'each level is added once');
});

// ---- 9장 수용 34: high score storage -------------------------------------------------

function fakeStore(initial = {}) {
  const data = { ...initial };
  const writes = [];
  return {
    data,
    writes,
    getItem: (k) => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null),
    setItem: (k, v) => {
      writes.push([k, v]);
      data[k] = v;
    },
  };
}

test('34: saveHighScore stores the total when no best is stored, under the exact key', () => {
  const store = fakeStore();
  saveHighScore(store, 1234);
  assert.equal(store.writes.length, 1, 'only one key is written');
  assert.equal(store.writes[0][0], 'dotgame-eunjin-highscore');
  assert.equal(HIGHSCORE_KEY, 'dotgame-eunjin-highscore');
  assert.equal(typeof store.data[HIGHSCORE_KEY], 'string');
  assert.match(store.data[HIGHSCORE_KEY], /^\d+$/, 'stored as a decimal integer string');
  assert.equal(store.data[HIGHSCORE_KEY], '1234');
  assert.equal(loadHighScore(store), 1234);
});

test('34: saveHighScore replaces the best when the total is greater', () => {
  const store = fakeStore({ 'dotgame-eunjin-highscore': '100' });
  saveHighScore(store, 2500);
  assert.equal(store.data['dotgame-eunjin-highscore'], '2500');
  assert.equal(loadHighScore(store), 2500);
});

test('34: saveHighScore keeps the larger stored best when the total is smaller', () => {
  const store = fakeStore({ 'dotgame-eunjin-highscore': '2500' });
  saveHighScore(store, 300);
  assert.equal(store.writes.length, 0, 'nothing is written');
  assert.equal(store.data['dotgame-eunjin-highscore'], '2500');
});

test('34: loadHighScore returns the stored integer, and null when nothing is stored', () => {
  assert.equal(loadHighScore(fakeStore({ 'dotgame-eunjin-highscore': '777' })), 777);
  assert.equal(loadHighScore(fakeStore()), null);
});

// ---- 9장 수용 35: sound events ---------------------------------------------------------

test('35: a dewdrop pickup reports dew; the clear reports clear; a loss reports fail', () => {
  // Firefly at (1,1) steps right onto the dewdrop at (2,1); one dewdrop is left, so the run goes on.
  let w = createWorld(parseLevel(['#######', '#Po.oS#', '#######'], 60), 0);
  w = advance(pressKey(w, 'right'), 0);
  assert.deepEqual(w.events, ['dew']);

  // Only dewdrop taken on the same tick: dew, then clear.
  const won = advance(pressKey(createWorld(parseLevel(['######', '#PoS.#', '######'], 60), 0), 'right'), 0);
  assert.equal(won.phase, 'won');
  assert.deepEqual(won.events, ['dew', 'clear']);

  // Spider walks onto the firefly: fail.
  let lost = createWorld(parseLevel(['#####', '#P.S#', '#####'], 60), 0);
  lost = advance(pressKey(lost, 'right'), 0); // (2,1)
  lost = releaseKey(lost, 'right');
  lost = advance(pressKey(lost, 'right'), 150); // (3,1): the spider stands here
  assert.equal(lost.phase, 'lost');
  assert.deepEqual(lost.events, ['fail']);
});

test('35: no sound event on the title screen; events do not carry over to the next call', () => {
  const title = createTitle(levels);
  assert.deepEqual(title.events, []);
  assert.equal(advance(title, 5000), title, 'no time passes on the title, so no sound');
  assert.equal(pressKey(title, 'right'), title);
  const started = enter(title, 0, levels);
  assert.deepEqual(started.events, []);
});

test('35: each sound has its own tones (dew 880 Hz; clear 523/659/784 Hz; fail 220 -> 110 Hz sawtooth)', () => {
  const oscs = [];
  const context = {
    currentTime: 0,
    destination: {},
    createGain: () => ({ gain: { value: 0 }, connect() {} }),
    createOscillator() {
      const o = {
        type: 'sine',
        frequency: {
          setValueAtTime(v) {
            o.from = v;
          },
          linearRampToValueAtTime(v) {
            o.to = v;
          },
        },
        connect() {},
        start() {},
        stop() {},
      };
      oscs.push(o);
      return o;
    },
  };
  const audio = createAudio(() => context);
  audio.unlock();

  audio.play('dew');
  assert.deepEqual(oscs.map((o) => [o.type, o.from, o.to]), [['square', 880, undefined]]);
  oscs.length = 0;

  audio.play('clear');
  assert.deepEqual(oscs.map((o) => [o.type, o.from]), [
    ['square', 523],
    ['square', 659],
    ['square', 784],
  ]);
  oscs.length = 0;

  audio.play('fail');
  assert.deepEqual(oscs.map((o) => [o.type, o.from, o.to]), [['sawtooth', 220, 110]]);
});

// ---- 9장 수용 36: final -> title -> new run --------------------------------------------

test('36: Enter on the final screen goes to the title with total 0; the next run starts from 0', () => {
  const { final } = playAllLevels();
  assert.equal(final.phase, 'final');
  assert.ok(final.totalScore > 0);

  const title = enter(final, 500_000, levels);
  assert.equal(title.phase, 'title');
  assert.equal(title.totalScore, 0);

  const run = enter(title, 600_000, levels);
  assert.equal(run.phase, 'play');
  assert.equal(run.levelIndex, 0);
  assert.equal(run.totalScore, 0, 'the total starts again at 0');
  assert.equal(run.collected, 0);
});

// ---- 9장 수용 37: sound and storage failures do not break the game ----------------------

// Runs fn with console output captured. Returns the captured calls.
function captureConsole(fn) {
  const saved = {};
  const calls = [];
  for (const name of ['log', 'info', 'warn', 'error', 'debug']) {
    saved[name] = console[name];
    console[name] = (...args) => calls.push([name, args]);
  }
  try {
    fn();
  } finally {
    Object.assign(console, saved);
  }
  return calls;
}

function playSounds(audio) {
  audio.unlock();
  audio.play('dew');
  audio.play('clear');
  audio.play('fail');
}

test('37: no audio context (throws, or null) -> no error and no console output', () => {
  const throwing = () => {
    throw new Error('AudioContext blocked');
  };
  const calls = captureConsole(() => {
    assert.doesNotThrow(() => playSounds(createAudio(throwing)));
    assert.doesNotThrow(() => playSounds(createAudio(() => null)));
    assert.doesNotThrow(() => playSounds(createAudio(() => undefined)));
  });
  assert.deepEqual(calls, []);
});

test('37: a context that fails at play time -> no error and no console output', () => {
  const broken = {
    currentTime: 0,
    destination: {},
    createOscillator() {
      throw new Error('oscillator unavailable');
    },
    createGain() {
      throw new Error('gain unavailable');
    },
  };
  const calls = captureConsole(() => {
    assert.doesNotThrow(() => playSounds(createAudio(() => broken)));
  });
  assert.deepEqual(calls, []);
});

test('37: unreadable or unwritable storage -> loadHighScore is null and saveHighScore does not throw', () => {
  const unreadable = {
    getItem() {
      throw new Error('storage blocked');
    },
    setItem() {
      throw new Error('storage blocked');
    },
  };
  const calls = captureConsole(() => {
    assert.equal(loadHighScore(unreadable), null);
    assert.doesNotThrow(() => saveHighScore(unreadable, 500));
  });
  assert.deepEqual(calls, []);
});

test('37: storage that can read but not write -> saving does not throw', () => {
  const readOnly = {
    getItem: () => null,
    setItem() {
      throw new Error('quota exceeded');
    },
  };
  assert.doesNotThrow(() => saveHighScore(readOnly, 500));
});
