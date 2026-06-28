import {
  createPhotoToTemplateRealityCheckReport,
  createPhotoToTemplateRealityHandoff,
  validatePhotoToTemplateRealityCheck,
  type PhotoToTemplateRealityCheckReport,
} from '../../template-engine';
import {
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  phase10aExampleAnalysis,
  ruleBasedStepSequenceReadyExample,
} from './makeup-attribute-candidates.example';
import { faceMeshRegionQaReadyExample } from './facemesh-region-qa.example';
import { photoToTemplateDraftIntegrationReadyExample } from './photo-to-template-draft-integration.example';

const replaceField = (
  report: PhotoToTemplateRealityCheckReport,
  fieldName: PhotoToTemplateRealityCheckReport['fieldEvidence'][number]['field'],
  sourceTypes: PhotoToTemplateRealityCheckReport['fieldEvidence'][number]['sourceTypes'],
): PhotoToTemplateRealityCheckReport => ({
  ...report,
  fieldEvidence: report.fieldEvidence.map((item) =>
    item.field === fieldName
      ? {
          ...item,
          sourceTypes,
          humanReviewRequired: sourceTypes.includes('human_required'),
        }
      : item,
  ),
});

export const photoToTemplateRealityReadyExample =
  createPhotoToTemplateRealityCheckReport({
    analysis: phase10aExampleAnalysis,
    regionQa: faceMeshRegionQaReadyExample,
    attributeCandidates: makeupAttributeCandidatesReadyExample,
    stepSequence: ruleBasedStepSequenceReadyExample,
    templateDraft: makeupTemplateDraftReadyExample,
  });

export const photoToTemplateRealitySemanticIntegratedExample =
  createPhotoToTemplateRealityCheckReport({
    analysis: phase10aExampleAnalysis,
    regionQa: faceMeshRegionQaReadyExample,
    attributeCandidates: makeupAttributeCandidatesReadyExample,
    stepSequence: ruleBasedStepSequenceReadyExample,
    templateDraft: makeupTemplateDraftReadyExample,
    draftIntegration: photoToTemplateDraftIntegrationReadyExample,
  });

export const photoToTemplateRealityDemoOnlyExample =
  createPhotoToTemplateRealityCheckReport({});

export const photoToTemplateRealityMissingPlaceholderWarningExample = {
  ...photoToTemplateRealityReadyExample,
  fieldEvidence: photoToTemplateRealityReadyExample.fieldEvidence.map((item) => ({
    ...item,
    sourceTypes: item.sourceTypes.filter((source) => source !== 'placeholder'),
  })),
};

export const photoToTemplateRealityFixtureAsRealBlockedExample = replaceField(
  photoToTemplateRealityReadyExample,
  'userAppPreview',
  ['demo_fixture', 'real_from_photo', 'human_required'],
);

export const photoToTemplateRealityLipColorRealBlockedExample = replaceField(
  photoToTemplateRealityReadyExample,
  'lipColor',
  ['real_from_photo', 'human_required'],
);

export const photoToTemplateRealityFullyAutomaticClaimBlockedExample = {
  ...photoToTemplateRealityReadyExample,
  claims: ['Current system provides fully automatic extraction from arbitrary makeup photos.'],
};

export const photoToTemplateRealityModelConfidenceMislabelBlockedExample = {
  ...photoToTemplateRealityReadyExample,
  claims: ['Readiness Score is model raw confidence for final makeup recognition.'],
};

export const photoToTemplateRealityRegistryClaimBlockedExample = {
  ...photoToTemplateRealityReadyExample,
  claims: ['Reality check completed and 已写入 registry for user app publication.'],
};

export const photoToTemplateRealityMissingHumanRequiredBlockedExample = {
  ...photoToTemplateRealityReadyExample,
  fieldEvidence: photoToTemplateRealityReadyExample.fieldEvidence.map((item) => ({
    ...item,
    sourceTypes: item.sourceTypes.filter((source) => source !== 'human_required'),
    humanReviewRequired: false,
  })),
} as PhotoToTemplateRealityCheckReport;

export const photoToTemplateRealityValidationReadyExample =
  validatePhotoToTemplateRealityCheck(photoToTemplateRealityReadyExample);

export const photoToTemplateRealityValidationSemanticIntegratedExample =
  validatePhotoToTemplateRealityCheck(photoToTemplateRealitySemanticIntegratedExample);

export const photoToTemplateRealityValidationWarningExample =
  validatePhotoToTemplateRealityCheck(
    photoToTemplateRealityMissingPlaceholderWarningExample,
  );

export const photoToTemplateRealityValidationFixtureAsRealBlockedExample =
  validatePhotoToTemplateRealityCheck(
    photoToTemplateRealityFixtureAsRealBlockedExample,
  );

export const photoToTemplateRealityValidationLipColorRealBlockedExample =
  validatePhotoToTemplateRealityCheck(
    photoToTemplateRealityLipColorRealBlockedExample,
  );

export const photoToTemplateRealityValidationFullyAutomaticBlockedExample =
  validatePhotoToTemplateRealityCheck(
    photoToTemplateRealityFullyAutomaticClaimBlockedExample,
  );

export const photoToTemplateRealityValidationModelConfidenceBlockedExample =
  validatePhotoToTemplateRealityCheck(
    photoToTemplateRealityModelConfidenceMislabelBlockedExample,
  );

export const photoToTemplateRealityValidationRegistryClaimBlockedExample =
  validatePhotoToTemplateRealityCheck(
    photoToTemplateRealityRegistryClaimBlockedExample,
  );

export const photoToTemplateRealityValidationMissingHumanRequiredBlockedExample =
  validatePhotoToTemplateRealityCheck(
    photoToTemplateRealityMissingHumanRequiredBlockedExample,
  );

export const photoToTemplateRealityHandoffReadyExample =
  createPhotoToTemplateRealityHandoff({
    report: photoToTemplateRealityReadyExample,
    validation: photoToTemplateRealityValidationReadyExample,
  });

export const photoToTemplateRealityHandoffSemanticIntegratedExample =
  createPhotoToTemplateRealityHandoff({
    report: photoToTemplateRealitySemanticIntegratedExample,
    validation: photoToTemplateRealityValidationSemanticIntegratedExample,
  });

export const photoToTemplateRealityHandoffBlockedExample =
  createPhotoToTemplateRealityHandoff({
    report: photoToTemplateRealityFullyAutomaticClaimBlockedExample,
    validation: photoToTemplateRealityValidationFullyAutomaticBlockedExample,
  });
