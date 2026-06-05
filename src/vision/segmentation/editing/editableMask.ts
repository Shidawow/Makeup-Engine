import type { CosmeticSegmentationMask, SegmentationMaskGrid } from '../masks';

export type MaskEditTool = 'brush-add' | 'brush-erase' | 'feather-brush' | 'smooth-local';

export interface MaskBrushPoint {
  x: number;
  y: number;
  space: 'normalized-image';
}

export interface MaskBrushEdit {
  id: string;
  tool: MaskEditTool;
  target: CosmeticSegmentationMask['target'];
  point: MaskBrushPoint;
  radius: number;
  strength: number;
  createdAt: string;
}

export interface EditableMaskSnapshot {
  id: string;
  reason: string;
  alpha: readonly number[];
}

export interface EditableMaskMetadata {
  version: '0.1';
  source: 'segmentation' | 'human-adjusted';
  lastEditedAt?: string;
  refinementNotes: string[];
}

export interface EditableCosmeticMask {
  id: string;
  baseMask: CosmeticSegmentationMask;
  userModifications: readonly MaskBrushEdit[];
  mergedMask: CosmeticSegmentationMask;
  history: {
    undo: readonly EditableMaskSnapshot[];
    redo: readonly EditableMaskSnapshot[];
  };
  metadata: EditableMaskMetadata;
}

export const createEditableCosmeticMask = (
  baseMask: CosmeticSegmentationMask,
): EditableCosmeticMask => ({
  id: `${baseMask.id}-editable`,
  baseMask,
  userModifications: [],
  mergedMask: {
    ...baseMask,
    id: `${baseMask.id}-editable-merged`,
    debug: [...baseMask.debug, 'Editable mask initialized from segmentation mask.'],
  },
  history: {
    undo: [],
    redo: [],
  },
  metadata: {
    version: '0.1',
    source: 'segmentation',
    refinementNotes: [],
  },
});

export const toCosmeticSegmentationMask = (
  editableMask: EditableCosmeticMask,
): CosmeticSegmentationMask => editableMask.mergedMask;

export const editableMasksToSegmentationMasks = (
  editableMasks: readonly EditableCosmeticMask[],
): CosmeticSegmentationMask[] => editableMasks.map(toCosmeticSegmentationMask);

export const createEditableMaskSnapshot = (
  id: string,
  reason: string,
  grid: SegmentationMaskGrid,
): EditableMaskSnapshot => ({
  id,
  reason,
  alpha: [...grid.alpha],
});

