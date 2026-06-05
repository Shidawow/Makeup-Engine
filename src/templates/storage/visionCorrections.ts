import type {
  CosmeticSegmentationTarget,
  EditableCosmeticMask,
  MaskBrushEdit,
} from '../../vision';
import { normalizeAlpha } from '../../vision';

const STORAGE_KEY = 'makeup-engine:vision-corrections:v0.1';

export const VISION_CORRECTION_RECORD_SCHEMA_VERSION =
  'vision-correction-record-v0.2' as const;

export const VISION_CORRECTION_SESSION_SCHEMA_VERSION =
  'vision-correction-session-v0.1' as const;

export interface VisionCorrectionRecord {
  schemaVersion: typeof VISION_CORRECTION_RECORD_SCHEMA_VERSION;
  id: string;
  imageId: string;
  templateId?: string;
  region: CosmeticSegmentationTarget;
  maskId: string;
  editHistory: readonly MaskBrushEdit[];
  mergedAlpha: readonly number[];
  grid: {
    width: number;
    height: number;
  };
  convergence: {
    correctionConfidence?: number;
    analysisVersion: string;
    humanAdjustedRegions: readonly CosmeticSegmentationTarget[];
  };
  savedAt: string;
}

export interface VisionCorrectionSnapshot {
  schemaVersion?: typeof VISION_CORRECTION_SESSION_SCHEMA_VERSION;
  records: VisionCorrectionRecord[];
  savedAt: string;
}

export interface VisionCorrectionSession {
  schemaVersion: typeof VISION_CORRECTION_SESSION_SCHEMA_VERSION;
  sessionId: string;
  imageId: string;
  templateId?: string;
  records: VisionCorrectionRecord[];
  dirtyRegions: CosmeticSegmentationTarget[];
  savedAt: string;
  migrationVersion: '0.1';
}

export interface VisionCorrectionImportResult {
  snapshot: VisionCorrectionSnapshot;
  importedCount: number;
}

export interface VisionCorrectionStorageAdapter {
  read(): string | null;
  write(value: string): void;
}

const createBrowserStorageAdapter = (): VisionCorrectionStorageAdapter | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return {
    read: () => window.localStorage.getItem(STORAGE_KEY),
    write: (value: string) => window.localStorage.setItem(STORAGE_KEY, value),
  };
};

export const createVisionCorrectionRecord = (input: {
  imageId: string;
  templateId?: string;
  editableMask: EditableCosmeticMask;
  correctionConfidence?: number;
  humanAdjustedRegions: readonly CosmeticSegmentationTarget[];
  savedAt: string;
}): VisionCorrectionRecord => ({
  schemaVersion: VISION_CORRECTION_RECORD_SCHEMA_VERSION,
  id: `${input.imageId}:${input.editableMask.mergedMask.target}:${input.editableMask.id}`,
  imageId: input.imageId,
  templateId: input.templateId,
  region: input.editableMask.mergedMask.target,
  maskId: input.editableMask.mergedMask.id,
  editHistory: input.editableMask.userModifications,
  mergedAlpha: input.editableMask.mergedMask.grid.alpha,
  grid: {
    width: input.editableMask.mergedMask.grid.width,
    height: input.editableMask.mergedMask.grid.height,
  },
  convergence: {
    correctionConfidence: input.correctionConfidence,
    analysisVersion: 'vision-first-4c',
    humanAdjustedRegions: input.humanAdjustedRegions,
  },
  savedAt: input.savedAt,
});

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isTarget = (value: unknown): value is CosmeticSegmentationTarget =>
  value === 'lips' ||
  value === 'eyeshadow' ||
  value === 'eyeliner' ||
  value === 'blush' ||
  value === 'contour' ||
  value === 'highlight';

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === 'number');

const isBrushEditArray = (value: unknown): value is MaskBrushEdit[] =>
  Array.isArray(value) &&
  value.every((entry) => {
    if (!isObjectRecord(entry)) {
      return false;
    }

    return (
      typeof entry.id === 'string' &&
      isTarget(entry.target) &&
      typeof entry.tool === 'string' &&
      isObjectRecord(entry.point) &&
      typeof entry.point.x === 'number' &&
      typeof entry.point.y === 'number' &&
      entry.point.space === 'normalized-image' &&
      typeof entry.radius === 'number' &&
      typeof entry.strength === 'number' &&
      typeof entry.createdAt === 'string'
    );
  });

