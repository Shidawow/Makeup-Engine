import type { TemplatePublishPackage, TemplatePublishPackageEntry } from '../schema/template-publish-package.schema';
import { stableStringify } from './datasetExport';

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

export const exportTemplatePublishPackageJson = (packageData: TemplatePublishPackage): string =>
  stableStringify(stripUndefined(packageData));

export const exportTemplatePublishPackageHandoff = (packageData: TemplatePublishPackage): string =>
  stableStringify(
    stripUndefined({
      packageId: packageData.packageId,
      packageName: packageData.packageName,
      packageVersion: packageData.packageVersion,
      sourceLibraryId: packageData.sourceLibraryId,
      sourceBatchIds: packageData.sourceBatchIds,
      readiness: packageData.validation.readiness,
      compatibility: packageData.compatibility,
      exportNotes: packageData.exportNotes,
      entries: packageData.entries.map((entry) => ({
        libraryEntryId: entry.libraryEntryId,
        templateId: entry.templateId,
        templateVersion: entry.templateVersion,
        packageStatus: entry.packageStatus,
        styleTags: entry.styleTags,
        evidenceSummary: entry.evidenceSummary,
        qualitySummary: entry.qualitySummary,
        lineage: entry.lineage,
      })),
    }),
  );

export const summarizeTemplatePublishPackage = (
  packageData: TemplatePublishPackage,
): string =>
  stableStringify(
    stripUndefined({
      packageId: packageData.packageId,
      entryCount: packageData.entries.length,
      localOnly: true,
      validation: packageData.validation,
    }),
  );

export const createPackageEntryPreview = (
  entry: TemplatePublishPackageEntry,
): string =>
  stableStringify(
    stripUndefined({
      templateId: entry.templateId,
      templateVersion: entry.templateVersion,
      styleTags: entry.styleTags,
      evidenceSummary: entry.evidenceSummary,
      lineage: entry.lineage,
      qualitySummary: entry.qualitySummary,
      packageStatus: entry.packageStatus,
    }),
  );
