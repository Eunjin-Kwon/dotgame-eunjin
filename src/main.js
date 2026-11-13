// Entry point: input loop and frame loop. Game rules live in logic.js.
import { requestMove, pressDirection, releaseDirection, activeDirection } from './logic.js';
import { LEVEL_1_ROWS, parseLevel } from './levels.js';
import { drawLevel, drawFirefly } from './render.js';
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

const level = parseLevel(LEVEL_1_ROWS);
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let state = { x: level.start.x, y: level.start.y, lockedUntil: 0 };

// Held arrow keys in press order (rules in logic.js: last pressed wins).
let held = [];

window.addEventListener('keydown', (e) => {
  const dir = KEY_TO_DIR[e.key];
  if (!dir) return;
  e.preventDefault();
  if (e.repeat) return;
  held = pressDirection(held, dir);
  // A press is judged at keydown so a tap released within one frame still moves once (2장).
  state = requestMove(state, dir, performance.now(), level);
});

window.addEventListener('keyup', (e) => {
  const dir = KEY_TO_DIR[e.key];
  if (!dir) return;
  held = releaseDirection(held, dir);
});

window.addEventListener('blur', () => {
  held = [];
});

function frame(nowMs) {
  const dir = activeDirection(held);
  if (dir) state = requestMove(state, dir, nowMs, level);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLevel(ctx, level);
  drawFirefly(ctx, state);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
