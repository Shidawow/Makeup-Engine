import type {
  UserAppCompatibilityTarget,
  UserAppMakeupStep,
  UserAppRegionInstruction,
  UserAppTemplate,
  UserAppTemplatePackage,
  UserAppTemplateValidationResult,
} from '../../templates/schema/user-app-template-contract.schema';

const objectUrlPattern = /\bblob:/i;
const dataImagePattern = /\bdata:image\//i;
const windowsPathPattern = /[A-Za-z]:\\[^"'\s]+/;
const unixLocalPathPattern = /(?:^|["'\s])\/(?:Users|home|tmp|var|private)\/[^"'\s]+/;

const collectRuntimeReferenceIssues = (value: unknown, path = '$'): string[] => {
  const issues: string[] = [];

  if (typeof value === 'string') {
    if (objectUrlPattern.test(value)) {
      issues.push(`${path} contains object URL`);
    }
    if (dataImagePattern.test(value)) {
      issues.push(`${path} contains image bytes`);
    }
    if (windowsPathPattern.test(value) || unixLocalPathPattern.test(value)) {
      issues.push(`${path} contains local absolute path`);
    }
    if (value.length > 250_000) {
      issues.push(`${path} looks like large inline bytes`);
    }
    return issues;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      issues.push(...collectRuntimeReferenceIssues(item, `${path}[${index}]`));
    });
    return issues;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, nextValue]) => {
      const lowerKey = key.toLowerCase();
      if (['objecturl', 'imagebytes', 'base64', 'reactstate'].includes(lowerKey)) {
        issues.push(`${path}.${key} is runtime-only data`);
      }
      issues.push(...collectRuntimeReferenceIssues(nextValue, `${path}.${key}`));
    });
  }

  return issues;
};

export const validateNoObjectUrls = (value: unknown): string[] =>
  collectRuntimeReferenceIssues(value).filter((issue) => issue.includes('object URL'));

export const validateNoLocalPaths = (value: unknown): string[] =>
  collectRuntimeReferenceIssues(value).filter((issue) => issue.includes('local absolute path'));

export const validateNoRuntimeOnlyReferences = (value: unknown): string[] =>
  collectRuntimeReferenceIssues(value);

export const validateUserAppMakeupSteps = (
  steps: readonly UserAppMakeupStep[],
): string[] => {
  const issues: string[] = [];
  const sortedOrders = [...steps].map((step) => step.order).sort((left, right) => left - right);

  if (steps.length === 0) {
    issues.push('template missing app-facing makeup steps');
  }

  steps.forEach((step, index) => {
    if (step.order !== sortedOrders[index]) {
      issues.push(`step ${step.stepId} is not in deterministic order`);
    }
    if (!step.title.trim()) {
      issues.push(`step ${step.stepId} missing title`);
    }
    if (!step.instructionText.trim()) {
      issues.push(`step ${step.stepId} missing instructionText`);
    }
    if (step.region === 'unknown') {
      issues.push(`step ${step.stepId} missing app region`);
    }
  });

  return issues;
};

export const validateUserAppRegionInstructions = (
  regionInstructions: readonly UserAppRegionInstruction[],
): string[] => {
  const issues =
    regionInstructions.length === 0
      ? ['template missing app-facing region instructions']
      : [];

  return [
    ...issues,
    ...regionInstructions.flatMap((instruction) => {
    const issues: string[] = [];
    if (!instruction.displayName.trim()) {
      issues.push(`region ${instruction.regionId} missing displayName`);
    }
    if (!instruction.applicationAreaDescription.trim()) {
      issues.push(`region ${instruction.regionId} missing application area`);
    }
    if (!instruction.normalizedRegionReference.trim()) {
      issues.push(`region ${instruction.regionId} missing normalized reference`);
    }
    return issues;
    }),
  ];
};

