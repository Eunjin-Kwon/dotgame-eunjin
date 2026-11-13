// Entry point: input loop and frame loop. Game rules live in logic.js.
import { requestMove } from './logic.js';
import { LEVEL_1_ROWS, parseLevel } from './levels.js';
import { drawLevel, drawFirefly } from './render.js';

const KEY_TO_DIR = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

const level = parseLevel(LEVEL_1_ROWS);
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let state = { x: level.start.x, y: level.start.y, lockedUntil: 0 };

// Held arrow keys in press order. The last pressed key wins (GAME_DESIGN.md 2장, 동시 입력).
const held = [];

window.addEventListener('keydown', (e) => {
  const dir = KEY_TO_DIR[e.key];
  if (!dir) return;
  e.preventDefault();
  if (e.repeat) return;
  const i = held.indexOf(dir);
  if (i !== -1) held.splice(i, 1);
  held.push(dir);
  // A press is judged at keydown so a tap released within one frame still moves once (2장).
  state = requestMove(state, dir, performance.now(), level);
});

window.addEventListener('keyup', (e) => {
  const dir = KEY_TO_DIR[e.key];
  if (!dir) return;
  const i = held.indexOf(dir);
  if (i !== -1) held.splice(i, 1);
});

window.addEventListener('blur', () => {
  held.length = 0;
});

function frame(nowMs) {
  const dir = held[held.length - 1];
  if (dir) state = requestMove(state, dir, nowMs, level);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLevel(ctx, level);
  drawFirefly(ctx, state);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
