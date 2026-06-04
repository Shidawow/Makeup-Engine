import type {
  UserAppMakeupDifficulty,
  UserAppMakeupStep,
  UserAppProductSuggestion,
  UserAppRegionInstruction,
  UserAppTemplate,
  UserAppTemplatePackage,
  UserAppToolSuggestion,
} from '../templates/schema';
import {
  validateNoRuntimeOnlyReferences,
  validateUserAppTemplate,
  validateUserAppTemplatePackage,
} from '../template-engine/app-contract';
import type { UserAppTemplateProgress } from './userAppProgress';

export type UserAppShellReadinessStatus = 'ready' | 'warning' | 'blocked' | 'empty';

export interface UserAppShellPackageSummaryViewModel {
  packageId?: string;
  packageName: string;
  packageVersion?: string;
  compatibilityTarget?: string;
  templateCount: number;
  totalSteps: number;
  totalRegionInstructions: number;
  averageDurationMinutes: number;
  styleTags: string[];
  localOnly: true;
  onlinePublished: false;
}

export interface UserAppTemplateCardViewModel {
  appTemplateId: string;
  title: string;
  subtitle: string;
  difficulty: UserAppMakeupDifficulty;
  estimatedDurationMinutes: number;
  styleTags: string[];
  suitableOccasions: string[];
  stepCount: number;
  warningCount: number;
  blockingIssueCount: number;
  status: UserAppShellReadinessStatus;
}

export interface UserAppGuidanceChecklistItem {
  id: string;
  label: string;
  required: boolean;
  missing: boolean;
  usageNotes: string[];
}

export interface UserAppStepGuidanceViewModel {
  stepId: string;
  progressLabel: string;
  stepCategory: string;
  userFriendlyInstructionText: string;
  shortInstructionSummary: string;
  detailedInstruction: string;
  toolChecklist: UserAppGuidanceChecklistItem[];
  productChecklist: UserAppGuidanceChecklistItem[];
  regionGuidanceSummary: string;
  commonMistakes: string[];
  correctionTips: string[];
  warningMessages: string[];
  blockedReason?: string;
  nextAction: string;
  emptyStates: string[];
}

export interface UserAppStepViewModel {
  stepId: string;
  order: number;
  title: string;
  instructionText: string;
  region: string;
  technique: string;
  targetEffect: string;
  colorHint?: string;
  intensity: string;
  toolIds: string[];
  productIds: string[];
  estimatedSeconds: number;
  commonMistakes: string[];
  correctionTips: string[];
  evidenceReferences: string[];
  warnings: string[];
  matchingRegionInstructionId?: string;
  compatibilityIssues: string[];
  guidance: UserAppStepGuidanceViewModel;
}

export interface UserAppRegionInstructionViewModel {
  regionId: string;
  regionType: string;
  displayName: string;
  normalizedRegionReference: string;
  applicationAreaDescription: string;
  intensityLabel: string;
  blendDirection: string;
  edgeSoftness: string;
  symmetryHint: string;
  userGuidanceText: string;
}

export interface UserAppToolProductViewModel {
  requiredTools: UserAppToolSuggestion[];
  optionalTools: UserAppToolSuggestion[];
  productSuggestions: UserAppProductSuggestion[];
  stepToolProductLinks: Array<{
    stepId: string;
    stepTitle: string;
    tools: UserAppToolSuggestion[];
    products: UserAppProductSuggestion[];
    missingToolIds: string[];
    missingProductIds: string[];
  }>;
  warnings: string[];
}

export interface UserAppTemplateDetailViewModel {
  appTemplateId: string;
  title: string;
  subtitle: string;
  styleTags: string[];
  difficulty: UserAppMakeupDifficulty;
  estimatedDurationMinutes: number;
  suitableOccasions: string[];
  safetyNotes: string[];
  steps: UserAppStepViewModel[];
  currentStep: UserAppStepViewModel | null;
  previousStepId?: string;
  nextStepId?: string;
  regionInstructions: UserAppRegionInstructionViewModel[];
  toolsAndProducts: UserAppToolProductViewModel;
  progress?: {
    currentStepId?: string;
    completedStepIds: string[];
    skippedStepIds: string[];
    progressPercent: number;
  };
  warnings: string[];
  blockingIssues: string[];
  status: UserAppShellReadinessStatus;
  lineageSummary: {
    sourcePublishPackageId: string;
    sourceLibraryEntryId: string;
    sourceTemplateId: string;
    sourceTemplateVersion: string;
    localOnly: true;
    onlinePublished: false;
  };
}

