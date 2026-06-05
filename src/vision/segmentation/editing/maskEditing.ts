import { normalizeAlpha, smoothMaskEdges } from '../blending';
import type { SegmentationMaskGrid } from '../masks';
import {
  createEditableMaskSnapshot,
  type EditableCosmeticMask,
  type EditableMaskSnapshot,
  type MaskBrushEdit,
} from './editableMask';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const nextSnapshotId = (
  editableMask: EditableCosmeticMask,
  suffix: string,
): string =>
  `${editableMask.id}-snapshot-${editableMask.history.undo.length + editableMask.userModifications.length + 1}-${suffix}`;

const replaceAlpha = (
  grid: SegmentationMaskGrid,
  alpha: readonly number[],
): SegmentationMaskGrid => ({
  ...grid,
  alpha: normalizeAlpha(alpha),
});

const localAverage = (
  grid: SegmentationMaskGrid,
  alpha: readonly number[],
  x: number,
  y: number,
): number => {
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

  return values.length === 0
    ? 0
    : values.reduce((sum, value) => sum + value, 0) / values.length;
};

const applyBrushToAlpha = (
  grid: SegmentationMaskGrid,
  edit: MaskBrushEdit,
): number[] => {
  const alpha = [...grid.alpha];
  const radius = Math.max(0.001, edit.radius);
  const strength = clamp01(edit.strength);

  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      const normalizedPoint = {
        x: (x + 0.5) / grid.width,
        y: (y + 0.5) / grid.height,
      };
      const distance = Math.sqrt(
        (normalizedPoint.x - edit.point.x) ** 2 +
          (normalizedPoint.y - edit.point.y) ** 2,
      );

      if (distance > radius) {
        continue;
      }

      const index = y * grid.width + x;
      const current = alpha[index] ?? 0;
      const influence = (1 - distance / radius) * strength;

      if (edit.tool === 'brush-add') {
        alpha[index] = clamp01(current + (1 - current) * influence);
      } else if (edit.tool === 'brush-erase') {
        alpha[index] = clamp01(current * (1 - influence));
      } else {
        const average = localAverage(grid, alpha, x, y);
        alpha[index] = clamp01(current * (1 - influence) + average * influence);
      }
    }
  }

  return normalizeAlpha(alpha);
};

const withMergedAlpha = (
  editableMask: EditableCosmeticMask,
  alpha: readonly number[],
  notes: readonly string[],
): EditableCosmeticMask => ({
  ...editableMask,
  mergedMask: {
    ...editableMask.mergedMask,
    grid: replaceAlpha(editableMask.mergedMask.grid, alpha),
    confidence: Number(
      Math.min(1, editableMask.baseMask.confidence + editableMask.userModifications.length * 0.01).toFixed(3),
    ),
    debug: [...editableMask.mergedMask.debug, ...notes],
  },
  metadata: {
    ...editableMask.metadata,
    source: editableMask.userModifications.length > 0 ? 'human-adjusted' : editableMask.metadata.source,
    refinementNotes: [...editableMask.metadata.refinementNotes, ...notes],
  },
});

export const applyMaskBrushEdit = (
  editableMask: EditableCosmeticMask,
  edit: MaskBrushEdit,
): EditableCosmeticMask => {
  const before = createEditableMaskSnapshot(
    nextSnapshotId(editableMask, 'before'),
    edit.tool,
    editableMask.mergedMask.grid,
  );
  const nextAlpha = applyBrushToAlpha(editableMask.mergedMask.grid, edit);
  const withModification: EditableCosmeticMask = {
    ...editableMask,
    userModifications: [...editableMask.userModifications, edit],
    history: {
      undo: [...editableMask.history.undo, before],
      redo: [],
    },
    metadata: {
      ...editableMask.metadata,
      lastEditedAt: edit.createdAt,
    },
  };

  return withMergedAlpha(withModification, nextAlpha, [
    `Applied ${edit.tool} at ${edit.point.x.toFixed(3)},${edit.point.y.toFixed(3)} radius=${edit.radius}.`,
  ]);
};

export const smoothEditableMask = (
  editableMask: EditableCosmeticMask,
  iterations = 1,
): EditableCosmeticMask => {
  const snapshot = createEditableMaskSnapshot(
    nextSnapshotId(editableMask, 'smooth'),
    'alpha smoothing',
    editableMask.mergedMask.grid,
  );
  const smoothed = smoothMaskEdges(editableMask.mergedMask.grid, iterations);

  return withMergedAlpha(
    {
      ...editableMask,
      history: {
        undo: [...editableMask.history.undo, snapshot],
        redo: [],
      },
    },
    smoothed.alpha,
    [`Applied alpha smoothing iterations=${iterations}.`],
  );
};

