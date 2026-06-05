import type {
  CosmeticSegmentationMask,
  SegmentationMaskGrid,
} from '../masks';

export type MaskCorrectionType =
  | 'expansion'
  | 'reduction'
  | 'edge_refinement'
  | 'feather_adjustment'
  | 'opacity_adjustment'
  | 'mixed';

export interface MaskDiffBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  space: 'normalized-image';
}

export interface MaskDiffArtifact {
  schemaVersion: 'mask-diff-v0.1';
  originalMaskId: string;
  humanEditedMaskId: string;
  target: CosmeticSegmentationMask['target'];
  addedAreaRatio: number;
  removedAreaRatio: number;
  changedAreaRatio: number;
  edgeShiftScore: number;
  alphaDeltaMean: number;
  affectedBounds: MaskDiffBounds | null;
  diffHeatmap: SegmentationMaskGrid;
  correctionType: MaskCorrectionType;
}

const CHANGE_THRESHOLD = 0.025;

const round4 = (value: number): number => Number(value.toFixed(4));

const assertCompatibleMasks = (
  original: CosmeticSegmentationMask,
  edited: CosmeticSegmentationMask,
): void => {
  if (original.target !== edited.target) {
    throw new Error(
      `Cannot diff masks with different targets: ${original.target} vs ${edited.target}.`,
    );
  }

  if (
    original.grid.width !== edited.grid.width ||
    original.grid.height !== edited.grid.height ||
    original.grid.alpha.length !== edited.grid.alpha.length
  ) {
    throw new Error('Cannot diff masks with incompatible grid dimensions.');
  }
};

const alphaAt = (
  alpha: readonly number[],
  grid: SegmentationMaskGrid,
  x: number,
  y: number,
): number => alpha[y * grid.width + x] ?? 0;

const isMaskEdge = (
  alpha: readonly number[],
  grid: SegmentationMaskGrid,
  x: number,
  y: number,
): boolean => {
  const center = alphaAt(alpha, grid, x, y);

  if (center <= CHANGE_THRESHOLD) {
    return false;
  }

  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      const px = x + dx;
      const py = y + dy;

      if (px < 0 || py < 0 || px >= grid.width || py >= grid.height) {
        return true;
      }

      if (alphaAt(alpha, grid, px, py) <= CHANGE_THRESHOLD) {
        return true;
      }
    }
  }

  return false;
};

const classifyCorrection = (input: {
  addedAreaRatio: number;
  removedAreaRatio: number;
  changedAreaRatio: number;
  edgeShiftScore: number;
  alphaDeltaMean: number;
}): MaskCorrectionType => {
  const { addedAreaRatio, removedAreaRatio, changedAreaRatio, edgeShiftScore, alphaDeltaMean } =
    input;
  const balancedAreaChange =
    addedAreaRatio > 0.015 &&
    removedAreaRatio > 0.015 &&
    Math.abs(addedAreaRatio - removedAreaRatio) <=
      Math.max(addedAreaRatio, removedAreaRatio) * 0.45;

  if (balancedAreaChange && edgeShiftScore > 0.18) {
    return 'edge_refinement';
  }

  if (addedAreaRatio > removedAreaRatio * 1.5 && addedAreaRatio > 0.015) {
    return 'expansion';
  }

  if (removedAreaRatio > addedAreaRatio * 1.5 && removedAreaRatio > 0.015) {
    return 'reduction';
  }

  if (
    changedAreaRatio > 0.55 &&
    addedAreaRatio < 0.015 &&
    removedAreaRatio < 0.015 &&
    alphaDeltaMean > 0.03
  ) {
    return 'opacity_adjustment';
  }

  if (edgeShiftScore > 0.28 && alphaDeltaMean <= 0.18) {
    return 'feather_adjustment';
  }

  return 'mixed';
};

export const diffSegmentationMasks = (
  original: CosmeticSegmentationMask,
  humanEdited: CosmeticSegmentationMask,
): MaskDiffArtifact => {
  assertCompatibleMasks(original, humanEdited);

  const totalCells = Math.max(1, original.grid.alpha.length);
  let addedCells = 0;
  let removedCells = 0;
  let changedCells = 0;
  let alphaDeltaSum = 0;
  let edgeShiftCells = 0;
  let minX = original.grid.width;
  let minY = original.grid.height;
  let maxX = -1;
  let maxY = -1;
  const diffAlpha: number[] = [];

  for (let y = 0; y < original.grid.height; y += 1) {
    for (let x = 0; x < original.grid.width; x += 1) {
      const index = y * original.grid.width + x;
      const before = original.grid.alpha[index] ?? 0;
      const after = humanEdited.grid.alpha[index] ?? 0;
      const delta = after - before;
      const absDelta = Math.abs(delta);

      diffAlpha[index] = round4(absDelta);
      alphaDeltaSum += absDelta;

      if (absDelta <= CHANGE_THRESHOLD) {
        continue;
      }

      changedCells += 1;

      if (delta > 0) {
        addedCells += 1;
      } else {
        removedCells += 1;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      if (
        isMaskEdge(original.grid.alpha, original.grid, x, y) !==
        isMaskEdge(humanEdited.grid.alpha, humanEdited.grid, x, y)
      ) {
        edgeShiftCells += 1;
      }
    }
  }

  const affectedBounds =
    changedCells === 0
      ? null
      : {
          x: round4(minX / original.grid.width),
          y: round4(minY / original.grid.height),
          width: round4((maxX - minX + 1) / original.grid.width),
          height: round4((maxY - minY + 1) / original.grid.height),
          space: 'normalized-image' as const,
        };
  const addedAreaRatio = round4(addedCells / totalCells);
  const removedAreaRatio = round4(removedCells / totalCells);
  const changedAreaRatio = round4(changedCells / totalCells);
  const edgeShiftScore = round4(edgeShiftCells / Math.max(1, changedCells));
  const alphaDeltaMean = round4(alphaDeltaSum / totalCells);
  const correctionType = classifyCorrection({
    addedAreaRatio,
    removedAreaRatio,
    changedAreaRatio,
    edgeShiftScore,
    alphaDeltaMean,
  });

  return {
    schemaVersion: 'mask-diff-v0.1',
    originalMaskId: original.id,
    humanEditedMaskId: humanEdited.id,
    target: original.target,
    addedAreaRatio,
    removedAreaRatio,
    changedAreaRatio,
    edgeShiftScore,
    alphaDeltaMean,
    affectedBounds,
    diffHeatmap: {
      width: original.grid.width,
      height: original.grid.height,
      alpha: diffAlpha,
    },
    correctionType,
  };
};