export interface UserAppCompatibilityViewModel {
  status: UserAppShellReadinessStatus;
  target?: string;
  canEnterStepGuide: boolean;
  warnings: string[];
  blockingIssues: string[];
  runtimeReferenceIssues: string[];
  nextAction: string;
  localOnlyDisclaimer: string;
}

export interface UserAppShellViewModel {
  hasPackage: boolean;
  packageSummary: UserAppShellPackageSummaryViewModel;
  templates: UserAppTemplateCardViewModel[];
  selectedTemplate: UserAppTemplateDetailViewModel | null;
  selection: {
    requestedTemplateId?: string;
    selectedTemplateId?: string;
    fallbackApplied: boolean;
    fallbackReason?: string;
  };
  compatibility: UserAppCompatibilityViewModel;
  emptyStates: string[];
}

export interface CreateUserAppShellViewModelInput {
  packageData?: UserAppTemplatePackage | null;
  selectedTemplateId?: string;
  currentStepId?: string;
  progress?: UserAppTemplateProgress;
}

const uniqueStrings = (items: readonly string[]): string[] => Array.from(new Set(items));

const statusFromIssues = (
  blockingIssueCount: number,
  warningCount: number,
): UserAppShellReadinessStatus => {
  if (blockingIssueCount > 0) {
    return 'blocked';
  }

  if (warningCount > 0) {
    return 'warning';
  }

  return 'ready';
};

const sortSteps = (steps: readonly UserAppMakeupStep[]): UserAppMakeupStep[] =>
  [...steps].sort((left, right) =>
    left.order === right.order
      ? left.stepId.localeCompare(right.stepId)
      : left.order - right.order,
  );

const findSelectedTemplate = (
  packageData: UserAppTemplatePackage,
  selectedTemplateId?: string,
): {
  template: UserAppTemplate | null;
  selectedTemplateId?: string;
  fallbackApplied: boolean;
  fallbackReason?: string;
} => {
  const exactTemplate = selectedTemplateId
    ? packageData.templates.find((template) => template.appTemplateId === selectedTemplateId)
    : undefined;

  if (exactTemplate) {
    return {
      template: exactTemplate,
      selectedTemplateId: exactTemplate.appTemplateId,
      fallbackApplied: false,
    };
  }

  const firstTemplate = [...packageData.templates].sort((left, right) =>
    left.appDisplayHints.sortPriority === right.appDisplayHints.sortPriority
      ? left.appTemplateId.localeCompare(right.appTemplateId)
      : right.appDisplayHints.sortPriority - left.appDisplayHints.sortPriority,
  )[0];

  return {
    template: firstTemplate ?? null,
    selectedTemplateId: firstTemplate?.appTemplateId,
    fallbackApplied: Boolean(selectedTemplateId && firstTemplate),
    fallbackReason:
      selectedTemplateId && firstTemplate
        ? 'Requested template was not found; selected the first available template.'
        : undefined,
  };
};

const formatIntensity = (instruction: UserAppRegionInstruction): string =>
  `${instruction.intensityRange.min}-${instruction.intensityRange.max}, recommended ${instruction.intensityRange.recommended}`;

const regionLabels: Record<string, string> = {
  'skin-prep': '妆前准备',
  base: '底妆',
  brows: '眉毛',
  eyeshadow: '眼影',
  eyeliner: '眼线',
  lashes: '睫毛',
  blush: '腮红',
  contour: '修容',
  highlight: '高光',
  lips: '唇妆',
  setting: '定妆',
  unknown: '未指定区域',
};

const intensityLabels: Record<string, string> = {
  low: '轻薄',
  medium: '适中',
  high: '明显',
};

const emptyText = (value: string | undefined, fallback: string): string =>
  value?.trim() ? value : fallback;

const toDisplayList = (items: readonly string[], fallback: string): string[] =>
  items.length > 0 ? [...items] : [fallback];