const parseRecord = (value: unknown): VisionCorrectionRecord | null => {
  if (!isObjectRecord(value)) {
    return null;
  }

  const grid = value.grid;
  const convergence = value.convergence;

  if (!isObjectRecord(grid) || !isObjectRecord(convergence)) {
    return null;
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.imageId !== 'string' ||
    (value.templateId !== undefined && typeof value.templateId !== 'string') ||
    !isTarget(value.region) ||
    typeof value.maskId !== 'string' ||
    !isBrushEditArray(value.editHistory) ||
    !isNumberArray(value.mergedAlpha) ||
    typeof grid.width !== 'number' ||
    typeof grid.height !== 'number' ||
    typeof convergence.analysisVersion !== 'string' ||
    !Array.isArray(convergence.humanAdjustedRegions) ||
    !convergence.humanAdjustedRegions.every(isTarget) ||
    typeof value.savedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: value.id,
    schemaVersion: VISION_CORRECTION_RECORD_SCHEMA_VERSION,
    imageId: value.imageId,
    templateId: value.templateId,
    region: value.region,
    maskId: value.maskId,
    editHistory: value.editHistory,
    mergedAlpha: normalizeAlpha(value.mergedAlpha),
    grid: {
      width: grid.width,
      height: grid.height,
    },
    convergence: {
      correctionConfidence:
        typeof convergence.correctionConfidence === 'number'
          ? convergence.correctionConfidence
          : undefined,
      analysisVersion: convergence.analysisVersion,
      humanAdjustedRegions: convergence.humanAdjustedRegions,
    },
    savedAt: value.savedAt,
  };
};

export const serializeVisionCorrectionSnapshot = (
  snapshot: VisionCorrectionSnapshot,
): string => JSON.stringify(snapshot, null, 2);

export const parseVisionCorrectionSnapshot = (
  raw: string,
): VisionCorrectionSnapshot => {
  const parsed = JSON.parse(raw) as unknown;

  if (!isObjectRecord(parsed) || !Array.isArray(parsed.records)) {
    throw new Error('Correction JSON must contain a records array.');
  }

  const records = parsed.records.map(parseRecord);

  if (records.some((record) => record === null)) {
    throw new Error('Correction JSON contains an invalid correction record.');
  }

  return {
    schemaVersion:
      parsed.schemaVersion === VISION_CORRECTION_SESSION_SCHEMA_VERSION
        ? parsed.schemaVersion
        : undefined,
    records: records.filter((record): record is VisionCorrectionRecord => record !== null),
    savedAt:
      typeof parsed.savedAt === 'string'
        ? parsed.savedAt
        : new Date(0).toISOString(),
  };
};

export const createVisionCorrectionSession = (input: {
  sessionId: string;
  imageId: string;
  templateId?: string;
  records: readonly VisionCorrectionRecord[];
  dirtyRegions: readonly CosmeticSegmentationTarget[];
  savedAt: string;
}): VisionCorrectionSession => ({
  schemaVersion: VISION_CORRECTION_SESSION_SCHEMA_VERSION,
  sessionId: input.sessionId,
  imageId: input.imageId,
  templateId: input.templateId,
  records: [...input.records].sort((a, b) => a.id.localeCompare(b.id)),
  dirtyRegions: [...new Set(input.dirtyRegions)].sort(),
  savedAt: input.savedAt,
  migrationVersion: '0.1',
});

export const serializeVisionCorrectionSession = (
  session: VisionCorrectionSession,
): string => JSON.stringify(session, null, 2);

export const parseVisionCorrectionSession = (
  raw: string,
): VisionCorrectionSession => {
  const parsed = JSON.parse(raw) as unknown;

  if (!isObjectRecord(parsed) || !Array.isArray(parsed.records)) {
    throw new Error('Correction session JSON must contain a records array.');
  }

  const records = parsed.records.map(parseRecord);

  if (records.some((record) => record === null)) {
    throw new Error('Correction session JSON contains an invalid record.');
  }

  if (
    parsed.schemaVersion !== VISION_CORRECTION_SESSION_SCHEMA_VERSION ||
    typeof parsed.sessionId !== 'string' ||
    typeof parsed.imageId !== 'string' ||
    (parsed.templateId !== undefined && typeof parsed.templateId !== 'string') ||
    !Array.isArray(parsed.dirtyRegions) ||
    !parsed.dirtyRegions.every(isTarget) ||
    typeof parsed.savedAt !== 'string'
  ) {
    throw new Error('Correction session JSON contains invalid metadata.');
  }

  return createVisionCorrectionSession({
    sessionId: parsed.sessionId,
    imageId: parsed.imageId,
    templateId: parsed.templateId,
    records: records.filter((record): record is VisionCorrectionRecord => record !== null),
    dirtyRegions: parsed.dirtyRegions,
    savedAt: parsed.savedAt,
  });
};

const mergeRecords = (
  currentRecords: readonly VisionCorrectionRecord[],
  incomingRecords: readonly VisionCorrectionRecord[],
): VisionCorrectionRecord[] => {
  const records = [...currentRecords];

  for (const record of incomingRecords) {
    const existingIndex = records.findIndex((item) => item.id === record.id);

    if (existingIndex >= 0) {
      records.splice(existingIndex, 1, record);
    } else {
      records.push(record);
    }
  }

  return records.sort((a, b) => a.id.localeCompare(b.id));
};

