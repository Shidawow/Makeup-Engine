import type {
  UserAppConsumptionExport,
  UserAppConsumptionManifest,
} from '../schema/user-app-consumption-manifest.schema';
import type {
  UserAppCompatibilityTarget,
  UserAppTemplate,
  UserAppTemplatePackage,
} from '../schema/user-app-template-contract.schema';
import { stableHash, stableStringify } from './datasetExport';

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

export const createUserAppConsumptionChecksums = (
  templates: readonly UserAppTemplate[],
): Record<string, string> =>
  templates.reduce<Record<string, string>>((checksums, template) => {
    checksums[template.appTemplateId] = stableHash({
      appTemplateId: template.appTemplateId,
      sourceTemplateId: template.sourceTemplateId,
      templateVersion: template.templateVersion,
      steps: template.steps.map((step) => ({
        stepId: step.stepId,
        order: step.order,
        instructionText: step.instructionText,
      })),
      lineage: template.lineage,
    });
    return checksums;
  }, {});

export const createUserAppConsumptionManifest = (input: {
  packageData: UserAppTemplatePackage;
  target?: UserAppCompatibilityTarget;
  generatedAt?: string;
  notes?: readonly string[];
}): UserAppConsumptionManifest => {
  const checksums = createUserAppConsumptionChecksums(input.packageData.templates);
  const generatedAt = input.generatedAt ?? now();
  const target = input.target ?? input.packageData.compatibilityTarget;

  return {
    schemaVersion: 'user-app-consumption-manifest-v0.1',
    manifestId: `user-app-consumption-manifest-${stableHash({
      packageId: input.packageData.packageId,
      packageVersion: input.packageData.packageVersion,
      target,
      generatedAt,
    })}`,
    appTemplatePackageId: input.packageData.packageId,
    appTemplatePackageVersion: input.packageData.packageVersion,
    generatedAt,
    compatibilityTarget: target,
    entryCount: input.packageData.templates.length,
    entries: input.packageData.templates.map((template) => ({
      appTemplateId: template.appTemplateId,
      sourceLibraryEntryId: template.sourceLibraryEntryId,
      sourceTemplateId: template.sourceTemplateId,
      templateVersion: template.templateVersion,
      title: template.title,
      styleTags: [...template.styleTags],
      difficulty: template.difficulty,
      estimatedDurationMinutes: template.estimatedDurationMinutes,
      stepCount: template.steps.length,
      regionInstructionCount: template.regionInstructions.length,
      checksum: checksums[template.appTemplateId] ?? '',
    })),
    readiness: {
      ready: input.packageData.validation.valid,
      target,
      templateCount: input.packageData.templates.length,
      warningCount: input.packageData.validation.warnings.length,
      blockingIssueCount: input.packageData.validation.blockingIssues.length,
      notes: [
        'local consumption manifest only',
        'not backend publication',
        'not a user app implementation',
        ...(input.notes ?? []),
      ],
    },
    sourcePublishPackageId: input.packageData.sourcePublishPackageId,
    localOnly: true,
    onlinePublished: false,
    checksums,
    notes: [
      'no object URLs',
      'no local absolute paths',
      'no large image bytes',
      'no React state',
      ...(input.notes ?? []),
    ],
  };
};

export const exportUserAppTemplatePackageJson = (
  packageData: UserAppTemplatePackage,
): string => stableStringify(stripUndefined(packageData));

export const exportUserAppConsumptionHandoff = (
  packageData: UserAppTemplatePackage,
): string =>
  stableStringify(
    stripUndefined({
      packageId: packageData.packageId,
      packageName: packageData.packageName,
      packageVersion: packageData.packageVersion,
      compatibilityTarget: packageData.compatibilityTarget,
      sourcePublishPackageId: packageData.sourcePublishPackageId,
      validation: packageData.validation,
      summary: packageData.summary,
      localOnlyDisclaimer:
        'UserAppTemplatePackage is local/export contract data, not online publication and not a user app.',
      entries: packageData.templates.map((template) => ({
        appTemplateId: template.appTemplateId,
        sourceLibraryEntryId: template.sourceLibraryEntryId,
        sourceTemplateId: template.sourceTemplateId,
        templateVersion: template.templateVersion,
        title: template.title,
        difficulty: template.difficulty,
        estimatedDurationMinutes: template.estimatedDurationMinutes,
        styleTags: template.styleTags,
        stepCount: template.steps.length,
        regionInstructionCount: template.regionInstructions.length,
        lineage: template.lineage,
      })),
    }),
  );

export const summarizeUserAppConsumptionExport = (
  packageData: UserAppTemplatePackage,
): string =>
  stableStringify(
    stripUndefined({
      packageId: packageData.packageId,
      target: packageData.compatibilityTarget,
      templates: packageData.templates.length,
      readiness: packageData.validation.readiness,
      localOnly: true,
    }),
  );

export const createUserAppConsumptionExport = (input: {
  packageData: UserAppTemplatePackage;
  target?: UserAppCompatibilityTarget;
  exportedAt?: string;
}): UserAppConsumptionExport => {
  const manifest = createUserAppConsumptionManifest({
    packageData: input.packageData,
    target: input.target,
    generatedAt: input.exportedAt,
  });

  return {
    schemaVersion: 'user-app-consumption-export-v0.1',
    exportedAt: input.exportedAt ?? now(),
    packageId: input.packageData.packageId,
    packageVersion: input.packageData.packageVersion,
    compatibilityTarget: input.target ?? input.packageData.compatibilityTarget,
    manifest,
    readiness: input.packageData.validation.readiness,
    checksums: manifest.checksums,
    localOnlyDisclaimer:
      'This export is a local user app consumption contract, not online release, backend upload, or training data.',
  };
};

