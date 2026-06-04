import type { MakeupStep, TemplatePublishPackage, TemplatePublishPackageEntry } from '../../templates/schema';
import type {
  UserAppCompatibilityTarget,
  UserAppMakeupCategory,
  UserAppMakeupDifficulty,
  UserAppProductSuggestion,
  UserAppTemplate,
  UserAppTemplateDisplayHints,
  UserAppTemplateLineage,
  UserAppTemplatePackage,
  UserAppToolSuggestion,
} from '../../templates/schema/user-app-template-contract.schema';
import { stableHash } from '../../templates/storage/datasetExport';
import {
  createProductSuggestionFromStep,
  createRegionInstructionsForApp,
  createToolSuggestionFromStep,
  inferStepDifficulty,
  normalizeMakeupStepsForApp,
} from './makeupStepNormalization';
import { validateUserAppTemplatePackage } from './userAppCompatibility';

const now = () => new Date().toISOString();

const uniqueById = <T>(
  items: readonly T[],
  getId: (item: T) => string,
): T[] => {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const id = getId(item);
    if (!seen.has(id)) {
      seen.add(id);
      result.push(item);
    }
  }

  return result;
};

export const extractAppStyleTags = (entry: TemplatePublishPackageEntry): string[] =>
  [...new Set([...entry.styleTags, ...entry.templateData.metadata.styleTags])].sort();

export const extractAppDifficulty = (steps: readonly MakeupStep[]): UserAppMakeupDifficulty => {
  const difficulties = steps.map(inferStepDifficulty);

  if (difficulties.includes('advanced')) {
    return 'advanced';
  }

  if (difficulties.includes('medium')) {
    return 'medium';
  }

  return 'easy';
};

export const estimateTemplateDuration = (steps: readonly MakeupStep[]): number => {
  const normalizedSteps = normalizeMakeupStepsForApp({ steps });
  const totalSeconds = normalizedSteps.reduce((sum, step) => sum + step.estimatedSeconds, 0);

  return Math.max(1, Math.ceil(totalSeconds / 60));
};

const inferCategory = (tags: readonly string[]): UserAppMakeupCategory => {
  const normalizedTags = tags.map((tag) => tag.toLowerCase());

  if (normalizedTags.some((tag) => tag.includes('glam'))) {
    return 'glam';
  }
  if (normalizedTags.some((tag) => tag.includes('editorial'))) {
    return 'editorial';
  }
  if (normalizedTags.some((tag) => tag.includes('event') || tag.includes('party'))) {
    return 'event';
  }
  if (normalizedTags.some((tag) => tag.includes('natural') || tag.includes('daily'))) {
    return 'natural';
  }

  return 'unknown';
};

export const createAppToolSuggestions = (
  steps: readonly MakeupStep[],
): UserAppToolSuggestion[] =>
  uniqueById(steps.map(createToolSuggestionFromStep), (tool) => tool.toolId).sort((left, right) =>
    left.toolId.localeCompare(right.toolId),
  );

export const createAppProductSuggestions = (
  steps: readonly MakeupStep[],
): UserAppProductSuggestion[] =>
  uniqueById(
    steps.map(createProductSuggestionFromStep),
    (product) => product.productId,
  ).sort((left, right) => left.productId.localeCompare(right.productId));

export const createAppDisplayHints = (
  entry: TemplatePublishPackageEntry,
): UserAppTemplateDisplayHints => ({
  heroLabel: entry.templateData.name,
  cardSubtitle: entry.templateData.style.signatureTraits.join(' / ') || entry.templateData.style.family,
  colorChips: [
    ...entry.templateData.style.palette.dominantFamilies,
    ...entry.templateData.style.palette.accentFamilies,
  ],
  cautionBadges: entry.evidenceSummary.evidenceReady ? [] : ['evidence warning'],
  sortPriority: entry.qualitySummary.qualityScore ? Math.round(entry.qualitySummary.qualityScore * 100) : 50,
});