export const undoMaskEdit = (
  editableMask: EditableCosmeticMask,
): EditableCosmeticMask => {
  const previous = editableMask.history.undo[editableMask.history.undo.length - 1];

  if (!previous) {
    return editableMask;
  }

  const current: EditableMaskSnapshot = createEditableMaskSnapshot(
    nextSnapshotId(editableMask, 'redo'),
    'redo point',
    editableMask.mergedMask.grid,
  );
  const remainingUndo = editableMask.history.undo.slice(0, -1);

  return {
    ...withMergedAlpha(editableMask, previous.alpha, [`Undo mask edit: ${previous.reason}.`]),
    userModifications: editableMask.userModifications.slice(0, -1),
    history: {
      undo: remainingUndo,
      redo: [...editableMask.history.redo, current],
    },
  };
};

export const redoMaskEdit = (
  editableMask: EditableCosmeticMask,
): EditableCosmeticMask => {
  const next = editableMask.history.redo[editableMask.history.redo.length - 1];

  if (!next) {
    return editableMask;
  }

  const current = createEditableMaskSnapshot(
    nextSnapshotId(editableMask, 'undo'),
    'undo point',
    editableMask.mergedMask.grid,
  );

  return {
    ...withMergedAlpha(editableMask, next.alpha, [`Redo mask edit: ${next.reason}.`]),
    history: {
      undo: [...editableMask.history.undo, current],
      redo: editableMask.history.redo.slice(0, -1),
    },
  };
};

export const resetEditableMaskToBase = (
  editableMask: EditableCosmeticMask,
  resetAt: string,
): EditableCosmeticMask => {
  const snapshot = createEditableMaskSnapshot(
    nextSnapshotId(editableMask, 'reset'),
    'reset region',
    editableMask.mergedMask.grid,
  );

  return {
    ...editableMask,
    userModifications: [],
    mergedMask: {
      ...editableMask.mergedMask,
      grid: replaceAlpha(
        editableMask.mergedMask.grid,
        editableMask.baseMask.grid.alpha,
      ),
      confidence: editableMask.baseMask.confidence,
      debug: [...editableMask.mergedMask.debug, 'Reset editable mask to base segmentation mask.'],
    },
    history: {
      undo: [...editableMask.history.undo, snapshot],
      redo: [],
    },
    metadata: {
      ...editableMask.metadata,
      source: 'segmentation',
      lastEditedAt: resetAt,
      refinementNotes: [
        ...editableMask.metadata.refinementNotes,
        'Reset editable mask to base segmentation mask.',
      ],
    },
  };
};

export const restoreEditableMaskSnapshot = (
  editableMask: EditableCosmeticMask,
  snapshotId: string,
  restoredAt: string,
): EditableCosmeticMask => {
  const snapshotIndex = editableMask.history.undo.findIndex(
    (snapshot) => snapshot.id === snapshotId,
  );
  const snapshot = editableMask.history.undo[snapshotIndex];

  if (!snapshot) {
    return editableMask;
  }

  const current = createEditableMaskSnapshot(
    nextSnapshotId(editableMask, 'restore-redo'),
    'restore redo point',
    editableMask.mergedMask.grid,
  );
  const restored = withMergedAlpha(
    {
      ...editableMask,
      userModifications: editableMask.userModifications.slice(0, snapshotIndex),
      history: {
        undo: editableMask.history.undo.slice(0, snapshotIndex),
        redo: [
          current,
          ...editableMask.history.undo.slice(snapshotIndex + 1),
          ...editableMask.history.redo,
        ],
      },
      metadata: {
        ...editableMask.metadata,
        lastEditedAt: restoredAt,
      },
    },
    snapshot.alpha,
    [`Restored editable mask history snapshot: ${snapshot.reason}.`],
  );

  return {
    ...restored,
    metadata: {
      ...restored.metadata,
      source:
        restored.userModifications.length > 0 ? 'human-adjusted' : 'segmentation',
    },
  };
};

export const hasEditableMaskChanges = (
  editableMask: EditableCosmeticMask,
): boolean =>
  editableMask.baseMask.grid.alpha.some(
    (value, index) =>
      Math.abs(value - (editableMask.mergedMask.grid.alpha[index] ?? 0)) > 0.0001,
  );

export const refineEditableMaskLocally = (
  editableMask: EditableCosmeticMask,
  edit: Omit<MaskBrushEdit, 'tool'>,
): EditableCosmeticMask =>
  applyMaskBrushEdit(editableMask, {
    ...edit,
    tool: 'smooth-local',
  });
