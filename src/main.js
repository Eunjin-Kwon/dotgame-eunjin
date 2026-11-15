// Entry point: input dispatch and frame loop. Game rules live in logic.js.
import { advance, createWorld, pressKey, releaseKey, clearKeys } from './logic.js';
import { LEVEL_1_ROWS, parseLevel } from './levels.js';
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

const level = parseLevel(LEVEL_1_ROWS);
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// The world is created on the first frame, so every timer uses the frame clock only.
let world = null;

window.addEventListener('keydown', (e) => {
  const dir = KEY_TO_DIR[e.key];
  if (!dir) return;
  e.preventDefault();
  if (e.repeat || !world) return;
  world = pressKey(world, dir);
});

window.addEventListener('keyup', (e) => {
  const dir = KEY_TO_DIR[e.key];
  if (!dir || !world) return;
  world = releaseKey(world, dir);
});

window.addEventListener('blur', () => {
  if (world) world = clearKeys(world);
});

function frame(nowMs) {
  if (!world) world = createWorld(level, nowMs);
  world = advance(world, nowMs);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld(ctx, world);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
