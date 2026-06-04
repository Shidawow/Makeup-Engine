import type {
  UserAppMakeupDifficulty,
  UserAppMakeupStep,
  UserAppProductSuggestion,
  UserAppRegionInstruction,
  UserAppTemplate,
  UserAppTemplatePackage,
  UserAppToolSuggestion,
} from '../../templates/schema/user-app-template-contract.schema';
import {
  validateNoRuntimeOnlyReferences,
  validateUserAppTemplate,
  validateUserAppTemplatePackage,
} from './userAppCompatibility';

export type UserAppPrototypeReadinessStatus = 'ready' | 'warning' | 'blocked';

export type UserAppPrototypeValidationSeverity = 'blocking' | 'warning';

export type UserAppPrototypeValidationSource =
  | 'package'
  | 'template'
  | 'runtime-reference'
  | 'compatibility';

export interface UserAppPrototypeValidationIssue {
  issueId: string;
  severity: UserAppPrototypeValidationSeverity;
  source: UserAppPrototypeValidationSource;
  message: string;
  nextAction: string;
}

export interface UserAppPrototypeEmptyState {
  stateId: string;
  label: string;
  message: string;
  nextAction: string;
}

export interface UserAppPrototypeReadinessCheck {
  checkId: string;
  label: string;
  status: UserAppPrototypeReadinessStatus;
  message: string;
}

export interface UserAppPrototypeTemplateListItem {
  appTemplateId: string;
  title: string;
  subtitle: string;
  difficulty: UserAppMakeupDifficulty;
  estimatedDurationMinutes: number;
  styleTags: string[];
  makeupCategory: string;
  stepCount: number;
  regionInstructionCount: number;
  warningCount: number;
  blockingIssueCount: number;
  status: UserAppPrototypeReadinessStatus;
}

export interface UserAppPrototypeStepViewModel {
  stepId: string;
  order: number;
  title: string;
  instructionText: string;
  region: string;
  technique: string;
  targetEffect: string;
  colorHint?: string;
  intensity: string;
  estimatedSeconds: number;
  toolIds: string[];
  productIds: string[];
  commonMistakes: string[];
  correctionTips: string[];
  evidenceReferences: string[];
  warnings: string[];
}

export interface UserAppPrototypeRegionViewModel {
  regionId: string;
  displayName: string;
  regionType: string;
  applicationAreaDescription: string;
  intensityLabel: string;
  blendDirection: string;
  edgeSoftness: string;
  symmetryHint: string;
  userGuidanceText: string;
  normalizedRegionReference: string;
}

export interface UserAppPrototypeToolProductViewModel {
  requiredTools: UserAppToolSuggestion[];
  optionalTools: UserAppToolSuggestion[];
  productSuggestions: UserAppProductSuggestion[];
  requiredToolCount: number;
  optionalToolCount: number;
  productCount: number;
}

export interface UserAppPrototypeTemplateDetailViewModel {
  appTemplateId: string;
  title: string;
  subtitle: string;
  difficulty: UserAppMakeupDifficulty;
  estimatedDurationMinutes: number;
  styleTags: string[];
  suitableOccasions: string[];
  safetyNotes: string[];
  steps: UserAppPrototypeStepViewModel[];
  regionInstructions: UserAppPrototypeRegionViewModel[];
  toolProductSummary: UserAppPrototypeToolProductViewModel;
  lineageSummary: {
    sourcePublishPackageId: string;
    sourceLibraryEntryId: string;
    sourceTemplateId: string;
    sourceTemplateVersion: string;
    sourceProductionBatchId?: string;
    sourceProductionTaskId?: string;
    localOnly: true;
    onlinePublished: false;
  };
  validation: {
    status: UserAppPrototypeReadinessStatus;
    warnings: string[];
    blockingIssues: string[];
  };
  emptyStates: UserAppPrototypeEmptyState[];
}

export interface UserAppPrototypeValidationPanel {
  status: UserAppPrototypeReadinessStatus;
  valid: boolean;
  target: string;
  warningCount: number;
  blockingIssueCount: number;
  warnings: string[];
  blockingIssues: string[];
  runtimeReferenceIssues: string[];
  issues: UserAppPrototypeValidationIssue[];
  emptyStates: UserAppPrototypeEmptyState[];
  readinessChecks: UserAppPrototypeReadinessCheck[];
  localOnlyDisclaimer: string;
}

