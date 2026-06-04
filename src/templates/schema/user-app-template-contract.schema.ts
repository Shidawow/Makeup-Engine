import type { TemplatePublishPackageCompatibility } from './template-publish-package.schema';

export const USER_APP_TEMPLATE_CONTRACT_SCHEMA_VERSION =
  'user-app-template-contract-v0.1' as const;

export type UserAppCompatibilityTarget =
  | 'ios-app-v0'
  | 'web-app-v0'
  | 'backend-template-service-v0'
  | 'unknown';

export type UserAppMakeupDifficulty = 'easy' | 'medium' | 'advanced';

export type UserAppMakeupCategory =
  | 'daily'
  | 'natural'
  | 'glam'
  | 'editorial'
  | 'event'
  | 'unknown';

export type UserAppRegionType =
  | 'skin-prep'
  | 'base'
  | 'brows'
  | 'eyeshadow'
  | 'eyeliner'
  | 'lashes'
  | 'blush'
  | 'contour'
  | 'highlight'
  | 'lips'
  | 'setting'
  | 'unknown';

export type UserAppStepIntensity = 'low' | 'medium' | 'high';

export interface UserAppTemplateCompatibility {
  target: UserAppCompatibilityTarget;
  schemaVersion: typeof USER_APP_TEMPLATE_CONTRACT_SCHEMA_VERSION;
  compatible: boolean;
  sourcePackageCompatibility?: TemplatePublishPackageCompatibility;
  warnings: string[];
  blockingIssues: string[];
}

export interface UserAppTemplateReadiness {
  ready: boolean;
  totalTemplates: number;
  readyTemplates: number;
  blockedTemplates: number;
  warningCount: number;
  blockingIssueCount: number;
}

export interface UserAppTemplateValidationResult {
  valid: boolean;
  warnings: string[];
  blockingIssues: string[];
  readiness: UserAppTemplateReadiness;
}

export interface UserAppToolSuggestion {
  toolId: string;
  displayName: string;
  toolType: string;
  required: boolean;
  usageNotes: string[];
}

export interface UserAppProductSuggestion {
  productId: string;
  displayName: string;
  productCategory: string;
  colorHint?: string;
  finish?: string;
  required: boolean;
  usageNotes: string[];
}

export interface UserAppVisualReference {
  referenceId: string;
  referenceKind: 'artifact-reference' | 'evidence-reference' | 'lineage-reference';
  description: string;
}

export interface UserAppMakeupStep {
  stepId: string;
  order: number;
  title: string;
  instructionText: string;
  region: UserAppRegionType;
  technique: string;
  targetEffect: string;
  colorHint?: string;
  intensity: UserAppStepIntensity;
  toolIds: string[];
  productIds: string[];
  estimatedSeconds: number;
  commonMistakes: string[];
  correctionTips: string[];
  visualReference?: UserAppVisualReference;
  evidenceReferences: string[];
  warnings: string[];
}

export interface UserAppRegionInstruction {
  regionId: string;
  regionType: UserAppRegionType;
  displayName: string;
  normalizedRegionReference: string;
  applicationAreaDescription: string;
  intensityRange: {
    min: number;
    max: number;
    recommended: number;
  };
  blendDirection: string;
  edgeSoftness: 'crisp' | 'soft' | 'diffused';
  symmetryHint: string;
  userGuidanceText: string;
}

export interface UserAppTemplateLineage {
  sourcePublishPackageId: string;
  sourceLibraryEntryId: string;
  sourceTemplateId: string;
  sourceTemplateVersion: string;
  sourceProductionBatchId?: string;
  sourceProductionTaskId?: string;
  sourceImageId?: string;
  evidenceReferences: string[];
  localOnly: true;
  onlinePublished: false;
}

export interface UserAppTemplateDisplayHints {
  heroLabel: string;
  cardSubtitle: string;
  colorChips: string[];
  cautionBadges: string[];
  sortPriority: number;
}

export interface UserAppTemplateMetadata {
  sourcePackageId: string;
  sourceLibraryEntryId: string;
  sourcePackageVersion: string;
  evidenceReady: boolean;
  qualityScore?: number;
  localOnly: true;
  onlinePublished: false;
  notes: string[];
}

export interface UserAppTemplate {
  appTemplateId: string;
  sourceLibraryEntryId: string;
  sourceTemplateId: string;
  templateVersion: string;
  title: string;
  subtitle: string;
  styleTags: string[];
  makeupCategory: UserAppMakeupCategory;
  difficulty: UserAppMakeupDifficulty;
  estimatedDurationMinutes: number;
  suitableOccasions: string[];
  suitableFaceFeatures?: string[];
  requiredTools: UserAppToolSuggestion[];
  optionalTools: UserAppToolSuggestion[];
  productSuggestions: UserAppProductSuggestion[];
  steps: UserAppMakeupStep[];
  regionInstructions: UserAppRegionInstruction[];
  safetyNotes: string[];
  appDisplayHints: UserAppTemplateDisplayHints;
  lineage: UserAppTemplateLineage;
  compatibility: UserAppTemplateCompatibility;
  metadata: UserAppTemplateMetadata;
  createdAt: string;
}

export interface UserAppTemplatePackageSummary {
  totalTemplates: number;
  totalSteps: number;
  totalRegionInstructions: number;
  difficultyCounts: Record<UserAppMakeupDifficulty, number>;
  styleTags: string[];
  estimatedDurationMinutes: {
    min: number;
    max: number;
    average: number;
  };
}

export interface UserAppTemplatePackage {
  schemaVersion: typeof USER_APP_TEMPLATE_CONTRACT_SCHEMA_VERSION;
  packageId: string;
  packageName: string;
  packageVersion: string;
  compatibilityTarget: UserAppCompatibilityTarget;
  createdAt: string;
  sourcePublishPackageId: string;
  sourcePublishPackageVersion: string;
  templates: UserAppTemplate[];
  compatibility: UserAppTemplateCompatibility;
  validation: UserAppTemplateValidationResult;
  summary: UserAppTemplatePackageSummary;
  localOnly: true;
  onlinePublished: false;
  exportNotes: string[];
}
