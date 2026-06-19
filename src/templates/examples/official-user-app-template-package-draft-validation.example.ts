import { validateOfficialUserAppTemplatePackageDraft } from '../../template-engine';
import {
  officialUserAppTemplatePackageDraftMedicalClaimBlockedExample,
  officialUserAppTemplatePackageDraftMissingGateExample,
  officialUserAppTemplatePackageDraftMissingPrivacyExample,
  officialUserAppTemplatePackageDraftMissingStepExample,
  officialUserAppTemplatePackageDraftMutationBlockedExample,
  officialUserAppTemplatePackageDraftPersonalDataBlockedExample,
  officialUserAppTemplatePackageDraftProductShadeBlockedExample,
  officialUserAppTemplatePackageDraftRawImageBlockedExample,
  officialUserAppTemplatePackageDraftReadyExample,
  officialUserAppTemplatePackageDraftRegistryWriteBlockedExample,
  officialUserAppTemplatePackageDraftWarningExample,
} from './official-user-app-template-package-draft.example';

export const officialUserAppTemplatePackageDraftValidationReadyExample =
  validateOfficialUserAppTemplatePackageDraft(officialUserAppTemplatePackageDraftReadyExample);

export const officialUserAppTemplatePackageDraftValidationWarningExample =
  validateOfficialUserAppTemplatePackageDraft(officialUserAppTemplatePackageDraftWarningExample);

export const officialUserAppTemplatePackageDraftValidationMissingGateExample =
  validateOfficialUserAppTemplatePackageDraft(
    officialUserAppTemplatePackageDraftMissingGateExample,
  );

export const officialUserAppTemplatePackageDraftValidationMissingStepExample =
  validateOfficialUserAppTemplatePackageDraft(
    officialUserAppTemplatePackageDraftMissingStepExample,
  );

export const officialUserAppTemplatePackageDraftValidationMissingPrivacyExample =
  validateOfficialUserAppTemplatePackageDraft(
    officialUserAppTemplatePackageDraftMissingPrivacyExample,
  );

export const officialUserAppTemplatePackageDraftValidationRawImageExample =
  validateOfficialUserAppTemplatePackageDraft(
    officialUserAppTemplatePackageDraftRawImageBlockedExample,
  );

export const officialUserAppTemplatePackageDraftValidationPersonalDataExample =
  validateOfficialUserAppTemplatePackageDraft(
    officialUserAppTemplatePackageDraftPersonalDataBlockedExample,
  );

export const officialUserAppTemplatePackageDraftValidationMedicalClaimExample =
  validateOfficialUserAppTemplatePackageDraft(
    officialUserAppTemplatePackageDraftMedicalClaimBlockedExample,
  );

export const officialUserAppTemplatePackageDraftValidationProductShadeExample =
  validateOfficialUserAppTemplatePackageDraft(
    officialUserAppTemplatePackageDraftProductShadeBlockedExample,
  );

export const officialUserAppTemplatePackageDraftValidationRegistryWriteExample =
  validateOfficialUserAppTemplatePackageDraft(
    officialUserAppTemplatePackageDraftRegistryWriteBlockedExample,
  );

export const officialUserAppTemplatePackageDraftValidationMutationExample =
  validateOfficialUserAppTemplatePackageDraft(
    officialUserAppTemplatePackageDraftMutationBlockedExample,
  );