export interface UserAppPrototypeConsumerViewModel {
  packageId: string;
  packageName: string;
  packageVersion: string;
  compatibilityTarget: string;
  sourcePublishPackageId: string;
  templateCount: number;
  totalSteps: number;
  totalRegionInstructions: number;
  averageDurationMinutes: number;
  styleTags: string[];
  localOnly: true;
  onlinePublished: false;
  selection: {
    requestedTemplateId?: string;
    selectedTemplateId?: string;
    fallbackApplied: boolean;
    fallbackReason?: string;
  };
  templates: UserAppPrototypeTemplateListItem[];
  selectedTemplate: UserAppPrototypeTemplateDetailViewModel | null;
  validationPanel: UserAppPrototypeValidationPanel;
}

export interface UserAppPrototypeRoundTripReport {
  packageId: string;
  exportedByteLength: number;
  parsedTemplateCount: number;
  stable: boolean;
  beforeStatus: UserAppPrototypeReadinessStatus;
  afterStatus: UserAppPrototypeReadinessStatus;
  warningCount: number;
  blockingIssueCount: number;
  runtimeReferenceIssues: string[];
}

const statusFromIssues = (
  blockingIssueCount: number,
  warningCount: number,
): UserAppPrototypeReadinessStatus => {
  if (blockingIssueCount > 0) {
    return 'blocked';
  }

  if (warningCount > 0) {
    return 'warning';
  }

  return 'ready';
};

const sortSteps = (
  steps: readonly UserAppMakeupStep[],
): UserAppMakeupStep[] =>
  [...steps].sort((left, right) =>
    left.order === right.order
      ? left.stepId.localeCompare(right.stepId)
      : left.order - right.order,
  );

const uniqueStrings = (items: readonly string[]): string[] => Array.from(new Set(items));

const classifyIssueSource = (message: string): UserAppPrototypeValidationSource => {
  if (
    message.includes('object URL') ||
    message.includes('image bytes') ||
    message.includes('local absolute path') ||
    message.includes('runtime-only') ||
    message.includes('large inline bytes')
  ) {
    return 'runtime-reference';
  }

  if (message.includes('compatibility target') || message.includes('schema version')) {
    return 'compatibility';
  }

  if (
    message.includes('package') ||
    message.includes('local-only') ||
    message.includes('offline')
  ) {
    return 'package';
  }

  return 'template';
};

const nextActionForIssue = (message: string): string => {
  if (message.includes('object URL')) {
    return 'Rebind the artifact and export a durable reference instead of a browser object URL.';
  }

  if (message.includes('local absolute path')) {
    return 'Replace local absolute paths with package-relative lineage or artifact references.';
  }

  if (
    message.includes('image bytes') ||
    message.includes('large inline bytes') ||
    message.includes('runtime-only')
  ) {
    return 'Remove runtime-only data and keep only durable contract metadata.';
  }

  if (message.includes('region instruction')) {
    return 'Add app-facing region instructions for every guided makeup step.';
  }

  if (message.includes('makeup steps')) {
    return 'Add ordered app-facing makeup steps before using this template in the prototype consumer.';
  }

  if (message.includes('compatibility target')) {
    return 'Set a supported compatibility target such as web-app-v0 or ios-app-v0.';
  }

  if (message.includes('required tools') || message.includes('product suggestions')) {
    return 'Add operator-reviewed tools or product suggestions, or keep the warning visible for app QA.';
  }

  return 'Review the contract source package and regenerate the UserAppTemplatePackage.';
};

const createValidationIssue = (
  severity: UserAppPrototypeValidationSeverity,
  message: string,
  index: number,
): UserAppPrototypeValidationIssue => {
  const source = classifyIssueSource(message);

  return {
    issueId: `${severity}-${source}-${index}-${message
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 64)}`,
    severity,
    source,
    message,
    nextAction: nextActionForIssue(message),
  };
};

