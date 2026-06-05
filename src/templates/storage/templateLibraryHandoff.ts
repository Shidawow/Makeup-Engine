import type { TemplateLibrary } from '../schema/template-library.schema';
import { stableStringify } from './datasetExport';
import { summarizeTemplatePublishPackage } from './templatePublishPackageExport';

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

export const exportTemplateLibraryHandoff = (library: TemplateLibrary): string =>
  stableStringify(
    stripUndefined({
      libraryId: library.libraryId,
      name: library.name,
      summary: library.summary,
      manifest: library.manifest,
      issues: library.issues,
      entries: library.entries.map((entry) => ({
        libraryEntryId: entry.libraryEntryId,
        templateId: entry.templateId,
        templateVersion: entry.templateVersion,
        status: entry.status,
        styleTags: entry.styleTags,
        evidenceSummary: entry.evidenceSummary,
        qualitySummary: entry.qualitySummary,
        reviewSummary: entry.reviewSummary,
        publishConfirmationSummary: entry.publishConfirmationSummary,
        lineage: entry.lineage,
        versionHistory: entry.versionHistory,
        issues: entry.issues,
      })),
      nextActions: library.summary.nextActions,
      limitations: [
        'local published is not online publication',
        'package export does not include object URLs or large image bytes',
        'SourceImagePackage cannot directly become a template library entry',
      ],
    }),
  );

export const createTemplateLibraryOperatorSummary = (library: TemplateLibrary): string =>
  stableStringify(
    stripUndefined({
      libraryId: library.libraryId,
      totalEntries: library.summary.totalEntries,
      readyForPackage: library.summary.readyForPackage,
      packaged: library.summary.packaged,
      localPublished: library.summary.localPublished,
    }),
  );

export const createTemplateLibraryCodexHandoff = (library: TemplateLibrary): string =>
  stableStringify(
    stripUndefined({
      libraryId: library.libraryId,
      summary: library.summary,
      manifest: library.manifest,
      nextActions: library.summary.nextActions,
    }),
  );

export const summarizeLibraryNextActions = (library: TemplateLibrary): string[] =>
  [...library.summary.nextActions];
