import type {
  TemplateLibrary,
  TemplateLibraryEntry,
  TemplateLibraryEntryIssue,
  TemplateLibraryEntryStatus,
} from '../../templates/schema/template-library.schema';
import { stableHash } from '../../templates/storage/datasetExport';
import {
  compareTemplateVersions,
  createTemplateVersionChangeLog,
  createInitialTemplateVersion,
} from './templateVersioning';
import { createTemplateLibrarySummary } from './productionToLibrary';

const now = () => new Date().toISOString();

const issue = (
  code: string,
  message: string,
  severity: TemplateLibraryEntryIssue['severity'] = 'blocking',
  source: TemplateLibraryEntryIssue['source'] = 'library-review',
): TemplateLibraryEntryIssue => ({ code, message, severity, source });

const nextVersion = (entry: TemplateLibraryEntry): string =>
  entry.versionHistory[entry.versionHistory.length - 1]?.version ?? createInitialTemplateVersion();

const updateHistory = (
  entry: TemplateLibraryEntry,
  changeType: 'patch' | 'minor' | 'major' | 'status-change' | 'initial',
  reason: string,
  notes: string[] = [],
  createdAt = now(),
): TemplateLibraryEntry['versionHistory'] => {
  const currentVersion = nextVersion(entry);
  const version =
    changeType === 'initial'
      ? currentVersion
      : changeType === 'status-change'
        ? currentVersion
        : changeType === 'patch'
          ? `${currentVersion}`
          : currentVersion;

  return [
    ...entry.versionHistory,
    createTemplateVersionChangeLog({
      previousVersion: currentVersion,
      nextVersion: version,
      changeType,
      reason,
      notes,
      createdAt,
    }),
  ];
};

const withEntry = (
  library: TemplateLibrary,
  nextEntry: TemplateLibraryEntry,
): TemplateLibrary => {
  const entries = library.entries
    .filter((entry) => entry.libraryEntryId !== nextEntry.libraryEntryId)
    .concat(nextEntry)
    .sort((left, right) => left.libraryEntryId.localeCompare(right.libraryEntryId));

  const nextLibrary: TemplateLibrary = {
    ...library,
    entries,
    updatedAt: nextEntry.updatedAt,
    summary: createTemplateLibrarySummary({ ...library, entries } as TemplateLibrary),
    manifest: {
      ...library.manifest,
      generatedAt: nextEntry.updatedAt,
      entryCount: entries.length,
      packageReadyEntryIds: entries
        .filter((entry) => entry.status === 'ready_for_package' || entry.status === 'packaged' || entry.status === 'local_published')
        .map((entry) => entry.libraryEntryId),
      entryStatuses: entries.reduce<TemplateLibrary['manifest']['entryStatuses']>(
        (counts, entry) => {
          counts[entry.status] = (counts[entry.status] ?? 0) + 1;
          return counts;
        },
        {
          draft: 0,
          imported_from_production: 0,
          needs_library_review: 0,
          ready_for_package: 0,
          packaged: 0,
          local_published: 0,
          archived: 0,
          deprecated: 0,
          rejected: 0,
        },
      ),
    },
    issues: entries.flatMap((entry) => entry.issues),
  };

  return nextLibrary;
};

const assertTransition = (
  entry: TemplateLibraryEntry,
  nextStatus: TemplateLibraryEntryStatus,
): { valid: boolean; issues: TemplateLibraryEntryIssue[] } => {
  const issues: TemplateLibraryEntryIssue[] = [];

  if (entry.status === nextStatus) {
    return { valid: true, issues };
  }

  const allowed: Record<TemplateLibraryEntryStatus, readonly TemplateLibraryEntryStatus[]> = {
    draft: ['imported_from_production', 'needs_library_review', 'rejected'],
    imported_from_production: ['needs_library_review', 'ready_for_package', 'rejected'],
    needs_library_review: ['ready_for_package', 'rejected', 'archived', 'deprecated'],
    ready_for_package: ['packaged', 'rejected', 'archived', 'deprecated'],
    packaged: ['local_published', 'archived', 'deprecated'],
    local_published: ['archived', 'deprecated'],
    archived: ['deprecated'],
    deprecated: [],
    rejected: [],
  };

  if (!allowed[entry.status].includes(nextStatus)) {
    issues.push(issue('invalid-transition', `entry status ${entry.status} cannot move directly to ${nextStatus}`));
  }

  if (nextStatus === 'packaged' && entry.status !== 'ready_for_package') {
    issues.push(issue('ready-for-package-required', 'ready_for_package 才能 packaged'));
  }

  if (nextStatus === 'local_published' && entry.status !== 'packaged') {
    issues.push(issue('packaged-required', 'packaged 才能 local_published'));
  }

  return { valid: issues.length === 0, issues };
};

