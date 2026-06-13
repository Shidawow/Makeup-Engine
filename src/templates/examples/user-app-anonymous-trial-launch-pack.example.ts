import {
  createDefaultUserAppAnonymousTrialLaunchScope,
  createDefaultUserAppAnonymousTrialStopConditions,
  createUserAppAnonymousTrialLaunchPack,
} from '../../user-app/userAppAnonymousTrialLaunchPack';

export const userAppAnonymousTrialLaunchPackReadyExample =
  createUserAppAnonymousTrialLaunchPack();

export const userAppAnonymousTrialLaunchPackWarningExample =
  createUserAppAnonymousTrialLaunchPack({
    scope: createDefaultUserAppAnonymousTrialLaunchScope().filter(
      (item) => item !== 'local_review_only',
    ),
  });

export const userAppAnonymousTrialLaunchPackMissingNoticeExample =
  createUserAppAnonymousTrialLaunchPack({
    participantNotice: null,
  });

export const userAppAnonymousTrialLaunchPackMissingAdminScriptExample =
  createUserAppAnonymousTrialLaunchPack({
    adminScript: null,
  });

export const userAppAnonymousTrialLaunchPackMissingStopConditionsExample =
  createUserAppAnonymousTrialLaunchPack({
    stopConditions: createDefaultUserAppAnonymousTrialStopConditions().slice(0, 2),
  });

export const userAppAnonymousTrialLaunchPackForbiddenPhotoExample =
  createUserAppAnonymousTrialLaunchPack({
    requestedForbiddenTypes: ['face_photo'],
  });

export const userAppAnonymousTrialLaunchPackForbiddenContactExample =
  createUserAppAnonymousTrialLaunchPack({
    requestedForbiddenTypes: ['email'],
  });

export const userAppAnonymousTrialLaunchPackUploadTrainingViolationExample =
  createUserAppAnonymousTrialLaunchPack({
    requestedForbiddenTypes: ['uploaded_image', 'training_dataset_write'],
  });
