import type { CosmeticSegmentationMask, SegmentationMaskGrid } from '../masks';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const normalizeAlpha = (alpha: readonly number[]): number[] =>
  alpha.map((value) => Number(clamp01(value).toFixed(4)));

export const smoothMaskEdges = (
  grid: SegmentationMaskGrid,
  iterations = 1,
): SegmentationMaskGrid => {
  let alpha = [...grid.alpha];

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const next = [...alpha];

    for (let y = 0; y < grid.height; y += 1) {
      for (let x = 0; x < grid.width; x += 1) {
        const values: number[] = [];

        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            const px = x + dx;
            const py = y + dy;

            if (px >= 0 && px < grid.width && py >= 0 && py < grid.height) {
              values.push(alpha[py * grid.width + px] ?? 0);
            }
          }
        }

        next[y * grid.width + x] = Number(
          (
            values.reduce((sum, value) => sum + value, 0) / values.length
          ).toFixed(4),
        );
      }
    }

    alpha = next;
  }

  return {
    ...grid,
    alpha: normalizeAlpha(alpha),
  };
};

export const featherMask = (
  mask: CosmeticSegmentationMask,
  strength = 0.35,
): CosmeticSegmentationMask => ({
  ...mask,
  grid: {
    ...mask.grid,
    alpha: normalizeAlpha(
      mask.grid.alpha.map((value) => value * (1 - strength) + value ** 0.5 * strength),
    ),
  },
  debug: [...mask.debug, `Applied feather strength ${strength}.`],
});

export const compositeMasks = (
  masks: CosmeticSegmentationMask[],
): SegmentationMaskGrid => {
  const [first] = masks;

  if (!first) {
    return { width: 0, height: 0, alpha: [] };
  }

  const alpha = first.grid.alpha.map((_, index) =>
    Number(
      Math.min(
        1,
        masks.reduce((sum, mask) => sum + (mask.grid.alpha[index] ?? 0), 0),
      ).toFixed(4),
    ),
  );

  return {
    width: first.grid.width,
    height: first.grid.height,
    alpha,
  };
};

