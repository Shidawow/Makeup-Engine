import {
  createControlledUserAppTemplatePackageRegistryWriterDraft,
  type ControlledRegistryWriterDraft,
  type UserAppTemplatePackageRegistryWriteGateResult,
} from '../../template-engine';
import {
  userAppTemplatePackageRegistryWriteGateActualRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryWriteGateMedicalClaimBlockedExample,
  userAppTemplatePackageRegistryWriteGateMissingValidationExample,
  userAppTemplatePackageRegistryWriteGatePersonalDataBlockedExample,
  userAppTemplatePackageRegistryWriteGateProductShadeBlockedExample,
  userAppTemplatePackageRegistryWriteGateProductionMarkerBlockedExample,
  userAppTemplatePackageRegistryWriteGateRawImageBlockedExample,
  userAppTemplatePackageRegistryWriteGateReadyExample,
  userAppTemplatePackageRegistryWriteGateShellReplacementBlockedExample,
  userAppTemplatePackageRegistryWriteGateUnsupportedFinalClaimBlockedExample,
  userAppTemplatePackageRegistryWriteGateWarningExample,
} from './user-app-template-package-registry-write-gate.example';

const writerDraftForGate = (
  id: string,
  gate: UserAppTemplatePackageRegistryWriteGateResult,
): ControlledRegistryWriterDraft =>
  createControlledUserAppTemplatePackageRegistryWriterDraft({
    gate,
    writerDraftId: `controlled-registry-writer-draft-${id}`,
  });

export const controlledRegistryWriterDraftReadyExample =
  createControlledUserAppTemplatePackageRegistryWriterDraft({
    gate: userAppTemplatePackageRegistryWriteGateReadyExample,
  });

export const controlledRegistryWriterDraftWarningExample =
  createControlledUserAppTemplatePackageRegistryWriterDraft({
    gate: userAppTemplatePackageRegistryWriteGateWarningExample,
  });

export const controlledRegistryWriterDraftMissingGateExample = writerDraftForGate(
  'missing-gate',
  userAppTemplatePackageRegistryWriteGateMissingValidationExample,
);

export const controlledRegistryWriterDraftMissingDryRunOnlyExample =
  createControlledUserAppTemplatePackageRegistryWriterDraft({
    gate: userAppTemplatePackageRegistryWriteGateReadyExample,
    writerDraftId: 'controlled-registry-writer-draft-missing-dry-run-only',
    safetyOverrides: { dryRunOnly: false },
  });

export const controlledRegistryWriterDraftMissingActualWriteBlockedExample =
  createControlledUserAppTemplatePackageRegistryWriterDraft({
    gate: userAppTemplatePackageRegistryWriteGateReadyExample,
    writerDraftId: 'controlled-registry-writer-draft-missing-actual-write-block',
    safetyOverrides: { actualWriteBlocked: false },
  });

export const controlledRegistryWriterDraftMissingPublishBlockedExample =
  createControlledUserAppTemplatePackageRegistryWriterDraft({
    gate: userAppTemplatePackageRegistryWriteGateReadyExample,
    writerDraftId: 'controlled-registry-writer-draft-missing-publish-block',
    safetyOverrides: { publishBlocked: false },
  });

export const controlledRegistryWriterDraftMissingPackageReplacementBlockedExample =
  createControlledUserAppTemplatePackageRegistryWriterDraft({
    gate: userAppTemplatePackageRegistryWriteGateReadyExample,
    writerDraftId: 'controlled-registry-writer-draft-missing-package-replacement-block',
    safetyOverrides: { packageReplacementBlocked: false },
  });

export const controlledRegistryWriterDraftRawImageBlockedExample =
  writerDraftForGate('raw-image', userAppTemplatePackageRegistryWriteGateRawImageBlockedExample);

export const controlledRegistryWriterDraftPersonalDataBlockedExample =
  writerDraftForGate(
    'personal-data',
    userAppTemplatePackageRegistryWriteGatePersonalDataBlockedExample,
  );

export const controlledRegistryWriterDraftMedicalClaimBlockedExample =
  writerDraftForGate(
    'medical-claim',
    userAppTemplatePackageRegistryWriteGateMedicalClaimBlockedExample,
  );

export const controlledRegistryWriterDraftProductShadeBlockedExample =
  writerDraftForGate(
    'product-shade',
    userAppTemplatePackageRegistryWriteGateProductShadeBlockedExample,
  );

export const controlledRegistryWriterDraftUnsupportedFinalClaimBlockedExample =
  writerDraftForGate(
    'unsupported-final-claim',
    userAppTemplatePackageRegistryWriteGateUnsupportedFinalClaimBlockedExample,
  );

export const controlledRegistryWriterDraftActualRegistryWriteBlockedExample =
  writerDraftForGate(
    'actual-registry-write',
    userAppTemplatePackageRegistryWriteGateActualRegistryWriteBlockedExample,
  );

export const controlledRegistryWriterDraftProductionMarkerBlockedExample =
  writerDraftForGate(
    'production-marker',
    userAppTemplatePackageRegistryWriteGateProductionMarkerBlockedExample,
  );

export const controlledRegistryWriterDraftShellReplacementBlockedExample =
  writerDraftForGate(
    'shell-replacement',
    userAppTemplatePackageRegistryWriteGateShellReplacementBlockedExample,
  );
