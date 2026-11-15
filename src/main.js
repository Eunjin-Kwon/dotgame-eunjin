// Entry point: input dispatch and frame loop. Game rules live in logic.js.
import { advance, createTitle, enter, pressKey, releaseKey, clearKeys, scoreOf } from './logic.js';
import { LEVELS, parseLevel } from './levels.js';
import { drawWorld } from './render.js';
import { PALETTE } from './sprites.js';
import { STRINGS } from './strings.js';
import { loadHighScore, saveHighScore } from './storage.js';
import { createAudio } from './audio.js';

const KEY_TO_DIR = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

document.title = STRINGS.gameTitle;
document.body.style.background = PALETTE[0];

const parsed = LEVELS.map((e) => parseLevel(e.rows, e.timeLimitS));
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Storage may be blocked (private mode, disabled cookies): fall back to a store that keeps nothing.
let store;
try {
  store = window.localStorage;
} catch {
  store = null;
}
if (!store) store = { getItem: () => null, setItem: () => {} };

// Best total from earlier runs; null when none is stored.
let best = loadHighScore(store);

const audio = createAudio(() => {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  return Ctor ? new Ctor() : null;
});
let unlocked = false;

// The game opens on the title screen. Timers start only when Enter starts play.
let world = createTitle(parsed);
// Frame clock of the last animation frame. Key events use it so every timer stays on one clock.
let lastNow = 0;

// Plays the sounds and saves the score for events from one advance() or enter() call.
// Callers pass only results that are a new world; a returned-unchanged world has stale events.
function consumeEvents(next) {
  for (const ev of next.events) {
    if (ev === 'final') {
      saveHighScore(store, next.totalScore);
      best = loadHighScore(store);
    } else {
      audio.play(ev);
    }
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (!unlocked) {
      unlocked = true;
      audio.unlock();
    }
    if (!e.repeat) {
      const next = enter(world, lastNow, parsed);
      if (next !== world) {
        world = next;
        consumeEvents(world);
      }
    }
    return;
  }
  const dir = KEY_TO_DIR[e.key];
  if (!dir) return;
  e.preventDefault();
  if (e.repeat) return;
  world = pressKey(world, dir);
});

window.addEventListener('keyup', (e) => {
  const dir = KEY_TO_DIR[e.key];
  if (!dir) return;
  world = releaseKey(world, dir);
});

window.addEventListener('blur', () => {
  world = clearKeys(world);
});

function frame(nowMs) {
  lastNow = nowMs;
  const next = advance(world, nowMs);
  if (next !== world) {
    world = next;
    consumeEvents(world);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld(ctx, world, canvas, scoreOf(world), best);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
