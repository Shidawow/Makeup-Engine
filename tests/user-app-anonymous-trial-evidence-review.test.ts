import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialEvidenceReviewCompleteSafeExample,
  userAppAnonymousTrialEvidenceReviewForbiddenDataExample,
  userAppAnonymousTrialEvidenceReviewInsufficientSampleExample,
  userAppAnonymousTrialEvidenceReviewMissingPostLaunchHandoffExample,
  userAppAnonymousTrialEvidenceReviewMissingPrivacyClarityExample,
  userAppAnonymousTrialEvidenceReviewPrivacyIncidentExample,
  userAppAnonymousTrialEvidenceReviewWarningExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial evidence review', () => {
  it('marks complete anonymous evidence review ready without production scope', () => {
    expect(userAppAnonymousTrialEvidenceReviewCompleteSafeExample.status).toBe(
      'evidence_review_ready',
    );
    expect(userAppAnonymousTrialEvidenceReviewCompleteSafeExample.localOnly).toBe(true);
    expect(userAppAnonymousTrialEvidenceReviewCompleteSafeExample.backendRecordSystem).toBe(false);
    expect(userAppAnonymousTrialEvidenceReviewCompleteSafeExample.usesAiAnalysis).toBe(false);
    expect(userAppAnonymousTrialEvidenceReviewCompleteSafeExample.writesTrainingInput).toBe(false);
    expect(userAppAnonymousTrialEvidenceReviewCompleteSafeExample.writesProjectStateUserRecords).toBe(false);
  });

  it('flags mock/example and insufficient sample reviews as warning only', () => {
    expect(userAppAnonymousTrialEvidenceReviewWarningExample.status).toBe(
      'evidence_review_ready_with_warnings',
    );
    expect(userAppAnonymousTrialEvidenceReviewWarningExample.mockOrExampleOnly).toBe(true);
    expect(userAppAnonymousTrialEvidenceReviewInsufficientSampleExample.status).toBe(
      'evidence_review_ready_with_warnings',
    );
  });

  it('blocks missing post-launch handoff but only warns on missing privacy clarity evidence', () => {
    expect(userAppAnonymousTrialEvidenceReviewMissingPostLaunchHandoffExample.status).toBe(
      'evidence_review_blocked',
    );
    expect(userAppAnonymousTrialEvidenceReviewMissingPrivacyClarityExample.status).toBe(
      'evidence_review_ready_with_warnings',
    );
  });

  it('blocks forbidden data and privacy incidents', () => {
    expect(userAppAnonymousTrialEvidenceReviewForbiddenDataExample.status).toBe(
      'evidence_review_blocked',
    );
    expect(userAppAnonymousTrialEvidenceReviewPrivacyIncidentExample.status).toBe(
      'evidence_review_blocked',
    );
  });
});
