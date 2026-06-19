import {
  createUserAppTemplatePackageRegistryWriteGate,
  type UserAppTemplatePackageRegistryPreparation,
  type UserAppTemplatePackageRegistryWriteGateResult,
  validateUserAppTemplatePackageRegistryPreparation,
} from '../../template-engine';
import {
  userAppTemplatePackageRegistryPreparationActualRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryPreparationMedicalClaimBlockedExample,
  userAppTemplatePackageRegistryPreparationMissingDraftOnlyExample,
  userAppTemplatePackageRegistryPreparationMissingPublishBlockedExample,
  userAppTemplatePackageRegistryPreparationMissingPublishGateExample,
  userAppTemplatePackageRegistryPreparationMissingRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryPreparationPersonalDataBlockedExample,
  userAppTemplatePackageRegistryPreparationProductShadeBlockedExample,
  userAppTemplatePackageRegistryPreparationProductionMarkerBlockedExample,
  userAppTemplatePackageRegistryPreparationRawImageBlockedExample,
  userAppTemplatePackageRegistryPreparationReadyExample,
  userAppTemplatePackageRegistryPreparationShellReplacementBlockedExample,
  userAppTemplatePackageRegistryPreparationUnsupportedFinalClaimBlockedExample,
  userAppTemplatePackageRegistryPreparationWarningExample,
} from './user-app-template-package-registry-preparation.example';
import {
  userAppTemplatePackageRegistryPreparationValidationMissingPublishGateExample,
  userAppTemplatePackageRegistryPreparationValidationReadyExample,
  userAppTemplatePackageRegistryPreparationValidationWarningExample,
} from './user-app-template-package-registry-preparation-validation.example';

const gateForPreparation = (
  id: string,
  preparation: UserAppTemplatePackageRegistryPreparation,
): UserAppTemplatePackageRegistryWriteGateResult =>
  createUserAppTemplatePackageRegistryWriteGate({
    preparation,
    validation: validateUserAppTemplatePackageRegistryPreparation(preparation),
    gateId: `registry-write-gate-${id}`,
  });

export const userAppTemplatePackageRegistryWriteGateReadyExample =
  createUserAppTemplatePackageRegistryWriteGate({
    preparation: userAppTemplatePackageRegistryPreparationReadyExample,
    validation: userAppTemplatePackageRegistryPreparationValidationReadyExample,
  });

export const userAppTemplatePackageRegistryWriteGateWarningExample =
  createUserAppTemplatePackageRegistryWriteGate({
    preparation: userAppTemplatePackageRegistryPreparationWarningExample,
    validation: userAppTemplatePackageRegistryPreparationValidationWarningExample,
  });

export const userAppTemplatePackageRegistryWriteGateMissingValidationExample =
  createUserAppTemplatePackageRegistryWriteGate({
    preparation: userAppTemplatePackageRegistryPreparationMissingPublishGateExample,
    validation: userAppTemplatePackageRegistryPreparationValidationMissingPublishGateExample,
    gateId: 'registry-write-gate-missing-validation',
  });

export const userAppTemplatePackageRegistryWriteGateMissingRegistryWriteBlockedExample =
  gateForPreparation(
    'missing-registry-write-blocked',
    userAppTemplatePackageRegistryPreparationMissingRegistryWriteBlockedExample,
  );

export const userAppTemplatePackageRegistryWriteGateMissingDraftOnlyExample =
  gateForPreparation(
    'missing-draft-only',
    userAppTemplatePackageRegistryPreparationMissingDraftOnlyExample,
  );

export const userAppTemplatePackageRegistryWriteGateMissingPublishBlockedExample =
  gateForPreparation(
    'missing-publish-blocked',
    userAppTemplatePackageRegistryPreparationMissingPublishBlockedExample,
  );

export const userAppTemplatePackageRegistryWriteGateRawImageBlockedExample =
  gateForPreparation(
    'raw-image',
    userAppTemplatePackageRegistryPreparationRawImageBlockedExample,
  );

export const userAppTemplatePackageRegistryWriteGatePersonalDataBlockedExample =
  gateForPreparation(
    'personal-data',
    userAppTemplatePackageRegistryPreparationPersonalDataBlockedExample,
  );

export const userAppTemplatePackageRegistryWriteGateMedicalClaimBlockedExample =
  gateForPreparation(
    'medical-claim',
    userAppTemplatePackageRegistryPreparationMedicalClaimBlockedExample,
  );

export const userAppTemplatePackageRegistryWriteGateProductShadeBlockedExample =
  gateForPreparation(
    'product-shade',
    userAppTemplatePackageRegistryPreparationProductShadeBlockedExample,
  );

export const userAppTemplatePackageRegistryWriteGateUnsupportedFinalClaimBlockedExample =
  gateForPreparation(
    'unsupported-final-claim',
    userAppTemplatePackageRegistryPreparationUnsupportedFinalClaimBlockedExample,
  );

export const userAppTemplatePackageRegistryWriteGateActualRegistryWriteBlockedExample =
  gateForPreparation(
    'actual-registry-write',
    userAppTemplatePackageRegistryPreparationActualRegistryWriteBlockedExample,
  );

export const userAppTemplatePackageRegistryWriteGateProductionMarkerBlockedExample =
  gateForPreparation(
    'production-marker',
    userAppTemplatePackageRegistryPreparationProductionMarkerBlockedExample,
  );

export const userAppTemplatePackageRegistryWriteGateShellReplacementBlockedExample =
  gateForPreparation(
    'shell-replacement',
    userAppTemplatePackageRegistryPreparationShellReplacementBlockedExample,
  );
