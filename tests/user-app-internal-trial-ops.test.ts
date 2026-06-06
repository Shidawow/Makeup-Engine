import { describe, expect, it } from 'vitest';
import { createUserAppInternalTrialOpsPack } from '../src/user-app';
import {
  userAppInternalTrialOpsIncompleteParticipantCoverageExample,
  userAppInternalTrialOpsReadyExample,
  userAppInternalTrialOpsUnsafeCollectionExample,
} from '../src/templates/examples';

describe('User App internal trial operations pack', () => {
  it('returns ready_for_internal_trial_ops for a complete local operations pack', () => {
    expect(userAppInternalTrialOpsReadyExample.schemaVersion).toBe(
      'user-app-internal-trial-ops-v0.1',
    );
    expect(userAppInternalTrialOpsReadyExample.status).toBe(
      'ready_for_internal_trial_ops',
    );
    expect(userAppInternalTrialOpsReadyExample.participantTypes).toEqual(
      expect.arrayContaining([
        'complete_beginner',
        'light_makeup_user',
        'frequent_makeup_user',
        'beauty_advisor_or_makeup_reviewer',
        'internal_product_reviewer',
      ]),
    );
    expect(userAppInternalTrialOpsReadyExample.localOnly).toBe(true);
    expect(userAppInternalTrialOpsReadyExample.productionRelease).toBe(false);
    expect(userAppInternalTrialOpsReadyExample.collectsPhoto).toBe(false);
    expect(userAppInternalTrialOpsReadyExample.writesTrainingInput).toBe(false);
  });

  it('warns when participant coverage is incomplete', () => {
    expect(userAppInternalTrialOpsIncompleteParticipantCoverageExample.status).toBe(
      'ready_with_warnings',
    );
    expect(userAppInternalTrialOpsIncompleteParticipantCoverageExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'participant_coverage',
          severity: 'warning',
        }),
      ]),
    );
  });

  it('blocks unsafe collection requests and runtime expansion', () => {
    expect(userAppInternalTrialOpsUnsafeCollectionExample.status).toBe('blocked');
    expect(userAppInternalTrialOpsUnsafeCollectionExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'privacy_collection',
          severity: 'blocking',
        }),
      ]),
    );

    const blocked = createUserAppInternalTrialOpsPack({
      usesBackendForm: true,
      usesAnalytics: true,
      usesCamera: true,
      usesAr: true,
      mutatesTemplatePackage: true,
    });
    expect(blocked.status).toBe('blocked');
  });
});
