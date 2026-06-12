import {
  createUserAppAnonymousTrialDryRunPack,
  createUserAppAnonymousTrialDryRunScenario,
} from '../../user-app/userAppAnonymousTrialDryRunPack';

export const userAppAnonymousTrialDryRunPackReadyExample =
  createUserAppAnonymousTrialDryRunPack();

export const userAppAnonymousTrialDryRunPackWarningExample =
  createUserAppAnonymousTrialDryRunPack({
    scenarios: [
      createUserAppAnonymousTrialDryRunScenario(
        'first_time_beginner_guided_makeup_flow',
        false,
      ),
      createUserAppAnonymousTrialDryRunScenario('template_discovery_and_selection_flow'),
      createUserAppAnonymousTrialDryRunScenario('step_guidance_comprehension_flow'),
      createUserAppAnonymousTrialDryRunScenario('privacy_notice_comprehension_flow'),
      createUserAppAnonymousTrialDryRunScenario('admin_evidence_capture_rehearsal'),
      createUserAppAnonymousTrialDryRunScenario('stop_condition_rehearsal'),
    ],
  });

export const userAppAnonymousTrialDryRunPackMissingNoticeExample =
  createUserAppAnonymousTrialDryRunPack({
    participantNotice: null,
  });

export const userAppAnonymousTrialDryRunPackForbiddenPhotoExample =
  createUserAppAnonymousTrialDryRunPack({
    requestedForbiddenTypes: ['face_photo'],
  });

export const userAppAnonymousTrialDryRunPackForbiddenContactExample =
  createUserAppAnonymousTrialDryRunPack({
    requestedForbiddenTypes: ['email'],
  });

export const userAppAnonymousTrialDryRunPackUploadTrainingViolationExample =
  createUserAppAnonymousTrialDryRunPack({
    requestedForbiddenTypes: ['uploaded_image', 'training_dataset_write'],
  });
