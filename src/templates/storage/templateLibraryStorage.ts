import type { MakeupTemplate } from '../schema';
import type {
  TemplateLibrary,
  TemplateLibraryEntry,
  TemplateLibraryEntryStatus,
} from '../schema/template-library.schema';
import { stableHash, stableStringify } from './datasetExport';

export const TEMPLATE_LIBRARY_SESSION_SCHEMA_VERSION =
  'template-library-session-v0.1' as const;

const DEFAULT_LIBRARY_KEY_PREFIX = 'makeup-engine:template-library:';
const DEFAULT_LIBRARY_SESSION_KEY = 'makeup-engine:template-library-session';
const ABSOLUTE_PATH = /^(?:[A-Za-z]:[\\/]|\\\\|\/)/;

export interface TemplateLibrarySession {
  schemaVersion: typeof TEMPLATE_LIBRARY_SESSION_SCHEMA_VERSION;
  sessionId: string;
  activeLibraryId?: string;
  recentLibraryIds: string[];
  createdAt: string;
  updatedAt: string;
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

const safeFileName = (value: string): string => {
  const sanitized = sanitizeReference(value);

  if (sanitized) {
    return sanitized;
  }

  const segments = value.replace(/\\/g, '/').split('/');
  return segments[segments.length - 1] ?? 'template-source-image';
};

const stripUndefined = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripUndefined);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, nextValue]) => nextValue !== undefined)
        .map(([key, nextValue]) => [key, stripUndefined(nextValue)]),
    );
  }

  return value;
};

const storageKey = (libraryId: string, prefix = DEFAULT_LIBRARY_KEY_PREFIX): string =>
  `${prefix}${libraryId}`;

const readSession = (
  storage: Storage | undefined,
  key = DEFAULT_LIBRARY_SESSION_KEY,
): TemplateLibrarySession | null => {
  const raw = storage?.getItem(key);

  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as TemplateLibrarySession;

  if (parsed.schemaVersion !== TEMPLATE_LIBRARY_SESSION_SCHEMA_VERSION) {
    throw new Error('Unsupported template library session schemaVersion');
  }

  return {
    ...parsed,
    activeLibraryId: sanitizeReference(parsed.activeLibraryId),
    recentLibraryIds: parsed.recentLibraryIds.map((id) => sanitizeReference(id) ?? id),
  };
};

const writeSession = (
  session: TemplateLibrarySession,
  storage: Storage | undefined,
  key = DEFAULT_LIBRARY_SESSION_KEY,
): void => {
  storage?.setItem(key, stableStringify(stripUndefined(session)));
};

const sanitizeTemplate = (template: MakeupTemplate): MakeupTemplate => ({
  ...template,
    metadata: {
    ...template.metadata,
    semanticEnrichment: template.metadata.semanticEnrichment
      ? {
          ...template.metadata.semanticEnrichment,
          qaSuggestions: [...template.metadata.semanticEnrichment.qaSuggestions],
          reviewerHints: [...template.metadata.semanticEnrichment.reviewerHints],
        }
      : undefined,
    styleTags: [...template.metadata.styleTags],
    source: {
      ...template.metadata.source,
      fileName: safeFileName(template.metadata.source.fileName),
    },
  },
  notes: template.notes ? [...template.notes] : undefined,
  steps: template.steps.map((step) => ({ ...step })),
  regions: template.regions.map((region) => ({ ...region })),
});