const validateStepRegionCoverage = (
  steps: readonly UserAppMakeupStep[],
  regionInstructions: readonly UserAppRegionInstruction[],
): string[] => {
  const instructionRegions = new Set(
    regionInstructions.map((instruction) => instruction.regionType),
  );

  return steps.flatMap((step) => {
    if (step.region === 'unknown' || instructionRegions.has(step.region)) {
      return [];
    }

    return [`step ${step.stepId} missing matching region instruction for ${step.region}`];
  });
};

export const validateTemplatePackageCompatibility = (input: {
  target: UserAppCompatibilityTarget;
  packageSchemaVersion: string;
}): string[] => {
  if (input.target === 'unknown') {
    return ['compatibility target is unknown'];
  }

  if (!input.packageSchemaVersion) {
    return ['package schema version is missing'];
  }

  return [];
};

export const validateUserAppTemplate = (template: UserAppTemplate): UserAppTemplateValidationResult => {
  const blockingIssues = [
    ...(!template.appTemplateId ? ['app template id is missing'] : []),
    ...(!template.sourceTemplateId ? ['source template id is missing'] : []),
    ...(!template.templateVersion ? ['template version is missing'] : []),
    ...validateUserAppMakeupSteps(template.steps),
    ...validateUserAppRegionInstructions(template.regionInstructions),
    ...validateStepRegionCoverage(template.steps, template.regionInstructions),
    ...(!template.lineage.sourceLibraryEntryId ? ['lineage source library entry is missing'] : []),
    ...validateNoRuntimeOnlyReferences(template),
  ];
  const warnings = [
    ...(template.requiredTools.length === 0 ? ['template has no required tools'] : []),
    ...(template.productSuggestions.length === 0 ? ['template has no product suggestions'] : []),
    ...template.steps.flatMap((step) => step.warnings),
    ...template.compatibility.warnings,
  ];

  return {
    valid: blockingIssues.length === 0,
    warnings,
    blockingIssues,
    readiness: {
      ready: blockingIssues.length === 0,
      totalTemplates: 1,
      readyTemplates: blockingIssues.length === 0 ? 1 : 0,
      blockedTemplates: blockingIssues.length === 0 ? 0 : 1,
      warningCount: warnings.length,
      blockingIssueCount: blockingIssues.length,
    },
  };
};

export const validateUserAppTemplatePackage = (
  packageData: UserAppTemplatePackage,
): UserAppTemplateValidationResult => {
  const templateResults = packageData.templates.map(validateUserAppTemplate);
  const packageIssues = [
    ...(!packageData.packageId ? ['app template package id is missing'] : []),
    ...(packageData.templates.length === 0 ? ['package contains no app templates'] : []),
    ...validateTemplatePackageCompatibility({
      target: packageData.compatibilityTarget,
      packageSchemaVersion: packageData.schemaVersion,
    }),
    ...validateNoRuntimeOnlyReferences(packageData),
  ];
  const blockingIssues = [
    ...packageIssues,
    ...templateResults.flatMap((result) => result.blockingIssues),
  ];
  const warnings = templateResults.flatMap((result) => result.warnings);
  const readyTemplates = templateResults.filter((result) => result.valid).length;

  return {
    valid: blockingIssues.length === 0,
    warnings,
    blockingIssues,
    readiness: {
      ready: blockingIssues.length === 0,
      totalTemplates: packageData.templates.length,
      readyTemplates,
      blockedTemplates: packageData.templates.length - readyTemplates,
      warningCount: warnings.length,
      blockingIssueCount: blockingIssues.length,
    },
  };
};

export const summarizeUserAppCompatibility = (
  packageData: UserAppTemplatePackage,
): string =>
  JSON.stringify({
    packageId: packageData.packageId,
    target: packageData.compatibilityTarget,
    valid: packageData.validation.valid,
    warnings: packageData.validation.warnings.length,
    blockingIssues: packageData.validation.blockingIssues.length,
  });
