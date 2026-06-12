import {
  createUserAppEvidenceCollectionChecklist,
  type UserAppEvidenceCollectionChecklist,
} from '../../user-app/userAppEvidenceCollectionChecklist';
import {
  userAppEvidenceCollectionProtocolForbiddenPhotoExample,
  userAppEvidenceCollectionProtocolMissingNoticeExample,
  userAppEvidenceCollectionProtocolReadyExample,
  userAppEvidenceCollectionProtocolWarningExample,
} from './user-app-evidence-collection-protocol.example';

export const userAppEvidenceCollectionChecklistReadyExample: UserAppEvidenceCollectionChecklist =
  createUserAppEvidenceCollectionChecklist({
    checklistId: 'evidence-collection-checklist-ready',
    protocol: userAppEvidenceCollectionProtocolReadyExample,
  });

export const userAppEvidenceCollectionChecklistWarningExample: UserAppEvidenceCollectionChecklist =
  createUserAppEvidenceCollectionChecklist({
    checklistId: 'evidence-collection-checklist-warning',
    protocol: userAppEvidenceCollectionProtocolWarningExample,
    overrides: {
      'check-evidence-quality-aggregated': false,
    },
  });

export const userAppEvidenceCollectionChecklistMissingNoticeExample: UserAppEvidenceCollectionChecklist =
  createUserAppEvidenceCollectionChecklist({
    checklistId: 'evidence-collection-checklist-missing-notice',
    protocol: userAppEvidenceCollectionProtocolMissingNoticeExample,
  });

export const userAppEvidenceCollectionChecklistBlockedExample: UserAppEvidenceCollectionChecklist =
  createUserAppEvidenceCollectionChecklist({
    checklistId: 'evidence-collection-checklist-blocked',
    protocol: userAppEvidenceCollectionProtocolForbiddenPhotoExample,
  });