export const createAppLineage = (
  entry: TemplatePublishPackageEntry,
  sourcePackage: TemplatePublishPackage,
): UserAppTemplateLineage => ({
  sourcePublishPackageId: sourcePackage.packageId,
  sourceLibraryEntryId: entry.libraryEntryId,
  sourceTemplateId: entry.templateId,
  sourceTemplateVersion: entry.templateVersion,
  sourceProductionBatchId: entry.lineage.source.sourceProductionBatchId,
  sourceProductionTaskId: entry.lineage.source.sourceProductionTaskId,
  sourceImageId: entry.lineage.source.sourceImageId,
  evidenceReferences: [...entry.evidenceSummary.references],
  localOnly: true,
  onlinePublished: false,
});

export const convertMakeupTemplateToAppSteps = (
  entry: TemplatePublishPackageEntry,
) =>
  normalizeMakeupStepsForApp({
    steps: entry.makeupSteps,
    evidenceReferences: entry.evidenceSummary.references,
  });

export const convertRegionInstructionsForApp = (entry: TemplatePublishPackageEntry) =>
  createRegionInstructionsForApp(convertMakeupTemplateToAppSteps(entry));

export const convertPublishPackageEntryToUserAppTemplate = (input: {
  entry: TemplatePublishPackageEntry;
  sourcePackage: TemplatePublishPackage;
  target?: UserAppCompatibilityTarget;
  createdAt?: string;
}): UserAppTemplate => {
  const styleTags = extractAppStyleTags(input.entry);
  const steps = convertMakeupTemplateToAppSteps(input.entry);
  const warnings = input.entry.evidenceSummary.evidenceReady
    ? []
    : [`entry ${input.entry.libraryEntryId} missing evidence summary`];
  const blockingIssues =
    input.entry.makeupSteps.length === 0
      ? [`entry ${input.entry.libraryEntryId} missing template steps`]
      : [];
  const target = input.target ?? 'web-app-v0';
  const appTemplateId = `user-app-template-${stableHash({
    packageId: input.sourcePackage.packageId,
    libraryEntryId: input.entry.libraryEntryId,
    templateVersion: input.entry.templateVersion,
  })}`;

  return {
    appTemplateId,
    sourceLibraryEntryId: input.entry.libraryEntryId,
    sourceTemplateId: input.entry.templateId,
    templateVersion: input.entry.templateVersion,
    title: input.entry.templateData.name,
    subtitle: input.entry.templateData.style.signatureTraits.join(' / ') || 'Makeup template',
    styleTags,
    makeupCategory: inferCategory(styleTags),
    difficulty: extractAppDifficulty(input.entry.makeupSteps),
    estimatedDurationMinutes: estimateTemplateDuration(input.entry.makeupSteps),
    suitableOccasions: styleTags.length > 0 ? styleTags : ['general guidance'],
    suitableFaceFeatures: input.entry.templateData.faceSuitability.profile.faceShapes,
    requiredTools: createAppToolSuggestions(input.entry.makeupSteps),
    optionalTools: [],
    productSuggestions: createAppProductSuggestions(input.entry.makeupSteps),
    steps,
    regionInstructions: createRegionInstructionsForApp(steps),
    safetyNotes: [
      'Patch test unfamiliar products before use.',
      'Stop using any product that causes irritation.',
      'This local contract is not online publication.',
    ],
    appDisplayHints: createAppDisplayHints(input.entry),
    lineage: createAppLineage(input.entry, input.sourcePackage),
    compatibility: {
      target,
      schemaVersion: 'user-app-template-contract-v0.1',
      compatible: blockingIssues.length === 0,
      sourcePackageCompatibility: input.sourcePackage.compatibility,
      warnings,
      blockingIssues,
    },
    metadata: {
      sourcePackageId: input.sourcePackage.packageId,
      sourceLibraryEntryId: input.entry.libraryEntryId,
      sourcePackageVersion: input.sourcePackage.packageVersion,
      evidenceReady: input.entry.evidenceSummary.evidenceReady,
      qualityScore: input.entry.qualitySummary.qualityScore,
      localOnly: true,
      onlinePublished: false,
      notes: [
        'converted from TemplatePublishPackage',
        'no object URLs',
        'no local absolute paths',
        'no large image bytes',
      ],
    },
    createdAt: input.createdAt ?? now(),
  };
};