const createTemplateEmptyStates = (
  template: UserAppTemplate,
): UserAppPrototypeEmptyState[] => [
  ...(template.steps.length === 0
    ? [
        {
          stateId: 'template-no-steps',
          label: 'No steps',
          message: 'This template has no app-facing makeup steps.',
          nextAction: 'Regenerate the contract with ordered makeup steps before app QA.',
        },
      ]
    : []),
  ...(template.regionInstructions.length === 0
    ? [
        {
          stateId: 'template-no-region-instructions',
          label: 'No region instructions',
          message: 'This template has no app-facing region instructions.',
          nextAction: 'Add region guidance for each makeup step region.',
        },
      ]
    : []),
  ...(template.requiredTools.length === 0 && template.optionalTools.length === 0
    ? [
        {
          stateId: 'template-no-tools',
          label: 'No tools',
          message: 'This template does not suggest required or optional tools.',
          nextAction: 'Add tool suggestions or keep this as a visible QA warning.',
        },
      ]
    : []),
  ...(template.productSuggestions.length === 0
    ? [
        {
          stateId: 'template-no-product-suggestions',
          label: 'No product suggestions',
          message: 'This template does not include product suggestions.',
          nextAction: 'Add product suggestions or keep this as a visible QA warning.',
        },
      ]
    : []),
];

export const createPrototypeStepGuidanceViewModel = (
  template: UserAppTemplate,
): UserAppPrototypeStepViewModel[] =>
  sortSteps(template.steps).map((step) => ({
    stepId: step.stepId,
    order: step.order,
    title: step.title,
    instructionText: step.instructionText,
    region: step.region,
    technique: step.technique,
    targetEffect: step.targetEffect,
    colorHint: step.colorHint,
    intensity: step.intensity,
    estimatedSeconds: step.estimatedSeconds,
    toolIds: [...step.toolIds],
    productIds: [...step.productIds],
    commonMistakes: [...step.commonMistakes],
    correctionTips: [...step.correctionTips],
    evidenceReferences: [...step.evidenceReferences],
    warnings: [...step.warnings],
  }));

const formatIntensityRange = (
  instruction: UserAppRegionInstruction,
): string =>
  `${instruction.intensityRange.min}-${instruction.intensityRange.max} / recommended ${instruction.intensityRange.recommended}`;

export const createPrototypeRegionInstructionViewModel = (
  template: UserAppTemplate,
): UserAppPrototypeRegionViewModel[] =>
  [...template.regionInstructions]
    .sort((left, right) => left.regionId.localeCompare(right.regionId))
    .map((instruction) => ({
      regionId: instruction.regionId,
      displayName: instruction.displayName,
      regionType: instruction.regionType,
      applicationAreaDescription: instruction.applicationAreaDescription,
      intensityLabel: formatIntensityRange(instruction),
      blendDirection: instruction.blendDirection,
      edgeSoftness: instruction.edgeSoftness,
      symmetryHint: instruction.symmetryHint,
      userGuidanceText: instruction.userGuidanceText,
      normalizedRegionReference: instruction.normalizedRegionReference,
    }));

export const createPrototypeToolProductViewModel = (
  template: UserAppTemplate,
): UserAppPrototypeToolProductViewModel => ({
  requiredTools: [...template.requiredTools].sort((left, right) =>
    left.toolId.localeCompare(right.toolId),
  ),
  optionalTools: [...template.optionalTools].sort((left, right) =>
    left.toolId.localeCompare(right.toolId),
  ),
  productSuggestions: [...template.productSuggestions].sort((left, right) =>
    left.productId.localeCompare(right.productId),
  ),
  requiredToolCount: template.requiredTools.length,
  optionalToolCount: template.optionalTools.length,
  productCount: template.productSuggestions.length,
});

