import { createUserAppTemplatePackageDraftPublishGateHandoff } from '../../template-engine';
import {
  userAppTemplatePackageDraftPublishGateMissingValidationExample,
  userAppTemplatePackageDraftPublishGateKeepDraftOnlyExample,
  userAppTemplatePackageDraftPublishGateReadyExample,
} from './user-app-template-package-draft-publish-gate.example';

export const userAppTemplatePackageDraftPublishGateHandoffReadyExample =
  createUserAppTemplatePackageDraftPublishGateHandoff({
    gate: userAppTemplatePackageDraftPublishGateReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateHandoffKeepDraftOnlyExample =
  createUserAppTemplatePackageDraftPublishGateHandoff({
    gate: userAppTemplatePackageDraftPublishGateKeepDraftOnlyExample,
  });

export const userAppTemplatePackageDraftPublishGateHandoffBlockedExample =
  createUserAppTemplatePackageDraftPublishGateHandoff({
    gate: userAppTemplatePackageDraftPublishGateMissingValidationExample,
  });
