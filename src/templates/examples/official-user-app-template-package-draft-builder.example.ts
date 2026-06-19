import {
  buildOfficialUserAppTemplatePackageDraft,
  validateUserAppPackageDraftPreview,
} from '../../template-engine';
import type { UserAppPackageDraftPreview } from '../../template-engine';
import {
  officialUserAppPackageDraftGateHandoffPrivacyReviewExample,
  officialUserAppPackageDraftGateHandoffReadyExample,
  officialUserAppPackageDraftGateHandoffStepRevisionExample,
} from './official-user-app-package-draft-gate-handoff.example';
import {
  officialUserAppPackageDraftGateMissingPreviewValidationExample,
  officialUserAppPackageDraftGateMissingStepGuidanceExample,
  officialUserAppPackageDraftGatePersonalDataBlockedExample,
  officialUserAppPackageDraftGateReadyExample,
  officialUserAppPackageDraftGateWarningExample,
} from './official-user-app-package-draft-gate.example';
import {
  userAppPackageDraftPreviewMedicalClaimBlockedExample,
  userAppPackageDraftPreviewMissingContractReadyExample,
  userAppPackageDraftPreviewMissingStepGuidanceExample,
  userAppPackageDraftPreviewPersonalDataBlockedExample,
  userAppPackageDraftPreviewRawImageBlockedExample,
  userAppPackageDraftPreviewReadyExample,
  userAppPackageDraftPreviewUserAppMutationBlockedExample,
  userAppPackageDraftPreviewWarningExample,
} from './user-app-package-draft-preview.example';

export const officialUserAppTemplatePackageDraftBuilderReadyExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: userAppPackageDraftPreviewReadyExample,
    gate: officialUserAppPackageDraftGateReadyExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffReadyExample,
  });

export const officialUserAppTemplatePackageDraftBuilderWarningExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: userAppPackageDraftPreviewWarningExample,
    gate: officialUserAppPackageDraftGateWarningExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffReadyExample,
  });

export const officialUserAppTemplatePackageDraftBuilderMissingGateExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: userAppPackageDraftPreviewMissingContractReadyExample,
    gate: officialUserAppPackageDraftGateMissingPreviewValidationExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffPrivacyReviewExample,
  });

export const officialUserAppTemplatePackageDraftBuilderMissingStepExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: userAppPackageDraftPreviewMissingStepGuidanceExample,
    gate: officialUserAppPackageDraftGateMissingStepGuidanceExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffStepRevisionExample,
  });

export const officialUserAppTemplatePackageDraftBuilderMissingPrivacyExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: {
      ...userAppPackageDraftPreviewReadyExample,
      previewId: 'user-app-draft-preview-missing-privacy-for-official-builder',
      privacyNoticePreview: '',
    },
    gate: officialUserAppPackageDraftGateReadyExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffReadyExample,
  });

export const officialUserAppTemplatePackageDraftBuilderRawImageExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: userAppPackageDraftPreviewRawImageBlockedExample,
    gate: officialUserAppPackageDraftGateReadyExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffReadyExample,
  });

export const officialUserAppTemplatePackageDraftBuilderPersonalDataExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: userAppPackageDraftPreviewPersonalDataBlockedExample,
    gate: officialUserAppPackageDraftGatePersonalDataBlockedExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffPrivacyReviewExample,
  });

export const officialUserAppTemplatePackageDraftBuilderMedicalClaimExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: userAppPackageDraftPreviewMedicalClaimBlockedExample,
    gate: officialUserAppPackageDraftGateReadyExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffReadyExample,
  });

const productShadePreview: UserAppPackageDraftPreview = {
  ...userAppPackageDraftPreviewReadyExample,
  previewId: 'user-app-draft-preview-shade-claim-for-official-builder',
  productPlaceholderPreview: ['MAC shade #12'],
};

export const officialUserAppTemplatePackageDraftBuilderProductShadeExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: productShadePreview,
    gate: officialUserAppPackageDraftGateReadyExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffReadyExample,
  });

const registryWritePreview: UserAppPackageDraftPreview = {
  ...userAppPackageDraftPreviewReadyExample,
  previewId: 'user-app-draft-preview-registry-write-for-official-builder',
  summaryPreview: 'writeRegistry marker should block this draft.',
};

export const officialUserAppTemplatePackageDraftBuilderRegistryWriteExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: registryWritePreview,
    gate: officialUserAppPackageDraftGateReadyExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffReadyExample,
  });

export const officialUserAppTemplatePackageDraftBuilderMutationExample =
  buildOfficialUserAppTemplatePackageDraft({
    preview: userAppPackageDraftPreviewUserAppMutationBlockedExample,
    gate: officialUserAppPackageDraftGateReadyExample,
    gateHandoff: officialUserAppPackageDraftGateHandoffReadyExample,
  });

export const officialUserAppTemplatePackageDraftBuilderValidationInputExample =
  validateUserAppPackageDraftPreview(userAppPackageDraftPreviewReadyExample);
