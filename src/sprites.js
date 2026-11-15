// Palette and sprites. Colors from GAME_DESIGN.md section 6 (order = palette index).
// Indices 5-7 are reserved for R2 (dewdrop, spider) and are not used in R1.
// Sprite pixels are palette indices; '.' is transparent. One sprite pixel = 4 canvas px.

export const PALETTE = [
  '#1E2B24', // 0 floor
  '#4A5A4C', // 1 wall
  '#FFE66D', // 2 firefly glow
  '#3A2A1A', // 3 firefly body
  '#F2F7EE', // 4 firefly highlight
  '#7FD8FF', // 5 dewdrop (R2)
  '#8B3A62', // 6 spider body (R2)
  '#C9B7FF', // 7 spider legs and shadow (R2)
];

export const TILE_PX = 32; // GAME_DESIGN.md 2장: 타일 32 px
export const SPRITE_SCALE = TILE_PX / 8; // 8 sprite px x 4 = one tile

export const FIREFLY_SPRITE = [
  '........',
  '.2.22.2.',
  '..2442..',
  '.224432.',
  '.224432.',
  '..3443..',
  '..3..3..',
  '........',
];

// Dewdrop (palette 5) and spider (palette 6 body, 7 legs and shadow). 8x8, scaled to one tile.
export const DEWDROP_SPRITE = [
  '........',
  '........',
  '...5....',
  '..555...',
  '..555...',
  '...5....',
  '........',
  '........',
];

export const SPIDER_SPRITE = [
  '.7.66.7.',
  '7.6666.7',
  '..6666..',
  '.666666.',
  '.666666.',
  '..6666..',
  '7.6..6.7',
  '7......7',
];
