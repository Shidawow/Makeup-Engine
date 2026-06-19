import {
  createUserAppTemplatePackageDraftPublishGate,
  createUserAppTemplatePackageRegistryPreparation,
  type OfficialUserAppTemplatePackageDraft,
  type UserAppTemplatePackageRegistryPreparation,
  validateOfficialUserAppTemplatePackageDraft,
} from '../../template-engine';
import {
  officialUserAppTemplatePackageDraftReadyExample,
  officialUserAppTemplatePackageDraftWarningExample,
} from './official-user-app-template-package-draft.example';
import {
  userAppTemplatePackageDraftPublishGateMissingValidationExample,
  userAppTemplatePackageDraftPublishGateReadyExample,
  userAppTemplatePackageDraftPublishGateWarningExample,
} from './user-app-template-package-draft-publish-gate.example';

const unsafeDraft = (
  id: string,
  patch: Partial<OfficialUserAppTemplatePackageDraft>,
): OfficialUserAppTemplatePackageDraft =>
  ({
    ...officialUserAppTemplatePackageDraftReadyExample,
    draftId: `official-user-app-template-package-draft-registry-${id}`,
    ...patch,
  }) as OfficialUserAppTemplatePackageDraft;

const preparationForDraft = (
  id: string,
  draft: OfficialUserAppTemplatePackageDraft,
): UserAppTemplatePackageRegistryPreparation =>
  createUserAppTemplatePackageRegistryPreparation({
    draft,
    gate: createUserAppTemplatePackageDraftPublishGate({
      draft,
      validation: validateOfficialUserAppTemplatePackageDraft(draft),
    }),
    preparationId: `registry-preparation-${id}`,
  });

export const userAppTemplatePackageRegistryPreparationReadyExample =
  createUserAppTemplatePackageRegistryPreparation({
    draft: officialUserAppTemplatePackageDraftReadyExample,
    gate: userAppTemplatePackageDraftPublishGateReadyExample,
  });

export const userAppTemplatePackageRegistryPreparationWarningExample =
  createUserAppTemplatePackageRegistryPreparation({
    draft: officialUserAppTemplatePackageDraftWarningExample,
    gate: userAppTemplatePackageDraftPublishGateWarningExample,
  });

export const userAppTemplatePackageRegistryPreparationMissingPublishGateExample =
  createUserAppTemplatePackageRegistryPreparation({
    draft: officialUserAppTemplatePackageDraftReadyExample,
    gate: userAppTemplatePackageDraftPublishGateMissingValidationExample,
    preparationId: 'registry-preparation-missing-publish-gate',
  });

export const userAppTemplatePackageRegistryPreparationMissingDraftOnlyExample =
  preparationForDraft(
    'missing-draft-only',
    unsafeDraft('missing-draft-only', {
      draftOnly: false as unknown as true,
      notProductionUserAppTemplatePackage: false as unknown as true,
    }),
  );

export const userAppTemplatePackageRegistryPreparationMissingPublishBlockedExample =
  preparationForDraft(
    'missing-publish-blocked',
    unsafeDraft('missing-publish-blocked', {
      publishBlocked: false as unknown as true,
      notPublished: false as unknown as true,
    }),
  );

export const userAppTemplatePackageRegistryPreparationRawImageBlockedExample =
  preparationForDraft(
    'raw-image',
    unsafeDraft('raw-image', {
      summary: 'data:image/png;base64 must never enter registry preparation.',
    }),
  );

export const userAppTemplatePackageRegistryPreparationPersonalDataBlockedExample =
  preparationForDraft(
    'personal-data',
    unsafeDraft('personal-data', {
      summary: '请联系手机号 13800000000 继续试用。',
    }),
  );

export const userAppTemplatePackageRegistryPreparationMedicalClaimBlockedExample =
  preparationForDraft(
    'medical-claim',
    unsafeDraft('medical-claim', {
      summary: '这个妆容可以治疗痤疮。',
    }),
  );

export const userAppTemplatePackageRegistryPreparationProductShadeBlockedExample =
  preparationForDraft(
    'product-shade',
    unsafeDraft('product-shade', {
      productPlaceholders: ['MAC shade #12'],
    }),
  );

export const userAppTemplatePackageRegistryPreparationUnsupportedFinalClaimBlockedExample =
  preparationForDraft(
    'unsupported-final-claim',
    unsafeDraft('unsupported-final-claim', {
      summary: 'final recognition complete.',
    }),
  );

export const userAppTemplatePackageRegistryPreparationActualRegistryWriteBlockedExample =
  preparationForDraft(
    'actual-registry-write',
    unsafeDraft('actual-registry-write', {
      summary: 'writeRegistry() must block this preparation.',
      noUserAppPackageRegistryWrite: false as unknown as true,
    }),
  );

export const userAppTemplatePackageRegistryPreparationProductionMarkerBlockedExample =
  preparationForDraft(
    'production-marker',
    unsafeDraft('production-marker', {
      summary: 'production_package_ready marker must block registry preparation.',
      notProductionUserAppTemplatePackage: false as unknown as true,
      productionPackageGenerationBlocked: false as unknown as true,
    }),
  );

export const userAppTemplatePackageRegistryPreparationShellReplacementBlockedExample =
  preparationForDraft(
    'shell-replacement',
    unsafeDraft('shell-replacement', {
      summary: 'replaceUserAppShellPackage marker must block this preparation.',
      noUserAppShellPackageReplacement: false as unknown as true,
    }),
  );

export const userAppTemplatePackageRegistryPreparationPrivacyReviewExample =
  {
    ...userAppTemplatePackageRegistryPreparationReadyExample,
    preparationId: 'registry-preparation-privacy-review',
    trace: {
      ...userAppTemplatePackageRegistryPreparationReadyExample.trace,
      noPersonalData: false,
    },
  } as UserAppTemplatePackageRegistryPreparation;

export const userAppTemplatePackageRegistryPreparationShellBoundaryReviewExample =
  {
    ...userAppTemplatePackageRegistryPreparationReadyExample,
    preparationId: 'registry-preparation-shell-boundary-review',
    noUserAppShellPackageReplacement: false as unknown as true,
    trace: {
      ...userAppTemplatePackageRegistryPreparationReadyExample.trace,
      noUserAppShellPackageReplacement: false,
    },
  } as UserAppTemplatePackageRegistryPreparation;

export const userAppTemplatePackageRegistryPreparationMissingRegistryWriteBlockedExample =
  {
    ...userAppTemplatePackageRegistryPreparationReadyExample,
    preparationId: 'registry-preparation-missing-registry-write-blocked',
    registryWriteBlocked: false as unknown as true,
    noActualRegistryWrite: false as unknown as true,
    registryEntryPreview: {
      ...userAppTemplatePackageRegistryPreparationReadyExample.registryEntryPreview,
      registryWriteBlocked: false as unknown as true,
    },
    trace: {
      ...userAppTemplatePackageRegistryPreparationReadyExample.trace,
      noActualRegistryWrite: false,
    },
  } as UserAppTemplatePackageRegistryPreparation;
