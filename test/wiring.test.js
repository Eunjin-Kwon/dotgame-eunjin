// Minimal wiring test for src/main.js. window, document, canvas, requestAnimationFrame,
// and performance are fakes. Expected values come from GAME_DESIGN.md 2장 (150 ms hold, keys),
// 3장 (title -> Enter -> play), and 5장 (P at (2,10)).
//
// Each test boots a fresh main.js instance (a new module URL gives new module state) with fresh
// fakes, so every test runs alone and in any order.
import { test } from 'node:test';
import assert from 'node:assert/strict';

let bootCount = 0;

async function boot() {
  const listeners = {};
  const fillRects = [];
  const texts = [];
  const app = { now: 0, listeners, fillRects, texts, frameCallback: null, document: null };
  const ctx = {
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
    clearRect() {},
    fillRect(x, y, w, h) {
      fillRects.push({ x, y, w, h, color: this.fillStyle });
    },
    fillText(text) {
      texts.push(text);
    },
  };
  const canvas = { width: 512, height: 384, getContext: () => ctx };
  app.document = { title: '', body: { style: {} }, getElementById: () => canvas };

  globalThis.window = {
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
  };
  globalThis.document = app.document;
  globalThis.requestAnimationFrame = (cb) => {
    app.frameCallback = cb;
  };
  Object.defineProperty(globalThis, 'performance', {
    value: { now: () => app.now },
    configurable: true,
    writable: true,
  });

  bootCount += 1;
  await import(`../src/main.js?boot=${bootCount}`);
  return app;
}

// Runs one animation frame at time t and returns the firefly cell, or null on the title screen.
// The firefly's first non-transparent pixel is row 1, column 1 of an 8x8 sprite at 4 px scale,
// so the first 4x4 rect is at (cell.x * 32 + 4, cell.y * 32 + 4). Only the firefly uses the
// yellow glow (palette 2), so dewdrops and the spider are never mistaken for it.
function frame(app, t) {
  app.fillRects.length = 0;
  app.texts.length = 0;
  app.now = t;
  app.frameCallback(t);
  const rect = app.fillRects.find((r) => r.w === 4 && r.color === '#FFE66D');
  if (!rect) return null;
  return { x: (rect.x - 4) / 32, y: (rect.y - 4) / 32 };
}

function keyDown(app, t, key) {
  app.now = t;
  app.listeners.keydown({ key, repeat: false, preventDefault() {} });
}

function keyUp(app, key) {
  app.listeners.keyup({ key });
}

// Opens the game at t=0 and presses Enter to start play at t=0.
async function startPlay(app) {
  frame(app, 0);
  keyDown(app, 0, 'Enter');
  frame(app, 0);
}

test('startup: title and background come from strings.js and the palette; no firefly on title', async () => {
  const app = await boot();
  assert.equal(app.document.title, '반딧불이 이슬 모으기');
  assert.equal(app.document.body.style.background, '#1E2B24');
  assert.equal(frame(app, 0), null, 'title shows no firefly (O8)');
  assert.ok(app.texts.includes('Enter 키로 시작'), 'title shows the start prompt');
});

test('Enter starts play at P (2,10); arrows do nothing on the title screen', async () => {
  const app = await boot();
  frame(app, 0);
  keyDown(app, 100, 'ArrowRight');
  assert.equal(frame(app, 100), null, 'arrow on title is ignored');
  keyDown(app, 200, 'Enter');
  assert.deepEqual(frame(app, 200), { x: 2, y: 10 });
});

test('keydown moves one cell at once; a held key moves again after 150 ms', async () => {
  const app = await boot();
  await startPlay(app);
  keyDown(app, 1000, 'ArrowRight');
  assert.deepEqual(frame(app, 1000), { x: 3, y: 10 }, 'immediate move on keydown');
  assert.deepEqual(frame(app, 1150), { x: 4, y: 10 }, 'held key moves at 150 ms');
});

test('keyup stops the held move', async () => {
  const app = await boot();
  await startPlay(app);
  keyDown(app, 1000, 'ArrowRight');
  frame(app, 1000);
  assert.deepEqual(frame(app, 1150), { x: 4, y: 10 });
  keyUp(app, 'ArrowRight');
  assert.deepEqual(frame(app, 1400), { x: 4, y: 10 });
});

test('a non-arrow, non-Enter key does nothing during play', async () => {
  const app = await boot();
  await startPlay(app);
  keyDown(app, 1600, 'a');
  assert.deepEqual(frame(app, 1600), { x: 2, y: 10 });
});

test('blur clears held keys, so no move continues after focus is lost', async () => {
  const app = await boot();
  await startPlay(app);
  keyDown(app, 2000, 'ArrowRight');
  assert.deepEqual(frame(app, 2000), { x: 3, y: 10 });
  app.listeners.blur();
  // Without the blur, Right would still be held and move to (4,10) at 2150 ms.
  assert.deepEqual(frame(app, 2150), { x: 3, y: 10 }, 'no held move after blur');
});

// GAME_DESIGN.md 2장 '잠금 중에 누른 키': 잠금 중에 누른 키를 계속 누르고 있으면 잠금이 풀리는 즉시 그 방향으로 이동한다.
// (2,10) -> left -> (1,10) at 3000 (locks until 3150); up pressed at 3050 during the lock;
// at unlock (1,10) -> up -> (1,9). Row 9 is '#.##....o.##..##' at x=1 floor, so (1,9) is floor.
test('a key pressed during the lock moves at unlock if still held; releasing it stops the move', async () => {
  const app = await boot();
  await startPlay(app);
  keyDown(app, 3000, 'ArrowLeft');
  assert.deepEqual(frame(app, 3000), { x: 1, y: 10 }, 'left moves at once');
  keyDown(app, 3050, 'ArrowUp');
  assert.deepEqual(frame(app, 3050), { x: 1, y: 10 }, 'up pressed during the lock does not move yet');
  assert.deepEqual(frame(app, 3150), { x: 1, y: 9 }, 'at unlock the held up key moves');
  keyUp(app, 'ArrowUp');
  keyUp(app, 'ArrowLeft');
  assert.deepEqual(frame(app, 3400), { x: 1, y: 9 }, 'nothing held: no further move');
});
