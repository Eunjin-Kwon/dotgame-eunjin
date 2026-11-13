// Minimal wiring test for src/main.js. window, document, canvas, requestAnimationFrame,
// and performance are fakes. Expected values come from GAME_DESIGN.md 2장 (150 ms hold, keys)
// and 5장 (P at (2,10)). Each node --test file runs in its own process, so the globals stay local.
import { test } from 'node:test';
import assert from 'node:assert/strict';

let now = 0;
const listeners = {};
const fillRects = [];
let frameCallback = null;

const ctx = {
  fillStyle: '',
  clearRect() {},
  fillRect(x, y, w, h) {
    fillRects.push({ x, y, w, h });
  },
};
const canvas = { width: 512, height: 384, getContext: () => ctx };

globalThis.window = {
  addEventListener: (type, fn) => {
    listeners[type] = fn;
  },
};
globalThis.document = {
  title: '',
  body: { style: {} },
  getElementById: () => canvas,
};
globalThis.requestAnimationFrame = (cb) => {
  frameCallback = cb;
};
Object.defineProperty(globalThis, 'performance', {
  value: { now: () => now },
  configurable: true,
  writable: true,
});

// Importing main.js runs its top-level wiring once.
await import('../src/main.js');

// The firefly sprite's first non-transparent pixel is row 1, column 1 (4 px scale).
// Level tiles are 32 px and are drawn as 32x32 rects, so 4x4 rects are firefly pixels.
function runFrame(t) {
  fillRects.length = 0;
  now = t;
  frameCallback(t);
  const rect = fillRects.find((r) => r.w === 4);
  return { x: (rect.x - 4) / 32, y: (rect.y - 4) / 32 };
}

test('startup: title and background come from strings.js and the palette, firefly starts at P (2,10)', () => {
  assert.equal(document.title, '반딧불이 이슬 모으기');
  assert.equal(document.body.style.background, '#1E2B24');
  assert.deepEqual(runFrame(0), { x: 2, y: 10 });
});

test('keydown moves one cell at once; a held key moves again after 150 ms', () => {
  now = 1000;
  listeners.keydown({ key: 'ArrowRight', repeat: false, preventDefault() {} });
  assert.deepEqual(runFrame(1000), { x: 3, y: 10 }, 'immediate move on keydown');
  assert.deepEqual(runFrame(1150), { x: 4, y: 10 }, 'held key moves at 150 ms');
});

test('keyup stops the held move', () => {
  listeners.keyup({ key: 'ArrowRight' });
  assert.deepEqual(runFrame(1400), { x: 4, y: 10 });
});

test('a non-arrow key does nothing', () => {
  listeners.keydown({ key: 'Enter', repeat: false, preventDefault() {} });
  assert.deepEqual(runFrame(1600), { x: 4, y: 10 });
});

test('blur clears held keys, so no move continues after focus is lost', () => {
  now = 2000;
  listeners.keydown({ key: 'ArrowLeft', repeat: false, preventDefault() {} });
  assert.deepEqual(runFrame(2000), { x: 3, y: 10 });
  listeners.blur();
  assert.deepEqual(runFrame(2300), { x: 3, y: 10 }, 'no held move after blur');
});

// GAME_DESIGN.md 2장 '잠금 중에 누른 키': 잠금 중에 누른 키를 계속 누르고 있으면 잠금이 풀리는 즈시 그 방향으로 이동한다.
// (3,10) -> right -> (4,10); up pressed during the 150 ms lock; at unlock (4,10) -> up -> (4,9).
// Row 9 is '#.##......##..##', so (4,9) is floor.
test('a key pressed during the lock moves at unlock if still held; releasing it stops the move', () => {
  now = 3000;
  listeners.keydown({ key: 'ArrowRight', repeat: false, preventDefault() {} });
  assert.deepEqual(runFrame(3000), { x: 4, y: 10 }, 'right moves at once');
  now = 3050;
  listeners.keydown({ key: 'ArrowUp', repeat: false, preventDefault() {} });
  assert.deepEqual(runFrame(3050), { x: 4, y: 10 }, 'up pressed during the lock does not move yet');
  assert.deepEqual(runFrame(3150), { x: 4, y: 9 }, 'at unlock the held up key moves');
  listeners.keyup({ key: 'ArrowUp' });
  listeners.keyup({ key: 'ArrowRight' });
  assert.deepEqual(runFrame(3400), { x: 4, y: 9 }, 'nothing held: no further move');
});