export const createUserFriendlyWarningMessage = (message: string): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes('no required tools') || normalized.includes('has no required tools')) {
    return '这套妆容没有列出必备工具，请先由运营补充刷具或上妆工具建议。';
  }
  if (normalized.includes('no product suggestions') || normalized.includes('has no product suggestions')) {
    return '这套妆容没有列出产品建议，用户仍可预览步骤，但真实跟练前需要补充产品信息。';
  }
  if (normalized.includes('missing tool')) {
    return '某个步骤引用了未登记的工具，跟练时可能不知道该用什么。';
  }
  if (normalized.includes('missing product')) {
    return '某个步骤引用了未登记的产品，跟练时可能不知道该用哪类产品。';
  }
  if (normalized.includes('evidence confidence')) {
    return '这一步的证据置信度需要复核，建议先由运营确认颜色或强度。';
  }
  if (normalized.includes('small screens')) {
    return '小屏幕上需要检查颜色强度和提示是否足够清楚。';
  }

  return message;
};

export const createUserFriendlyBlockedMessage = (message: string): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes('object url') || normalized.includes('blob:')) {
    return '模板包含临时资源引用（object URL），刷新后可能失效，不能用于用户侧指导。';
  }
  if (normalized.includes('local absolute path')) {
    return '模板包含本机路径（local absolute path），其他设备无法读取，不能用于用户侧指导。';
  }
  if (normalized.includes('image bytes') || normalized.includes('inline bytes')) {
    return '模板包含内联图片数据（image bytes），体积和隐私风险过高，不能用于用户侧指导。';
  }
  if (normalized.includes('reactstate') || normalized.includes('runtime-only data')) {
    return '模板包含运行时 UI 状态，不能写入用户侧消费包。';
  }
  if (normalized.includes('missing instructiontext')) {
    return '这一步缺少具体操作说明，暂时不能开始指导。';
  }
  if (normalized.includes('missing app region')) {
    return '这一步缺少上妆区域，暂时不能开始指导。';
  }
  if (normalized.includes('missing matching region instruction')) {
    return '这一步缺少具体上妆区域说明，暂时不能开始指导。';
  }
  if (normalized.includes('missing app-facing makeup steps')) {
    return '这套模板没有可展示的化妆步骤，暂时不能开始指导。';
  }
  if (normalized.includes('missing app-facing region instructions')) {
    return '这套模板没有区域说明，暂时不能开始指导。';
  }
  if (normalized.includes('not in deterministic order')) {
    return '步骤顺序不稳定，需要先修正顺序后才能用于跟练。';
  }
  if (normalized.includes('compatibility target is unknown')) {
    return '模板没有声明目标 App 兼容版本，需要先补充兼容目标。';
  }
  if (normalized.includes('package contains no app templates')) {
    return '当前 package 没有可用妆容模板。';
  }
  if (normalized.includes('no userapptemplatepackage loaded')) {
    return '还没有加载可用于预览的用户侧模板包。';
  }

  return message;
};

export const summarizeStepForUser = (input: {
  step: UserAppMakeupStep;
  matchingRegion?: UserAppRegionInstruction;
}): string => {
  const regionLabel = regionLabels[input.step.region] ?? input.step.region;
  const technique = emptyText(input.step.technique, '按模板建议上妆');
  const targetEffect = emptyText(input.step.targetEffect, '完成当前区域效果');

  if (input.matchingRegion) {
    return `${regionLabel}：${technique}，重点是${targetEffect}。`;
  }

  return `${regionLabel}：${technique}，但这一步还缺少可解释的区域说明。`;
};

const createChecklistItems = <T extends {
  required: boolean;
  usageNotes: string[];
}>(input: {
  ids: readonly string[];
  byId: Map<string, T>;
  getLabel: (item: T, id: string) => string;
}): UserAppGuidanceChecklistItem[] =>
  input.ids.map((id) => {
    const item = input.byId.get(id);

    return {
      id,
      label: item ? input.getLabel(item, id) : `未登记项目：${id}`,
      required: item?.required ?? true,
      missing: !item,
      usageNotes: item ? [...item.usageNotes] : ['这项引用尚未在模板中登记。'],
    };
  });

