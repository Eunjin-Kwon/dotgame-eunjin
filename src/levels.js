// Level data. Copied from GAME_DESIGN.md section 5 (no coordinates written by hand).
// Characters: '#' wall, '.' floor, 'P' firefly start, 'o' dewdrop (floor), 'S' spider start (floor).

export const LEVEL_1_ROWS = [
  '################',
  '#............o.#',
  '#..##..........#',
  '#o......#......#',
  '#............o.#',
  '#...##.o.......#',
  '#............S.#',
  '#.........#....#',
  '#o.........o...#',
  '#.##....o.##..##',
  '#.P..........o.#',
  '################',
];

const LEVEL_CHARS = new Set(['#', '.', 'P', 'o', 'S']);

// Turns rows of level characters into the grid shape used by src/logic.js.
export function parseLevel(rows) {
  if (rows.length === 0) throw new Error('empty level');
  const height = rows.length;
  const width = rows[0].length;
  let start = null;
  let spider = null;
  const dewdrops = [];
  for (let y = 0; y < height; y++) {
    if (rows[y].length !== width) throw new Error(`row ${y} width mismatch`);
    for (let x = 0; x < width; x++) {
      const ch = rows[y][x];
      if (!LEVEL_CHARS.has(ch)) throw new Error(`unknown level char '${ch}' at ${x},${y}`);
      if (ch === 'P') {
        if (start) throw new Error('more than one start cell');
        start = { x, y };
      } else if (ch === 'S') {
        if (spider) throw new Error('more than one spider cell');
        spider = { x, y };
      } else if (ch === 'o') {
        dewdrops.push({ x, y });
      }
    }
  }
  if (!start) throw new Error('no start cell');
  if (!spider) throw new Error('no spider cell');
  return {
    width,
    height,
    start,
    spider,
    dewdrops,
    rows,
    blocked: (x, y) => rows[y][x] === '#',
  };
}
