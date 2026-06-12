import { describe, expect, it } from 'vitest';
import {
  createUserAppEvidenceCollectionAllowedItem,
  createUserAppEvidenceCollectionForbiddenItem,
} from '../src/user-app';
import {
  userAppEvidenceCollectionProtocolForbiddenContactExample,
  userAppEvidenceCollectionProtocolForbiddenPhotoExample,
  userAppEvidenceCollectionProtocolMissingNoticeExample,
  userAppEvidenceCollectionProtocolReadyExample,
  userAppEvidenceCollectionProtocolUploadTrainingViolationExample,
  userAppEvidenceCollectionProtocolWarningExample,
} from '../src/templates/examples';

describe('User App evidence collection protocol', () => {
  it('marks the default protocol ready with required allowed and forbidden coverage', () => {
    expect(userAppEvidenceCollectionProtocolReadyExample.status).toBe('protocol_ready');
    expect(userAppEvidenceCollectionProtocolReadyExample.allowedItems).toHaveLength(10);
    expect(userAppEvidenceCollectionProtocolReadyExample.forbiddenItems.length).toBeGreaterThan(15);
    expect(userAppEvidenceCollectionProtocolReadyExample.participantNotice?.mentionsNoPhoto).toBe(
      true,
    );
  });

  it('classifies allowed anonymous items without privacy or training collection', () => {
    const item = createUserAppEvidenceCollectionAllowedItem(
      'anonymous_step_comprehension_notes',
    );

    expect(item.anonymousOnly).toBe(true);
    expect(item.collectsPhoto).toBe(false);
    expect(item.collectsContact).toBe(false);
    expect(item.writesTrainingInput).toBe(false);
  });

  it('classifies forbidden requests as blocking', () => {
    const item = createUserAppEvidenceCollectionForbiddenItem('face_photo', true);

    expect(item.requested).toBe(true);
    expect(item.blocking).toBe(true);
  });

  it('distinguishes warning and blocked protocol states', () => {
    expect(userAppEvidenceCollectionProtocolWarningExample.status).toBe(
      'protocol_ready_with_warnings',
    );
    expect(userAppEvidenceCollectionProtocolMissingNoticeExample.status).toBe(
      'protocol_blocked',
    );
    expect(userAppEvidenceCollectionProtocolForbiddenPhotoExample.status).toBe(
      'protocol_blocked',
    );
  });

  it('blocks photo, contact, upload, and training requests', () => {
    expect(
      userAppEvidenceCollectionProtocolForbiddenPhotoExample.forbiddenItems.some(
        (item) => item.type === 'face_photo' && item.requested,
      ),
    ).toBe(true);
    expect(
      userAppEvidenceCollectionProtocolForbiddenContactExample.forbiddenItems.some(
        (item) => item.type === 'email' && item.requested,
      ),
    ).toBe(true);
    expect(
      userAppEvidenceCollectionProtocolUploadTrainingViolationExample.forbiddenItems.some(
        (item) => item.type === 'training_dataset_write' && item.requested,
      ),
    ).toBe(true);
  });
});
