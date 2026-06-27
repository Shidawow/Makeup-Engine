import type {
  UserAppTemplate,
  UserAppTemplatePackage,
} from '../schema/user-app-template-contract.schema';
import { userAppTemplatePackageExample } from './user-app-template-package.example';

const clonePackage = (packageData: UserAppTemplatePackage): UserAppTemplatePackage =>
  JSON.parse(JSON.stringify(packageData)) as UserAppTemplatePackage;

const cloneTemplate = (template: UserAppTemplate): UserAppTemplate =>
  JSON.parse(JSON.stringify(template)) as UserAppTemplate;

const baseTemplate = userAppTemplatePackageExample.templates[0];

const createBronzeTemplate = (): UserAppTemplate => {
  const template = cloneTemplate(baseTemplate);

  return {
    ...template,
    appTemplateId: 'user-app-template-warm-bronze-example',
    sourceLibraryEntryId: 'template-library-entry-warm-bronze-example',
    sourceTemplateId: 'template-warm-bronze-example',
    title: '暖棕约会妆',
    subtitle: '暖棕眼影 / 蜜桃腮红 / 缎光唇色，适合晚餐和小型活动',
    styleTags: ['约会', '暖棕', '进阶练习'],
    makeupCategory: 'event',
    difficulty: 'medium',
    estimatedDurationMinutes: 12,
    suitableOccasions: ['晚餐', '小型活动'],
    appDisplayHints: {
      ...template.appDisplayHints,
      heroLabel: '暖棕约会妆',
      cardSubtitle: '暖棕色调的活动妆',
      colorChips: ['暖棕', '蜜桃玫瑰'],
      sortPriority: 70,
    },
    lineage: {
      ...template.lineage,
      sourceLibraryEntryId: 'template-library-entry-warm-bronze-example',
      sourceTemplateId: 'template-warm-bronze-example',
      sourceProductionTaskId: 'production-task-warm-bronze-example',
      sourceImageId: 'source-image-warm-bronze-example',
    },
    metadata: {
      ...template.metadata,
      sourceLibraryEntryId: 'template-library-entry-warm-bronze-example',
      qualityScore: 0.82,
      notes: ['multi-template QA fixture', 'no runtime-only references'],
    },
    compatibility: {
      ...template.compatibility,
      warnings: ['operator should verify evening intensity on small screens'],
    },
    steps: template.steps.map((step) => ({
      ...step,
      stepId: step.stepId.replace('example', 'bronze-example'),
      title:
        step.region === 'eyeshadow'
          ? '暖棕眼影加深'
          : step.region === 'blush'
            ? '蜜桃腮红提气色'
            : step.title,
      instructionText:
        step.region === 'eyeshadow'
          ? '用小号晕染刷把暖棕色压在睫毛根部上方，再向眼尾外侧轻扫。边缘用余粉晕开，保持上边界柔和。'
          : step.region === 'blush'
            ? '把蜜桃玫瑰色轻扫在脸颊外侧，向太阳穴方向晕开。先确认两边高度，再少量叠加。'
            : step.instructionText,
      technique:
        step.region === 'eyeshadow'
          ? '根部压色后向外晕染'
          : step.region === 'blush'
            ? '向外向上轻扫'
            : step.technique,
      targetEffect:
        step.region === 'eyeshadow'
          ? '增加眼部深邃感但保留柔和边缘'
          : step.region === 'blush'
            ? '增加温暖气色'
            : step.targetEffect,
      colorHint: step.region === 'eyeshadow' ? '暖棕' : step.region === 'blush' ? '蜜桃玫瑰' : step.colorHint,
      warnings:
        step.region === 'eyeshadow'
          ? ['evidence confidence warning for bronze shimmer intensity']
          : step.warnings,
      commonMistakes:
        step.region === 'eyeshadow'
          ? ['眼尾颜色一次压太重。', '上边缘没有晕开，显得像硬线。']
          : step.region === 'blush'
            ? ['腮红靠鼻翼太近。', '两边腮红高度不一致。']
            : step.commonMistakes,
      correctionTips:
        step.region === 'eyeshadow'
          ? ['用干净刷子沿上边缘小范围来回晕染。', '眼尾过重时，用刷上余粉向外带开。']
          : step.region === 'blush'
            ? ['先用干净刷子扫淡靠内侧边缘。', '站远一点检查两边高度后再补色。']
            : step.correctionTips,
    })),
  };
};

export const userAppMultiTemplatePackageExample: UserAppTemplatePackage = {
  ...clonePackage(userAppTemplatePackageExample),
  packageId: 'user-app-template-package-multi-template-v0',
  packageName: 'Multi Template QA Package',
  templates: [cloneTemplate(baseTemplate), createBronzeTemplate()],
  validation: {
    valid: true,
    warnings: [
      'operator should verify evening intensity on small screens',
      'evidence confidence warning for bronze shimmer intensity',
    ],
    blockingIssues: [],
    readiness: {
      ready: true,
      totalTemplates: 2,
      readyTemplates: 2,
      blockedTemplates: 0,
      warningCount: 2,
      blockingIssueCount: 0,
    },
  },
  summary: {
    totalTemplates: 2,
    totalSteps: 8,
    totalRegionInstructions: 8,
    difficultyCounts: { easy: 1, medium: 1, advanced: 0 },
    styleTags: ['日常', '自然', '玫瑰色', '新手友好', '约会', '暖棕', '进阶练习'],
    estimatedDurationMinutes: { min: 8, max: 12, average: 10 },
  },
  exportNotes: [
    'multi-template QA fixture',
    'no object URLs',
    'no local absolute paths',
    'no large image bytes',
  ],
};

export const userAppEmptyTemplatePackageExample: UserAppTemplatePackage = {
  ...clonePackage(userAppTemplatePackageExample),
  packageId: 'user-app-template-package-empty-v0',
  packageName: 'Empty Template QA Package',
  templates: [],
  validation: {
    valid: false,
    warnings: [],
    blockingIssues: ['package contains no app templates'],
    readiness: {
      ready: false,
      totalTemplates: 0,
      readyTemplates: 0,
      blockedTemplates: 0,
      warningCount: 0,
      blockingIssueCount: 1,
    },
  },
  summary: {
    totalTemplates: 0,
    totalSteps: 0,
    totalRegionInstructions: 0,
    difficultyCounts: { easy: 0, medium: 0, advanced: 0 },
    styleTags: [],
    estimatedDurationMinutes: { min: 0, max: 0, average: 0 },
  },
  exportNotes: ['empty package QA fixture'],
};

export const userAppPrototypeQaPackageFixtures: UserAppTemplatePackage[] = [
  userAppTemplatePackageExample,
  userAppMultiTemplatePackageExample,
  userAppEmptyTemplatePackageExample,
];
