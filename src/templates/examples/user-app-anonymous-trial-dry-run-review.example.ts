import { createUserAppAnonymousTrialDryRunChecklist } from '../../user-app/userAppAnonymousTrialDryRunChecklist';
import { createUserAppAnonymousTrialDryRunReview } from '../../user-app/userAppAnonymousTrialDryRunReview';
import {
  userAppEvidenceCollectionQualityGateMissingProtocolExample,
  userAppEvidenceCollectionQualityGateWarningExample,
} from './user-app-evidence-collection-quality-gate.example';
import {
  userAppAnonymousTrialDryRunChecklistReadyExample,
  userAppAnonymousTrialDryRunChecklistWarningExample,
} from './user-app-anonymous-trial-dry-run-checklist.example';
import {
  userAppAnonymousTrialDryRunPackForbiddenContactExample,
  userAppAnonymousTrialDryRunPackForbiddenPhotoExample,
  userAppAnonymousTrialDryRunPackMissingNoticeExample,
  userAppAnonymousTrialDryRunPackReadyExample,
  userAppAnonymousTrialDryRunPackUploadTrainingViolationExample,
  userAppAnonymousTrialDryRunPackWarningExample,
} from './user-app-anonymous-trial-dry-run-pack.example';

export const userAppAnonymousTrialDryRunReviewReadyExample =
  createUserAppAnonymousTrialDryRunReview({
    pack: userAppAnonymousTrialDryRunPackReadyExample,
    checklist: userAppAnonymousTrialDryRunChecklistReadyExample,
  });

export const userAppAnonymousTrialDryRunReviewWarningExample =
  createUserAppAnonymousTrialDryRunReview({
    pack: userAppAnonymousTrialDryRunPackReadyExample,
    checklist: createUserAppAnonymousTrialDryRunChecklist({
      pack: userAppAnonymousTrialDryRunPackReadyExample,
    }),
    evidenceQualityGate: userAppEvidenceCollectionQualityGateWarningExample,
  });

export const userAppAnonymousTrialDryRunReviewRepeatExample =
  createUserAppAnonymousTrialDryRunReview({
    pack: userAppAnonymousTrialDryRunPackWarningExample,
    checklist: userAppAnonymousTrialDryRunChecklistWarningExample,
  });

export const userAppAnonymousTrialDryRunReviewReviseChecklistExample =
  createUserAppAnonymousTrialDryRunReview({
    pack: userAppAnonymousTrialDryRunPackReadyExample,
    checklist: createUserAppAnonymousTrialDryRunChecklist({
      pack: userAppAnonymousTrialDryRunPackReadyExample,
      overrides: {
        'dry-run-check-admin-script': false,
      },
    }),
  });

export const userAppAnonymousTrialDryRunReviewReviseProtocolExample =
  createUserAppAnonymousTrialDryRunReview({
    pack: userAppAnonymousTrialDryRunPackReadyExample,
    checklist: userAppAnonymousTrialDryRunChecklistReadyExample,
    evidenceQualityGate: userAppEvidenceCollectionQualityGateMissingProtocolExample,
  });

export const userAppAnonymousTrialDryRunReviewMissingNoticeExample =
  createUserAppAnonymousTrialDryRunReview({
    pack: userAppAnonymousTrialDryRunPackMissingNoticeExample,
  });

export const userAppAnonymousTrialDryRunReviewForbiddenPhotoExample =
  createUserAppAnonymousTrialDryRunReview({
    pack: userAppAnonymousTrialDryRunPackForbiddenPhotoExample,
  });

export const userAppAnonymousTrialDryRunReviewForbiddenContactExample =
  createUserAppAnonymousTrialDryRunReview({
    pack: userAppAnonymousTrialDryRunPackForbiddenContactExample,
  });

export const userAppAnonymousTrialDryRunReviewUploadTrainingViolationExample =
  createUserAppAnonymousTrialDryRunReview({
    pack: userAppAnonymousTrialDryRunPackUploadTrainingViolationExample,
  });
