import { describe, expect, it } from 'vitest';
import { createPhotoToTemplateRealityHandoff } from '../src/template-engine';
import {
  photoToTemplateRealityDemoOnlyExample,
  photoToTemplateRealityFullyAutomaticClaimBlockedExample,
  photoToTemplateRealityHandoffBlockedExample,
  photoToTemplateRealityHandoffReadyExample,
  photoToTemplateRealityValidationFullyAutomaticBlockedExample,
  photoToTemplateRealityValidationReadyExample,
} from '../src/templates/examples';
import { validatePhotoToTemplateRealityCheck } from '../src/template-engine';

describe('photo-to-template reality handoff', () => {
  it('hands a ready reality check to Phase 12B without claiming automatic extraction', () => {
    expect(photoToTemplateRealityHandoffReadyExample.status).toBe('reality_handoff_ready');
    expect(photoToTemplateRealityHandoffReadyExample.nextAction).toBe(
      'ready_for_makeup_semantic_extraction_baseline',
    );
    expect(photoToTemplateRealityHandoffReadyExample.nextRecommendedPhase).toBe(
      'Phase 12B - Makeup Semantic Extraction Baseline',
    );
    expect(photoToTemplateRealityHandoffReadyExample.notFullyAutomaticExtraction).toBe(true);
    expect(photoToTemplateRealityHandoffReadyExample.noRegistryWrite).toBe(true);
    expect(photoToTemplateRealityHandoffReadyExample.noPublish).toBe(true);
  });

  it('blocks handoff when the report claims fully automatic extraction', () => {
    expect(photoToTemplateRealityHandoffBlockedExample.status).toBe(
      'reality_handoff_blocked',
    );
    expect(photoToTemplateRealityHandoffBlockedExample.nextAction).toBe(
      'blocked_do_not_claim_automatic_extraction',
    );
    expect(photoToTemplateRealityValidationFullyAutomaticBlockedExample.status).toBe(
      'reality_check_blocked',
    );
  });

  it('keeps missing analysis as demo-only instead of overclaiming draft capability', () => {
    const validation = validatePhotoToTemplateRealityCheck(
      photoToTemplateRealityDemoOnlyExample,
    );
    const handoff = createPhotoToTemplateRealityHandoff({
      report: photoToTemplateRealityDemoOnlyExample,
      validation,
    });

    expect(photoToTemplateRealityDemoOnlyExample.capabilityStatus).toBe('demo_only');
    expect(handoff.status).toBe('reality_handoff_demo_only');
    expect(handoff.nextAction).toBe('keep_as_demo_only');
  });

  it('keeps handoff JSON round-trip stable', () => {
    const handoff = createPhotoToTemplateRealityHandoff({
      report: photoToTemplateRealityFullyAutomaticClaimBlockedExample,
      validation: photoToTemplateRealityValidationFullyAutomaticBlockedExample,
    });

    expect(photoToTemplateRealityValidationReadyExample.readyForPhase12B).toBe(true);
    expect(handoff.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(handoff))).toEqual(handoff);
  });
});
