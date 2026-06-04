import type {
  UserAppMakeupStep,
  UserAppTemplate,
  UserAppTemplatePackage,
} from '../schema/user-app-template-contract.schema';
import { userAppMvpShellExamplePackage } from './user-app-mvp-shell.example';

const clonePackage = (packageData: UserAppTemplatePackage): UserAppTemplatePackage =>
  JSON.parse(JSON.stringify(packageData)) as UserAppTemplatePackage;

const cloneTemplate = (template: UserAppTemplate): UserAppTemplate =>
  JSON.parse(JSON.stringify(template)) as UserAppTemplate;

const basePackage = clonePackage(userAppMvpShellExamplePackage);
const completeTemplate = cloneTemplate(basePackage.templates[0]);

const shortTemplate: UserAppTemplate = {
  ...cloneTemplate(completeTemplate),
  appTemplateId: 'user-app-guidance-short-flow',
  title: '三步快速气色妆',
  subtitle: '腮红 / 唇妆 / 定妆的短流程',
  estimatedDurationMinutes: 5,
  steps: cloneTemplate(completeTemplate).steps.slice(0, 3).map((step, index) => ({
    ...step,
    stepId: `short-flow-step-${index + 1}`,
    order: index + 1,
  })),
};

const longTemplateSteps: UserAppMakeupStep[] = [
  ...cloneTemplate(completeTemplate).steps,
  ...cloneTemplate(completeTemplate).steps.slice(0, 2).map((step, index): UserAppMakeupStep => ({
    ...step,
    stepId: `long-flow-extra-step-${index + 1}`,
    order: completeTemplate.steps.length + index + 1,
    title: index === 0 ? '检查边缘过渡' : '最终定妆检查',
    instructionText:
      index === 0
        ? '照镜子检查腮红、眼影和唇线边缘，如果有明显分界，用干净刷子轻扫边缘。'
        : '用少量定妆产品压在容易出油的位置，保持妆面干净。不要覆盖已经完成的颜色层次。',
    region: index === 0 ? 'blush' : 'setting',
    technique: index === 0 ? 'soft blend' : 'press and set',
    targetEffect: index === 0 ? '边缘自然，没有硬线' : '妆面稳定但不厚重',
    warnings: index === 0 ? ['small screens need edge clarity check'] : [],
  })),
];

const longTemplate: UserAppTemplate = {
  ...cloneTemplate(completeTemplate),
  appTemplateId: 'user-app-guidance-long-flow',
  title: '完整晚宴跟练妆',
  subtitle: '多步骤长流程，用于测试跟练节奏',
  difficulty: 'advanced',
  estimatedDurationMinutes: 18,
  steps: longTemplateSteps,
};

const noToolsProductsTemplate: UserAppTemplate = {
  ...cloneTemplate(completeTemplate),
  appTemplateId: 'user-app-guidance-no-tools-products',
  title: '缺工具产品提醒模板',
  subtitle: '用于验证 warning 不阻断指导',
  requiredTools: [],
  optionalTools: [],
  productSuggestions: [],
  steps: cloneTemplate(completeTemplate).steps.map((step) => ({
    ...step,
    toolIds: [],
    productIds: [],
  })),
};

const missingRegionTemplate: UserAppTemplate = {
  ...cloneTemplate(completeTemplate),
  appTemplateId: 'user-app-guidance-missing-region',
  title: '缺区域阻断模板',
  subtitle: '用于验证缺少区域时不能进入指导',
  steps: cloneTemplate(completeTemplate).steps.map((step, index) =>
    index === 0
      ? {
          ...step,
          stepId: 'missing-region-step-1',
          region: 'unknown',
          instructionText: '',
        }
      : step,
  ),
};

const invalidOrderTemplate: UserAppTemplate = {
  ...cloneTemplate(completeTemplate),
  appTemplateId: 'user-app-guidance-invalid-order',
  title: '顺序异常阻断模板',
  subtitle: '用于验证 invalid step order',
  steps: cloneTemplate(completeTemplate).steps.map((step, index) => ({
    ...step,
    order: index === 0 ? 2 : index === 1 ? 1 : index + 1,
  })),
};

export const userAppGuidanceUxExamplePackage: UserAppTemplatePackage = {
  ...basePackage,
  packageId: 'user-app-guidance-ux-example-v0',
  packageName: 'User App Guidance UX Example Package',
  templates: [
    completeTemplate,
    shortTemplate,
    longTemplate,
    noToolsProductsTemplate,
    missingRegionTemplate,
    invalidOrderTemplate,
  ],
  summary: {
    ...basePackage.summary,
    totalTemplates: 6,
    totalSteps:
      completeTemplate.steps.length +
      shortTemplate.steps.length +
      longTemplate.steps.length +
      noToolsProductsTemplate.steps.length +
      missingRegionTemplate.steps.length +
      invalidOrderTemplate.steps.length,
    totalRegionInstructions:
      completeTemplate.regionInstructions.length +
      shortTemplate.regionInstructions.length +
      longTemplate.regionInstructions.length +
      noToolsProductsTemplate.regionInstructions.length +
      missingRegionTemplate.regionInstructions.length +
      invalidOrderTemplate.regionInstructions.length,
    difficultyCounts: { easy: 2, medium: 3, advanced: 1 },
    estimatedDurationMinutes: { min: 5, max: 18, average: 10 },
  },
  validation: {
    ...basePackage.validation,
    warnings: [
      ...basePackage.validation.warnings,
      'template has no required tools',
      'template has no product suggestions',
    ],
    blockingIssues: [
      'step missing-region-step-1 missing instructionText',
      'step missing-region-step-1 missing app region',
      'step app-step-example-1 is not in deterministic order',
    ],
    readiness: {
      ready: false,
      totalTemplates: 6,
      readyTemplates: 4,
      blockedTemplates: 2,
      warningCount: 2,
      blockingIssueCount: 3,
    },
  },
  exportNotes: [
    'Phase 7B guidance UX fixture',
    'covers complete, warning, blocked, long-flow, and short-flow states',
    'no object URLs',
    'no local absolute paths',
    'no large image bytes',
  ],
};
