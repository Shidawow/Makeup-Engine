import { describe, expect, it } from 'vitest';
import {
  createUserAppTrialIterationPriorityRecommendation,
  userAppTrialIterationPriorityRules,
} from '../src/user-app';
import {
  userAppTrialIterationPriorityObserveMoreExample,
  userAppTrialIterationPriorityP0Example,
  userAppTrialIterationPriorityP1ContentExample,
  userAppTrialIterationPriorityP1ShellExample,
  userAppTrialIterationPriorityP2Example,
  userAppTrialIterationPriorityP3Example,
} from '../src/templates/examples';

describe('User App trial iteration priority', () => {
  it('scores p0, p1, p2, p3, and observe-more priorities deterministically', () => {
    expect(userAppTrialIterationPriorityP0Example.priority).toBe('p0_blocker');
    expect(userAppTrialIterationPriorityP1ShellExample.priority).toBe('p1_high');
    expect(userAppTrialIterationPriorityP1ContentExample.priority).toBe('p1_high');
    expect(userAppTrialIterationPriorityP2Example.priority).toBe('p2_medium');
    expect(userAppTrialIterationPriorityP3Example.priority).toBe('p3_low');
    expect(userAppTrialIterationPriorityObserveMoreExample.priority).toBe('observe_more');
  });

  it('forces privacy and boundary issues into p0 blocker', () => {
    const result = createUserAppTrialIterationPriorityRecommendation({
      issueCategory: 'privacy_copy_issue',
      severity: 'critical',
      actionability: 'blocked_by_boundary',
      confidence: 'high',
      issueCount: 1,
    });

    expect(result.priority).toBe('p0_blocker');
    expect(result.nextAction).toContain('暂停');
    expect(result.backendRecordSystem).toBe(false);
    expect(result.usesAiAnalysis).toBe(false);
    expect(result.writesTrainingInput).toBe(false);
  });

  it('keeps low confidence and not-actionable issues out of immediate fixes', () => {
    const result = createUserAppTrialIterationPriorityRecommendation({
      issueCategory: 'unknown_issue',
      severity: 'medium',
      actionability: 'not_actionable_yet',
      confidence: 'low',
      issueCount: 1,
    });

    expect(result.priority).toBe('observe_more');
    expect(result.nextAction).toContain('继续收集匿名示例信号');
  });

  it('documents the priority rules used by the iteration plan', () => {
    expect(userAppTrialIterationPriorityRules.map((rule) => rule.ruleId)).toEqual(
      expect.arrayContaining([
        'privacy-boundary-p0',
        'high-shell-content-p1',
        'repeated-medium-upgrade',
        'low-confidence-observe',
      ]),
    );
  });
});