const createStepGuidanceViewModel = (input: {
  step: UserAppMakeupStep;
  totalSteps: number;
  matchingRegion?: UserAppRegionInstruction;
  toolById: Map<string, UserAppToolSuggestion>;
  productById: Map<string, UserAppProductSuggestion>;
  compatibilityIssues: readonly string[];
}): UserAppStepGuidanceViewModel => {
  const instructionText = input.step.instructionText.trim();
  const regionLabel = regionLabels[input.step.region] ?? input.step.region;
  const toolChecklist = createChecklistItems({
    ids: input.step.toolIds,
    byId: input.toolById,
    getLabel: (tool) => tool.displayName,
  });
  const productChecklist = createChecklistItems({
    ids: input.step.productIds,
    byId: input.productById,
    getLabel: (product) =>
      `${product.displayName}${product.colorHint ? `（${product.colorHint}）` : ''}`,
  });
  const blockedReason =
    !instructionText
      ? createUserFriendlyBlockedMessage(`step ${input.step.stepId} missing instructionText`)
      : input.step.region === 'unknown'
        ? createUserFriendlyBlockedMessage(`step ${input.step.stepId} missing app region`)
        : input.compatibilityIssues[0]
          ? createUserFriendlyBlockedMessage(input.compatibilityIssues[0])
          : undefined;
  const warningMessages = uniqueStrings([
    ...input.step.warnings.map(createUserFriendlyWarningMessage),
    ...toolChecklist
      .filter((item) => item.missing)
      .map(() => createUserFriendlyWarningMessage('missing tool')),
    ...productChecklist
      .filter((item) => item.missing)
      .map(() => createUserFriendlyWarningMessage('missing product')),
  ]);

  return {
    stepId: input.step.stepId,
    progressLabel: `第 ${input.step.order} 步 / 共 ${input.totalSteps} 步`,
    stepCategory: regionLabel,
    userFriendlyInstructionText:
      instructionText || '这一步还没有具体操作说明，请先补充后再开始跟练。',
    shortInstructionSummary: summarizeStepForUser({
      step: input.step,
      matchingRegion: input.matchingRegion,
    }),
    detailedInstruction: [
      instructionText || '缺少详细操作说明。',
      input.step.colorHint ? `颜色参考：${input.step.colorHint}。` : '',
      `强度建议：${intensityLabels[input.step.intensity] ?? input.step.intensity}。`,
      input.step.estimatedSeconds > 0 ? `预计用时：${input.step.estimatedSeconds} 秒。` : '',
    ]
      .filter(Boolean)
      .join(' '),
    toolChecklist,
    productChecklist,
    regionGuidanceSummary: input.matchingRegion
      ? `${input.matchingRegion.displayName}：${input.matchingRegion.userGuidanceText}`
      : '这一步缺少具体上妆区域说明，暂时不能开始指导。',
    commonMistakes: toDisplayList(input.step.commonMistakes, '暂无常见错误提示。'),
    correctionTips: toDisplayList(input.step.correctionTips, '暂无修正建议。'),
    warningMessages,
    blockedReason,
    nextAction: blockedReason
      ? '请先修正这一步的模板信息，再开始跟练。'
      : warningMessages.length > 0
        ? '可以继续预览；完成本步骤前请注意上方提示。'
        : '完成后可以标记完成，或进入下一步。',
    emptyStates: [
      ...(!instructionText ? ['step-missing-instruction'] : []),
      ...(input.step.region === 'unknown' ? ['step-missing-region'] : []),
      ...(!input.matchingRegion ? ['step-missing-region-instruction'] : []),
      ...(toolChecklist.length === 0 ? ['step-no-tools'] : []),
      ...(productChecklist.length === 0 ? ['step-no-products'] : []),
    ],
  };
};

export const createUserAppPackageSummaryViewModel = (
  packageData?: UserAppTemplatePackage | null,
): UserAppShellPackageSummaryViewModel => {
  if (!packageData) {
    return {
      packageName: 'No UserAppTemplatePackage loaded',
      templateCount: 0,
      totalSteps: 0,
      totalRegionInstructions: 0,
      averageDurationMinutes: 0,
      styleTags: [],
      localOnly: true,
      onlinePublished: false,
    };
  }

  return {
    packageId: packageData.packageId,
    packageName: packageData.packageName,
    packageVersion: packageData.packageVersion,
    compatibilityTarget: packageData.compatibilityTarget,
    templateCount: packageData.templates.length,
    totalSteps: packageData.summary.totalSteps,
    totalRegionInstructions: packageData.summary.totalRegionInstructions,
    averageDurationMinutes: packageData.summary.estimatedDurationMinutes.average,
    styleTags: [...packageData.summary.styleTags],
    localOnly: true,
    onlinePublished: false,
  };
};

