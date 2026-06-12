import { describe, expect, it } from 'vitest';
import {
  userAppEvidenceCollectionQualityGateForbiddenContactExample,
  userAppEvidenceCollectionQualityGateForbiddenPhotoExample,
  userAppEvidenceCollectionQualityGateMissingNoticeExample,
  userAppEvidenceCollectionQualityGateMissingProtocolExample,
  userAppEvidenceCollectionQualityGateReadyExample,
  userAppEvidenceCollectionQualityGateUploadTrainingViolationExample,
  userAppEvidenceCollectionQualityGateWarningExample,
} from '../src/templates/examples';

describe('User App evidence collection quality gate', () => {
  it('allows anonymous internal evidence dry run only when all preparation is complete', () => {
    expect(userAppEvidenceCollectionQualityGateReadyExample.decision).toBe(
      'ready_to_collect_anonymous_internal_evidence',
    );
    expect(userAppEvidenceCollectionQualityGateReadyExample.productionBuildApproved).toBe(false);
    expect(userAppEvidenceCollectionQualityGateReadyExample.writesTrainingInput).toBe(false);
  });

  it('keeps warning preparation separate from full readiness', () => {
    expect(userAppEvidenceCollectionQualityGateWarningExample.decision).toBe(
      'ready_with_warnings',
    );
  });

  it('blocks missing protocol and missing participant notice', () => {
    expect(userAppEvidenceCollectionQualityGateMissingProtocolExample.decision).toBe(
      'blocked_by_missing_protocol',
    );
    expect(userAppEvidenceCollectionQualityGateMissingNoticeExample.decision).toBe(
      'blocked_by_missing_notice',
    );
  });

  it('forces privacy scope block for photo, contact, upload, and training requests', () => {
    expect(userAppEvidenceCollectionQualityGateForbiddenPhotoExample.decision).toBe(
      'blocked_by_privacy_scope',
    );
    expect(userAppEvidenceCollectionQualityGateForbiddenContactExample.decision).toBe(
      'blocked_by_privacy_scope',
    );
    expect(userAppEvidenceCollectionQualityGateUploadTrainingViolationExample.decision).toBe(
      'blocked_by_privacy_scope',
    );
  });
});
