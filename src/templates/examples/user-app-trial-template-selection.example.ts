import {
  createUserAppTemplateContentQaReport,
  createUserAppTrialContentReadinessReport,
  createUserAppTrialTemplateSelectionReport,
  type UserAppTrialContentReadinessReport,
  type UserAppTrialTemplateSelectionReport,
} from '../../user-app';
import type { UserAppTemplatePackage } from '../schema';
import {
  userAppTemplateContentQaExamplePackage,
  userAppTrialBlockedMissingStepsTemplate,
  userAppTrialReadyBeginnerTemplate,
  userAppTrialTechnicalCopyTemplate,
  userAppTrialWarningTemplate,
} from './user-app-template-content-qa.example';
import { userAppTemplatePackageExample } from './user-app-template-package.example';

const clonePackage = (packageData: UserAppTemplatePackage): UserAppTemplatePackage =>
  JSON.parse(JSON.stringify(packageData)) as UserAppTemplatePackage;

export const userAppTrialTemplateSelectionReadyExample: UserAppTrialTemplateSelectionReport =
  createUserAppTrialTemplateSelectionReport({
    packageData: {
      ...clonePackage(userAppTemplatePackageExample),
      packageId: 'user-app-trial-template-selection-ready-v0',
      templates: [userAppTrialReadyBeginnerTemplate],
      summary: {
        totalTemplates: 1,
        totalSteps: userAppTrialReadyBeginnerTemplate.steps.length,
        totalRegionInstructions: userAppTrialReadyBeginnerTemplate.regionInstructions.length,
        difficultyCounts: { easy: 1, medium: 0, advanced: 0 },
        styleTags: userAppTrialReadyBeginnerTemplate.styleTags,
        estimatedDurationMinutes: { min: 8, max: 8, average: 8 },
      },
    },
  });

export const userAppTrialTemplateSelectionWarningExample: UserAppTrialTemplateSelectionReport =
  createUserAppTrialTemplateSelectionReport({
    packageData: {
      ...clonePackage(userAppTemplateContentQaExamplePackage),
      packageId: 'user-app-trial-template-selection-warning-v0',
      templates: [userAppTrialReadyBeginnerTemplate, userAppTrialWarningTemplate],
    },
  });

export const userAppTrialTemplateSelectionBlockedExample: UserAppTrialTemplateSelectionReport =
  createUserAppTrialTemplateSelectionReport({
    packageData: {
      ...clonePackage(userAppTemplateContentQaExamplePackage),
      packageId: 'user-app-trial-template-selection-blocked-v0',
      templates: [userAppTrialBlockedMissingStepsTemplate, userAppTrialTechnicalCopyTemplate],
    },
  });

export const userAppTrialContentReadinessReadyExample: UserAppTrialContentReadinessReport =
  createUserAppTrialContentReadinessReport({
    packageData: {
      ...clonePackage(userAppTemplatePackageExample),
      packageId: 'user-app-trial-content-readiness-ready-v0',
      templates: [userAppTrialReadyBeginnerTemplate],
    },
    hasPrivacyBoundaryCopy: true,
  });

export const userAppTrialContentReadinessWarningExample: UserAppTrialContentReadinessReport =
  createUserAppTrialContentReadinessReport({
    templateSelectionReport: userAppTrialTemplateSelectionWarningExample,
    hasPrivacyBoundaryCopy: true,
  });

export const userAppTrialContentReadinessBlockedExample: UserAppTrialContentReadinessReport =
  createUserAppTrialContentReadinessReport({
    templateSelectionReport: createUserAppTrialTemplateSelectionReport({
      packageData: {
        ...clonePackage(userAppTemplateContentQaExamplePackage),
        packageId: 'user-app-trial-content-readiness-blocked-v0',
        templates: [userAppTrialTechnicalCopyTemplate],
      },
      contentQaReports: [
        createUserAppTemplateContentQaReport({
          packageData: userAppTemplateContentQaExamplePackage,
          template: userAppTrialTechnicalCopyTemplate,
        }),
      ],
    }),
    hasPrivacyBoundaryCopy: false,
  });