export const createTemplateLibrary = (input: {
  libraryId?: string;
  name?: string;
  createdAt?: string;
} = {}): TemplateLibrary => {
  const createdAt = input.createdAt ?? now();

  return {
    schemaVersion: 'template-library-v0.1',
    libraryId: input.libraryId ?? `template-library-${stableHash({ name: input.name ?? 'Template Library', createdAt })}`,
    name: input.name ?? 'Template Library',
    createdAt,
    updatedAt: createdAt,
    entries: [],
    manifest: {
      schemaVersion: 'template-library-manifest-v0.1',
      manifestId: `template-library-manifest-${stableHash({ libraryId: input.libraryId ?? input.name ?? 'Template Library' })}`,
      libraryId: input.libraryId ?? `template-library-${stableHash({ name: input.name ?? 'Template Library', createdAt })}`,
      generatedAt: createdAt,
      entryCount: 0,
      entryStatuses: {
        draft: 0,
        imported_from_production: 0,
        needs_library_review: 0,
        ready_for_package: 0,
        packaged: 0,
        local_published: 0,
        archived: 0,
        deprecated: 0,
        rejected: 0,
      },
      packageReadyEntryIds: [],
      localOnly: true,
      onlinePublished: false,
      notes: ['local template library only', 'not backend publication'],
    },
    summary: {
      totalEntries: 0,
      needsReview: 0,
      readyForPackage: 0,
      packaged: 0,
      localPublished: 0,
      rejected: 0,
      archived: 0,
      deprecated: 0,
      issueCount: 0,
      nextActions: [],
    },
    issues: [],
    metadata: {
      createdBy: 'template-studio',
      localOnly: true,
      onlinePublished: false,
      notes: ['local template library only', 'package export remains local handoff metadata'],
    },
  };
};

export const validateLibraryEntryTransition = (
  entry: TemplateLibraryEntry,
  nextStatus: TemplateLibraryEntryStatus,
): { valid: boolean; issues: TemplateLibraryEntryIssue[] } => {
  const result = assertTransition(entry, nextStatus);
  const issues = [...result.issues];

  if (nextStatus === 'packaged' && entry.status !== 'ready_for_package') {
    issues.push(issue('ready-for-package-required', 'ready_for_package 才能 packaged'));
  }

  if (nextStatus === 'local_published' && entry.status !== 'packaged') {
    issues.push(issue('packaged-required', 'packaged 才能 local_published'));
  }

  if (entry.status === 'rejected' && nextStatus === 'packaged') {
    issues.push(issue('rejected-not-packaged', 'rejected entry 不能 packaged'));
  }

  return { valid: issues.length === 0, issues };
};

export const updateLibraryEntryStatus = (
  entry: TemplateLibraryEntry,
  nextStatus: TemplateLibraryEntryStatus,
  reason: string,
  notes: string[] = [],
  updatedAt = now(),
): TemplateLibraryEntry => {
  const validation = validateLibraryEntryTransition(entry, nextStatus);

  if (!validation.valid) {
    return {
      ...entry,
      issues: [...entry.issues, ...validation.issues],
      updatedAt,
    };
  }

  return {
    ...entry,
    status: nextStatus,
    versionHistory: updateHistory(entry, 'status-change', reason, notes, updatedAt),
    updatedAt,
    issues: [...entry.issues, ...validation.issues],
  };
};

export const addEntryToTemplateLibrary = (
  library: TemplateLibrary,
  entry: TemplateLibraryEntry,
): TemplateLibrary =>
  withEntry(library, {
    ...entry,
    status: entry.status,
    updatedAt: entry.updatedAt ?? library.updatedAt,
  });

export const markEntryNeedsLibraryReview = (
  entry: TemplateLibraryEntry,
  reason = 'library review required',
): TemplateLibraryEntry =>
  updateLibraryEntryStatus(entry, 'needs_library_review', reason);

export const markEntryReadyForPackage = (
  entry: TemplateLibraryEntry,
  reason = 'ready for package',
): TemplateLibraryEntry =>
  updateLibraryEntryStatus(entry, 'ready_for_package', reason);

export const markEntryPackaged = (
  entry: TemplateLibraryEntry,
  reason = 'packaged locally',
): TemplateLibraryEntry =>
  updateLibraryEntryStatus(entry, 'packaged', reason);

export const markEntryLocalPublished = (
  entry: TemplateLibraryEntry,
  reason = 'local publish confirmed',
): TemplateLibraryEntry =>
  updateLibraryEntryStatus(entry, 'local_published', reason);

export const archiveLibraryEntry = (
  entry: TemplateLibraryEntry,
  reason = 'archived',
): TemplateLibraryEntry => updateLibraryEntryStatus(entry, 'archived', reason, ['archived entry'], now());

export const deprecateLibraryEntry = (
  entry: TemplateLibraryEntry,
  reason: string,
): TemplateLibraryEntry => ({
  ...updateLibraryEntryStatus(entry, 'deprecated', reason),
  issues: [...entry.issues, issue('deprecation-reason', reason, 'warning', 'library-review')],
});

export const rejectLibraryEntry = (
  entry: TemplateLibraryEntry,
  reason: string,
): TemplateLibraryEntry => ({
  ...updateLibraryEntryStatus(entry, 'rejected', reason),
  issues: [...entry.issues, issue('rejection-reason', reason, 'blocking', 'library-review')],
});

export const summarizeTemplateLibrary = (library: TemplateLibrary): TemplateLibrary['summary'] =>
  createTemplateLibrarySummary(library);