export const createPrototypeTemplateDetailViewModel = (
  template: UserAppTemplate,
): UserAppPrototypeTemplateDetailViewModel => {
  const validation = validateUserAppTemplate(template);
  const status = statusFromIssues(
    validation.blockingIssues.length,
    validation.warnings.length,
  );

  return {
    appTemplateId: template.appTemplateId,
    title: template.title,
    subtitle: template.subtitle,
    difficulty: template.difficulty,
    estimatedDurationMinutes: template.estimatedDurationMinutes,
    styleTags: [...template.styleTags],
    suitableOccasions: [...template.suitableOccasions],
    safetyNotes: [...template.safetyNotes],
    steps: createPrototypeStepGuidanceViewModel(template),
    regionInstructions: createPrototypeRegionInstructionViewModel(template),
    toolProductSummary: createPrototypeToolProductViewModel(template),
    lineageSummary: {
      sourcePublishPackageId: template.lineage.sourcePublishPackageId,
      sourceLibraryEntryId: template.lineage.sourceLibraryEntryId,
      sourceTemplateId: template.lineage.sourceTemplateId,
      sourceTemplateVersion: template.lineage.sourceTemplateVersion,
      sourceProductionBatchId: template.lineage.sourceProductionBatchId,
      sourceProductionTaskId: template.lineage.sourceProductionTaskId,
      localOnly: true,
      onlinePublished: false,
    },
    validation: {
      status,
      warnings: validation.warnings,
      blockingIssues: validation.blockingIssues,
    },
    emptyStates: createTemplateEmptyStates(template),
  };
};

export const createPrototypeTemplateListViewModel = (
  packageData: UserAppTemplatePackage,
): UserAppPrototypeTemplateListItem[] =>
  [...packageData.templates]
    .sort((left, right) => {
      const priorityDelta =
        right.appDisplayHints.sortPriority - left.appDisplayHints.sortPriority;
      return priorityDelta === 0
        ? left.appTemplateId.localeCompare(right.appTemplateId)
        : priorityDelta;
    })
    .map((template) => {
      const validation = validateUserAppTemplate(template);
      const warningCount = validation.warnings.length;
      const blockingIssueCount = validation.blockingIssues.length;

      return {
        appTemplateId: template.appTemplateId,
        title: template.title,
        subtitle: template.subtitle,
        difficulty: template.difficulty,
        estimatedDurationMinutes: template.estimatedDurationMinutes,
        styleTags: [...template.styleTags],
        makeupCategory: template.makeupCategory,
        stepCount: template.steps.length,
        regionInstructionCount: template.regionInstructions.length,
        warningCount,
        blockingIssueCount,
        status: statusFromIssues(blockingIssueCount, warningCount),
      };
    });

export const validatePrototypeConsumerReadiness = (
  packageData: UserAppTemplatePackage,
): UserAppPrototypeValidationPanel => {
  const validation = validateUserAppTemplatePackage(packageData);
  const runtimeReferenceIssues = validateNoRuntimeOnlyReferences(packageData);
  const blockingIssues = uniqueStrings([
    ...validation.blockingIssues,
    ...runtimeReferenceIssues,
    ...(packageData.localOnly && !packageData.onlinePublished
      ? []
      : ['prototype consumer input must remain local-only and offline']),
  ]);
  const warnings = uniqueStrings(validation.warnings);
  const emptyStates: UserAppPrototypeEmptyState[] = [
    ...(packageData.templates.length === 0
      ? [
          {
            stateId: 'package-no-templates',
            label: 'No templates',
            message: 'This package does not contain app-facing templates.',
            nextAction: 'Rebuild the UserAppTemplatePackage from a publish package with ready entries.',
          },
        ]
      : []),
    ...packageData.templates.flatMap(createTemplateEmptyStates),
  ];
  const issues = [
    ...blockingIssues.map((issue, index) =>
      createValidationIssue('blocking', issue, index),
    ),
    ...warnings.map((issue, index) =>
      createValidationIssue('warning', issue, index),
    ),
  ];
  const readinessChecks: UserAppPrototypeReadinessCheck[] = [
    {
      checkId: 'templates-present',
      label: 'Templates present',
      status: packageData.templates.length > 0 ? 'ready' : 'blocked',
      message:
        packageData.templates.length > 0
          ? `${packageData.templates.length} templates available.`
          : 'No templates are available for prototype preview.',
    },
    {
      checkId: 'runtime-references',
      label: 'Runtime-only references',
      status: runtimeReferenceIssues.length === 0 ? 'ready' : 'blocked',
      message:
        runtimeReferenceIssues.length === 0
          ? 'No object URLs, local paths, image bytes, or React state were found.'
          : `${runtimeReferenceIssues.length} runtime-only references need cleanup.`,
    },
    {
      checkId: 'compatibility-target',
      label: 'Compatibility target',
      status: packageData.compatibilityTarget === 'unknown' ? 'blocked' : 'ready',
      message: `Target: ${packageData.compatibilityTarget}`,
    },
    {
      checkId: 'warnings',
      label: 'Warnings',
      status: warnings.length > 0 ? 'warning' : 'ready',
      message:
        warnings.length > 0
          ? `${warnings.length} warnings should remain visible to the operator.`
          : 'No warning issues reported.',
    },
  ];

  return {
    status: statusFromIssues(blockingIssues.length, warnings.length),
    valid: blockingIssues.length === 0,
    target: packageData.compatibilityTarget,
    warningCount: warnings.length,
    blockingIssueCount: blockingIssues.length,
    warnings,
    blockingIssues,
    runtimeReferenceIssues,
    issues,
    emptyStates,
    readinessChecks,
    localOnlyDisclaimer:
      'Prototype consumer is read-only contract validation. It is not the real user app, backend publication, or training data.',
  };
};

