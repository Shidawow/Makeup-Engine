import { describe, expect, it } from 'vitest';
import {
  classifyUserAppTrialIssue,
  createUserAppTrialIssueSummary,
} from '../src/user-app';
import {
  userAppTrialIssueTaxonomyCleanSummary,
  userAppTrialIssueTaxonomyContentSignals,
  userAppTrialIssueTaxonomyContentSummary,
  userAppTrialIssueTaxonomyPrivacyBoundarySignals,
  userAppTrialIssueTaxonomyPrivacyBoundarySummary,
  userAppTrialIssueTaxonomyShellSummary,
} from '../src/templates/examples';

describe('User App trial issue taxonomy', () => {
  it('keeps clean anonymous signals ready without backend or training writes', () => {
    expect(userAppTrialIssueTaxonomyCleanSummary.schemaVersion).toBe(
      'user-app-trial-issue-taxonomy-v0.1',
    );
    expect(userAppTrialIssueTaxonomyCleanSummary.status).toBe('summary_ready');
    expect(userAppTrialIssueTaxonomyCleanSummary.issues).toHaveLength(0);
    expect(userAppTrialIssueTaxonomyCleanSummary.backendRecordSystem).toBe(false);
    expect(userAppTrialIssueTaxonomyCleanSummary.usesAiAnalysis).toBe(false);
    expect(userAppTrialIssueTaxonomyCleanSummary.writesTrainingInput).toBe(false);
  });

  it('classifies content and shell issues with severity and actionability', () => {
    expect(userAppTrialIssueTaxonomyContentSummary.status).toBe(
      'summary_ready_with_warnings',
    );
    expect(userAppTrialIssueTaxonomyContentSummary.categoryCounts.content_issue).toBe(1);
    expect(userAppTrialIssueTaxonomyContentSummary.categoryCounts.guidance_clarity_issue).toBe(1);
    expect(userAppTrialIssueTaxonomyContentSummary.severityCounts.high).toBe(2);
    expect(userAppTrialIssueTaxonomyContentSummary.actionabilityCounts.clear_fix).toBe(2);

    expect(userAppTrialIssueTaxonomyShellSummary.categoryCounts.shell_usability_issue).toBe(2);
  });

  it('blocks privacy or sensitive collection requests', () => {
    const classification = classifyUserAppTrialIssue(
      userAppTrialIssueTaxonomyPrivacyBoundarySignals[0],
    );

    expect(classification.category).toBe('blocked_boundary_issue');
    expect(classification.severity).toBe('critical');
    expect(classification.actionability).toBe('blocked_by_boundary');
    expect(userAppTrialIssueTaxonomyPrivacyBoundarySummary.status).toBe('summary_blocked');
  });

  it('does not treat local-only no-upload copy as unsafe collection', () => {
    const summary = createUserAppTrialIssueSummary([
      {
        signalId: 'safe-privacy-copy',
        dimension: 'privacy_clarity',
        score: 4,
        summary: '参与者理解不需要照片、不上传、不训练。',
        evidenceCount: 2,
      },
    ]);

    expect(summary.status).toBe('summary_ready');
    expect(summary.issues).toHaveLength(0);
  });

  it('marks one medium signal as needing more trials before overclaiming', () => {
    const classification = classifyUserAppTrialIssue({
      signalId: 'single-medium',
      dimension: 'recommendation_usefulness',
      score: 3,
      summary: '一名参与者觉得推荐理由有点泛。',
      evidenceCount: 1,
    });

    expect(classification.severity).toBe('medium');
    expect(classification.actionability).toBe('needs_more_trials');
  });
});
