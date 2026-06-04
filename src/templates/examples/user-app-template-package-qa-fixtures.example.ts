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
    title: 'Warm Bronze Evening Look',
    subtitle: 'bronze eyeshadow / warm blush / satin lip',
    styleTags: ['evening', 'bronze', 'warm'],
    makeupCategory: 'event',
    difficulty: 'medium',
    estimatedDurationMinutes: 12,
    suitableOccasions: ['dinner', 'event'],
    appDisplayHints: {
      ...template.appDisplayHints,
      heroLabel: 'Warm Bronze Evening Look',
      cardSubtitle: 'evening bronze look',
      colorChips: ['bronze', 'warm rose'],
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
      colorHint: step.region === 'eyeshadow' ? 'bronze' : step.colorHint,
      warnings:
        step.region === 'eyeshadow'
          ? ['evidence confidence warning for bronze shimmer intensity']
          : step.warnings,
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
    styleTags: ['bronze', 'daily', 'evening', 'natural', 'rose', 'warm'],
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
