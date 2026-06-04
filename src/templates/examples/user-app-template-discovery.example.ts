import {
  createDefaultUserLocalPreferences,
  type UserLocalPreferences,
} from '../../user-app';
import type {
  UserAppMakeupStep,
  UserAppTemplate,
  UserAppTemplatePackage,
} from '../schema/user-app-template-contract.schema';
import { userAppTemplatePackageExample } from './user-app-template-package.example';

const cloneTemplate = (template: UserAppTemplate): UserAppTemplate =>
  JSON.parse(JSON.stringify(template)) as UserAppTemplate;

const clonePackage = (packageData: UserAppTemplatePackage): UserAppTemplatePackage =>
  JSON.parse(JSON.stringify(packageData)) as UserAppTemplatePackage;

const baseTemplate = userAppTemplatePackageExample.templates[0];

const withStepIds = (
  steps: readonly UserAppMakeupStep[],
  suffix: string,
): UserAppMakeupStep[] =>
  steps.map((step, index) => ({
    ...step,
    stepId: `${step.stepId}-${suffix}-${index + 1}`,
    order: index + 1,
  }));

const createTemplateVariant = (input: {
  id: string;
  title: string;
  subtitle: string;
  styleTags: string[];
  difficulty: UserAppTemplate['difficulty'];
  estimatedDurationMinutes: number;
  suitableOccasions: string[];
  sortPriority: number;
  requiredToolMode?: 'minimal' | 'base' | 'heavy' | 'none';
  stepMode?: 'short' | 'base' | 'long' | 'invalid-order' | 'missing-region';
  warning?: string;
}): UserAppTemplate => {
  const template = cloneTemplate(baseTemplate);
  const shortSteps = template.steps.slice(0, 3);
  const longSteps = [
    ...template.steps,
    {
      ...template.steps[1],
      stepId: 'app-step-discovery-extra-liner',
      order: 5,
      title: 'Soft liner define',
      instructionText: 'Use a small brush to soften the lash line without a sharp wing.',
      region: 'eyeliner' as const,
      technique: 'define',
      targetEffect: 'polished lash line',
      toolIds: ['tool-detail-brush'],
      productIds: ['product-taupe-eyeshadow'],
      estimatedSeconds: 70,
    },
    {
      ...template.steps[3],
      stepId: 'app-step-discovery-extra-setting',
      order: 6,
      title: 'Set the finish',
      instructionText: 'Press lightly around the center of the face to keep the finish clean.',
      region: 'setting' as const,
      technique: 'press',
      targetEffect: 'longer wear',
      toolIds: ['tool-sponge'],
      productIds: ['product-soft-blush'],
      estimatedSeconds: 45,
    },
  ];
  const selectedSteps =
    input.stepMode === 'short'
      ? shortSteps
      : input.stepMode === 'long'
        ? longSteps
        : input.stepMode === 'missing-region'
          ? template.steps.map((step, index) =>
              index === 0 ? { ...step, region: 'unknown' as const } : step,
            )
          : input.stepMode === 'invalid-order'
            ? template.steps.map((step, index) =>
                index === 1 ? { ...step, order: 99 } : step,
              )
            : template.steps;
  const extraRegionInstructions =
    input.stepMode === 'long'
      ? [
          {
            regionId: `app-region-eyeliner-${input.id}`,
            regionType: 'eyeliner' as const,
            displayName: 'Eyeliner',
            normalizedRegionReference: 'normalized-region:eyeliner',
            applicationAreaDescription: 'Soft lash line only; keep the wing optional.',
            intensityRange: { min: 0.1, max: 0.45, recommended: 0.25 },
            blendDirection: 'outward along the lash line',
            edgeSoftness: 'soft' as const,
            symmetryHint: 'Check both lash lines before adding depth.',
            userGuidanceText: 'Keep the liner close to the lashes and soften the edge.',
          },
          {
            regionId: `app-region-setting-${input.id}`,
            regionType: 'setting' as const,
            displayName: 'Setting',
            normalizedRegionReference: 'normalized-region:setting',
            applicationAreaDescription: 'Center face and any area that creases quickly.',
            intensityRange: { min: 0.1, max: 0.4, recommended: 0.2 },
            blendDirection: 'press and release',
            edgeSoftness: 'diffused' as const,
            symmetryHint: 'Use the same amount on both sides of the face.',
            userGuidanceText: 'Press lightly instead of dragging across finished makeup.',
          },
        ]
      : [];
  const requiredTools =
    input.requiredToolMode === 'minimal'
      ? [template.requiredTools[1]]
      : input.requiredToolMode === 'heavy'
        ? [
            ...template.requiredTools,
            {
              toolId: 'tool-detail-brush',
              displayName: 'Detail brush',
              toolType: 'brush',
              required: true,
              usageNotes: ['Use for liner and precise edges.'],
            },
            {
              toolId: 'tool-sponge',
              displayName: 'Sponge',
              toolType: 'sponge',
              required: true,
              usageNotes: ['Press softly to blend base and edges.'],
            },
            {
              toolId: 'tool-lash-curler',
              displayName: 'Lash curler',
              toolType: 'lash_curler',
              required: true,
              usageNotes: ['Use before mascara guidance in a future template.'],
            },
          ]
        : input.requiredToolMode === 'none'
          ? []
          : template.requiredTools;

  return {
    ...template,
    appTemplateId: `user-app-discovery-${input.id}`,
    sourceLibraryEntryId: `template-library-entry-discovery-${input.id}`,
    sourceTemplateId: `template-discovery-${input.id}`,
    title: input.title,
    subtitle: input.subtitle,
    styleTags: input.styleTags,
    makeupCategory: input.styleTags.includes('glam') ? 'glam' : 'natural',
    difficulty: input.difficulty,
    estimatedDurationMinutes: input.estimatedDurationMinutes,
    suitableOccasions: input.suitableOccasions,
    requiredTools,
    regionInstructions: [...template.regionInstructions, ...extraRegionInstructions],
    steps: withStepIds(selectedSteps, input.id),
    appDisplayHints: {
      ...template.appDisplayHints,
      heroLabel: input.title,
      cardSubtitle: input.subtitle,
      colorChips: input.styleTags.slice(0, 3),
      cautionBadges: input.warning ? ['warning'] : [],
      sortPriority: input.sortPriority,
    },
    compatibility: {
      ...template.compatibility,
      warnings: input.warning ? [input.warning] : [],
      blockingIssues: [],
    },
    lineage: {
      ...template.lineage,
      sourceLibraryEntryId: `template-library-entry-discovery-${input.id}`,
      sourceTemplateId: `template-discovery-${input.id}`,
      sourceProductionTaskId: `production-task-discovery-${input.id}`,
      sourceImageId: `source-image-discovery-${input.id}`,
    },
    metadata: {
      ...template.metadata,
      sourceLibraryEntryId: `template-library-entry-discovery-${input.id}`,
      notes: ['Phase 7E discovery fixture', 'no runtime-only references'],
    },
  };
};

