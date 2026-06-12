import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialDryRunPackForbiddenContactExample,
  userAppAnonymousTrialDryRunPackForbiddenPhotoExample,
  userAppAnonymousTrialDryRunPackMissingNoticeExample,
  userAppAnonymousTrialDryRunPackReadyExample,
  userAppAnonymousTrialDryRunPackUploadTrainingViolationExample,
  userAppAnonymousTrialDryRunPackWarningExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial dry run pack', () => {
  it('marks the default dry run pack ready with all required scenarios', () => {
    expect(userAppAnonymousTrialDryRunPackReadyExample.status).toBe('dry_run_ready');
    expect(userAppAnonymousTrialDryRunPackReadyExample.scenarios.map((item) => item.scenarioId)).toEqual(
      expect.arrayContaining([
        'first_time_beginner_guided_makeup_flow',
        'template_discovery_and_selection_flow',
        'step_guidance_comprehension_flow',
        'privacy_notice_comprehension_flow',
        'admin_evidence_capture_rehearsal',
        'stop_condition_rehearsal',
      ]),
    );
    expect(userAppAnonymousTrialDryRunPackReadyExample.collectsRealUserRecords).toBe(false);
    expect(userAppAnonymousTrialDryRunPackReadyExample.writesTrainingInput).toBe(false);
  });

  it('keeps allowed evidence anonymous, local, and mock-only', () => {
    expect(
      userAppAnonymousTrialDryRunPackReadyExample.allowedEvidence.every(
        (item) => item.anonymousOnly && item.localOnly && item.mockEvidenceOnly,
      ),
    ).toBe(true);
  });

  it('distinguishes warning and blocked dry run pack states', () => {
    expect(userAppAnonymousTrialDryRunPackWarningExample.status).toBe(
      'dry_run_ready_with_warnings',
    );
    expect(userAppAnonymousTrialDryRunPackMissingNoticeExample.status).toBe(
      'dry_run_blocked',
    );
  });

  it('blocks photo, contact, upload, and training requests', () => {
    expect(userAppAnonymousTrialDryRunPackForbiddenPhotoExample.status).toBe(
      'dry_run_blocked',
    );
    expect(userAppAnonymousTrialDryRunPackForbiddenContactExample.status).toBe(
      'dry_run_blocked',
    );
    expect(userAppAnonymousTrialDryRunPackUploadTrainingViolationExample.status).toBe(
      'dry_run_blocked',
    );
    expect(
      userAppAnonymousTrialDryRunPackUploadTrainingViolationExample.forbiddenData.some(
        (item) => item.type === 'training_dataset_write' && item.requested,
      ),
    ).toBe(true);
  });
});
