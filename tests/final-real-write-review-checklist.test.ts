import { describe, expect, it } from 'vitest';
import { finalRealWriteOwnerAuthorizationText } from '../src/template-engine';
import {
  finalRealWriteReviewChecklistMissingOwnerScopeExample,
  finalRealWriteReviewChecklistOwnerActualWriteBlockedExample,
  finalRealWriteReviewChecklistReadyExample,
  finalRealWriteReviewChecklistWarningExample,
} from '../src/templates/examples';

describe('Final real write review checklist', () => {
  it('preserves the owner authorization scope text as review gate evidence', () => {
    const checklist = finalRealWriteReviewChecklistReadyExample;

    expect(checklist.status).toBe('final_review_checklist_ready');
    expect(checklist.ownerAuthorizationEvidence.scope).toBe('review_gate_only');
    expect(checklist.ownerAuthorizationEvidence.text).toBe(
      finalRealWriteOwnerAuthorizationText,
    );
    expect(checklist.ownerAuthorizationEvidence.ownerAuthorizedReviewGateOnly).toBe(
      true,
    );
    expect(checklist.ownerAuthorizationEvidence.ownerAuthorizedActualWrite).toBe(
      false,
    );
    expect(checklist.ownerAuthorizationEvidence.ownerAuthorizedPublish).toBe(false);
    expect(
      checklist.ownerAuthorizationEvidence.ownerAuthorizedUserAppShellReplacement,
    ).toBe(false);
    expect(checklist.doesNotTriggerWrite).toBe(true);
    expect(checklist.doesNotCreateProductionWriter).toBe(true);
    expect(checklist.doesNotModifyRegistry).toBe(true);
    expect(checklist.noActualRegistryWrite).toBe(true);
    expect(checklist.notPublished).toBe(true);
    expect(checklist.noUserAppShellPackageReplacement).toBe(true);
  });

  it('keeps warning source inputs as checklist warnings', () => {
    expect(finalRealWriteReviewChecklistWarningExample.status).toBe(
      'final_review_checklist_ready_with_warnings',
    );
  });

  it('blocks actual-write owner authorization interpretation', () => {
    const checklist = finalRealWriteReviewChecklistOwnerActualWriteBlockedExample;

    expect(checklist.status).toBe('final_review_checklist_blocked');
    expect(checklist.ownerAuthorizationEvidence.scope).toBe('actual_write');
    expect(checklist.ownerAuthorizationEvidence.ownerAuthorizedActualWrite).toBe(
      true,
    );
    expect(
      checklist.items.find(
        (item) =>
          item.id === 'confirm_owner_did_not_authorize_actual_registry_write',
      )?.status,
    ).toBe('blocked');
  });

  it('blocks missing owner scope checklist requirement', () => {
    expect(finalRealWriteReviewChecklistMissingOwnerScopeExample.status).toBe(
      'final_review_checklist_blocked',
    );
    expect(
      finalRealWriteReviewChecklistMissingOwnerScopeExample.items.find(
        (item) => item.id === 'confirm_owner_authorized_review_gate_only',
      )?.status,
    ).toBe('blocked');
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(finalRealWriteReviewChecklistReadyExample);

    expect(JSON.parse(json)).toEqual(finalRealWriteReviewChecklistReadyExample);
  });
});