export const loadUserAppTemplatePackageForPrototype = (input: {
  packageData: UserAppTemplatePackage;
  selectedTemplateId?: string;
}): UserAppPrototypeConsumerViewModel => {
  const templates = createPrototypeTemplateListViewModel(input.packageData);
  const selectedTemplateId =
    input.selectedTemplateId && templates.some((item) => item.appTemplateId === input.selectedTemplateId)
      ? input.selectedTemplateId
      : templates[0]?.appTemplateId;
  const fallbackApplied = Boolean(
    input.selectedTemplateId && input.selectedTemplateId !== selectedTemplateId,
  );
  const selectedTemplate =
    input.packageData.templates.find(
      (template) => template.appTemplateId === selectedTemplateId,
    ) ?? null;
  const validationPanel = validatePrototypeConsumerReadiness(input.packageData);

  return {
    packageId: input.packageData.packageId,
    packageName: input.packageData.packageName,
    packageVersion: input.packageData.packageVersion,
    compatibilityTarget: input.packageData.compatibilityTarget,
    sourcePublishPackageId: input.packageData.sourcePublishPackageId,
    templateCount: input.packageData.templates.length,
    totalSteps: input.packageData.summary.totalSteps,
    totalRegionInstructions: input.packageData.summary.totalRegionInstructions,
    averageDurationMinutes:
      input.packageData.summary.estimatedDurationMinutes.average,
    styleTags: [...input.packageData.summary.styleTags],
    localOnly: true,
    onlinePublished: false,
    selection: {
      requestedTemplateId: input.selectedTemplateId,
      selectedTemplateId,
      fallbackApplied,
      fallbackReason: fallbackApplied
        ? 'Requested template was not found; selected the first deterministic template.'
        : undefined,
    },
    templates,
    selectedTemplate: selectedTemplate
      ? createPrototypeTemplateDetailViewModel(selectedTemplate)
      : null,
    validationPanel,
  };
};

export const summarizePrototypeConsumer = (
  packageData: UserAppTemplatePackage,
): string => {
  const readiness = validatePrototypeConsumerReadiness(packageData);

  return JSON.stringify({
    packageId: packageData.packageId,
    target: packageData.compatibilityTarget,
    templates: packageData.templates.length,
    steps: packageData.summary.totalSteps,
    status: readiness.status,
    warnings: readiness.warningCount,
    blockingIssues: readiness.blockingIssueCount,
    localOnly: true,
  });
};

export const validatePrototypePackageRoundTrip = (
  packageData: UserAppTemplatePackage,
): UserAppPrototypeRoundTripReport => {
  const exportedJson = JSON.stringify(packageData);
  const parsedPackage = JSON.parse(exportedJson) as UserAppTemplatePackage;
  const before = validatePrototypeConsumerReadiness(packageData);
  const after = validatePrototypeConsumerReadiness(parsedPackage);

  return {
    packageId: packageData.packageId,
    exportedByteLength: exportedJson.length,
    parsedTemplateCount: parsedPackage.templates.length,
    stable: summarizePrototypeConsumer(packageData) === summarizePrototypeConsumer(parsedPackage),
    beforeStatus: before.status,
    afterStatus: after.status,
    warningCount: after.warningCount,
    blockingIssueCount: after.blockingIssueCount,
    runtimeReferenceIssues: after.runtimeReferenceIssues,
  };
};
