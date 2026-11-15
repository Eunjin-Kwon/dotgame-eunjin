// Expected values come from GAME_DESIGN.md sections 5 and 6.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LEVELS, LEVEL_1_ROWS, parseLevel } from '../src/levels.js';
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

// 5장 문자 규칙 (R2): o는 이슬방울, S는 거미 시작. 둘 다 바닥 칸이다.
test('o and S are accepted as floor cells; a level without S is rejected', () => {
  assert.throws(() => parseLevel(['###', '#P#', '###']), /no spider cell/);
  const ok = parseLevel(['#####', '#PoS#', '#####']);
  assert.equal(ok.blocked(2, 1), false, 'dewdrop cell is floor');
  assert.equal(ok.blocked(3, 1), false, 'spider cell is floor');
});

// 9장 수용 9: the level 1 map has 8 dewdrops, each on a floor cell (counted from the map characters)
test('level 1 has 8 dewdrops, each on a floor cell, and one spider start', () => {
  assert.equal(level.dewdrops.length, 8);
  for (const d of level.dewdrops) {
    assert.equal(level.blocked(d.x, d.y), false, `dewdrop at ${d.x},${d.y}`);
    assert.equal(LEVEL_1_ROWS[d.y][d.x], 'o');
  }
  assert.equal(LEVEL_1_ROWS[level.spider.y][level.spider.x], 'S');
  assert.equal(level.blocked(level.spider.x, level.spider.y), false);
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

// 5장 레벨별 값 표 (확정): 제한 시간 60/50/45초, 이슬방울 8/10/12개, 거미 1마리.
// 시작 P와 거미 S 좌표는 5장 맵 그림에서 읽은 값이다.
const DESIGN = readFileSync(new URL('../GAME_DESIGN.md', import.meta.url), 'utf8');
const LEVEL_TABLE = [
  { heading: '### 레벨 1', timeLimitS: 60, dewdrops: 8 },
  { heading: '### 레벨 2', timeLimitS: 50, dewdrops: 10, start: { x: 4, y: 10 }, spider: { x: 7, y: 6 } },
  { heading: '### 레벨 3', timeLimitS: 45, dewdrops: 12, start: { x: 2, y: 10 }, spider: { x: 5, y: 3 } },
];

// The 5장 code block under a level heading, read from GAME_DESIGN.md (not copied from src).
function designMap(heading) {
  const section = DESIGN.slice(DESIGN.indexOf(heading));
  return section.match(/```\n([\s\S]*?)```/)[1].split('\n').filter((line) => line.length > 0);
}

test('LEVELS holds the 5장 time limits 60/50/45 and dewdrop counts 8/10/12', () => {
  const parsed = LEVELS.map((e) => parseLevel(e.rows, e.timeLimitS));
  assert.deepEqual(parsed.map((l) => l.timeLimitS), [60, 50, 45]);
  assert.deepEqual(parsed.map((l) => l.dewdrops.length), [8, 10, 12]);
});

for (const index of [1, 2]) {
  const spec = LEVEL_TABLE[index];
  test(`level ${index + 1}: 5장 map, 16 x 12 tiles, ${spec.dewdrops} dewdrops, one P and one S, ${spec.timeLimitS} s (5장)`, () => {
    const block = designMap(spec.heading);
    assert.equal(block.length, 12);
    assert.deepEqual(LEVELS[index].rows, block);

    const text = block.join('');
    assert.equal(text.split('P').length - 1, 1, 'one P');
    assert.equal(text.split('S').length - 1, 1, 'one S');
    assert.equal(text.split('o').length - 1, spec.dewdrops, 'dewdrops in the design map');

    const parsed = parseLevel(LEVELS[index].rows, LEVELS[index].timeLimitS);
    assert.equal(parsed.width, 16);
    assert.equal(parsed.height, 12);
    assert.equal(parsed.timeLimitS, spec.timeLimitS);
    assert.equal(parsed.dewdrops.length, spec.dewdrops);
    assert.deepEqual(parsed.start, spec.start);
    assert.deepEqual(parsed.spider, spec.spider);
    for (let x = 0; x < parsed.width; x++) {
      assert.equal(parsed.blocked(x, 0), true, `top ${x}`);
      assert.equal(parsed.blocked(x, parsed.height - 1), true, `bottom ${x}`);
    }
    for (let y = 0; y < parsed.height; y++) {
      assert.equal(parsed.blocked(0, y), true, `left ${y}`);
      assert.equal(parsed.blocked(parsed.width - 1, y), true, `right ${y}`);
    }
  });
}
