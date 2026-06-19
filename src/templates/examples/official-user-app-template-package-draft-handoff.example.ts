import { createOfficialUserAppTemplatePackageDraftHandoff } from '../../template-engine';
import {
  officialUserAppTemplatePackageDraftMissingPrivacyExample,
  officialUserAppTemplatePackageDraftMissingStepExample,
  officialUserAppTemplatePackageDraftReadyExample,
  officialUserAppTemplatePackageDraftWarningExample,
} from './official-user-app-template-package-draft.example';
import {
  officialUserAppTemplatePackageDraftValidationMissingPrivacyExample,
  officialUserAppTemplatePackageDraftValidationMissingStepExample,
  officialUserAppTemplatePackageDraftValidationReadyExample,
  officialUserAppTemplatePackageDraftValidationWarningExample,
} from './official-user-app-template-package-draft-validation.example';

export const officialUserAppTemplatePackageDraftHandoffReadyExample =
  createOfficialUserAppTemplatePackageDraftHandoff({
    draft: officialUserAppTemplatePackageDraftReadyExample,
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const officialUserAppTemplatePackageDraftHandoffKeepDraftOnlyExample =
  createOfficialUserAppTemplatePackageDraftHandoff({
    draft: officialUserAppTemplatePackageDraftWarningExample,
    validation: officialUserAppTemplatePackageDraftValidationWarningExample,
  });

export const officialUserAppTemplatePackageDraftHandoffStepRevisionExample =
  createOfficialUserAppTemplatePackageDraftHandoff({
    draft: officialUserAppTemplatePackageDraftMissingStepExample,
    validation: officialUserAppTemplatePackageDraftValidationMissingStepExample,
  });

export const officialUserAppTemplatePackageDraftHandoffPrivacyRevisionExample =
  createOfficialUserAppTemplatePackageDraftHandoff({
    draft: officialUserAppTemplatePackageDraftMissingPrivacyExample,
    validation: officialUserAppTemplatePackageDraftValidationMissingPrivacyExample,
  });
