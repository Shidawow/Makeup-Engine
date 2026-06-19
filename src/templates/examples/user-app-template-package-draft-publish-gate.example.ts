import {
  createUserAppTemplatePackageDraftPublishGate,
  type OfficialUserAppTemplatePackageDraft,
} from '../../template-engine';
import {
  officialUserAppTemplatePackageDraftMissingGateExample,
  officialUserAppTemplatePackageDraftReadyExample,
  officialUserAppTemplatePackageDraftWarningExample,
} from './official-user-app-template-package-draft.example';
import {
  officialUserAppTemplatePackageDraftValidationMissingGateExample,
  officialUserAppTemplatePackageDraftValidationReadyExample,
  officialUserAppTemplatePackageDraftValidationWarningExample,
} from './official-user-app-template-package-draft-validation.example';

const unsafeDraft = (
  id: string,
  patch: Partial<OfficialUserAppTemplatePackageDraft>,
): OfficialUserAppTemplatePackageDraft =>
  ({
    ...officialUserAppTemplatePackageDraftReadyExample,
    draftId: `official-user-app-template-package-draft-${id}`,
    ...patch,
  }) as OfficialUserAppTemplatePackageDraft;

export const userAppTemplatePackageDraftPublishGateReadyExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: officialUserAppTemplatePackageDraftReadyExample,
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateWarningExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: officialUserAppTemplatePackageDraftWarningExample,
    validation: officialUserAppTemplatePackageDraftValidationWarningExample,
  });

export const userAppTemplatePackageDraftPublishGateKeepDraftOnlyExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('tools-warning', {
      toolsChecklist: [],
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateMissingValidationExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: officialUserAppTemplatePackageDraftMissingGateExample,
    validation: officialUserAppTemplatePackageDraftValidationMissingGateExample,
  });

export const userAppTemplatePackageDraftPublishGateMissingDraftOnlyExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('missing-draft-only', {
      draftOnly: false as unknown as true,
      notProductionUserAppTemplatePackage: false as unknown as true,
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateMissingPublishBlockedExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('missing-publish-blocked', {
      publishBlocked: false as unknown as true,
      notPublished: false as unknown as true,
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateRawImageBlockedExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('raw-image', {
      summary: 'data:image/png;base64 should never enter a draft publish gate.',
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGatePersonalDataBlockedExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('personal-data', {
      summary: '请联系手机号 13800000000 继续试用。',
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateMedicalClaimBlockedExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('medical-claim', {
      summary: '这个妆容可以治疗痤疮。',
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateProductShadeBlockedExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('product-shade', {
      productPlaceholders: ['MAC shade #12'],
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateUnsupportedFinalClaimBlockedExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('unsupported-final-claim', {
      summary: 'final recognition complete.',
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateRegistryWriteBlockedExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('registry-write', {
      summary: 'writeRegistry marker must block future registry preparation.',
      noUserAppPackageRegistryWrite: false as unknown as true,
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGatePublishMarkerBlockedExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('publish-marker', {
      summary: 'published to user app marker must block this gate.',
      publishBlocked: false as unknown as true,
      notPublished: false as unknown as true,
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateShellReplacementBlockedExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('shell-replacement', {
      noUserAppShellPackageReplacement: false as unknown as true,
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });

export const userAppTemplatePackageDraftPublishGateProductionMarkerBlockedExample =
  createUserAppTemplatePackageDraftPublishGate({
    draft: unsafeDraft('production-marker', {
      summary: 'production_package_ready marker must block this gate.',
      notProductionUserAppTemplatePackage: false as unknown as true,
      productionPackageGenerationBlocked: false as unknown as true,
    }),
    validation: officialUserAppTemplatePackageDraftValidationReadyExample,
  });
