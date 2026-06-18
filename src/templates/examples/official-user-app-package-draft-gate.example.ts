import {
  createOfficialUserAppPackageDraftGate,
  validateUserAppPackageDraftPreview,
} from '../../template-engine';
import type { UserAppPackageDraftPreview } from '../../template-engine';
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
import {
  userAppPackageDraftPreviewValidationMedicalClaimBlockedExample,
  userAppPackageDraftPreviewValidationMissingContractReadyExample,
  userAppPackageDraftPreviewValidationMissingStepGuidanceExample,
  userAppPackageDraftPreviewValidationPersonalDataBlockedExample,
  userAppPackageDraftPreviewValidationRawImageBlockedExample,
  userAppPackageDraftPreviewValidationReadyExample,
  userAppPackageDraftPreviewValidationUserAppMutationBlockedExample,
  userAppPackageDraftPreviewValidationWarningExample,
} from './user-app-package-draft-preview-validation.example';

const userAppPackageDraftPreviewProductShadeBlockedExample: UserAppPackageDraftPreview = {
  ...userAppPackageDraftPreviewReadyExample,
  previewId: 'user-app-draft-preview-product-shade-blocked',
  productPlaceholderPreview: ['MAC shade #12'],
};

const userAppPackageDraftPreviewRegistryWriteBlockedExample = {
  ...userAppPackageDraftPreviewReadyExample,
  previewId: 'user-app-draft-preview-registry-write-blocked',
  noUserAppPackageRegistryWrite: false,
  trace: {
    ...userAppPackageDraftPreviewReadyExample.trace,
    noUserAppPackageRegistryWrite: false,
  },
} as unknown as UserAppPackageDraftPreview;

export const officialUserAppPackageDraftGateReadyExample =
  createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreviewReadyExample,
    validation: userAppPackageDraftPreviewValidationReadyExample,
  });

export const officialUserAppPackageDraftGateWarningExample =
  createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreviewWarningExample,
    validation: userAppPackageDraftPreviewValidationWarningExample,
  });

export const officialUserAppPackageDraftGateMissingPreviewValidationExample =
  createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreviewMissingContractReadyExample,
    validation: userAppPackageDraftPreviewValidationMissingContractReadyExample,
  });

export const officialUserAppPackageDraftGateMissingStepGuidanceExample =
  createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreviewMissingStepGuidanceExample,
    validation: userAppPackageDraftPreviewValidationMissingStepGuidanceExample,
  });

export const officialUserAppPackageDraftGateRawImageBlockedExample =
  createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreviewRawImageBlockedExample,
    validation: userAppPackageDraftPreviewValidationRawImageBlockedExample,
  });

export const officialUserAppPackageDraftGatePersonalDataBlockedExample =
  createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreviewPersonalDataBlockedExample,
    validation: userAppPackageDraftPreviewValidationPersonalDataBlockedExample,
  });

export const officialUserAppPackageDraftGateMedicalClaimBlockedExample =
  createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreviewMedicalClaimBlockedExample,
    validation: userAppPackageDraftPreviewValidationMedicalClaimBlockedExample,
  });

export const officialUserAppPackageDraftGateProductShadeBlockedExample =
  createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreviewProductShadeBlockedExample,
    validation: validateUserAppPackageDraftPreview(
      userAppPackageDraftPreviewProductShadeBlockedExample,
    ),
  });

export const officialUserAppPackageDraftGateRegistryWriteBlockedExample =
  createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreviewRegistryWriteBlockedExample,
    validation: validateUserAppPackageDraftPreview(
      userAppPackageDraftPreviewRegistryWriteBlockedExample,
    ),
  });

export const officialUserAppPackageDraftGateUserAppMutationBlockedExample =
  createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreviewUserAppMutationBlockedExample,
    validation: userAppPackageDraftPreviewValidationUserAppMutationBlockedExample,
  });
