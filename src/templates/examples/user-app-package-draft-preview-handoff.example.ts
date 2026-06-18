import { createUserAppPackageDraftPreviewHandoff } from '../../template-engine';
import {
  userAppPackageDraftPreviewMissingStepGuidanceExample,
  userAppPackageDraftPreviewReadyExample,
  userAppPackageDraftPreviewRawImageBlockedExample,
  userAppPackageDraftPreviewWarningExample,
} from './user-app-package-draft-preview.example';
import {
  userAppPackageDraftPreviewValidationMissingStepGuidanceExample,
  userAppPackageDraftPreviewValidationRawImageBlockedExample,
  userAppPackageDraftPreviewValidationReadyExample,
  userAppPackageDraftPreviewValidationWarningExample,
} from './user-app-package-draft-preview-validation.example';

export const userAppPackageDraftPreviewHandoffReadyExample =
  createUserAppPackageDraftPreviewHandoff({
    preview: userAppPackageDraftPreviewReadyExample,
    validation: userAppPackageDraftPreviewValidationReadyExample,
  });

export const userAppPackageDraftPreviewHandoffCopyRevisionExample =
  createUserAppPackageDraftPreviewHandoff({
    preview: userAppPackageDraftPreviewWarningExample,
    validation: userAppPackageDraftPreviewValidationWarningExample,
  });

export const userAppPackageDraftPreviewHandoffStepRevisionExample =
  createUserAppPackageDraftPreviewHandoff({
    preview: userAppPackageDraftPreviewMissingStepGuidanceExample,
    validation: userAppPackageDraftPreviewValidationMissingStepGuidanceExample,
  });

export const userAppPackageDraftPreviewHandoffBlockedExample =
  createUserAppPackageDraftPreviewHandoff({
    preview: userAppPackageDraftPreviewRawImageBlockedExample,
    validation: userAppPackageDraftPreviewValidationRawImageBlockedExample,
  });
