import type { TemplateAnalysisSeed } from '../schema';
import type {
  TemplateProductionBatch,
  TemplateProductionTask,
} from '../schema/template-production-batch.schema';
import {
  TEMPLATE_PRODUCTION_BATCH_SCHEMA_VERSION,
} from '../schema/template-production-batch.schema';
import { stableHash, stableStringify } from './datasetExport';

export const TEMPLATE_PRODUCTION_BATCH_SESSION_SCHEMA_VERSION =
  'template-production-batch-session-v0.1' as const;

const DEFAULT_BATCH_KEY_PREFIX = 'makeup-engine:template-production-batch:';
const DEFAULT_BATCH_SESSION_KEY = 'makeup-engine:template-production-batch-session';
const ABSOLUTE_PATH = /^(?:[A-Za-z]:[\\/]|\\\\|\/)/;

export interface TemplateProductionBatchSession {
  schemaVersion: typeof TEMPLATE_PRODUCTION_BATCH_SESSION_SCHEMA_VERSION;
  sessionId: string;
  activeBatchId?: string;
  recentBatchIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateProductionBatchStorageInput {
  batch: TemplateProductionBatch;
  storage?: Storage;
  batchKeyPrefix?: string;
  sessionKey?: string;
}

const browserStorage = (): Storage | undefined => {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }

  return (globalThis as { localStorage?: Storage }).localStorage;
};

const isAbsolutePath = (value: string): boolean => ABSOLUTE_PATH.test(value.replace(/\\/g, '/'));

const sanitizeReference = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(/\\/g, '/').trim();
  return isAbsolutePath(normalized) ? undefined : normalized;
};

const stripUndefined = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripUndefined);
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, stripUndefined(entryValue)]),
    );
  }

  return value;
};

const storageKey = (batchId: string, prefix = DEFAULT_BATCH_KEY_PREFIX): string =>
  `${prefix}${batchId}`;

const readSession = (
  storage: Storage | undefined,
  key = DEFAULT_BATCH_SESSION_KEY,
): TemplateProductionBatchSession | null => {
  const raw = storage?.getItem(key);

  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as TemplateProductionBatchSession;

  if (parsed.schemaVersion !== TEMPLATE_PRODUCTION_BATCH_SESSION_SCHEMA_VERSION) {
    throw new Error('Unsupported template production batch session schemaVersion');
  }

  return {
    ...parsed,
    activeBatchId: sanitizeReference(parsed.activeBatchId),
    recentBatchIds: parsed.recentBatchIds.map((id) => sanitizeReference(id) ?? id),
  };
};

const writeSession = (
  session: TemplateProductionBatchSession,
  storage: Storage | undefined,
  key = DEFAULT_BATCH_SESSION_KEY,
): void => {
  storage?.setItem(key, stableStringify(stripUndefined(session)));
};

const sanitizeSeed = (seed: TemplateAnalysisSeed): TemplateAnalysisSeed => ({
  ...seed,
  sourceImageManifestPath: sanitizeReference(seed.sourceImageManifestPath),
  sourceImageManifestReference: sanitizeReference(seed.sourceImageManifestReference),
  boundArtifactResource: undefined,
  browserPreviewUrl: undefined,
  imageDataReference: sanitizeReference(seed.imageDataReference),
});

const sanitizeTask = (task: TemplateProductionTask): TemplateProductionTask => ({
  ...task,
  templateAnalysisSeed: task.templateAnalysisSeed
    ? sanitizeSeed(task.templateAnalysisSeed)
    : undefined,
  events: task.events.map((event) => ({
    ...event,
    metadata: event.metadata ? { ...event.metadata } : undefined,
  })),
  issues: task.issues.map((issue) => ({ ...issue })),
  analysisSummary: task.analysisSummary
    ? {
        ...task.analysisSummary,
        previewId: sanitizeReference(task.analysisSummary.previewId),
        sourceImageId: sanitizeReference(task.analysisSummary.sourceImageId),
        seedId: sanitizeReference(task.analysisSummary.seedId),
      }
    : undefined,
});

export const sanitizeTemplateProductionBatchForStorage = (
  batch: TemplateProductionBatch,
): TemplateProductionBatch => ({
  ...batch,
  sourceImageManifestReference: sanitizeReference(batch.sourceImageManifestReference) ?? batch.sourceImageManifestReference,
  tasks: batch.tasks.map(sanitizeTask),
  issues: batch.issues.map((issue) => ({ ...issue })),
  metadata: {
    ...batch.metadata,
    sourceImageManifestReference:
      sanitizeReference(batch.metadata.sourceImageManifestReference) ??
      batch.metadata.sourceImageManifestReference,
    notes: batch.metadata.notes ? [...batch.metadata.notes] : undefined,
  },
});

