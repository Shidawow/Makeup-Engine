import { createOfficialUserAppPackageDraftGateHandoff } from '../../template-engine';
import {
  officialUserAppPackageDraftGateMissingStepGuidanceExample,
  officialUserAppPackageDraftGatePersonalDataBlockedExample,
  officialUserAppPackageDraftGateReadyExample,
  officialUserAppPackageDraftGateWarningExample,
} from './official-user-app-package-draft-gate.example';

export const officialUserAppPackageDraftGateHandoffReadyExample =
  createOfficialUserAppPackageDraftGateHandoff({
    gate: officialUserAppPackageDraftGateReadyExample,
  });

export const officialUserAppPackageDraftGateHandoffCopyRevisionExample =
  createOfficialUserAppPackageDraftGateHandoff({
    gate: officialUserAppPackageDraftGateWarningExample,
  });

export const officialUserAppPackageDraftGateHandoffStepRevisionExample =
  createOfficialUserAppPackageDraftGateHandoff({
    gate: officialUserAppPackageDraftGateMissingStepGuidanceExample,
  });

export const officialUserAppPackageDraftGateHandoffPrivacyReviewExample =
  createOfficialUserAppPackageDraftGateHandoff({
    gate: officialUserAppPackageDraftGatePersonalDataBlockedExample,
  });