export const userAppTemplateDiscoveryExamplePackage: UserAppTemplatePackage = {
  ...clonePackage(userAppTemplatePackageExample),
  packageId: 'user-app-template-discovery-example-v0',
  packageName: 'User App Template Discovery Example Package',
  templates: [
    createTemplateVariant({
      id: 'beginner-natural',
      title: 'Beginner Natural Five Minute Look',
      subtitle: 'easy natural routine with clear steps',
      styleTags: ['natural', 'soft', 'minimal'],
      difficulty: 'easy',
      estimatedDurationMinutes: 5,
      suitableOccasions: ['daily', 'practice'],
      sortPriority: 96,
      requiredToolMode: 'minimal',
      stepMode: 'short',
    }),
    createTemplateVariant({
      id: 'short-daily',
      title: 'Quick Daily Rose Look',
      subtitle: 'short rose routine for busy mornings',
      styleTags: ['daily', 'natural', 'rose'],
      difficulty: 'easy',
      estimatedDurationMinutes: 6,
      suitableOccasions: ['daily', 'work'],
      sortPriority: 90,
      requiredToolMode: 'minimal',
      stepMode: 'short',
    }),
    createTemplateVariant({
      id: 'minimal-tools',
      title: 'Finger Blend Minimal Look',
      subtitle: 'minimal tools and soft color payoff',
      styleTags: ['minimal', 'natural', 'soft'],
      difficulty: 'easy',
      estimatedDurationMinutes: 8,
      suitableOccasions: ['practice', 'daily'],
      sortPriority: 88,
      requiredToolMode: 'minimal',
    }),
    createTemplateVariant({
      id: 'polished-work',
      title: 'Polished Workday Look',
      subtitle: 'balanced work look with neat brows and blush',
      styleTags: ['polished', 'soft', 'work'],
      difficulty: 'medium',
      estimatedDurationMinutes: 12,
      suitableOccasions: ['work', 'daily'],
      sortPriority: 80,
    }),
    createTemplateVariant({
      id: 'glam-advanced',
      title: 'Advanced Glam Evening Look',
      subtitle: 'longer glam routine with more detail',
      styleTags: ['bold', 'glam', 'polished'],
      difficulty: 'advanced',
      estimatedDurationMinutes: 22,
      suitableOccasions: ['evening', 'special_event'],
      sortPriority: 76,
      requiredToolMode: 'heavy',
      stepMode: 'long',
    }),
    createTemplateVariant({
      id: 'tool-heavy',
      title: 'Tool Heavy Detail Practice',
      subtitle: 'practice look with extra brushes and sponge',
      styleTags: ['polished', 'practice'],
      difficulty: 'medium',
      estimatedDurationMinutes: 18,
      suitableOccasions: ['practice'],
      sortPriority: 65,
      requiredToolMode: 'heavy',
      stepMode: 'long',
    }),
    createTemplateVariant({
      id: 'warning-products',
      title: 'Warning Soft Glow Look',
      subtitle: 'usable look with operator warning',
      styleTags: ['glowy', 'soft'],
      difficulty: 'medium',
      estimatedDurationMinutes: 10,
      suitableOccasions: ['date', 'daily'],
      sortPriority: 72,
      requiredToolMode: 'none',
      warning: 'template has no required tools',
    }),
    createTemplateVariant({
      id: 'blocked-missing-region',
      title: 'Blocked Missing Region Look',
      subtitle: 'blocked fixture for recommendation boundary',
      styleTags: ['bold', 'practice'],
      difficulty: 'advanced',
      estimatedDurationMinutes: 14,
      suitableOccasions: ['practice'],
      sortPriority: 40,
      stepMode: 'missing-region',
    }),
  ],
  validation: {
    valid: false,
    warnings: ['template has no required tools'],
    blockingIssues: ['step app-step-brows-example-blocked-missing-region-1 missing app region'],
    readiness: {
      ready: false,
      totalTemplates: 8,
      readyTemplates: 7,
      blockedTemplates: 1,
      warningCount: 1,
      blockingIssueCount: 1,
    },
  },
  summary: {
    totalTemplates: 8,
    totalSteps: 35,
    totalRegionInstructions: 36,
    difficultyCounts: { easy: 3, medium: 3, advanced: 2 },
    styleTags: [
      'bold',
      'daily',
      'glam',
      'glowy',
      'minimal',
      'natural',
      'polished',
      'practice',
      'rose',
      'soft',
      'work',
    ],
    estimatedDurationMinutes: { min: 5, max: 22, average: 12 },
  },
  exportNotes: [
    'Phase 7E discovery fixture',
    'local-only recommendation placeholder data',
    'no object URLs',
    'no local absolute paths',
    'no large image bytes',
    'no base64 image data',
    'no biometric identifiers',
    'no training input',
  ],
};