export const createUserAppTemplateCards = (
  packageData: UserAppTemplatePackage,
): UserAppTemplateCardViewModel[] =>
  [...packageData.templates]
    .sort((left, right) =>
      left.appDisplayHints.sortPriority === right.appDisplayHints.sortPriority
        ? left.appTemplateId.localeCompare(right.appTemplateId)
        : right.appDisplayHints.sortPriority - left.appDisplayHints.sortPriority,
    )
    .map((template) => {
      const validation = validateUserAppTemplate(template);

      return {
        appTemplateId: template.appTemplateId,
        title: template.title,
        subtitle: template.subtitle,
        difficulty: template.difficulty,
        estimatedDurationMinutes: template.estimatedDurationMinutes,
        styleTags: [...template.styleTags],
        suitableOccasions: [...template.suitableOccasions],
        stepCount: template.steps.length,
        warningCount: validation.warnings.length,
        blockingIssueCount: validation.blockingIssues.length,
        status: statusFromIssues(
          validation.blockingIssues.length,
          validation.warnings.length,
        ),
      };
    });

export const createUserAppRegionInstructionViewModels = (
  template: UserAppTemplate,
): UserAppRegionInstructionViewModel[] =>
  [...template.regionInstructions]
    .sort((left, right) => left.regionId.localeCompare(right.regionId))
    .map((instruction) => ({
      regionId: instruction.regionId,
      regionType: instruction.regionType,
      displayName: instruction.displayName,
      normalizedRegionReference: instruction.normalizedRegionReference,
      applicationAreaDescription: instruction.applicationAreaDescription,
      intensityLabel: formatIntensity(instruction),
      blendDirection: instruction.blendDirection,
      edgeSoftness: instruction.edgeSoftness,
      symmetryHint: instruction.symmetryHint,
      userGuidanceText: instruction.userGuidanceText,
    }));

export const createUserAppStepViewModels = (
  template: UserAppTemplate,
): UserAppStepViewModel[] => {
  const regionByType = new Map(
    template.regionInstructions.map((instruction) => [
      instruction.regionType,
      instruction,
    ]),
  );
  const toolById = new Map(
    [...template.requiredTools, ...template.optionalTools].map((tool) => [
      tool.toolId,
      tool,
    ]),
  );
  const productById = new Map(
    template.productSuggestions.map((product) => [product.productId, product]),
  );
  const totalSteps = template.steps.length;

  return sortSteps(template.steps).map((step) => {
    const matchingRegion = regionByType.get(step.region);
    const compatibilityIssues =
      step.region !== 'unknown' && !matchingRegion
        ? [`step ${step.stepId} missing matching region instruction for ${step.region}`]
        : [];

    return {
      stepId: step.stepId,
      order: step.order,
      title: step.title,
      instructionText: step.instructionText,
      region: step.region,
      technique: step.technique,
      targetEffect: step.targetEffect,
      colorHint: step.colorHint,
      intensity: step.intensity,
      toolIds: [...step.toolIds],
      productIds: [...step.productIds],
      estimatedSeconds: step.estimatedSeconds,
      commonMistakes: [...step.commonMistakes],
      correctionTips: [...step.correctionTips],
      evidenceReferences: [...step.evidenceReferences],
      warnings: [...step.warnings],
      matchingRegionInstructionId: matchingRegion?.regionId,
      compatibilityIssues,
      guidance: createStepGuidanceViewModel({
        step,
        totalSteps,
        matchingRegion,
        toolById,
        productById,
        compatibilityIssues,
      }),
    };
  });
};

