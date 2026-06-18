import { validateUserAppPackageDraftPreview } from '../../template-engine';
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

export const userAppPackageDraftPreviewValidationReadyExample =
  validateUserAppPackageDraftPreview(userAppPackageDraftPreviewReadyExample);

export const userAppPackageDraftPreviewValidationWarningExample =
  validateUserAppPackageDraftPreview(userAppPackageDraftPreviewWarningExample);

export const userAppPackageDraftPreviewValidationMissingContractReadyExample =
  validateUserAppPackageDraftPreview(
    userAppPackageDraftPreviewMissingContractReadyExample,
  );

export const userAppPackageDraftPreviewValidationRawImageBlockedExample =
  validateUserAppPackageDraftPreview(userAppPackageDraftPreviewRawImageBlockedExample);

export const userAppPackageDraftPreviewValidationMissingStepGuidanceExample =
  validateUserAppPackageDraftPreview(
    userAppPackageDraftPreviewMissingStepGuidanceExample,
  );

export const userAppPackageDraftPreviewValidationPersonalDataBlockedExample =
  validateUserAppPackageDraftPreview(
    userAppPackageDraftPreviewPersonalDataBlockedExample,
  );

export const userAppPackageDraftPreviewValidationMedicalClaimBlockedExample =
  validateUserAppPackageDraftPreview(
    userAppPackageDraftPreviewMedicalClaimBlockedExample,
  );

export const userAppPackageDraftPreviewValidationUserAppMutationBlockedExample =
  validateUserAppPackageDraftPreview(
    userAppPackageDraftPreviewUserAppMutationBlockedExample,
  );
