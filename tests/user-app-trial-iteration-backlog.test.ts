import { describe, expect, it } from 'vitest';
import { createUserAppTrialIterationBacklog } from '../src/user-app';
import {
  userAppTrialIterationBacklogCleanExample,
  userAppTrialIterationBacklogContentHeavyExample,
  userAppTrialIterationBacklogLowConfidenceExample,
  userAppTrialIterationBacklogPrivacyBlockerExample,
  userAppTrialIterationBacklogShellHeavyExample,
} from '../src/templates/examples';

describe('User App trial iteration backlog', () => {
  it('creates a ready empty backlog from clean review signals', () => {
    expect(userAppTrialIterationBacklogCleanExample.schemaVersion).toBe(
      'user-app-trial-iteration-backlog-v0.1',
    );
    expect(userAppTrialIterationBacklogCleanExample.status).toBe('backlog_ready');
    expect(userAppTrialIterationBacklogCleanExample.items).toHaveLength(0);
    expect(userAppTrialIterationBacklogCleanExample.backendRecordSystem).toBe(false);
    expect(userAppTrialIterationBacklogCleanExample.usesAiAnalysis).toBe(false);
    expect(userAppTrialIterationBacklogCleanExample.writesTrainingInput).toBe(false);
  });

  it('maps content-heavy and shell-heavy issues to owner areas and fix types', () => {
    expect(
      userAppTrialIterationBacklogContentHeavyExample.items.map((item) => item.ownerArea),
    ).toEqual(expect.arrayContaining(['template_content']));
    expect(
      userAppTrialIterationBacklogContentHeavyExample.items.map(
        (item) => item.recommendedFixType,
      ),
    ).toEqual(expect.arrayContaining(['copy_revision']));

    expect(userAppTrialIterationBacklogShellHeavyExample.items[0].ownerArea).toBe(
      'user_app_shell',
    );
    expect(userAppTrialIterationBacklogShellHeavyExample.items[0].recommendedFixType).toBe(
      'layout_revision',
    );
  });

  it('blocks the backlog when privacy or boundary risks appear', () => {
    expect(userAppTrialIterationBacklogPrivacyBlockerExample.status).toBe(
      'backlog_blocked',
    );
    expect(userAppTrialIterationBacklogPrivacyBlockerExample.items[0].blockedReason).toContain(
      '隐私',
    );
    expect(
      userAppTrialIterationBacklogPrivacyBlockerExample.items[0].priorityRecommendation
        .priority,
    ).toBe('p0_blocker');
  });

  it('keeps low-confidence issues in observe-more instead of immediate fix', () => {
    expect(
      userAppTrialIterationBacklogLowConfidenceExample.items[0].priorityRecommendation
        .priority,
    ).toBe('observe_more');
    expect(userAppTrialIterationBacklogLowConfidenceExample.items[0].targetIteration).toBe(
      'future_iteration',
    );
  });

  it('can be generated directly from an empty issue summary input', () => {
    const backlog = createUserAppTrialIterationBacklog();

    expect(backlog.status).toBe('backlog_ready');
    expect(backlog.items).toHaveLength(0);
    expect(backlog.anonymousOrExampleOnly).toBe(true);
  });
});
