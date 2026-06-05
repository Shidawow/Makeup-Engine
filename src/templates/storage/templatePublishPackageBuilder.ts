import type { TemplateLibrary, TemplateLibraryEntry, TemplateLibraryEntryStatus } from '../schema/template-library.schema';
import type {
  TemplatePublishPackage,
  TemplatePublishPackageCompatibility,
  TemplatePublishPackageEntry,
  TemplatePublishPackageReadiness,
  TemplatePublishPackageValidationResult,
} from '../schema/template-publish-package.schema';
import { stableHash } from './datasetExport';

const now = () => new Date().toISOString();

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

const entryStatusAllowed = new Set<TemplateLibraryEntryStatus>([
  'ready_for_package',
  'packaged',
  'local_published',
]);

const packageStatusForEntry = (status: TemplateLibraryEntryStatus): TemplatePublishPackageEntry['packageStatus'] => {
  if (status === 'local_published') {
    return 'local_published';
  }

  if (status === 'packaged') {
    return 'packaged';
  }

  return 'included';
};

export const filterPackageEntriesByStatus = (
  entries: readonly TemplateLibraryEntry[],
  statuses: readonly TemplateLibraryEntryStatus[],
): TemplateLibraryEntry[] => entries.filter((entry) => statuses.includes(entry.status));

export const validateTemplatePublishPackageReadiness = (
  packageEntries: readonly TemplatePublishPackageEntry[],
): TemplatePublishPackageValidationResult => {
  const blockingIssues: string[] = [];
  const warnings: string[] = [];

  for (const entry of packageEntries) {
    if (!entry.templateData) {
      blockingIssues.push(`entry ${entry.libraryEntryId} missing template data`);
    }

    if (!entry.evidenceSummary?.evidenceReady) {
      blockingIssues.push(`entry ${entry.libraryEntryId} missing evidence summary`);
    }

    if (!entry.lineage?.source?.sourceProductionTaskId) {
      blockingIssues.push(`entry ${entry.libraryEntryId} missing lineage`);
    }
  }

  return {
    valid: blockingIssues.length === 0,
    readiness: {
      ready: blockingIssues.length === 0,
      totalEntries: packageEntries.length,
      includedEntries: packageEntries.length,
      blockedEntries: blockingIssues.length,
      warnings,
      blockingIssues,
    },
    issues: blockingIssues,
  };
};

export const createTemplatePublishPackageChecksums = (
  entries: readonly TemplatePublishPackageEntry[],
): Record<string, string> =>
  entries.reduce<Record<string, string>>((checksums, entry) => {
    checksums[entry.libraryEntryId] = stableHash(
      stripUndefined({
        templateId: entry.templateId,
        templateVersion: entry.templateVersion,
        styleTags: entry.styleTags,
        lineage: entry.lineage,
      }),
    );
    return checksums;
  }, {});

export const createTemplatePublishPackageManifest = (input: {
  packageId: string;
  packageName: string;
  packageVersion: string;
  createdAt?: string;
  sourceLibraryId: string;
  sourceBatchIds: string[];
  entries: readonly TemplatePublishPackageEntry[];
  notes?: readonly string[];
}): TemplatePublishPackage['manifest'] => ({
  schemaVersion: 'template-publish-package-manifest-v0.1',
  manifestId: `template-publish-package-manifest-${stableHash({
    packageId: input.packageId,
    packageVersion: input.packageVersion,
    createdAt: input.createdAt ?? now(),
  })}`,
  packageId: input.packageId,
  packageName: input.packageName,
  packageVersion: input.packageVersion,
  createdAt: input.createdAt ?? now(),
  entryCount: input.entries.length,
  sourceLibraryId: input.sourceLibraryId,
  sourceBatchIds: [...new Set(input.sourceBatchIds)],
  localOnly: true,
  onlinePublished: false,
  checksums: createTemplatePublishPackageChecksums(input.entries),
  notes: [
    'local publish package only',
    'no object URLs',
    'no local absolute paths',
    'no large image bytes',
    ...(input.notes ?? []),
  ],
});

export const buildTemplatePublishPackage = (input: {
  library: TemplateLibrary;
  packageName?: string;
  packageVersion?: string;
  createdAt?: string;
  includeStatuses?: TemplateLibraryEntryStatus[];
  notes?: readonly string[];
}): TemplatePublishPackage => {
  const includedEntries = filterPackageEntriesByStatus(
    input.library.entries,
    input.includeStatuses ?? ['ready_for_package', 'packaged', 'local_published'],
  );
  const packageEntries: TemplatePublishPackageEntry[] = includedEntries
    .sort((left, right) => left.libraryEntryId.localeCompare(right.libraryEntryId))
    .map((entry) => ({
      libraryEntryId: entry.libraryEntryId,
      templateId: entry.templateId,
      templateVersion: entry.templateVersion,
      templateData: entry.makeupTemplate,
      evidenceSummary: entry.evidenceSummary,
      regionInstructions: entry.regionCoverage,
      makeupSteps: entry.makeupTemplate.steps,
      styleTags: [...entry.styleTags],
      qualitySummary: entry.qualitySummary,
      lineage: entry.lineage,
      packageStatus: packageStatusForEntry(entry.status),
    }));
  const validation = validateTemplatePublishPackageReadiness(packageEntries);
  const compatibility: TemplatePublishPackageCompatibility = {
    target: 'local-user-app-contract',
    schemaVersion: 'template-publish-package-v0.1',
    compatible: validation.valid,
    notes: [
      'package is local-only',
      'package can be handed to a future template consumer contract',
      'package does not include object URLs or large image bytes',
    ],
  };
  const packageId = `template-publish-package-${stableHash({
    libraryId: input.library.libraryId,
    packageVersion: input.packageVersion ?? input.library.updatedAt,
    entryIds: packageEntries.map((entry) => entry.libraryEntryId),
  })}`;

  return {
    schemaVersion: 'template-publish-package-v0.1',
    packageId,
    packageName: input.packageName ?? `${input.library.name} Publish Package`,
    packageVersion: input.packageVersion ?? '0.1.0',
    createdAt: input.createdAt ?? now(),
    entries: packageEntries,
    manifest: createTemplatePublishPackageManifest({
      packageId,
      packageName: input.packageName ?? `${input.library.name} Publish Package`,
      packageVersion: input.packageVersion ?? '0.1.0',
      createdAt: input.createdAt,
      sourceLibraryId: input.library.libraryId,
      sourceBatchIds: input.library.entries.map((entry) => entry.sourceProductionBatchId),
      entries: packageEntries,
      notes: input.notes,
    }),
    compatibility,
    validation,
    sourceLibraryId: input.library.libraryId,
    sourceBatchIds: [...new Set(input.library.entries.map((entry) => entry.sourceProductionBatchId))],
    checksums: createTemplatePublishPackageChecksums(packageEntries),
    exportNotes: [
      'local publish package only',
      'no object URLs',
      'no local absolute paths',
      'no large image bytes',
      ...(input.notes ?? []),
    ],
  };
};

