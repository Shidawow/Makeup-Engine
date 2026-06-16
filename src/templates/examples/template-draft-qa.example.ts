import {
  evaluateTemplateDraftQa,
  generateMakeupAttributeCandidates,
  generateMakeupTemplateDraft,
  generateRuleBasedStepSequence,
} from '../../template-engine';
import {
  faceMeshRegionQaBlockedExample,
  faceMeshRegionQaReadyExample,
} from './facemesh-region-qa.example';
import {
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  phase10aExampleAnalysis,
  ruleBasedStepSequenceReadyExample,
} from './makeup-attribute-candidates.example';

export const templateDraftQaReadyExample = evaluateTemplateDraftQa({
  regionQa: faceMeshRegionQaReadyExample,
  attributeCandidates: makeupAttributeCandidatesReadyExample,
  stepSequence: ruleBasedStepSequenceReadyExample,
  templateDraft: makeupTemplateDraftReadyExample,
});

const blockedCandidates = generateMakeupAttributeCandidates({
  analysis: phase10aExampleAnalysis,
  regionQa: faceMeshRegionQaBlockedExample,
});
const blockedSteps = generateRuleBasedStepSequence(blockedCandidates);
const blockedDraft = generateMakeupTemplateDraft({
  analysis: phase10aExampleAnalysis,
  regionQa: faceMeshRegionQaBlockedExample,
  attributeCandidates: blockedCandidates,
  stepSequence: blockedSteps,
});

export const templateDraftQaRegionBlockedExample = evaluateTemplateDraftQa({
  regionQa: faceMeshRegionQaBlockedExample,
  attributeCandidates: blockedCandidates,
  stepSequence: blockedSteps,
  templateDraft: blockedDraft,
});

export const templateDraftQaFinalClaimBlockedExample = evaluateTemplateDraftQa({
  regionQa: faceMeshRegionQaReadyExample,
  attributeCandidates: makeupAttributeCandidatesReadyExample,
  stepSequence: {
    ...ruleBasedStepSequenceReadyExample,
    steps: ruleBasedStepSequenceReadyExample.steps.map((step, index) =>
      index === 0
        ? { ...step, instruction: `${step.instruction} 最终识别完成。` }
        : step,
    ),
  },
  templateDraft: makeupTemplateDraftReadyExample,
});
