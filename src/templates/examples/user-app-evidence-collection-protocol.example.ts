import {
  createDefaultUserAppEvidenceCollectionAllowedItems,
  createDefaultUserAppEvidenceCollectionAnonymizationRules,
  createDefaultUserAppEvidenceCollectionParticipantNotice,
  createDefaultUserAppEvidenceCollectionStopConditions,
  createUserAppEvidenceCollectionForbiddenItem,
  createUserAppEvidenceCollectionProtocol,
  type UserAppEvidenceCollectionProtocol,
} from '../../user-app/userAppEvidenceCollectionProtocol';

export const userAppEvidenceCollectionProtocolReadyExample: UserAppEvidenceCollectionProtocol =
  createUserAppEvidenceCollectionProtocol({
    protocolId: 'evidence-collection-protocol-ready',
  });

export const userAppEvidenceCollectionProtocolWarningExample: UserAppEvidenceCollectionProtocol =
  createUserAppEvidenceCollectionProtocol({
    protocolId: 'evidence-collection-protocol-warning',
    allowedItems: createDefaultUserAppEvidenceCollectionAllowedItems().slice(0, 7),
  });

export const userAppEvidenceCollectionProtocolMissingNoticeExample: UserAppEvidenceCollectionProtocol =
  createUserAppEvidenceCollectionProtocol({
    protocolId: 'evidence-collection-protocol-missing-notice',
    participantNotice: null,
  });

export const userAppEvidenceCollectionProtocolForbiddenPhotoExample: UserAppEvidenceCollectionProtocol =
  createUserAppEvidenceCollectionProtocol({
    protocolId: 'evidence-collection-protocol-photo-request',
    requestedForbiddenTypes: ['face_photo'],
  });

export const userAppEvidenceCollectionProtocolForbiddenContactExample: UserAppEvidenceCollectionProtocol =
  createUserAppEvidenceCollectionProtocol({
    protocolId: 'evidence-collection-protocol-contact-request',
    requestedForbiddenTypes: ['email', 'phone_number'],
  });

export const userAppEvidenceCollectionProtocolUploadTrainingViolationExample: UserAppEvidenceCollectionProtocol =
  createUserAppEvidenceCollectionProtocol({
    protocolId: 'evidence-collection-protocol-upload-training',
    requestedForbiddenTypes: ['uploaded_image', 'training_dataset_write'],
    forbiddenItems: [
      ...[
        'uploaded_image',
        'training_dataset_write',
        'face_embedding',
        'account_credential',
      ].map((type) =>
        createUserAppEvidenceCollectionForbiddenItem(
          type as Parameters<typeof createUserAppEvidenceCollectionForbiddenItem>[0],
          true,
        ),
      ),
    ],
  });

export const userAppEvidenceCollectionProtocolCustomWarningExample: UserAppEvidenceCollectionProtocol =
  createUserAppEvidenceCollectionProtocol({
    protocolId: 'evidence-collection-protocol-custom-warning',
    anonymizationRules: createDefaultUserAppEvidenceCollectionAnonymizationRules().slice(0, 2),
    participantNotice: createDefaultUserAppEvidenceCollectionParticipantNotice(),
    stopConditions: createDefaultUserAppEvidenceCollectionStopConditions(),
  });
