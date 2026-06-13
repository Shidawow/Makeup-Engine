import { createUserAppAnonymousTrialLaunchReadiness } from '../../user-app/userAppAnonymousTrialLaunchReadiness';
import {
  userAppAnonymousTrialLaunchPackForbiddenContactExample,
  userAppAnonymousTrialLaunchPackForbiddenPhotoExample,
  userAppAnonymousTrialLaunchPackMissingAdminScriptExample,
  userAppAnonymousTrialLaunchPackMissingNoticeExample,
  userAppAnonymousTrialLaunchPackMissingStopConditionsExample,
  userAppAnonymousTrialLaunchPackReadyExample,
  userAppAnonymousTrialLaunchPackUploadTrainingViolationExample,
  userAppAnonymousTrialLaunchPackWarningExample,
} from './user-app-anonymous-trial-launch-pack.example';

export const userAppAnonymousTrialLaunchReadinessReadyExample =
  createUserAppAnonymousTrialLaunchReadiness({
    pack: userAppAnonymousTrialLaunchPackReadyExample,
  });

export const userAppAnonymousTrialLaunchReadinessWarningExample =
  createUserAppAnonymousTrialLaunchReadiness({
    pack: userAppAnonymousTrialLaunchPackWarningExample,
  });

export const userAppAnonymousTrialLaunchReadinessMissingNoticeExample =
  createUserAppAnonymousTrialLaunchReadiness({
    pack: userAppAnonymousTrialLaunchPackMissingNoticeExample,
  });

export const userAppAnonymousTrialLaunchReadinessMissingAdminScriptExample =
  createUserAppAnonymousTrialLaunchReadiness({
    pack: userAppAnonymousTrialLaunchPackMissingAdminScriptExample,
  });

export const userAppAnonymousTrialLaunchReadinessMissingStopConditionsExample =
  createUserAppAnonymousTrialLaunchReadiness({
    pack: userAppAnonymousTrialLaunchPackMissingStopConditionsExample,
  });

export const userAppAnonymousTrialLaunchReadinessForbiddenPhotoExample =
  createUserAppAnonymousTrialLaunchReadiness({
    pack: userAppAnonymousTrialLaunchPackForbiddenPhotoExample,
  });

export const userAppAnonymousTrialLaunchReadinessForbiddenContactExample =
  createUserAppAnonymousTrialLaunchReadiness({
    pack: userAppAnonymousTrialLaunchPackForbiddenContactExample,
  });

export const userAppAnonymousTrialLaunchReadinessUploadTrainingViolationExample =
  createUserAppAnonymousTrialLaunchReadiness({
    pack: userAppAnonymousTrialLaunchPackUploadTrainingViolationExample,
  });
