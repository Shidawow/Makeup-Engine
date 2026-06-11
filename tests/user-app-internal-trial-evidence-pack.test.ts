import { describe, expect, it } from 'vitest';
import {
  userAppInternalTrialEvidencePackInsufficientExample,
  userAppInternalTrialEvidencePackMvpPlanningExample,
  userAppInternalTrialEvidencePackNoEvidenceExample,
  userAppInternalTrialEvidencePackPrivacyBlockerExample,
} from '../src/templates/examples';
import { createUserAppInternalTrialEvidencePack } from '../src/user-app';

describe('User App internal trial evidence pack', () => {
  it('reports ready, warning, and blocked evidence pack states', () => {
    expect(userAppInternalTrialEvidencePackMvpPlanningExample.status).toBe(
      'evidence_pack_ready',
    );
    expect(userAppInternalTrialEvidencePackInsufficientExample.status).toBe(
      'evidence_pack_ready_with_warnings',
    );
    expect(userAppInternalTrialEvidencePackPrivacyBlockerExample.status).toBe(
      'evidence_pack_blocked',
    );
  });

  it('keeps evidence anonymous, local, mock-only, and out of training/project-state records', () => {
    const pack = createUserAppInternalTrialEvidencePack();

    expect(pack.localOnly).toBe(true);
    expect(pack.mockOnly).toBe(true);
    expect(pack.anonymousOrExampleOnly).toBe(true);
    expect(pack.backendRecordSystem).toBe(false);
    expect(pack.usesAiAnalysis).toBe(false);
    expect(pack.collectsPhotos).toBe(false);
    expect(pack.writesTrainingInput).toBe(false);
    expect(pack.writesProjectStateUserRecords).toBe(false);
    expect(pack.evidenceChain).toContain('9E evidence pack and sufficiency gate');
  });

  it('does not treat no evidence as enough for an evidence pack', () => {
    expect(userAppInternalTrialEvidencePackNoEvidenceExample.status).toBe(
      'evidence_pack_ready_with_warnings',
    );
    expect(userAppInternalTrialEvidencePackNoEvidenceExample.risks[0].riskId).toBe(
      'evidence-risk-missing',
    );
  });
});
