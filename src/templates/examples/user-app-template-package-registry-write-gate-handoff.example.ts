import { createUserAppTemplatePackageRegistryWriteGateHandoff } from '../../template-engine';
import {
  userAppTemplatePackageRegistryWriteGateActualRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryWriteGatePersonalDataBlockedExample,
  userAppTemplatePackageRegistryWriteGateReadyExample,
  userAppTemplatePackageRegistryWriteGateShellReplacementBlockedExample,
  userAppTemplatePackageRegistryWriteGateWarningExample,
} from './user-app-template-package-registry-write-gate.example';

export const userAppTemplatePackageRegistryWriteGateHandoffReadyExample =
  createUserAppTemplatePackageRegistryWriteGateHandoff({
    gate: userAppTemplatePackageRegistryWriteGateReadyExample,
  });

export const userAppTemplatePackageRegistryWriteGateHandoffPreviewOnlyExample =
  createUserAppTemplatePackageRegistryWriteGateHandoff({
    gate: userAppTemplatePackageRegistryWriteGateWarningExample,
  });

export const userAppTemplatePackageRegistryWriteGateHandoffBlockedExample =
  createUserAppTemplatePackageRegistryWriteGateHandoff({
    gate: userAppTemplatePackageRegistryWriteGateActualRegistryWriteBlockedExample,
  });

export const userAppTemplatePackageRegistryWriteGateHandoffPrivacyReviewExample =
  createUserAppTemplatePackageRegistryWriteGateHandoff({
    gate: userAppTemplatePackageRegistryWriteGatePersonalDataBlockedExample,
  });

export const userAppTemplatePackageRegistryWriteGateHandoffShellBoundaryExample =
  createUserAppTemplatePackageRegistryWriteGateHandoff({
    gate: userAppTemplatePackageRegistryWriteGateShellReplacementBlockedExample,
  });
