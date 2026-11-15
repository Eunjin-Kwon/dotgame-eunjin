// Entry point: input dispatch and frame loop. Game rules live in logic.js.
import { advance, createTitle, enter, pressKey, releaseKey, clearKeys, scoreOf } from './logic.js';
import { LEVELS, parseLevel } from './levels.js';
import { drawWorld } from './render.js';
import { PALETTE } from './sprites.js';
import { STRINGS } from './strings.js';

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

// The game opens on the title screen. Timers start only when Enter starts play.
let world = createTitle(parsed);
// Frame clock of the last animation frame. Key events use it so every timer stays on one clock.
let lastNow = 0;

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (!e.repeat) world = enter(world, lastNow, parsed);
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
  world = advance(world, nowMs);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld(ctx, world, canvas, scoreOf(world));
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
