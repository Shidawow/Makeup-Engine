import { createControlledUserAppTemplatePackageRegistryWriterHandoff } from '../../template-engine';
import {
  controlledRegistryWriterDraftActualRegistryWriteBlockedExample,
  controlledRegistryWriterDraftMissingActualWriteBlockedExample,
  controlledRegistryWriterDraftReadyExample,
  controlledRegistryWriterDraftShellReplacementBlockedExample,
  controlledRegistryWriterDraftWarningExample,
} from './controlled-user-app-template-package-registry-writer-draft.example';
import {
  controlledRegistryWriterValidationActualRegistryWriteExample,
  controlledRegistryWriterValidationMissingActualWriteBlockedExample,
  controlledRegistryWriterValidationReadyExample,
  controlledRegistryWriterValidationShellReplacementExample,
  controlledRegistryWriterValidationWarningExample,
} from './controlled-user-app-template-package-registry-writer-validation.example';

export const controlledRegistryWriterHandoffReadyExample =
  createControlledUserAppTemplatePackageRegistryWriterHandoff({
    draft: controlledRegistryWriterDraftReadyExample,
    validation: controlledRegistryWriterValidationReadyExample,
  });

export const controlledRegistryWriterHandoffDryRunOnlyExample =
  createControlledUserAppTemplatePackageRegistryWriterHandoff({
    draft: controlledRegistryWriterDraftWarningExample,
    validation: controlledRegistryWriterValidationWarningExample,
  });

export const controlledRegistryWriterHandoffBlockedExample =
  createControlledUserAppTemplatePackageRegistryWriterHandoff({
    draft: controlledRegistryWriterDraftActualRegistryWriteBlockedExample,
    validation: controlledRegistryWriterValidationActualRegistryWriteExample,
  });

export const controlledRegistryWriterHandoffDoNotAuthorizeExample =
  createControlledUserAppTemplatePackageRegistryWriterHandoff({
    draft: controlledRegistryWriterDraftMissingActualWriteBlockedExample,
    validation: controlledRegistryWriterValidationMissingActualWriteBlockedExample,
  });

export const controlledRegistryWriterHandoffShellBoundaryExample =
  createControlledUserAppTemplatePackageRegistryWriterHandoff({
    draft: controlledRegistryWriterDraftShellReplacementBlockedExample,
    validation: controlledRegistryWriterValidationShellReplacementExample,
  });
