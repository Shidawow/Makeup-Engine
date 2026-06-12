import {
  createUserAppEvidenceCollectionQualityGate,
  type UserAppEvidenceCollectionQualityGate,
} from '../../user-app/userAppEvidenceCollectionQualityGate';
import {
  userAppEvidenceCollectionChecklistBlockedExample,
  userAppEvidenceCollectionChecklistReadyExample,
  userAppEvidenceCollectionChecklistWarningExample,
} from './user-app-evidence-collection-checklist.example';
import {
  userAppEvidenceCollectionProtocolForbiddenContactExample,
  userAppEvidenceCollectionProtocolForbiddenPhotoExample,
  userAppEvidenceCollectionProtocolMissingNoticeExample,
  userAppEvidenceCollectionProtocolReadyExample,
  userAppEvidenceCollectionProtocolUploadTrainingViolationExample,
  userAppEvidenceCollectionProtocolWarningExample,
} from './user-app-evidence-collection-protocol.example';

export const userAppEvidenceCollectionQualityGateReadyExample: UserAppEvidenceCollectionQualityGate =
  createUserAppEvidenceCollectionQualityGate({
    gateId: 'evidence-collection-quality-ready',
    protocol: userAppEvidenceCollectionProtocolReadyExample,
    checklist: userAppEvidenceCollectionChecklistReadyExample,
  });

export const userAppEvidenceCollectionQualityGateWarningExample: UserAppEvidenceCollectionQualityGate =
  createUserAppEvidenceCollectionQualityGate({
    gateId: 'evidence-collection-quality-warning',
    protocol: userAppEvidenceCollectionProtocolWarningExample,
    checklist: userAppEvidenceCollectionChecklistWarningExample,
    requireAllChecklistItems: false,
  });

export const userAppEvidenceCollectionQualityGateMissingProtocolExample: UserAppEvidenceCollectionQualityGate =
  createUserAppEvidenceCollectionQualityGate({
    gateId: 'evidence-collection-quality-missing-protocol',
    protocol: null,
    checklist: null,
  });

export const userAppEvidenceCollectionQualityGateMissingNoticeExample: UserAppEvidenceCollectionQualityGate =
  createUserAppEvidenceCollectionQualityGate({
    gateId: 'evidence-collection-quality-missing-notice',
    protocol: userAppEvidenceCollectionProtocolMissingNoticeExample,
  });

export const userAppEvidenceCollectionQualityGateForbiddenPhotoExample: UserAppEvidenceCollectionQualityGate =
  createUserAppEvidenceCollectionQualityGate({
    gateId: 'evidence-collection-quality-photo',
    protocol: userAppEvidenceCollectionProtocolForbiddenPhotoExample,
    checklist: userAppEvidenceCollectionChecklistBlockedExample,
  });

export const userAppEvidenceCollectionQualityGateForbiddenContactExample: UserAppEvidenceCollectionQualityGate =
  createUserAppEvidenceCollectionQualityGate({
    gateId: 'evidence-collection-quality-contact',
    protocol: userAppEvidenceCollectionProtocolForbiddenContactExample,
  });

export const userAppEvidenceCollectionQualityGateUploadTrainingViolationExample: UserAppEvidenceCollectionQualityGate =
  createUserAppEvidenceCollectionQualityGate({
    gateId: 'evidence-collection-quality-upload-training',
    protocol: userAppEvidenceCollectionProtocolUploadTrainingViolationExample,
  });