const sanitizeEntry = (entry: TemplateLibraryEntry): TemplateLibraryEntry => ({
  ...entry,
  templateId: sanitizeReference(entry.templateId) ?? entry.templateId,
  sourceProductionBatchId: sanitizeReference(entry.sourceProductionBatchId) ?? entry.sourceProductionBatchId,
  sourceProductionTaskId: sanitizeReference(entry.sourceProductionTaskId) ?? entry.sourceProductionTaskId,
  sourceImageId: sanitizeReference(entry.sourceImageId) ?? entry.sourceImageId,
  makeupTemplate: sanitizeTemplate(entry.makeupTemplate),
  evidenceSummary: {
    ...entry.evidenceSummary,
    notes: [...entry.evidenceSummary.notes],
    references: entry.evidenceSummary.references
      .map((reference) => sanitizeReference(reference))
      .filter((reference): reference is string => Boolean(reference)),
  },
  qualitySummary: {
    ...entry.qualitySummary,
    notes: [...entry.qualitySummary.notes],
  },
  reviewSummary: { ...entry.reviewSummary },
  publishConfirmationSummary: entry.publishConfirmationSummary
    ? { ...entry.publishConfirmationSummary }
    : undefined,
  styleTags: [...entry.styleTags],
  regionCoverage: [...entry.regionCoverage],
  supportedUseCases: [...entry.supportedUseCases],
  versionHistory: entry.versionHistory.map((version) => ({
    ...version,
    notes: [...version.notes],
  })),
  lineage: {
    ...entry.lineage,
    source: {
      ...entry.lineage.source,
      sourceImagePackageId: sanitizeReference(entry.lineage.source.sourceImagePackageId),
      templateAnalysisSeedId: sanitizeReference(entry.lineage.source.templateAnalysisSeedId),
      sourceImageManifestReference: sanitizeReference(entry.lineage.source.sourceImageManifestReference),
    },
    sourceImageLineage: entry.lineage.sourceImageLineage
      ? { ...entry.lineage.sourceImageLineage }
      : undefined,
    analysisSummary: entry.lineage.analysisSummary
      ? {
          ...entry.lineage.analysisSummary,
          traceSummary: [...entry.lineage.analysisSummary.traceSummary],
        }
      : undefined,
    reviewSummary: { ...entry.lineage.reviewSummary },
    publishConfirmationSummary: entry.lineage.publishConfirmationSummary
      ? { ...entry.lineage.publishConfirmationSummary }
      : undefined,
  },
  issues: entry.issues.map((issue) => ({ ...issue })),
  metadata: {
    ...entry.metadata,
    styleTags: [...entry.metadata.styleTags],
    regionCoverage: [...entry.metadata.regionCoverage],
    supportedUseCases: [...entry.metadata.supportedUseCases],
  },
});

export const sanitizeTemplateLibraryForStorage = (
  library: TemplateLibrary,
): TemplateLibrary => ({
  ...library,
  entries: library.entries.map(sanitizeEntry),
  manifest: {
    ...library.manifest,
    notes: [...library.manifest.notes],
  },
  summary: {
    ...library.summary,
    nextActions: [...library.summary.nextActions],
  },
  issues: library.issues.map((issue) => ({ ...issue })),
  metadata: {
    ...library.metadata,
    notes: [...library.metadata.notes],
  },
});

