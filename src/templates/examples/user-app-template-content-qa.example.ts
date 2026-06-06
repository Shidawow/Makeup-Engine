import {
  createUserAppTemplateContentQaReport,
  type UserAppTemplateContentQaReport,
} from '../../user-app/userAppTemplateContentQa';
import type { UserAppTemplate, UserAppTemplatePackage } from '../schema';
import { userAppTemplatePackageExample } from './user-app-template-package.example';

const cloneTemplate = (template: UserAppTemplate): UserAppTemplate =>
  JSON.parse(JSON.stringify(template)) as UserAppTemplate;

const clonePackage = (packageData: UserAppTemplatePackage): UserAppTemplatePackage =>
  JSON.parse(JSON.stringify(packageData)) as UserAppTemplatePackage;

const baseTemplate = userAppTemplatePackageExample.templates[0];

const allProducts = [
  {
    productId: 'product-brow-powder',
    displayName: 'Soft brow powder',
    productCategory: 'brow color',
    colorHint: 'taupe',
    finish: 'soft matte',
    required: true,
    usageNotes: ['Use a small amount and keep the brow front soft.'],
  },
  {
    productId: 'product-taupe-eyeshadow',
    displayName: 'Taupe eyeshadow',
    productCategory: 'eyeshadow',
    colorHint: 'taupe',
    finish: 'satin',
    required: true,
    usageNotes: ['Blend slowly and stop before the crease edge gets harsh.'],
  },
  ...baseTemplate.productSuggestions,
];

export const userAppTrialReadyBeginnerTemplate: UserAppTemplate = {
  ...cloneTemplate(baseTemplate),
  appTemplateId: 'user-app-trial-ready-beginner-natural',
  title: 'Beginner Soft Daily Look',
  subtitle: 'easy natural rose routine for a short practice session',
  styleTags: ['beginner', 'daily', 'natural', 'soft'],
  makeupCategory: 'natural',
  difficulty: 'easy',
  estimatedDurationMinutes: 8,
  suitableOccasions: ['daily', 'work', 'practice'],
  productSuggestions: allProducts,
  steps: baseTemplate.steps.map((step) => ({
    ...step,
    instructionText:
      step.region === 'brows'
        ? 'Use light strokes to define sparse brow areas, then brush through to keep the front soft.'
        : step.instructionText,
  })),
  appDisplayHints: {
    ...baseTemplate.appDisplayHints,
    heroLabel: 'Beginner Soft Daily Look',
    cardSubtitle: 'easy daily rose routine',
    colorChips: ['rose', 'taupe', 'soft'],
    cautionBadges: [],
    sortPriority: 98,
  },
  compatibility: {
    ...baseTemplate.compatibility,
    warnings: [],
    blockingIssues: [],
  },
  metadata: {
    ...baseTemplate.metadata,
    qualityScore: 0.92,
    notes: ['Phase 8D trial-ready content QA fixture'],
  },
};

export const userAppTrialWarningTemplate: UserAppTemplate = {
  ...cloneTemplate(userAppTrialReadyBeginnerTemplate),
  appTemplateId: 'user-app-trial-warning-polished-evening',
  title: 'Polished Evening Practice Look',
  subtitle: 'clear evening routine with a little more detail',
  styleTags: ['evening', 'polished', 'warm'],
  makeupCategory: 'event',
  difficulty: 'medium',
  estimatedDurationMinutes: 14,
  suitableOccasions: ['evening', 'practice'],
  compatibility: {
    ...baseTemplate.compatibility,
    warnings: ['review shimmer intensity with the tester before starting'],
    blockingIssues: [],
  },
};

export const userAppTrialBlockedMissingStepsTemplate: UserAppTemplate = {
  ...cloneTemplate(userAppTrialReadyBeginnerTemplate),
  appTemplateId: 'user-app-trial-blocked-missing-steps',
  title: 'Incomplete Practice Look',
  subtitle: 'missing steps fixture',
  steps: [],
};

export const userAppTrialMissingToolsTemplate: UserAppTemplate = {
  ...cloneTemplate(userAppTrialReadyBeginnerTemplate),
  appTemplateId: 'user-app-trial-revision-missing-tools',
  title: 'Missing Tool Practice Look',
  requiredTools: [],
  optionalTools: [],
};

export const userAppTrialUnclearRegionTemplate: UserAppTemplate = {
  ...cloneTemplate(userAppTrialReadyBeginnerTemplate),
  appTemplateId: 'user-app-trial-blocked-unclear-region',
  title: 'Missing Region Practice Look',
  steps: userAppTrialReadyBeginnerTemplate.steps.map((step, index) =>
    index === 0 ? { ...step, region: 'unknown' } : step,
  ),
};

export const userAppTrialTechnicalCopyTemplate: UserAppTemplate = {
  ...cloneTemplate(userAppTrialReadyBeginnerTemplate),
  appTemplateId: 'user-app-trial-blocked-technical-copy',
  title: 'Schema Contract Practice Look',
  subtitle: 'uses package schema language that should never appear to users',
  steps: userAppTrialReadyBeginnerTemplate.steps.map((step, index) =>
    index === 0
      ? {
          ...step,
          instructionText:
            'Use this UserAppTemplatePackage schema contract step before entering the readiness gate.',
        }
      : step,
  ),
};

export const userAppTemplateContentQaExamplePackage: UserAppTemplatePackage = {
  ...clonePackage(userAppTemplatePackageExample),
  packageId: 'user-app-template-content-qa-example-v0',
  packageName: 'User App Template Content QA Example Package',
  templates: [
    userAppTrialReadyBeginnerTemplate,
    userAppTrialWarningTemplate,
    userAppTrialBlockedMissingStepsTemplate,
    userAppTrialMissingToolsTemplate,
    userAppTrialUnclearRegionTemplate,
    userAppTrialTechnicalCopyTemplate,
  ],
  validation: {
    valid: true,
    warnings: ['Phase 8D fixture intentionally includes warning and blocked templates'],
    blockingIssues: [],
    readiness: {
      ready: true,
      totalTemplates: 6,
      readyTemplates: 2,
      blockedTemplates: 3,
      warningCount: 2,
      blockingIssueCount: 0,
    },
  },
  summary: {
    totalTemplates: 6,
    totalSteps: 20,
    totalRegionInstructions: 24,
    difficultyCounts: { easy: 5, medium: 1, advanced: 0 },
    styleTags: ['beginner', 'daily', 'evening', 'natural', 'polished', 'soft', 'warm'],
    estimatedDurationMinutes: { min: 8, max: 14, average: 9 },
  },
  exportNotes: [
    'Phase 8D content QA fixture',
    'local-only',
    'no real user records',
    'no training input',
  ],
};

export const userAppTemplateContentQaReadyReport: UserAppTemplateContentQaReport =
  createUserAppTemplateContentQaReport({
    packageData: userAppTemplateContentQaExamplePackage,
    template: userAppTrialReadyBeginnerTemplate,
  });

export const userAppTemplateContentQaWarningReport: UserAppTemplateContentQaReport =
  createUserAppTemplateContentQaReport({
    packageData: userAppTemplateContentQaExamplePackage,
    template: userAppTrialWarningTemplate,
  });

export const userAppTemplateContentQaBlockedReport: UserAppTemplateContentQaReport =
  createUserAppTemplateContentQaReport({
    packageData: userAppTemplateContentQaExamplePackage,
    template: userAppTrialTechnicalCopyTemplate,
  });
