import type { UserAppTemplate, UserAppTemplatePackage } from '../templates/schema';

export const USER_APP_TEMPLATE_CONTENT_QA_SCHEMA_VERSION =
  'user-app-template-content-qa-v0.1' as const;

export type UserAppTemplateContentQaStatus =
  | 'trial_ready'
  | 'ready_with_warnings'
  | 'needs_content_revision'
  | 'blocked';

export type UserAppTemplateContentQaArea =
  | 'template_title'
  | 'template_summary'
  | 'step_count'
  | 'step_instruction'
  | 'step_actionability'
  | 'region_instruction'
  | 'tools'
  | 'products'
  | 'duration'
  | 'difficulty'
  | 'recommendation_reason'
  | 'privacy_placeholder_copy'
  | 'internal_terms'
  | 'trial_suitability';

export interface UserAppTemplateContentQaIssue {
  issueId: string;
  templateId: string;
  checkId: string;
  area: UserAppTemplateContentQaArea;
  severity: 'warning' | 'revision' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppTemplateContentQaCheck {
  checkId: string;
  area: UserAppTemplateContentQaArea;
  label: string;
  status: 'passed' | 'warning' | 'needs_revision' | 'blocked';
  required: boolean;
  summary: string;
  evidence: string[];
  issues: UserAppTemplateContentQaIssue[];
  deterministic: true;
}

export interface UserAppTemplateContentQaRecommendation {
  templateId: string;
  status: UserAppTemplateContentQaStatus;
  trialEligible: boolean;
  recommendation: string;
  reasons: string[];
}

export interface UserAppTemplateContentQaReport {
  schemaVersion: typeof USER_APP_TEMPLATE_CONTENT_QA_SCHEMA_VERSION;
  packageId: string;
  templateId: string;
  templateTitle: string;
  status: UserAppTemplateContentQaStatus;
  checks: UserAppTemplateContentQaCheck[];
  issues: UserAppTemplateContentQaIssue[];
  recommendation: UserAppTemplateContentQaRecommendation;
  localOnly: true;
  deterministic: true;
  productionRelease: false;
  usesAiGeneration: false;
  callsOpenAiApi: false;
  collectsUserPhotos: false;
  writesTrainingInput: false;
  mutatesTemplatePackage: false;
}

export interface CreateUserAppTemplateContentQaReportInput {
  packageData?: UserAppTemplatePackage | null;
  template?: UserAppTemplate | null;
  templateId?: string;
  recommendationReason?: string;
  privacyPlaceholderCopy?: string;
}

const internalTechnicalTerms = [
  'contract',
  'schema',
  'package',
  'readiness gate',
  'SourceImagePackage',
  'UserAppTemplatePackage',
  'faceEmbedding',
  'biometricId',
  'training dataset',
  'object URL',
  'base64',
  '后端表',
  '数据集',
  '契约',
  '架构',
];

const actionWords = [
  'apply',
  'blend',
  'tap',
  'press',
  'define',
  'soften',
  'diffuse',
  'draw',
  'brush',
  'use',
  'lightly',
  'keep',
  'start',
  'finish',
  '涂',
  '晕染',
  '轻扫',
  '点',
  '按压',
  '描',
  '保持',
];

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 41);

const normalized = (value: string): string => value.trim().toLowerCase();

const hasText = (value: string | undefined, minLength: number): boolean =>
  Boolean(value && value.trim().length >= minLength);

const containsInternalTerm = (value: string): string[] => {
  const lower = normalized(value);
  return internalTechnicalTerms.filter((term) => lower.includes(term.toLowerCase()));
};

const issue = (
  input: Omit<UserAppTemplateContentQaIssue, 'issueId'>,
): UserAppTemplateContentQaIssue => ({
  ...input,
  issueId: `template-content-qa-${input.area}-${input.severity}-${Math.abs(
    hashText(`${input.templateId}:${input.message}`),
  )}`,
});