export const createTemplateLibrarySession = (input: {
  activeLibraryId?: string;
  recentLibraryIds?: readonly string[];
  createdAt?: string;
  updatedAt?: string;
} = {}): TemplateLibrarySession => {
  const createdAt = input.createdAt ?? '2026-05-31T00:00:00.000Z';

  return {
    schemaVersion: TEMPLATE_LIBRARY_SESSION_SCHEMA_VERSION,
    sessionId: `template-library-session-${stableHash({
      activeLibraryId: input.activeLibraryId ?? 'none',
      recentLibraryIds: input.recentLibraryIds ?? [],
    })}`,
    activeLibraryId: sanitizeReference(input.activeLibraryId),
    recentLibraryIds: [...(input.recentLibraryIds ?? [])].map((id) => sanitizeReference(id) ?? id),
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
};

export const saveTemplateLibrary = (
  library: TemplateLibrary,
  options: {
    storage?: Storage;
    libraryKeyPrefix?: string;
    sessionKey?: string;
  } = {},
): string => {
  const storage = options.storage ?? browserStorage();
  const sanitized = sanitizeTemplateLibraryForStorage(library);
  const json = stableStringify(stripUndefined(sanitized));
  const key = storageKey(sanitized.libraryId, options.libraryKeyPrefix);
  const session = readSession(storage, options.sessionKey) ?? createTemplateLibrarySession();
  const nextSession: TemplateLibrarySession = {
    ...session,
    activeLibraryId: sanitized.libraryId,
    recentLibraryIds: [sanitized.libraryId, ...session.recentLibraryIds.filter((id) => id !== sanitized.libraryId)].slice(0, 20),
    updatedAt: sanitized.updatedAt,
  };

  storage?.setItem(key, json);
  writeSession(nextSession, storage, options.sessionKey);

  return json;
};

export const loadTemplateLibrary = (
  libraryId: string,
  options: {
    storage?: Storage;
    libraryKeyPrefix?: string;
  } = {},
): TemplateLibrary | null => {
  const storage = options.storage ?? browserStorage();
  const raw = storage?.getItem(storageKey(libraryId, options.libraryKeyPrefix));

  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as TemplateLibrary;

  if (parsed.schemaVersion !== 'template-library-v0.1') {
    throw new Error('Unsupported template library schemaVersion');
  }

  return sanitizeTemplateLibraryForStorage(parsed);
};

export const clearTemplateLibrary = (
  libraryId: string,
  options: {
    storage?: Storage;
    libraryKeyPrefix?: string;
    sessionKey?: string;
  } = {},
): void => {
  const storage = options.storage ?? browserStorage();
  storage?.removeItem(storageKey(libraryId, options.libraryKeyPrefix));

  const session = readSession(storage, options.sessionKey);
  if (!session) {
    return;
  }

  const nextSession: TemplateLibrarySession = {
    ...session,
    activeLibraryId: session.activeLibraryId === libraryId ? undefined : session.activeLibraryId,
    recentLibraryIds: session.recentLibraryIds.filter((id) => id !== libraryId),
    updatedAt: new Date().toISOString(),
  };

  writeSession(nextSession, storage, options.sessionKey);
};

export const listRecentTemplateLibraries = (
  options: {
    storage?: Storage;
    libraryKeyPrefix?: string;
    sessionKey?: string;
  } = {},
): TemplateLibrary[] => {
  const storage = options.storage ?? browserStorage();
  const session = readSession(storage, options.sessionKey);

  if (!session) {
    return [];
  }

  return session.recentLibraryIds
    .map((libraryId) => loadTemplateLibrary(libraryId, options))
    .filter((library): library is TemplateLibrary => Boolean(library));
};

export const exportTemplateLibraryJson = (library: TemplateLibrary): string =>
  stableStringify(stripUndefined(sanitizeTemplateLibraryForStorage(library)));

export const importTemplateLibraryJson = (content: string): TemplateLibrary => {
  const parsed = JSON.parse(content) as TemplateLibrary;

  if (parsed.schemaVersion !== 'template-library-v0.1') {
    throw new Error('Unsupported template library schemaVersion');
  }

  return sanitizeTemplateLibraryForStorage(parsed);
};

export const mergeTemplateLibraryUpdates = (
  library: TemplateLibrary,
  updates: Partial<TemplateLibrary>,
): TemplateLibrary =>
  sanitizeTemplateLibraryForStorage({
    ...library,
    ...updates,
    entries: updates.entries ? updates.entries.map(sanitizeEntry) : library.entries.map(sanitizeEntry),
    issues: updates.issues ? updates.issues.map((issue) => ({ ...issue })) : library.issues.map((issue) => ({ ...issue })),
    manifest: {
      ...library.manifest,
      ...(updates.manifest ?? {}),
      notes: [...(updates.manifest?.notes ?? library.manifest.notes)],
    },
    summary: {
      ...library.summary,
      ...(updates.summary ?? {}),
      nextActions: [...(updates.summary?.nextActions ?? library.summary.nextActions)],
    },
    metadata: {
      ...library.metadata,
      ...(updates.metadata ?? {}),
      notes: [...(updates.metadata?.notes ?? library.metadata.notes)],
    },
  });
