import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialLaunchPackForbiddenContactExample,
  userAppAnonymousTrialLaunchPackForbiddenPhotoExample,
  userAppAnonymousTrialLaunchPackMissingAdminScriptExample,
  userAppAnonymousTrialLaunchPackMissingNoticeExample,
  userAppAnonymousTrialLaunchPackMissingStopConditionsExample,
  userAppAnonymousTrialLaunchPackReadyExample,
  userAppAnonymousTrialLaunchPackUploadTrainingViolationExample,
  userAppAnonymousTrialLaunchPackWarningExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial launch pack', () => {
  it('marks the default launch pack ready with required launch scope', () => {
    expect(userAppAnonymousTrialLaunchPackReadyExample.status).toBe('launch_pack_ready');
    expect(userAppAnonymousTrialLaunchPackReadyExample.scope).toEqual(
      expect.arrayContaining([
        'internal_only',
        'small_scope',
        'anonymous_observation_only',
        'no_photo_collection',
        'no_contact_collection',
        'no_health_or_sensitive_data',
        'no_upload',
        'no_training',
        'no_backend_storage',
        'local_review_only',
      ]),
    );
    expect(userAppAnonymousTrialLaunchPackReadyExample.collectsRealUserRecords).toBe(false);
    expect(userAppAnonymousTrialLaunchPackReadyExample.backendRecordSystem).toBe(false);
    expect(userAppAnonymousTrialLaunchPackReadyExample.writesTrainingInput).toBe(false);
  });

  it('keeps participant notice, admin script, and capture sheet local and anonymous', () => {
    expect(userAppAnonymousTrialLaunchPackReadyExample.participantNotice?.anonymousOnly).toBe(true);
    expect(userAppAnonymousTrialLaunchPackReadyExample.adminScript?.anonymousOnly).toBe(true);
    expect(userAppAnonymousTrialLaunchPackReadyExample.evidenceCaptureSheet?.anonymousOnly).toBe(true);
    expect(userAppAnonymousTrialLaunchPackReadyExample.evidenceCaptureSheet?.collectsPhoto).toBe(false);
    expect(userAppAnonymousTrialLaunchPackReadyExample.evidenceCaptureSheet?.collectsContact).toBe(false);
  });

  it('distinguishes warning and blocked launch pack states', () => {
    expect(userAppAnonymousTrialLaunchPackWarningExample.status).toBe(
      'launch_pack_ready_with_warnings',
    );
    expect(userAppAnonymousTrialLaunchPackMissingNoticeExample.status).toBe(
      'launch_pack_blocked',
    );
    expect(userAppAnonymousTrialLaunchPackMissingAdminScriptExample.status).toBe(
      'launch_pack_blocked',
    );
    expect(userAppAnonymousTrialLaunchPackMissingStopConditionsExample.status).toBe(
      'launch_pack_blocked',
    );
  });

  it('blocks photo, contact, upload, and training requests', () => {
    expect(userAppAnonymousTrialLaunchPackForbiddenPhotoExample.status).toBe(
      'launch_pack_blocked',
    );
    expect(userAppAnonymousTrialLaunchPackForbiddenContactExample.status).toBe(
      'launch_pack_blocked',
    );
    expect(userAppAnonymousTrialLaunchPackUploadTrainingViolationExample.status).toBe(
      'launch_pack_blocked',
    );
    expect(
      userAppAnonymousTrialLaunchPackUploadTrainingViolationExample.forbiddenDataRequests.some(
        (item) => item.type === 'training_dataset_write' && item.requested,
      ),
    ).toBe(true);
  });
});