export const noPreferencesRecommendationContextExample: UserLocalPreferences =
  createDefaultUserLocalPreferences({
    preferenceId: 'recommendation-no-preferences-example',
    skillLevel: 'unknown',
    availableTime: 'flexible',
    availableTools: [],
    preferredStyleTags: [],
    occasion: 'practice',
  });

export const beginnerRecommendationContextExample: UserLocalPreferences =
  createDefaultUserLocalPreferences({
    preferenceId: 'recommendation-beginner-example',
    skillLevel: 'beginner',
    guidanceVerbosity: 'detailed',
    availableTime: '10_to_20_minutes',
    availableTools: ['fingers', 'brush'],
    preferredStyleTags: ['natural', 'soft'],
    occasion: 'daily',
    comfortLevel: 'cautious',
  });

export const shortTimeRecommendationContextExample: UserLocalPreferences =
  createDefaultUserLocalPreferences({
    preferenceId: 'recommendation-short-time-example',
    skillLevel: 'beginner',
    availableTime: 'under_5_minutes',
    availableTools: ['fingers'],
    preferredStyleTags: ['minimal', 'natural'],
    occasion: 'practice',
  });

export const minimalToolsRecommendationContextExample: UserLocalPreferences =
  createDefaultUserLocalPreferences({
    preferenceId: 'recommendation-minimal-tools-example',
    skillLevel: 'beginner',
    availableTime: 'flexible',
    availableTools: [],
    preferredStyleTags: ['minimal', 'natural'],
    occasion: 'practice',
  });
