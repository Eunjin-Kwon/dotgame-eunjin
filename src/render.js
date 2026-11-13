// Drawing only. Reads level rows, palette, and sprites; never changes game state.
import { PALETTE, FIREFLY_SPRITE, SPRITE_SCALE } from './sprites.js';

const TILE_PX = 32; // GAME_DESIGN.md 2장

export function drawLevel(ctx, level) {
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const ch = level.rows[y][x];
      ctx.fillStyle = ch === '#' ? PALETTE[1] : PALETTE[0];
      ctx.fillRect(x * TILE_PX, y * TILE_PX, TILE_PX, TILE_PX);
    }
  }
}

export function drawFirefly(ctx, state) {
  for (let py = 0; py < FIREFLY_SPRITE.length; py++) {
    const row = FIREFLY_SPRITE[py];
    for (let px = 0; px < row.length; px++) {
      const ch = row[px];
      if (ch === '.') continue;
      ctx.fillStyle = PALETTE[Number(ch)];
      ctx.fillRect(
        state.x * TILE_PX + px * SPRITE_SCALE,
        state.y * TILE_PX + py * SPRITE_SCALE,
        SPRITE_SCALE,
        SPRITE_SCALE,
      );
    }
  }
}
