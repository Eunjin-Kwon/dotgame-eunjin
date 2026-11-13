// Expected values come from GAME_DESIGN.md sections 5 and 6.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LEVEL_1_ROWS, parseLevel } from '../src/levels.js';
import { PALETTE, FIREFLY_SPRITE, SPRITE_SCALE, TILE_PX } from '../src/sprites.js';

const level = parseLevel(LEVEL_1_ROWS);

// 5장 문자 규칙: #, ., P 외의 문자는 맵 오류다
test('a character outside # . P is rejected, not treated as floor', () => {
  assert.throws(() => parseLevel(['###', '#x#', '#P#']), /unknown level char 'x' at 1,1/);
  assert.throws(() => parseLevel(['###', '# #', '#P#']), /unknown level char ' '/);
});

// GAME_DESIGN.md 5장 '레벨 1' 코드 블록을 직접 읽어 글자 단위로 비교한다 (숫자를 복사하지 않는다)
test('level 1 rows match the 5장 code block character for character', () => {
  const design = readFileSync(new URL('../GAME_DESIGN.md', import.meta.url), 'utf8');
  const section = design.slice(design.indexOf('### 레벨 1'));
  const block = section.match(/```\n([\s\S]*?)```/)[1].split('\n').filter((line) => line.length > 0);
  assert.equal(block.length, 12);
  assert.deepEqual(LEVEL_1_ROWS, block);
});

test('an empty level is rejected', () => {
  assert.throws(() => parseLevel([]), /empty level/);
});

test('level 1 is 16 x 12 tiles (5장, 2장 화면 512x384 / 32 px)', () => {
  assert.equal(level.width, 16);
  assert.equal(level.height, 12);
});

test('level 1 border is all walls (5장: 가장자리는 벽)', () => {
  for (let x = 0; x < level.width; x++) {
    assert.equal(level.blocked(x, 0), true, `top ${x}`);
    assert.equal(level.blocked(x, level.height - 1), true, `bottom ${x}`);
  }
  for (let y = 0; y < level.height; y++) {
    assert.equal(level.blocked(0, y), true, `left ${y}`);
    assert.equal(level.blocked(level.width - 1, y), true, `right ${y}`);
  }
});

test('level 1 has 11 interior walls (5장)', () => {
  let count = 0;
  for (let y = 1; y < level.height - 1; y++) {
    for (let x = 1; x < level.width - 1; x++) {
      if (level.blocked(x, y)) count++;
    }
  }
  assert.equal(count, 11);
});

test('level 1 has exactly one start P on a floor cell at (2, 10) (5장)', () => {
  assert.deepEqual(level.start, { x: 2, y: 10 });
  assert.equal(level.blocked(level.start.x, level.start.y), false);
});

test('palette is the 8 hex values of 6장 in order', () => {
  assert.deepEqual(PALETTE, [
    '#1E2B24',
    '#4A5A4C',
    '#FFE66D',
    '#3A2A1A',
    '#F2F7EE',
    '#7FD8FF',
    '#8B3A62',
    '#C9B7FF',
  ]);
});

test('firefly sprite is 8 px square, scaled to one 32 px tile (2장, 4장)', () => {
  assert.equal(FIREFLY_SPRITE.length, 8);
  for (const row of FIREFLY_SPRITE) assert.equal(row.length, 8);
  assert.equal(TILE_PX, 32);
  assert.equal(FIREFLY_SPRITE.length * SPRITE_SCALE, TILE_PX);
});

test('firefly sprite uses only R1 palette indices 2-4 (6장 반딧불이 색)', () => {
  for (const row of FIREFLY_SPRITE) {
    for (const ch of row) {
      if (ch === '.') continue;
      assert.ok(['2', '3', '4'].includes(ch), ch);
    }
  }
});
