import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialGapActionPlanForbiddenDataExample,
  userAppAnonymousTrialGapActionPlanInsufficientSampleExample,
  userAppAnonymousTrialGapActionPlanLowConfidenceExample,
  userAppAnonymousTrialGapActionPlanMissingParticipantNoticeExample,
  userAppAnonymousTrialGapActionPlanMissingPostLaunchHandoffExample,
  userAppAnonymousTrialGapActionPlanMissingStopConditionsExample,
  userAppAnonymousTrialGapActionPlanReadyExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial gap action plan', () => {
  it('maps privacy and forbidden data gaps to P0 blockers', () => {
    expect(
      userAppAnonymousTrialGapActionPlanForbiddenDataExample.actions.some(
        (action) => action.priority === 'p0_privacy_blocker',
      ),
    ).toBe(true);
    expect(
      userAppAnonymousTrialGapActionPlanForbiddenDataExample.actions.some(
        (action) => action.ownerArea === 'privacy_boundary',
      ),
    ).toBe(true);
  });

  it('maps notice, stop condition, and handoff gaps to P1 required fixes', () => {
    expect(
      userAppAnonymousTrialGapActionPlanMissingParticipantNoticeExample.actions.find(
        (action) => action.issueType === 'missing_participant_notice',
      )?.priority,
    ).toBe('p1_required_before_next_trial');
    expect(
      userAppAnonymousTrialGapActionPlanMissingStopConditionsExample.actions.find(
        (action) => action.issueType === 'missing_stop_condition_record',
      )?.priority,
    ).toBe('p1_required_before_next_trial');
    expect(
      userAppAnonymousTrialGapActionPlanMissingPostLaunchHandoffExample.actions.find(
        (action) => action.issueType === 'missing_post_launch_handoff',
      )?.priority,
    ).toBe('p1_required_before_next_trial');
  });

  it('keeps insufficient sample at P2 and low confidence at observe priority', () => {
    expect(
      userAppAnonymousTrialGapActionPlanInsufficientSampleExample.actions.find(
        (action) => action.issueType === 'insufficient_sample_size',
      )?.priority,
    ).toBe('p2_should_fix');
    expect(
      userAppAnonymousTrialGapActionPlanLowConfidenceExample.actions.find(
        (action) => action.issueType === 'low_confidence_issue',
      )?.priority,
    ).toBe('p3_observe');
  });

  it('keeps ready action plan local and non-production', () => {
    expect(userAppAnonymousTrialGapActionPlanReadyExample.localOnly).toBe(true);
    expect(userAppAnonymousTrialGapActionPlanReadyExample.productionBuildApproved).toBe(false);
    expect(userAppAnonymousTrialGapActionPlanReadyExample.backendRecordSystem).toBe(false);
    expect(userAppAnonymousTrialGapActionPlanReadyExample.writesTrainingInput).toBe(false);
  });
});
