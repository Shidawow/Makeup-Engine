import { createPhotoToTemplateAcceptanceTrialReport } from '../../template-engine';
import {
  photoToTemplateDraftPreviewQaBlockedClaimsExample,
  photoToTemplateDraftPreviewQaBlockedInternalTermsExample,
  photoToTemplateDraftPreviewQaReadyExample,
  photoToTemplateOperatorWorkflowBlockedByPreviewExample,
  photoToTemplateOperatorWorkflowReadyExample,
} from './photo-to-template-operator-workflow.example';

export const photoToTemplateAcceptanceTrialReadyExample =
  createPhotoToTemplateAcceptanceTrialReport({
    operatorWorkflow: photoToTemplateOperatorWorkflowReadyExample,
    draftPreviewQa: photoToTemplateDraftPreviewQaReadyExample,
    buildAndTestsPassed: true,
    publicMediapipeIgnored: true,
  });

export const photoToTemplateAcceptanceTrialWarningExample =
  createPhotoToTemplateAcceptanceTrialReport({
    operatorWorkflow: photoToTemplateOperatorWorkflowReadyExample,
    draftPreviewQa: photoToTemplateDraftPreviewQaReadyExample,
    buildAndTestsPassed: false,
    publicMediapipeIgnored: true,
  });

export const photoToTemplateAcceptanceTrialBlockedByWorkflowExample =
  createPhotoToTemplateAcceptanceTrialReport({
    operatorWorkflow: photoToTemplateOperatorWorkflowBlockedByPreviewExample,
    draftPreviewQa: photoToTemplateDraftPreviewQaBlockedInternalTermsExample,
    buildAndTestsPassed: true,
    publicMediapipeIgnored: true,
  });

export const photoToTemplateAcceptanceTrialBlockedByClaimsExample =
  createPhotoToTemplateAcceptanceTrialReport({
    operatorWorkflow: photoToTemplateOperatorWorkflowReadyExample,
    draftPreviewQa: photoToTemplateDraftPreviewQaBlockedClaimsExample,
    demoClaimText:
      'AI 已确认 fully automatic extraction，可做 medical diagnosis，并精准匹配 Dior shade #001。',
    buildAndTestsPassed: true,
    publicMediapipeIgnored: true,
  });

export const photoToTemplateAcceptanceTrialBlockedByRegistryExample =
  createPhotoToTemplateAcceptanceTrialReport({
    operatorWorkflow: photoToTemplateOperatorWorkflowReadyExample,
    draftPreviewQa: photoToTemplateDraftPreviewQaReadyExample,
    registryWriteAttempted: true,
    publishAttempted: true,
    productionWriterCreated: true,
    userAppShellReplacementAttempted: true,
    buildAndTestsPassed: true,
    publicMediapipeIgnored: true,
  });

export const photoToTemplateAcceptanceTrialDemoEvidenceExample = {
  fakeImageId: 'demo-image-anonymous-coral-look-v0',
  mockedReadinessSummary: 'FaceMesh / mask / region readiness demo evidence, no raw image stored.',
  semanticCandidateExamples: ['lipColorCandidate', 'blushToneCandidate', 'eyeToneCandidate'],
  draftPreviewQaReportId: photoToTemplateDraftPreviewQaReadyExample.reportId,
  trialReportId: photoToTemplateAcceptanceTrialReadyExample.trialId,
  localOnly: true,
  containsRawImage: false,
  containsBase64: false,
  containsLocalPhotoPath: false,
  containsPersonalData: false,
};
