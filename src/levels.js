// Level data. Copied from GAME_DESIGN.md section 5 (no coordinates written by hand).
// Characters: '#' wall, '.' floor, 'P' firefly start (floor cell).

export const LEVEL_1_ROWS = [
  '################',
  '#..............#',
  '#..##..........#',
  '#.......#......#',
  '#..............#',
  '#...##.........#',
  '#..............#',
  '#.........#....#',
  '#..............#',
  '#.##......##..##',
  '#.P............#',
  '################',
];

// Turns rows of level characters into the grid shape used by src/logic.js.
export function parseLevel(rows) {
  const height = rows.length;
  const width = rows[0].length;
  let start = null;
  for (let y = 0; y < height; y++) {
    if (rows[y].length !== width) throw new Error(`row ${y} width mismatch`);
    for (let x = 0; x < width; x++) {
      if (rows[y][x] === 'P') {
        if (start) throw new Error('more than one start cell');
        start = { x, y };
      }
    }
  }
  if (!start) throw new Error('no start cell');
  return {
    width,
    height,
    start,
    rows,
    blocked: (x, y) => rows[y][x] === '#',
  };
}