export const createUserAppToolProductViewModel = (
  template: UserAppTemplate,
): UserAppToolProductViewModel => {
  const tools = [...template.requiredTools, ...template.optionalTools];
  const toolById = new Map(tools.map((tool) => [tool.toolId, tool]));
  const productById = new Map(
    template.productSuggestions.map((product) => [product.productId, product]),
  );
  const stepToolProductLinks = sortSteps(template.steps).map((step) => {
    const stepTools = step.toolIds
      .map((toolId) => toolById.get(toolId))
      .filter((tool): tool is UserAppToolSuggestion => Boolean(tool));
    const products = step.productIds
      .map((productId) => productById.get(productId))
      .filter((product): product is UserAppProductSuggestion => Boolean(product));

    return {
      stepId: step.stepId,
      stepTitle: step.title,
      tools: stepTools,
      products,
      missingToolIds: step.toolIds.filter((toolId) => !toolById.has(toolId)),
      missingProductIds: step.productIds.filter(
        (productId) => !productById.has(productId),
      ),
    };
  });

  return {
    requiredTools: [...template.requiredTools].sort((left, right) =>
      left.toolId.localeCompare(right.toolId),
    ),
    optionalTools: [...template.optionalTools].sort((left, right) =>
      left.toolId.localeCompare(right.toolId),
    ),
    productSuggestions: [...template.productSuggestions].sort((left, right) =>
      left.productId.localeCompare(right.productId),
    ),
    stepToolProductLinks,
    warnings: [
      ...(template.requiredTools.length === 0
        ? [createUserFriendlyWarningMessage('template has no required tools')]
        : []),
      ...(template.productSuggestions.length === 0
        ? [createUserFriendlyWarningMessage('template has no product suggestions')]
        : []),
      ...stepToolProductLinks.flatMap((link) => [
        ...link.missingToolIds.map(
          () => createUserFriendlyWarningMessage('missing tool'),
        ),
        ...link.missingProductIds.map(
          () => createUserFriendlyWarningMessage('missing product'),
        ),
      ]),
    ],
  };
};

export const createUserAppTemplateDetailViewModel = (input: {
  template: UserAppTemplate;
  currentStepId?: string;
  progress?: UserAppTemplateProgress;
}): UserAppTemplateDetailViewModel => {
  const validation = validateUserAppTemplate(input.template);
  const steps = createUserAppStepViewModels(input.template);
  const selectedStepId =
    input.currentStepId && steps.some((step) => step.stepId === input.currentStepId)
      ? input.currentStepId
      : input.progress?.currentStepId && steps.some((step) => step.stepId === input.progress?.currentStepId)
        ? input.progress.currentStepId
        : steps[0]?.stepId;
  const currentStepIndex = selectedStepId
    ? steps.findIndex((step) => step.stepId === selectedStepId)
    : -1;
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  return {
    appTemplateId: input.template.appTemplateId,
    title: input.template.title,
    subtitle: input.template.subtitle,
    styleTags: [...input.template.styleTags],
    difficulty: input.template.difficulty,
    estimatedDurationMinutes: input.template.estimatedDurationMinutes,
    suitableOccasions: [...input.template.suitableOccasions],
    safetyNotes: [...input.template.safetyNotes],
    steps,
    currentStep,
    previousStepId: currentStepIndex > 0 ? steps[currentStepIndex - 1].stepId : undefined,
    nextStepId:
      currentStepIndex >= 0 && currentStepIndex < steps.length - 1
        ? steps[currentStepIndex + 1].stepId
        : undefined,
    regionInstructions: createUserAppRegionInstructionViewModels(input.template),
    toolsAndProducts: createUserAppToolProductViewModel(input.template),
    progress: input.progress
      ? {
          currentStepId: input.progress.currentStepId,
          completedStepIds: [...input.progress.completedStepIds],
          skippedStepIds: [...input.progress.skippedStepIds],
          progressPercent: input.progress.progressPercent,
        }
      : undefined,
    warnings: uniqueStrings(validation.warnings.map(createUserFriendlyWarningMessage)),
    blockingIssues: uniqueStrings(
      validation.blockingIssues.map(createUserFriendlyBlockedMessage),
    ),
    status: statusFromIssues(
      validation.blockingIssues.length,
      validation.warnings.length,
    ),
    lineageSummary: {
      sourcePublishPackageId: input.template.lineage.sourcePublishPackageId,
      sourceLibraryEntryId: input.template.lineage.sourceLibraryEntryId,
      sourceTemplateId: input.template.lineage.sourceTemplateId,
      sourceTemplateVersion: input.template.lineage.sourceTemplateVersion,
      localOnly: true,
      onlinePublished: false,
    },
  };
};

