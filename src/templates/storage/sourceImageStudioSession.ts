import type { SourceImageManifest } from '../../training/schema';
import type { TemplateAnalysisSeed } from '../schema';
import { stableHash, stableStringify } from './datasetExport';

export const SOURCE_IMAGE_STUDIO_SESSION_SCHEMA_VERSION =
  'source-image-studio-session-v0.1' as const;

const DEFAULT_STORAGE_KEY = 'makeup-engine:source-image-studio-session';
const ABSOLUTE_PATH = /^(?:[A-Za-z]:[\\/]|\\\\|\/)/;

export interface SourceImageStudioSession {
  schemaVersion: typeof SOURCE_IMAGE_STUDIO_SESSION_SCHEMA_VERSION;
  sessionId: string;
  sourceImagePackageId?: string;
  manifestReference?: string;
  activeSeedId?: string;
  seeds: TemplateAnalysisSeed[];
  createdAt: string;
  updatedAt: string;
}

export interface SourceImageStudioSessionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const sanitizeReference = (reference: string | undefined): string | undefined => {
  if (!reference) {
    return undefined;
  }

  const normalized = reference.replace(/\\/g, '/').trim();

  return ABSOLUTE_PATH.test(normalized) ? undefined : normalized;
};

const browserStorage = (): SourceImageStudioSessionStorage | undefined => {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }

  const candidate = (globalThis as { localStorage?: SourceImageStudioSessionStorage })
    .localStorage;

  return candidate;
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

export const createSourceImageStudioSession = (input: {
  manifest?: SourceImageManifest;
  manifestReference?: string;
  seeds?: readonly TemplateAnalysisSeed[];
  createdAt?: string;
  updatedAt?: string;
} = {}): SourceImageStudioSession => {
  const manifestReference = sanitizeReference(input.manifestReference);
  const createdAt =
    input.createdAt ?? input.manifest?.createdAt ?? '2026-05-30T00:00:00.000Z';

  return {
    schemaVersion: SOURCE_IMAGE_STUDIO_SESSION_SCHEMA_VERSION,
    sessionId: `source-image-session-${stableHash({
      packageId: input.manifest?.packageId ?? 'empty',
      manifestReference: manifestReference ?? 'none',
    })}`,
    sourceImagePackageId: input.manifest?.packageId,
    manifestReference,
    activeSeedId: input.seeds?.[0]?.seedId,
    seeds: [...(input.seeds ?? [])],
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
};

export const addTemplateAnalysisSeedToSession = (
  session: SourceImageStudioSession,
  seed: TemplateAnalysisSeed,
  updatedAt = seed.createdAt,
): SourceImageStudioSession => {
  const seeds = [
    seed,
    ...session.seeds.filter((candidate) => candidate.seedId !== seed.seedId),
  ];

  return {
    ...session,
    sourceImagePackageId: seed.sourceImagePackageId,
    activeSeedId: seed.seedId,
    seeds,
    updatedAt,
  };
};

export const listRecentTemplateAnalysisSeeds = (
  session: SourceImageStudioSession,
  limit = 5,
): TemplateAnalysisSeed[] =>
  [...session.seeds]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, limit);

export const saveSourceImageStudioSession = (
  session: SourceImageStudioSession,
  options: {
    storage?: SourceImageStudioSessionStorage;
    key?: string;
  } = {},
): string => {
  const content = stableStringify(stripUndefined(session));
  const storage = options.storage ?? browserStorage();

  storage?.setItem(options.key ?? DEFAULT_STORAGE_KEY, content);

  return content;
};

export const loadSourceImageStudioSession = (
  options: {
    storage?: SourceImageStudioSessionStorage;
    key?: string;
  } = {},
): SourceImageStudioSession | null => {
  const storage = options.storage ?? browserStorage();
  const content = storage?.getItem(options.key ?? DEFAULT_STORAGE_KEY);

  if (!content) {
    return null;
  }

  const parsed = JSON.parse(content) as SourceImageStudioSession;

  if (parsed.schemaVersion !== SOURCE_IMAGE_STUDIO_SESSION_SCHEMA_VERSION) {
    throw new Error('Unsupported source image studio session schemaVersion');
  }

  return {
    ...parsed,
    manifestReference: sanitizeReference(parsed.manifestReference),
    seeds: parsed.seeds.map((seed) => ({
      ...seed,
      sourceImageManifestPath: sanitizeReference(seed.sourceImageManifestPath),
      sourceImageManifestReference: sanitizeReference(seed.sourceImageManifestReference),
    })),
  };
};

export const clearSourceImageStudioSession = (
  options: {
    storage?: SourceImageStudioSessionStorage;
    key?: string;
  } = {},
): void => {
  const storage = options.storage ?? browserStorage();

  storage?.removeItem(options.key ?? DEFAULT_STORAGE_KEY);
};
