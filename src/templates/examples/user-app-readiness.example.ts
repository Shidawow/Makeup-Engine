import {
  createInitialTemplateDiscoveryState,
  createInitialUserAppSession,
  createInitialUserOnboardingState,
  createUserAppReadinessReport,
  evaluateMobileQaReadiness,
} from '../../user-app';
import { userAppMvpShellExamplePackage } from './user-app-mvp-shell.example';
import { completedOnboardingUserAppSessionExample } from './user-app-session.example';

export const userAppReadinessExampleMobileQa = evaluateMobileQaReadiness({
  hasPackage: true,
  templateCount: userAppMvpShellExamplePackage.templates.length,
  canEnterStepGuide: true,
  hasPrivacyCopy: true,
  hasSessionControls: true,
  hasRecoveryNotice: true,
  hasWarningCopy: true,
  hasBlockedCopy: true,
  hasLargeTapTargets: true,
  hasMobileStackingClasses: true,
  hidesRawJsonByDefault: true,
});

export const userAppReadinessExampleReport = createUserAppReadinessReport({
  packageData: userAppMvpShellExamplePackage,
  onboarding: createInitialUserOnboardingState(),
  discoveryState: createInitialTemplateDiscoveryState(),
  session: completedOnboardingUserAppSessionExample,
  mobileQaResult: userAppReadinessExampleMobileQa,
});

export const userAppBlockedReadinessExampleReport = createUserAppReadinessReport({
  packageData: null,
  onboarding: createInitialUserOnboardingState(),
  discoveryState: createInitialTemplateDiscoveryState(),
  session: createInitialUserAppSession({ sessionId: 'readiness-blocked-no-package' }),
  mobileQaResult: evaluateMobileQaReadiness({
    hasPackage: false,
    templateCount: 0,
    canEnterStepGuide: false,
    hasPrivacyCopy: true,
    hasSessionControls: true,
    hasRecoveryNotice: true,
    hasWarningCopy: true,
    hasBlockedCopy: true,
    hasLargeTapTargets: true,
    hasMobileStackingClasses: true,
    hidesRawJsonByDefault: true,
  }),
});

export const userAppMobileQaWarningExample = evaluateMobileQaReadiness({
  hasPackage: true,
  templateCount: 1,
  canEnterStepGuide: true,
  hasPrivacyCopy: true,
  hasSessionControls: true,
  hasRecoveryNotice: false,
  hasWarningCopy: true,
  hasBlockedCopy: true,
  hasLargeTapTargets: false,
  hasMobileStackingClasses: true,
  hidesRawJsonByDefault: true,
});