export const createTemplateProductionBatchSession = (input: {
  activeBatchId?: string;
  recentBatchIds?: readonly string[];
  createdAt?: string;
  updatedAt?: string;
} = {}): TemplateProductionBatchSession => {
  const createdAt = input.createdAt ?? '2026-05-31T00:00:00.000Z';

  return {
    schemaVersion: TEMPLATE_PRODUCTION_BATCH_SESSION_SCHEMA_VERSION,
    sessionId: `template-production-batch-session-${stableHash({
      activeBatchId: input.activeBatchId ?? 'none',
      recentBatchIds: input.recentBatchIds ?? [],
    })}`,
    activeBatchId: sanitizeReference(input.activeBatchId),
    recentBatchIds: [...(input.recentBatchIds ?? [])].map((id) => sanitizeReference(id) ?? id),
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
};

export const saveTemplateProductionBatch = (
  batch: TemplateProductionBatch,
  options: Partial<TemplateProductionBatchStorageInput> = {},
): string => {
  const storage = options.storage ?? browserStorage();
  const sanitized = sanitizeTemplateProductionBatchForStorage(batch);
  const batchJson = stableStringify(stripUndefined(sanitized));
  const batchStorageKey = storageKey(sanitized.batchId, options.batchKeyPrefix);
  const session = readSession(storage, options.sessionKey) ?? createTemplateProductionBatchSession();
  const nextSession = {
    ...session,
    activeBatchId: sanitized.batchId,
    recentBatchIds: [
      sanitized.batchId,
      ...session.recentBatchIds.filter((batchId) => batchId !== sanitized.batchId),
    ].slice(0, 20),
    updatedAt: sanitized.updatedAt,
  };

  storage?.setItem(batchStorageKey, batchJson);
  writeSession(nextSession, storage, options.sessionKey);

  return batchJson;
};

export const loadTemplateProductionBatch = (
  batchId: string,
  options: Partial<TemplateProductionBatchStorageInput> = {},
): TemplateProductionBatch | null => {
  const storage = options.storage ?? browserStorage();
  const raw = storage?.getItem(storageKey(batchId, options.batchKeyPrefix));

  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as TemplateProductionBatch;

  if (parsed.schemaVersion !== TEMPLATE_PRODUCTION_BATCH_SCHEMA_VERSION) {
    throw new Error('Unsupported template production batch schemaVersion');
  }

  return sanitizeTemplateProductionBatchForStorage(parsed);
};

export const clearTemplateProductionBatch = (
  batchId: string,
  options: Partial<TemplateProductionBatchStorageInput> = {},
): void => {
  const storage = options.storage ?? browserStorage();
  const key = storageKey(batchId, options.batchKeyPrefix);
  storage?.removeItem(key);

  const session = readSession(storage, options.sessionKey);
  if (!session) {
    return;
  }

  const nextSession = {
    ...session,
    activeBatchId: session.activeBatchId === batchId ? undefined : session.activeBatchId,
    recentBatchIds: session.recentBatchIds.filter((candidate) => candidate !== batchId),
    updatedAt: new Date().toISOString(),
  };

  writeSession(nextSession, storage, options.sessionKey);
};

export const exportTemplateProductionBatchJson = (
  batch: TemplateProductionBatch,
): string => stableStringify(stripUndefined(sanitizeTemplateProductionBatchForStorage(batch)));

export const importTemplateProductionBatchJson = (
  content: string,
): TemplateProductionBatch => {
  const parsed = JSON.parse(content) as TemplateProductionBatch;

  if (parsed.schemaVersion !== TEMPLATE_PRODUCTION_BATCH_SCHEMA_VERSION) {
    throw new Error('Unsupported template production batch schemaVersion');
  }

  return sanitizeTemplateProductionBatchForStorage(parsed);
};

export const mergeTemplateProductionBatchUpdates = (
  batch: TemplateProductionBatch,
  updates: Partial<TemplateProductionBatch>,
): TemplateProductionBatch =>
  sanitizeTemplateProductionBatchForStorage({
    ...batch,
    ...updates,
    tasks: updates.tasks ? updates.tasks.map(sanitizeTask) : batch.tasks.map(sanitizeTask),
    issues: updates.issues ? updates.issues.map((issue) => ({ ...issue })) : batch.issues.map((issue) => ({ ...issue })),
    metadata: {
      ...batch.metadata,
      ...(updates.metadata ?? {}),
      sourceImageManifestReference:
        sanitizeReference(updates.metadata?.sourceImageManifestReference) ??
        sanitizeReference(batch.metadata.sourceImageManifestReference) ??
        batch.metadata.sourceImageManifestReference,
    },
  });

export const listRecentTemplateProductionBatches = (
  options: Partial<TemplateProductionBatchStorageInput> = {},
): TemplateProductionBatch[] => {
  const storage = options.storage ?? browserStorage();
  const session = readSession(storage, options.sessionKey);

  if (!session) {
    return [];
  }

  return session.recentBatchIds
    .map((batchId) => loadTemplateProductionBatch(batchId, options))
    .filter((batch): batch is TemplateProductionBatch => Boolean(batch));
};

export const loadTemplateProductionBatchSession = (
  options: Partial<TemplateProductionBatchStorageInput> = {},
): TemplateProductionBatchSession | null => {
  const storage = options.storage ?? browserStorage();
  return readSession(storage, options.sessionKey);
};

export const clearTemplateProductionBatchSession = (
  options: Partial<TemplateProductionBatchStorageInput> = {},
): void => {
  const storage = options.storage ?? browserStorage();

  loadTemplateProductionBatchSession(options)?.recentBatchIds.forEach((batchId) =>
    storage?.removeItem(storageKey(batchId, options.batchKeyPrefix)),
  );
  storage?.removeItem(options.sessionKey ?? DEFAULT_BATCH_SESSION_KEY);
};