const createPackageSummary = (templates: readonly UserAppTemplate[]): UserAppTemplatePackage['summary'] => {
  const durations = templates.map((template) => template.estimatedDurationMinutes);
  const styleTags = [...new Set(templates.flatMap((template) => template.styleTags))].sort();
  const average =
    durations.length === 0
      ? 0
      : Number((durations.reduce((sum, value) => sum + value, 0) / durations.length).toFixed(2));

  return {
    totalTemplates: templates.length,
    totalSteps: templates.reduce((sum, template) => sum + template.steps.length, 0),
    totalRegionInstructions: templates.reduce(
      (sum, template) => sum + template.regionInstructions.length,
      0,
    ),
    difficultyCounts: {
      easy: templates.filter((template) => template.difficulty === 'easy').length,
      medium: templates.filter((template) => template.difficulty === 'medium').length,
      advanced: templates.filter((template) => template.difficulty === 'advanced').length,
    },
    styleTags,
    estimatedDurationMinutes: {
      min: durations.length > 0 ? Math.min(...durations) : 0,
      max: durations.length > 0 ? Math.max(...durations) : 0,
      average,
    },
  };
};

export const createUserAppTemplatePackageFromPublishPackage = (input: {
  packageData: TemplatePublishPackage;
  target?: UserAppCompatibilityTarget;
  createdAt?: string;
}): UserAppTemplatePackage => {
  const target = input.target ?? 'web-app-v0';
  const eligibleEntries = input.packageData.validation.valid
    ? input.packageData.entries.filter((entry) => entry.packageStatus !== 'blocked' && entry.packageStatus !== 'excluded')
    : [];
  const templates = eligibleEntries
    .sort((left, right) => left.libraryEntryId.localeCompare(right.libraryEntryId))
    .map((entry) =>
      convertPublishPackageEntryToUserAppTemplate({
        entry,
        sourcePackage: input.packageData,
        target,
        createdAt: input.createdAt,
      }),
    );
  const packageId = `user-app-template-package-${stableHash({
    sourcePackageId: input.packageData.packageId,
    sourcePackageVersion: input.packageData.packageVersion,
    target,
  })}`;
  const basePackage: UserAppTemplatePackage = {
    schemaVersion: 'user-app-template-contract-v0.1',
    packageId,
    packageName: `${input.packageData.packageName} User App Contract`,
    packageVersion: input.packageData.packageVersion,
    compatibilityTarget: target,
    createdAt: input.createdAt ?? now(),
    sourcePublishPackageId: input.packageData.packageId,
    sourcePublishPackageVersion: input.packageData.packageVersion,
    templates,
    compatibility: {
      target,
      schemaVersion: 'user-app-template-contract-v0.1',
      compatible: input.packageData.validation.valid,
      sourcePackageCompatibility: input.packageData.compatibility,
      warnings: input.packageData.validation.readiness.warnings,
      blockingIssues: input.packageData.validation.readiness.blockingIssues,
    },
    validation: {
      valid: false,
      warnings: [],
      blockingIssues: [],
      readiness: {
        ready: false,
        totalTemplates: templates.length,
        readyTemplates: 0,
        blockedTemplates: templates.length,
        warningCount: 0,
        blockingIssueCount: 0,
      },
    },
    summary: createPackageSummary(templates),
    localOnly: true,
    onlinePublished: false,
    exportNotes: [
      'User app consumption contract only',
      'Not a user app implementation',
      'Not backend publication',
      'No object URLs',
      'No local absolute paths',
      'No large image bytes',
    ],
  };
  const validation = validateUserAppTemplatePackage(basePackage);

  return {
    ...basePackage,
    compatibility: {
      ...basePackage.compatibility,
      compatible: validation.valid,
      warnings: validation.warnings,
      blockingIssues: validation.blockingIssues,
    },
    validation,
  };
};

export const summarizeAppTemplateConversion = (
  packageData: UserAppTemplatePackage,
): string =>
  JSON.stringify({
    packageId: packageData.packageId,
    target: packageData.compatibilityTarget,
    templateCount: packageData.templates.length,
    stepCount: packageData.summary.totalSteps,
    ready: packageData.validation.valid,
  });