export const applyVisionCorrectionToEditableMask = (
  editableMask: EditableCosmeticMask,
  record: VisionCorrectionRecord,
): EditableCosmeticMask | null => {
  if (
    editableMask.mergedMask.target !== record.region ||
    editableMask.mergedMask.grid.width !== record.grid.width ||
    editableMask.mergedMask.grid.height !== record.grid.height ||
    editableMask.mergedMask.grid.alpha.length !== record.mergedAlpha.length
  ) {
    return null;
  }

  return {
    ...editableMask,
    userModifications: [...record.editHistory],
    mergedMask: {
      ...editableMask.mergedMask,
      id: record.maskId,
      grid: {
        ...editableMask.mergedMask.grid,
        alpha: normalizeAlpha(record.mergedAlpha),
      },
      confidence: Math.max(
        editableMask.mergedMask.confidence,
        record.convergence.correctionConfidence ?? editableMask.mergedMask.confidence,
      ),
      debug: [
        ...editableMask.mergedMask.debug,
        `Loaded correction ${record.id}.`,
      ],
    },
    history: {
      undo: editableMask.history.undo,
      redo: [],
    },
    metadata: {
      ...editableMask.metadata,
      source: record.editHistory.length > 0 ? 'human-adjusted' : 'segmentation',
      lastEditedAt: record.savedAt,
      refinementNotes: [
        ...editableMask.metadata.refinementNotes,
        `Loaded correction ${record.id}.`,
      ],
    },
  };
};

export const createVisionCorrectionStorage = (
  adapter: VisionCorrectionStorageAdapter | null = createBrowserStorageAdapter(),
) => {
  const readSnapshot = (): VisionCorrectionSnapshot => {
    const raw = adapter?.read();

    if (!raw) {
      return {
        schemaVersion: VISION_CORRECTION_SESSION_SCHEMA_VERSION,
        records: [],
        savedAt: '',
      };
    }

    try {
      return parseVisionCorrectionSnapshot(raw);
    } catch {
      return {
        schemaVersion: VISION_CORRECTION_SESSION_SCHEMA_VERSION,
        records: [],
        savedAt: '',
      };
    }
  };

  return {
    list(): VisionCorrectionRecord[] {
      return readSnapshot().records;
    },
    save(record: VisionCorrectionRecord): VisionCorrectionSnapshot {
      const snapshot = readSnapshot();
      const records = mergeRecords(snapshot.records, [record]);

      const nextSnapshot = {
        schemaVersion: VISION_CORRECTION_SESSION_SCHEMA_VERSION,
        records,
        savedAt: record.savedAt,
      };

      adapter?.write(JSON.stringify(nextSnapshot));

      return nextSnapshot;
    },
    saveMany(recordsToSave: readonly VisionCorrectionRecord[]): VisionCorrectionSnapshot {
      const snapshot = readSnapshot();
      const records = mergeRecords(snapshot.records, recordsToSave);
      const savedAt =
        recordsToSave[recordsToSave.length - 1]?.savedAt ??
        snapshot.savedAt;
      const nextSnapshot = {
        schemaVersion: VISION_CORRECTION_SESSION_SCHEMA_VERSION,
        records,
        savedAt,
      };

      adapter?.write(serializeVisionCorrectionSnapshot(nextSnapshot));

      return nextSnapshot;
    },
    saveSelected(input: {
      records: readonly VisionCorrectionRecord[];
      selectedRegions: readonly CosmeticSegmentationTarget[];
    }): VisionCorrectionSnapshot {
      const selected = new Set(input.selectedRegions);

      return this.saveMany(
        input.records.filter((record) => selected.has(record.region)),
      );
    },
    getByImageId(imageId: string): VisionCorrectionRecord[] {
      return this.list().filter((record) => record.imageId === imageId);
    },
    exportSnapshot(): string {
      return serializeVisionCorrectionSnapshot(readSnapshot());
    },
    replace(snapshot: VisionCorrectionSnapshot): VisionCorrectionSnapshot {
      adapter?.write(serializeVisionCorrectionSnapshot(snapshot));

      return snapshot;
    },
    createSession(input: {
      sessionId: string;
      imageId: string;
      templateId?: string;
      dirtyRegions: readonly CosmeticSegmentationTarget[];
      savedAt: string;
    }): VisionCorrectionSession {
      return createVisionCorrectionSession({
        ...input,
        records: readSnapshot().records,
      });
    },
    exportCorrectionSession(session: VisionCorrectionSession): string {
      return serializeVisionCorrectionSession(session);
    },
    loadCorrectionSession(raw: string): VisionCorrectionSession {
      return parseVisionCorrectionSession(raw);
    },
    importCorrectionSession(raw: string): VisionCorrectionImportResult {
      const session = parseVisionCorrectionSession(raw);
      const snapshot = this.saveMany(session.records);

      return {
        snapshot,
        importedCount: session.records.length,
      };
    },
    importJson(raw: string): VisionCorrectionImportResult {
      const imported = parseVisionCorrectionSnapshot(raw);
      const current = readSnapshot();
      const records = mergeRecords(current.records, imported.records);

      const snapshot = {
        schemaVersion: VISION_CORRECTION_SESSION_SCHEMA_VERSION,
        records,
        savedAt: imported.savedAt || new Date().toISOString(),
      };

      adapter?.write(serializeVisionCorrectionSnapshot(snapshot));

      return {
        snapshot,
        importedCount: imported.records.length,
      };
    },
  };
};

export const visionCorrectionStorage = createVisionCorrectionStorage();