export const createUserAppCompatibilityViewModel = (
  packageData?: UserAppTemplatePackage | null,
): UserAppCompatibilityViewModel => {
  if (!packageData) {
    return {
      status: 'empty',
      canEnterStepGuide: false,
      warnings: [],
      blockingIssues: [createUserFriendlyBlockedMessage('No UserAppTemplatePackage loaded.')],
      runtimeReferenceIssues: [],
      nextAction: '请先加载通过校验的 UserAppTemplatePackage，再开始分步指导。',
      localOnlyDisclaimer:
        '这是本地 contract-driven prototype，不是正式 App 或线上发布。',
    };
  }

  const validation = validateUserAppTemplatePackage(packageData);
  const runtimeReferenceIssues = validateNoRuntimeOnlyReferences(packageData);
  const blockingIssues = uniqueStrings([
    ...validation.blockingIssues,
    ...runtimeReferenceIssues,
  ]);
  const warnings = uniqueStrings(validation.warnings);

  return {
    status: statusFromIssues(blockingIssues.length, warnings.length),
    target: packageData.compatibilityTarget,
    canEnterStepGuide: blockingIssues.length === 0 && packageData.templates.length > 0,
    warnings: warnings.map(createUserFriendlyWarningMessage),
    blockingIssues: blockingIssues.map(createUserFriendlyBlockedMessage),
    runtimeReferenceIssues: runtimeReferenceIssues.map(createUserFriendlyBlockedMessage),
    nextAction:
      blockingIssues.length > 0
        ? '请先修正阻断问题，再开始分步跟练。'
        : warnings.length > 0
          ? '可以进入本地预览，但需要把提醒持续展示给用户。'
          : '可以开始本地分步指导预览。',
    localOnlyDisclaimer:
      '本地 MVP Shell 只消费 UserAppTemplatePackage，不上传、不发布、不训练、不使用相机或 AR。',
  };
};

export const createUserAppShellViewModel = (
  input: CreateUserAppShellViewModelInput,
): UserAppShellViewModel => {
  const compatibility = createUserAppCompatibilityViewModel(input.packageData);
  const packageSummary = createUserAppPackageSummaryViewModel(input.packageData);

  if (!input.packageData) {
    return {
      hasPackage: false,
      packageSummary,
      templates: [],
      selectedTemplate: null,
      selection: {
        requestedTemplateId: input.selectedTemplateId,
        fallbackApplied: false,
      },
      compatibility,
      emptyStates: ['no-package'],
    };
  }

  const selection = findSelectedTemplate(input.packageData, input.selectedTemplateId);
  const templates = createUserAppTemplateCards(input.packageData);
  const selectedTemplate = selection.template
    ? createUserAppTemplateDetailViewModel({
        template: selection.template,
        currentStepId: input.currentStepId,
        progress: input.progress,
      })
    : null;

  return {
    hasPackage: true,
    packageSummary,
    templates,
    selectedTemplate,
    selection: {
      requestedTemplateId: input.selectedTemplateId,
      selectedTemplateId: selection.selectedTemplateId,
      fallbackApplied: selection.fallbackApplied,
      fallbackReason: selection.fallbackReason,
    },
    compatibility,
    emptyStates: [
      ...(input.packageData.templates.length === 0 ? ['package-no-templates'] : []),
      ...(selectedTemplate && selectedTemplate.steps.length === 0
        ? ['template-no-steps']
        : []),
      ...(selectedTemplate && selectedTemplate.regionInstructions.length === 0
        ? ['template-no-region-instructions']
        : []),
      ...(selectedTemplate &&
      selectedTemplate.toolsAndProducts.requiredTools.length === 0 &&
      selectedTemplate.toolsAndProducts.optionalTools.length === 0
        ? ['template-no-tools']
        : []),
      ...(selectedTemplate &&
      selectedTemplate.toolsAndProducts.productSuggestions.length === 0
        ? ['template-no-products']
        : []),
    ],
  };
};

export const summarizeUserAppShellViewModel = (
  viewModel: UserAppShellViewModel,
): string =>
  JSON.stringify({
    hasPackage: viewModel.hasPackage,
    packageId: viewModel.packageSummary.packageId,
    templates: viewModel.templates.length,
    selectedTemplateId: viewModel.selection.selectedTemplateId,
    status: viewModel.compatibility.status,
    canEnterStepGuide: viewModel.compatibility.canEnterStepGuide,
    warnings: viewModel.compatibility.warnings.length,
    blockingIssues: viewModel.compatibility.blockingIssues.length,
    localOnly: true,
  });