const checkStatus = (
  issues: readonly UserAppTemplateContentQaIssue[],
): UserAppTemplateContentQaCheck['status'] => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.some((item) => item.severity === 'revision')) return 'needs_revision';
  if (issues.length > 0) return 'warning';
  return 'passed';
};

const reportStatus = (
  issues: readonly UserAppTemplateContentQaIssue[],
): UserAppTemplateContentQaStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.some((item) => item.severity === 'revision')) return 'needs_content_revision';
  if (issues.length > 0) return 'ready_with_warnings';
  return 'trial_ready';
};

const createCheck = (input: Omit<UserAppTemplateContentQaCheck, 'deterministic'>) => ({
  ...input,
  deterministic: true as const,
});

const hasActionableInstruction = (text: string): boolean => {
  const lower = normalized(text);
  return actionWords.some((word) => lower.includes(word.toLowerCase()));
};

const getTemplate = (
  input: CreateUserAppTemplateContentQaReportInput,
): UserAppTemplate | null => {
  if (input.template) return input.template;
  if (!input.packageData) return null;
  if (input.templateId) {
    return (
      input.packageData.templates.find((template) => template.appTemplateId === input.templateId) ??
      null
    );
  }
  return input.packageData.templates[0] ?? null;
};

const createMissingTemplateReport = (
  packageId: string,
): UserAppTemplateContentQaReport => {
  const missingTemplateIssue = issue({
    templateId: 'missing-template',
    checkId: 'template-exists',
    area: 'trial_suitability',
    severity: 'blocking',
    message: '没有可供内容 QA 的模板。',
    recommendation: '先提供至少一个有效 UserAppTemplatePackage 模板。',
  });
  const checks = [
    createCheck({
      checkId: 'template-exists',
      area: 'trial_suitability',
      label: '模板存在',
      status: 'blocked',
      required: true,
      summary: '模板内容 QA 无法开始。',
      evidence: [`packageId: ${packageId}`],
      issues: [missingTemplateIssue],
    }),
  ];
  return {
    schemaVersion: USER_APP_TEMPLATE_CONTENT_QA_SCHEMA_VERSION,
    packageId,
    templateId: 'missing-template',
    templateTitle: 'Missing template',
    status: 'blocked',
    checks,
    issues: [missingTemplateIssue],
    recommendation: {
      templateId: 'missing-template',
      status: 'blocked',
      trialEligible: false,
      recommendation: '阻断进入真实用户试用。',
      reasons: ['没有模板内容。'],
    },
    localOnly: true,
    deterministic: true,
    productionRelease: false,
    usesAiGeneration: false,
    callsOpenAiApi: false,
    collectsUserPhotos: false,
    writesTrainingInput: false,
    mutatesTemplatePackage: false,
  };
};

