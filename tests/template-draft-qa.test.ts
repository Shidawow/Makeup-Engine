import { describe, expect, it } from 'vitest';
import { evaluateTemplateDraftQa } from '../src/template-engine';
import {
  faceMeshRegionQaBlockedExample,
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
  templateDraftQaFinalClaimBlockedExample,
  templateDraftQaReadyExample,
  templateDraftQaRegionBlockedExample,
} from '../src/templates/examples';

describe('template draft QA', () => {
  it('marks a clean draft as ready for human review only', () => {
    expect(templateDraftQaReadyExample.status).toBe('draft_qa_ready_for_human_review');
    expect(templateDraftQaReadyExample.readyForHumanReview).toBe(true);
    expect(templateDraftQaReadyExample.publishBlocked).toBe(true);
    expect(templateDraftQaReadyExample.userAppTemplatePackageGenerationBlocked).toBe(true);
    expect(templateDraftQaReadyExample.recommendations.map((item) => item.message).join('\n')).toContain(
      '草稿可进入人工审核，但不能发布。',
    );
  });

  it('blocks draft QA when region QA is blocked', () => {
    expect(templateDraftQaRegionBlockedExample.status).toBe('draft_qa_blocked');
    expect(templateDraftQaRegionBlockedExample.issues.map((issue) => issue.checkId)).toContain(
      'region_qa_ready',
    );
  });

  it('warns or blocks candidates missing source confidence review status', () => {
    const report = evaluateTemplateDraftQa({
      regionQa: faceMeshRegionQaReadyExample,
      attributeCandidates: {
        ...makeupAttributeCandidatesReadyExample,
        candidates: makeupAttributeCandidatesReadyExample.candidates.map((candidate, index) =>
          index === 0
            ? ({ ...candidate, reviewStatus: 'unchecked' } as never)
            : candidate,
        ),
      },
      stepSequence: ruleBasedStepSequenceReadyExample,
      templateDraft: makeupTemplateDraftReadyExample,
    });

    expect(report.status).toBe('draft_qa_blocked');
    expect(report.issues.map((issue) => issue.checkId)).toContain(
      'candidates_have_source_confidence_review_status',
    );
  });

  it('blocks steps missing target region or beginner guidance', () => {
    const report = evaluateTemplateDraftQa({
      regionQa: faceMeshRegionQaReadyExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: {
        ...ruleBasedStepSequenceReadyExample,
        steps: ruleBasedStepSequenceReadyExample.steps.map((step, index) =>
          index === 0
            ? { ...step, placement: { ...step.placement, region: 'lip' }, instruction: '涂。' }
            : step,
        ),
      },
      templateDraft: makeupTemplateDraftReadyExample,
    });

    expect(report.status).toBe('draft_qa_blocked');
    expect(report.issues.map((issue) => issue.checkId)).toContain('steps_have_target_regions');
    expect(report.issues.map((issue) => issue.checkId)).toContain('steps_have_beginner_guidance');
  });

  it('blocks final, medical, and product shade claims', () => {
    const shadeAndMedical = evaluateTemplateDraftQa({
      regionQa: faceMeshRegionQaReadyExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: {
        ...ruleBasedStepSequenceReadyExample,
        steps: ruleBasedStepSequenceReadyExample.steps.map((step, index) =>
          index === 0
            ? {
                ...step,
                instruction: `${step.instruction} medical treatment shade #12`,
              }
            : step,
        ),
      },
      templateDraft: makeupTemplateDraftReadyExample,
    });

    expect(templateDraftQaFinalClaimBlockedExample.status).toBe('draft_qa_blocked');
    expect(templateDraftQaFinalClaimBlockedExample.issues.map((issue) => issue.checkId)).toContain(
      'no_final_claims',
    );
    expect(shadeAndMedical.issues.map((issue) => issue.checkId)).toContain('no_medical_claims');
    expect(shadeAndMedical.issues.map((issue) => issue.checkId)).toContain(
      'no_product_shade_claims',
    );
  });

  it('requires publishBlocked and does not mutate user app contract', () => {
    const report = evaluateTemplateDraftQa({
      regionQa: faceMeshRegionQaBlockedExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: ruleBasedStepSequenceReadyExample,
      templateDraft: {
        ...makeupTemplateDraftReadyExample,
        publishBlocked: false as true,
        notes: ['UserAppTemplatePackage should not be generated here.', 'packageId leaked'],
      },
    });

    expect(report.status).toBe('draft_qa_blocked');
    expect(report.issues.map((issue) => issue.checkId)).toContain('publish_blocked_is_true');
    expect(report.issues.map((issue) => issue.checkId)).toContain('user_app_contract_not_mutated');
  });
});
