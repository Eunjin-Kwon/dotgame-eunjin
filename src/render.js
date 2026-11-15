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
  ctx.textAlign = 'center';
  ctx.fillText(STRINGS.hudLevel(world.levelIndex + 1), 256, 22);
  ctx.textAlign = 'left';
}

// Text uses one typeface everywhere (9장 26): the system monospace family, sizes vary only.
function drawCentered(ctx, lines) {
  ctx.font = 'monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = PALETTE[4];
  for (const [text, size, y] of lines) {
    ctx.font = `${size}px monospace`;
    ctx.fillText(text, 256, y);
  }
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

// Title shows the name and the start prompt, plus the saved high score when there is one (O8).
export function drawTitle(ctx, canvas, best) {
  ctx.fillStyle = PALETTE[0];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const lines = [
    [STRINGS.gameTitle, 28, 160],
    [STRINGS.titleStart, 16, 230],
  ];
  if (best !== null) lines.splice(1, 0, [STRINGS.highScore(best), 16, 200]);
  drawCentered(ctx, lines);
}

// Final screen: total of all three levels, the saved high score when there is one, and the title prompt.
export function drawFinal(ctx, canvas, world, best) {
  ctx.fillStyle = PALETTE[0];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const lines = [
    [STRINGS.finalTitle, 28, 160],
    [STRINGS.finalTotal(world.totalScore), 18, 210],
  ];
  if (best !== null) lines.push([STRINGS.highScore(best), 16, 250]);
  lines.push([STRINGS.clearBack, 16, 290]);
  drawCentered(ctx, lines);
}

// Clear and fail screens: a dark panel with the result text.
export function drawResult(ctx, canvas, world, score) {
  ctx.fillStyle = PALETTE[0];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (world.phase === 'won') {
    // Level 3 clear shows no prompt: Enter goes on to the final screen (3장, 7장).
    const lines = [
      [STRINGS.clearTitle, 28, 160],
      [STRINGS.clearScore(score), 18, 210],
    ];
    if (world.levelIndex < 2) lines.push([STRINGS.clearNext, 16, 260]);
    drawCentered(ctx, lines);
    return;
  }
  const reason = world.reason === 'timeout' ? STRINGS.failTime : STRINGS.failSpider;
  drawCentered(ctx, [
    [reason, 24, 170],
    [STRINGS.failRetry, 16, 230],
  ]);
}

// Draws one frame. Title and result screens replace the board; play draws the board and HUD.
export function drawWorld(ctx, world, canvas, score, best) {
  if (world.phase === 'title') return drawTitle(ctx, canvas, best);
  if (world.phase === 'final') return drawFinal(ctx, canvas, world, best);
  if (world.phase === 'won' || world.phase === 'lost') return drawResult(ctx, canvas, world, score);
  drawLevel(ctx, world.level);
  drawDewdrops(ctx, world.dewdrops);
  drawSpider(ctx, world.spider);
  drawFirefly(ctx, world.player);
  drawHud(ctx, world);
}
