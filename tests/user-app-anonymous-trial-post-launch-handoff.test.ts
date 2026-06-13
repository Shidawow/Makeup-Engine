import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialPostLaunchHandoffPrivacyIncidentExample,
  userAppAnonymousTrialPostLaunchHandoffReadyExample,
  userAppAnonymousTrialPostLaunchHandoffStoppedSessionExample,
  userAppAnonymousTrialPostLaunchHandoffWithEvidenceGapsExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial post-launch handoff', () => {
  it('creates a ready anonymous post-launch handoff template', () => {
    expect(userAppAnonymousTrialPostLaunchHandoffReadyExample.status).toBe(
      'post_launch_handoff_ready',
    );
    expect(userAppAnonymousTrialPostLaunchHandoffReadyExample.localOnly).toBe(true);
    expect(userAppAnonymousTrialPostLaunchHandoffReadyExample.templateOnly).toBe(true);
    expect(userAppAnonymousTrialPostLaunchHandoffReadyExample.backendRecordSystem).toBe(false);
    expect(userAppAnonymousTrialPostLaunchHandoffReadyExample.writesTrainingInput).toBe(false);
  });

  it('marks evidence gaps without blocking the handoff template', () => {
    expect(userAppAnonymousTrialPostLaunchHandoffWithEvidenceGapsExample.status).toBe(
      'post_launch_handoff_ready_with_gaps',
    );
    expect(
      userAppAnonymousTrialPostLaunchHandoffWithEvidenceGapsExample.evidenceHandoff.evidenceGaps,
    ).toContain('缺少推荐有用性聚合摘要');
  });

  it('stops handoff when stopped sessions or privacy incidents are present', () => {
    expect(userAppAnonymousTrialPostLaunchHandoffStoppedSessionExample.status).toBe(
      'post_launch_handoff_stopped',
    );
    expect(userAppAnonymousTrialPostLaunchHandoffPrivacyIncidentExample.status).toBe(
      'post_launch_handoff_stopped',
    );
  });
});