export const createUserAppTemplateContentQaReport = (
  input: CreateUserAppTemplateContentQaReportInput = {},
): UserAppTemplateContentQaReport => {
  const packageId = input.packageData?.packageId ?? 'standalone-template-content-qa';
  const template = getTemplate(input);
  if (!template) return createMissingTemplateReport(packageId);

  const templateId = template.appTemplateId;
  const createIssue = (
    issueInput: Omit<UserAppTemplateContentQaIssue, 'issueId' | 'templateId'>,
  ) => issue({ ...issueInput, templateId });

  const titleIssues = [
    ...(hasText(template.title, 6)
      ? []
      : [
          createIssue({
            checkId: 'template-title-clarity',
            area: 'template_title',
            severity: 'revision',
            message: '模板标题过短或缺失。',
            recommendation: '使用普通用户能理解的妆容名称。',
          }),
        ]),
    ...containsInternalTerm(template.title).map((term) =>
      createIssue({
        checkId: 'template-title-clarity',
        area: 'template_title',
        severity: 'blocking',
        message: `模板标题包含技术词：${term}`,
        recommendation: '移除普通用户路径中的技术词。',
      }),
    ),
  ];

  const summaryText = `${template.subtitle} ${template.appDisplayHints.cardSubtitle}`;
  const summaryIssues = [
    ...(hasText(summaryText, 12)
      ? []
      : [
          createIssue({
            checkId: 'template-summary-clarity',
            area: 'template_summary',
            severity: 'revision',
            message: '模板摘要不足以让用户理解妆效。',
            recommendation: '补充适合场景、主要色彩或整体效果。',
          }),
        ]),
    ...containsInternalTerm(summaryText).map((term) =>
      createIssue({
        checkId: 'template-summary-clarity',
        area: 'template_summary',
        severity: 'blocking',
        message: `模板摘要包含技术词：${term}`,
        recommendation: '把摘要改成用户能直接理解的妆容描述。',
      }),
    ),
  ];

  const stepCountIssues =
    template.steps.length === 0
      ? [
          createIssue({
            checkId: 'step-count',
            area: 'step_count',
            severity: 'blocking',
            message: '模板没有步骤。',
            recommendation: '至少提供 3 个可跟练步骤。',
          }),
        ]
      : template.steps.length < 3
        ? [
            createIssue({
              checkId: 'step-count',
              area: 'step_count',
              severity: 'revision',
              message: '步骤数量不足，真实试用很难判断跟练体验。',
              recommendation: '补齐至少 3 个步骤。',
            }),
          ]
        : template.steps.length > 8
          ? [
              createIssue({
                checkId: 'step-count',
                area: 'step_count',
                severity: 'warning',
                message: '步骤较多，第一轮试用可能负担偏高。',
                recommendation: '把长流程作为备用模板，核心试用优先短流程。',
              }),
            ]
          : [];

  const stepInstructionIssues = template.steps.flatMap((step) => {
    const text = `${step.title} ${step.instructionText}`;
    return [
      ...(hasText(step.instructionText, 16)
        ? []
        : [
            createIssue({
              checkId: 'step-instruction-clarity',
              area: 'step_instruction',
              severity: 'revision',
              message: `步骤 ${step.order} 文案太短或缺失。`,
              recommendation: '补充用户能照做的动作、区域和效果。',
            }),
          ]),
      ...(!hasActionableInstruction(text)
        ? [
            createIssue({
              checkId: 'step-actionability',
              area: 'step_actionability',
              severity: 'revision',
              message: `步骤 ${step.order} 缺少明确动作。`,
              recommendation: '加入涂、晕染、轻拍、按压、描画等具体动作。',
            }),
          ]
        : []),
      ...containsInternalTerm(text).map((term) =>
        createIssue({
          checkId: 'step-internal-terms',
          area: 'internal_terms',
          severity: 'blocking',
          message: `步骤 ${step.order} 包含技术词：${term}`,
          recommendation: '普通用户步骤文案不能暴露 contract/schema/package/readiness 等词。',
        }),
      ),
    ];
  });

  const regionTypes = new Set(template.regionInstructions.map((region) => region.regionType));
  const regionIssues = [
    ...template.steps
      .filter((step) => step.region === 'unknown' || !regionTypes.has(step.region))
      .map((step) =>
        createIssue({
          checkId: 'region-instruction-coverage',
          area: 'region_instruction',
          severity: 'blocking',
          message: `步骤 ${step.order} 缺少可匹配的区域说明。`,
          recommendation: '为每个步骤区域补充用户能理解的位置、方向和边缘说明。',
        }),
      ),
    ...template.regionInstructions.flatMap((region) => {
      const text = `${region.displayName} ${region.applicationAreaDescription} ${region.blendDirection} ${region.userGuidanceText}`;
      return [
        ...(hasText(region.userGuidanceText, 14)
          ? []
          : [
              createIssue({
                checkId: 'region-instruction-clarity',
                area: 'region_instruction',
                severity: 'revision',
                message: `${region.displayName} 区域说明不够清楚。`,
                recommendation: '补充画在哪里、往哪里晕染、边缘如何处理。',
              }),
            ]),
        ...containsInternalTerm(text).map((term) =>
          createIssue({
            checkId: 'region-internal-terms',
            area: 'internal_terms',
            severity: 'blocking',
            message: `${region.displayName} 区域说明包含技术词：${term}`,
            recommendation: '区域说明应使用普通用户语言。',
          }),
        ),
      ];
    }),
  ];

  const requiredStepToolIds = new Set(template.steps.flatMap((step) => step.toolIds));
  const availableToolIds = new Set([
    ...template.requiredTools.map((tool) => tool.toolId),
    ...template.optionalTools.map((tool) => tool.toolId),
  ]);
  const missingToolIds = [...requiredStepToolIds].filter((toolId) => !availableToolIds.has(toolId));
  const toolIssues = [
    ...(template.requiredTools.length === 0
      ? [
          createIssue({
            checkId: 'tools-completeness',
            area: 'tools',
            severity: 'revision',
            message: '模板没有必备工具建议。',
            recommendation: '至少说明用户需要手指、刷子或其他可替代工具。',
          }),
        ]
      : []),
    ...missingToolIds.map((toolId) =>
      createIssue({
        checkId: 'tools-completeness',
        area: 'tools',
        severity: 'revision',
        message: `步骤引用了未说明的工具：${toolId}`,
        recommendation: '补齐工具名称和使用说明。',
      }),
    ),
  ];

  const requiredStepProductIds = new Set(template.steps.flatMap((step) => step.productIds));
  const availableProductIds = new Set(template.productSuggestions.map((product) => product.productId));
  const missingProductIds = [...requiredStepProductIds].filter(
    (productId) => !availableProductIds.has(productId),
  );
  const productIssues = [
    ...(template.productSuggestions.length === 0
      ? [
          createIssue({
            checkId: 'product-suggestions',
            area: 'products',
            severity: 'revision',
            message: '模板没有产品建议。',
            recommendation: '至少说明品类、颜色或妆效，不要求具体品牌。',
          }),
        ]
      : []),
    ...missingProductIds.map((productId) =>
      createIssue({
        checkId: 'product-suggestions',
        area: 'products',
        severity: 'warning',
        message: `步骤引用了未说明的产品：${productId}`,
        recommendation: '补充产品建议或把步骤改成无需特定产品。',
      }),
    ),
  ];

  const durationIssues =
    template.estimatedDurationMinutes <= 0
      ? [
          createIssue({
            checkId: 'duration-reasonableness',
            area: 'duration',
            severity: 'blocking',
            message: '模板时长无效。',
            recommendation: '为用户标注合理的预计分钟数。',
          }),
        ]
      : template.estimatedDurationMinutes > 18
        ? [
            createIssue({
              checkId: 'duration-reasonableness',
              area: 'duration',
              severity: 'warning',
              message: '模板时长偏长，不适合作为第一轮核心试用模板。',
              recommendation: '作为备用模板，核心试用优先 12 分钟以内。',
            }),
          ]
        : [];

  const difficultyIssues =
    template.difficulty === 'advanced'
      ? [
          createIssue({
            checkId: 'difficulty-consistency',
            area: 'difficulty',
            severity: 'warning',
            message: '高级难度模板不适合作为第一轮核心试用模板。',
            recommendation: '将高级模板放入备用集合，并标注 warning。',
          }),
        ]
      : [];

  const recommendationReason =
    input.recommendationReason ??
    `${template.title} 适合 ${template.suitableOccasions.join('、')}，${template.difficulty} 难度，预计 ${template.estimatedDurationMinutes} 分钟。`;
  const recommendationIssues = [
    ...(hasText(recommendationReason, 16)
      ? []
      : [
          createIssue({
            checkId: 'recommendation-reason-clarity',
            area: 'recommendation_reason',
            severity: 'warning',
            message: '推荐理由不够清楚。',
            recommendation: '说明适合人群、场景、时长或难度。',
          }),
        ]),
    ...containsInternalTerm(recommendationReason).map((term) =>
      createIssue({
        checkId: 'recommendation-reason-clarity',
        area: 'recommendation_reason',
        severity: 'blocking',
        message: `推荐理由包含技术词：${term}`,
        recommendation: '推荐理由应自然解释为什么适合用户。',
      }),
    ),
  ];

  const privacyCopy = input.privacyPlaceholderCopy ?? '本地练习，不上传照片，不启用相机或 AR，不用于训练。';
  const privacyIssues =
    /上传|相机|AR|训练/.test(privacyCopy) && !/暂未启用|不上传|不启用|不用于训练/.test(privacyCopy)
      ? [
          createIssue({
            checkId: 'privacy-placeholder-copy',
            area: 'privacy_placeholder_copy',
            severity: 'blocking',
            message: '隐私/占位文案可能让用户误以为照片、相机、AR 或训练已启用。',
            recommendation: '明确暂未启用、不上传、不训练。',
          }),
        ]
      : [];

  const compatibilityIssues = [
    ...template.compatibility.blockingIssues.map((blockingIssue) =>
      createIssue({
        checkId: 'trial-suitability',
        area: 'trial_suitability',
        severity: 'blocking',
        message: `模板 compatibility 阻断：${blockingIssue}`,
        recommendation: '阻断模板不能进入真实用户试用集合。',
      }),
    ),
    ...template.compatibility.warnings.map((warning) =>
      createIssue({
        checkId: 'trial-suitability',
        area: 'trial_suitability',
        severity: 'warning',
        message: `模板带有 warning：${warning}`,
        recommendation: '可作为备用模板，但必须标注 warning。',
      }),
    ),
    ...(!template.metadata.evidenceReady
      ? [
          createIssue({
            checkId: 'trial-suitability',
            area: 'trial_suitability',
            severity: 'revision',
            message: '模板证据未标记 ready。',
            recommendation: '真实试用前需要确认模板证据和内容一致。',
          }),
        ]
      : []),
  ];

  const checks = [
    createCheck({
      checkId: 'template-title-clarity',
      area: 'template_title',
      label: '标题清晰度',
      status: checkStatus(titleIssues),
      required: true,
      summary: template.title,
      evidence: [`titleLength: ${template.title.length}`],
      issues: titleIssues,
    }),
    createCheck({
      checkId: 'template-summary-clarity',
      area: 'template_summary',
      label: '摘要清晰度',
      status: checkStatus(summaryIssues),
      required: true,
      summary: template.subtitle,
      evidence: [`subtitleLength: ${template.subtitle.length}`],
      issues: summaryIssues,
    }),
    createCheck({
      checkId: 'step-count',
      area: 'step_count',
      label: '步骤数量',
      status: checkStatus(stepCountIssues),
      required: true,
      summary: `${template.steps.length} steps`,
      evidence: [`stepCount: ${template.steps.length}`],
      issues: stepCountIssues,
    }),
    createCheck({
      checkId: 'step-instruction-clarity',
      area: 'step_instruction',
      label: '步骤文案',
      status: checkStatus(stepInstructionIssues),
      required: true,
      summary: '检查步骤是否清楚、可跟练。',
      evidence: template.steps.map((step) => `${step.order}: ${step.title}`),
      issues: stepInstructionIssues,
    }),
    createCheck({
      checkId: 'region-instruction-coverage',
      area: 'region_instruction',
      label: '区域说明',
      status: checkStatus(regionIssues),
      required: true,
      summary: `${template.regionInstructions.length} region instructions`,
      evidence: template.regionInstructions.map((region) => region.displayName),
      issues: regionIssues,
    }),
    createCheck({
      checkId: 'tools-completeness',
      area: 'tools',
      label: '工具建议',
      status: checkStatus(toolIssues),
      required: true,
      summary: `${template.requiredTools.length} required tools`,
      evidence: template.requiredTools.map((tool) => tool.displayName),
      issues: toolIssues,
    }),
    createCheck({
      checkId: 'product-suggestions',
      area: 'products',
      label: '产品建议',
      status: checkStatus(productIssues),
      required: true,
      summary: `${template.productSuggestions.length} product suggestions`,
      evidence: template.productSuggestions.map((product) => product.displayName),
      issues: productIssues,
    }),
    createCheck({
      checkId: 'duration-reasonableness',
      area: 'duration',
      label: '时长合理性',
      status: checkStatus(durationIssues),
      required: true,
      summary: `${template.estimatedDurationMinutes} minutes`,
      evidence: [`estimatedDurationMinutes: ${template.estimatedDurationMinutes}`],
      issues: durationIssues,
    }),
    createCheck({
      checkId: 'difficulty-consistency',
      area: 'difficulty',
      label: '难度一致性',
      status: checkStatus(difficultyIssues),
      required: true,
      summary: template.difficulty,
      evidence: [`difficulty: ${template.difficulty}`],
      issues: difficultyIssues,
    }),
    createCheck({
      checkId: 'recommendation-reason-clarity',
      area: 'recommendation_reason',
      label: '推荐理由',
      status: checkStatus(recommendationIssues),
      required: true,
      summary: recommendationReason,
      evidence: [`reasonLength: ${recommendationReason.length}`],
      issues: recommendationIssues,
    }),
    createCheck({
      checkId: 'privacy-placeholder-copy',
      area: 'privacy_placeholder_copy',
      label: '隐私/占位文案',
      status: checkStatus(privacyIssues),
      required: true,
      summary: privacyCopy,
      evidence: ['local-only, no upload, no camera/AR, no training copy checked'],
      issues: privacyIssues,
    }),
    createCheck({
      checkId: 'trial-suitability',
      area: 'trial_suitability',
      label: '试用适配',
      status: checkStatus(compatibilityIssues),
      required: true,
      summary: '检查 warning / blocked / evidence 状态。',
      evidence: [
        `warnings: ${template.compatibility.warnings.length}`,
        `blockingIssues: ${template.compatibility.blockingIssues.length}`,
        `evidenceReady: ${String(template.metadata.evidenceReady)}`,
      ],
      issues: compatibilityIssues,
    }),
  ];

  const issues = checks.flatMap((item) => item.issues);
  const status = reportStatus(issues);
  const trialEligible = status === 'trial_ready' || status === 'ready_with_warnings';
  return {
    schemaVersion: USER_APP_TEMPLATE_CONTENT_QA_SCHEMA_VERSION,
    packageId,
    templateId,
    templateTitle: template.title,
    status,
    checks,
    issues,
    recommendation: {
      templateId,
      status,
      trialEligible,
      recommendation: trialEligible
        ? status === 'trial_ready'
          ? '可进入核心真实用户试用模板集合。'
          : '可作为备用试用模板，但必须标注 warning。'
        : '进入真实用户试用前必须修改内容。',
      reasons: [
        `${template.difficulty} difficulty`,
        `${template.estimatedDurationMinutes} minutes`,
        `${template.steps.length} steps`,
        `${template.regionInstructions.length} region instructions`,
      ],
    },
    localOnly: true,
    deterministic: true,
    productionRelease: false,
    usesAiGeneration: false,
    callsOpenAiApi: false,
    collectsUserPhotos: false,
    writesTrainingInput: false,
    mutatesTemplatePackage: false,
  };
};

export const summarizeUserAppTemplateContentQa = (
  report: UserAppTemplateContentQaReport,
): string =>
  `${report.templateTitle}: ${report.status}, ${report.issues.length} content QA issue(s), trialEligible=${String(
    report.recommendation.trialEligible,
  )}.`;
