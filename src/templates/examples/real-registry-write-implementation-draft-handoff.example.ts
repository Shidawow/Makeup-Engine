import { createRealRegistryWriteImplementationDraftHandoff } from '../../template-engine';
import {
  realRegistryWriteImplementationDraftActualRegistryWriteExample,
  realRegistryWriteImplementationDraftReadyExample,
  realRegistryWriteImplementationDraftWarningExample,
} from './real-registry-write-implementation-draft.example';
import {
  realRegistryWriteImplementationDraftValidationActualRegistryWriteExample,
  realRegistryWriteImplementationDraftValidationReadyExample,
  realRegistryWriteImplementationDraftValidationWarningExample,
} from './real-registry-write-implementation-draft-validation.example';

export const realRegistryWriteImplementationDraftHandoffReadyExample =
  createRealRegistryWriteImplementationDraftHandoff({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
  });

export const realRegistryWriteImplementationDraftHandoffKeepDraftOnlyExample =
  createRealRegistryWriteImplementationDraftHandoff({
    draft: realRegistryWriteImplementationDraftWarningExample,
    validation: realRegistryWriteImplementationDraftValidationWarningExample,
  });

export const realRegistryWriteImplementationDraftHandoffBlockedExample =
  createRealRegistryWriteImplementationDraftHandoff({
    draft: realRegistryWriteImplementationDraftActualRegistryWriteExample,
    validation: realRegistryWriteImplementationDraftValidationActualRegistryWriteExample,
  });
