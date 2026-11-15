// Drawing only. Reads world and level data, palette, sprites, and strings; never changes game state.
import {
  PALETTE,
  FIREFLY_SPRITE,
  DEWDROP_SPRITE,
  SPIDER_SPRITE,
  SPRITE_SCALE,
  TILE_PX,
} from './sprites.js';
import { STRINGS } from './strings.js';

export function drawLevel(ctx, level) {
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const ch = level.rows[y][x];
      ctx.fillStyle = ch === '#' ? PALETTE[1] : PALETTE[0];
      ctx.fillRect(x * TILE_PX, y * TILE_PX, TILE_PX, TILE_PX);
    }
  }
}

function drawSprite(ctx, sprite, cellX, cellY) {
  for (let py = 0; py < sprite.length; py++) {
    const row = sprite[py];
    for (let px = 0; px < row.length; px++) {
      const ch = row[px];
      if (ch === '.') continue;
      ctx.fillStyle = PALETTE[Number(ch)];
      ctx.fillRect(
        cellX * TILE_PX + px * SPRITE_SCALE,
        cellY * TILE_PX + py * SPRITE_SCALE,
        SPRITE_SCALE,
        SPRITE_SCALE,
      );
    }
  }
}

export function drawFirefly(ctx, state) {
  drawSprite(ctx, FIREFLY_SPRITE, state.x, state.y);
}

export function drawDewdrops(ctx, dewdrops) {
  for (const d of dewdrops) drawSprite(ctx, DEWDROP_SPRITE, d.x, d.y);
}

export function drawSpider(ctx, spider) {
  drawSprite(ctx, SPIDER_SPRITE, spider.x, spider.y);
}

// HUD sits on the top wall row (0 to 32 px). The bar uses the wall colour so the row still reads
// as wall (5장). Text is 16 px system monospace (확정 O5).
export function drawHud(ctx, world) {
  ctx.fillStyle = PALETTE[1];
  ctx.fillRect(0, 0, world.level.width * TILE_PX, TILE_PX);
  ctx.font = '16px monospace';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = PALETTE[4];
  ctx.textAlign = 'left';
  ctx.fillText(STRINGS.hudDew(world.collected, world.total), 8, 22);
  ctx.textAlign = 'right';
  ctx.fillText(STRINGS.hudTime(world.timeLeft), 504, 22);
  ctx.textAlign = 'left';
}

// Draws one play frame in the order: level, dewdrops, spider, firefly, HUD.
export function drawWorld(ctx, world) {
  drawLevel(ctx, world.level);
  drawDewdrops(ctx, world.dewdrops);
  drawSpider(ctx, world.spider);
  drawFirefly(ctx, world.player);
  drawHud(ctx, world);
}
