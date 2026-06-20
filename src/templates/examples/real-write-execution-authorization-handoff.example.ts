import { createRealWriteExecutionAuthorizationHandoff } from '../../template-engine';
import {
  realWriteExecutionAuthorizationChecklistOwnerActualWriteBlockedExample,
  realWriteExecutionAuthorizationChecklistReadyExample,
  realWriteExecutionAuthorizationChecklistWarningExample,
} from './real-write-execution-authorization-checklist.example';
import {
  realWriteExecutionAuthorizationActualRegistryWriteExample,
  realWriteExecutionAuthorizationOwnerActualRegistryWriteExample,
  realWriteExecutionAuthorizationReadyExample,
  realWriteExecutionAuthorizationWarningExample,
} from './real-write-execution-authorization.example';

export const realWriteExecutionAuthorizationHandoffReadyExample =
  createRealWriteExecutionAuthorizationHandoff({
    authorization: realWriteExecutionAuthorizationReadyExample,
    checklist: realWriteExecutionAuthorizationChecklistReadyExample,
  });

export const realWriteExecutionAuthorizationHandoffKeepModelOnlyExample =
  createRealWriteExecutionAuthorizationHandoff({
    authorization: realWriteExecutionAuthorizationWarningExample,
    checklist: realWriteExecutionAuthorizationChecklistWarningExample,
  });

export const realWriteExecutionAuthorizationHandoffOwnerClarificationExample =
  createRealWriteExecutionAuthorizationHandoff({
    authorization: realWriteExecutionAuthorizationOwnerActualRegistryWriteExample,
    checklist: realWriteExecutionAuthorizationChecklistOwnerActualWriteBlockedExample,
  });

export const realWriteExecutionAuthorizationHandoffBlockedExample =
  createRealWriteExecutionAuthorizationHandoff({
    authorization: realWriteExecutionAuthorizationActualRegistryWriteExample,
    checklist: realWriteExecutionAuthorizationChecklistReadyExample,
  });
