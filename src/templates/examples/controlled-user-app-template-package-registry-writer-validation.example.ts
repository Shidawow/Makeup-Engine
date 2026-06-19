import { validateControlledUserAppTemplatePackageRegistryWriterDraft } from '../../template-engine';
import {
  controlledRegistryWriterDraftActualRegistryWriteBlockedExample,
  controlledRegistryWriterDraftMedicalClaimBlockedExample,
  controlledRegistryWriterDraftMissingActualWriteBlockedExample,
  controlledRegistryWriterDraftMissingDryRunOnlyExample,
  controlledRegistryWriterDraftMissingGateExample,
  controlledRegistryWriterDraftMissingPackageReplacementBlockedExample,
  controlledRegistryWriterDraftMissingPublishBlockedExample,
  controlledRegistryWriterDraftPersonalDataBlockedExample,
  controlledRegistryWriterDraftProductShadeBlockedExample,
  controlledRegistryWriterDraftProductionMarkerBlockedExample,
  controlledRegistryWriterDraftRawImageBlockedExample,
  controlledRegistryWriterDraftReadyExample,
  controlledRegistryWriterDraftShellReplacementBlockedExample,
  controlledRegistryWriterDraftUnsupportedFinalClaimBlockedExample,
  controlledRegistryWriterDraftWarningExample,
} from './controlled-user-app-template-package-registry-writer-draft.example';

export const controlledRegistryWriterValidationReadyExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftReadyExample,
  );

export const controlledRegistryWriterValidationWarningExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftWarningExample,
  );

export const controlledRegistryWriterValidationMissingGateExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftMissingGateExample,
  );

export const controlledRegistryWriterValidationMissingDryRunOnlyExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftMissingDryRunOnlyExample,
  );

export const controlledRegistryWriterValidationMissingActualWriteBlockedExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftMissingActualWriteBlockedExample,
  );

export const controlledRegistryWriterValidationMissingPublishBlockedExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftMissingPublishBlockedExample,
  );

export const controlledRegistryWriterValidationMissingPackageReplacementBlockedExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftMissingPackageReplacementBlockedExample,
  );

export const controlledRegistryWriterValidationRawImageExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftRawImageBlockedExample,
  );

export const controlledRegistryWriterValidationPersonalDataExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftPersonalDataBlockedExample,
  );

export const controlledRegistryWriterValidationMedicalClaimExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftMedicalClaimBlockedExample,
  );

export const controlledRegistryWriterValidationProductShadeExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftProductShadeBlockedExample,
  );

export const controlledRegistryWriterValidationUnsupportedFinalClaimExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftUnsupportedFinalClaimBlockedExample,
  );

export const controlledRegistryWriterValidationActualRegistryWriteExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftActualRegistryWriteBlockedExample,
  );

export const controlledRegistryWriterValidationProductionMarkerExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftProductionMarkerBlockedExample,
  );

export const controlledRegistryWriterValidationShellReplacementExample =
  validateControlledUserAppTemplatePackageRegistryWriterDraft(
    controlledRegistryWriterDraftShellReplacementBlockedExample,
  );
