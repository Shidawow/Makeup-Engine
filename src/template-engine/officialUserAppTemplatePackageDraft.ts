import type { OfficialUserAppPackageDraftGateResult } from './officialUserAppPackageDraftGate';
import type { OfficialUserAppPackageDraftGateHandoff } from './officialUserAppPackageDraftGateHandoff';
import type { UserAppPackageDraftPreview } from './userAppPackageDraftPreview';

export type OfficialUserAppTemplatePackageDraftStatus =
  | 'official_package_draft_ready'
  | 'official_package_draft_ready_with_warnings'
  | 'official_package_draft_blocked'
  | 'official_package_draft_example_only';

export interface OfficialUserAppTemplatePackageDraftSource {
  gateStatus: OfficialUserAppPackageDraftGateResult['status'];
  gateHandoffStatus: OfficialUserAppPackageDraftGateHandoff['status'];
  previewStatus: UserAppPackageDraftPreview['previewStatus'];
  sourceReadyForOfficialDraft: boolean;
}

export interface OfficialUserAppTemplatePackageDraftSection {
  id: string;
  label: string;
  items: string[];
  status: 'ready' | 'warning' | 'blocked';
}

export interface OfficialUserAppTemplatePackageDraftWarning {
  id: string;
  message: string;
  recommendation: string;
}

export interface OfficialUserAppTemplatePackageDraftBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface OfficialUserAppTemplatePackageDraftTrace {
  source: OfficialUserAppTemplatePackageDraftSource;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: UserAppPackageDraftPreview['trace'];
  gateTrace: OfficialUserAppPackageDraftGateResult['trace'];
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noRegistryWrite: true;
  noPublish: true;
  noUserAppShellPackageReplacement: true;
  noProductionPackageMarker: true;
}

export interface OfficialUserAppTemplatePackageDraft {
  draftId: string;
  sourceGateResultId: string;
  sourcePreviewId: string;
  sourceCandidatePackageId: string;
  title: string;
  summary: string;
  styleTags: string[];
  difficulty: string;
  estimatedTime: string;
  suitableScenarios: string[];
  toolsChecklist: string[];
  productPlaceholders: string[];
  stepSequence: string[];
  regionGuidance: string[];
  userFacingCopy: UserAppPackageDraftPreview['userFacingCopyPreview'];
  privacyNotice: string;
  sections: OfficialUserAppTemplatePackageDraftSection[];
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: UserAppPackageDraftPreview['trace'];
  gateTrace: OfficialUserAppPackageDraftGateResult['trace'];
  warnings: OfficialUserAppTemplatePackageDraftWarning[];
  blockedReasons: OfficialUserAppTemplatePackageDraftBlockedReason[];
  draftStatus: OfficialUserAppTemplatePackageDraftStatus;
  draftOnly: true;
  publishBlocked: true;
  notProductionUserAppTemplatePackage: true;
  notPublished: true;
  noUserAppPackageRegistryWrite: true;
  noUserAppShellPackageReplacement: true;
  productionPackageGenerationBlocked: true;
  jsonRoundTripStable: boolean;
}

export const officialDraftPayloadText = (
  draft: Pick<
    OfficialUserAppTemplatePackageDraft,
    | 'title'
    | 'summary'
    | 'styleTags'
    | 'difficulty'
    | 'estimatedTime'
    | 'suitableScenarios'
    | 'toolsChecklist'
    | 'productPlaceholders'
    | 'stepSequence'
    | 'regionGuidance'
    | 'userFacingCopy'
    | 'privacyNotice'
  >,
): string =>
  JSON.stringify({
    title: draft.title,
    summary: draft.summary,
    styleTags: draft.styleTags,
    difficulty: draft.difficulty,
    estimatedTime: draft.estimatedTime,
    suitableScenarios: draft.suitableScenarios,
    toolsChecklist: draft.toolsChecklist,
    productPlaceholders: draft.productPlaceholders,
    stepSequence: draft.stepSequence,
    regionGuidance: draft.regionGuidance,
    userFacingCopy: draft.userFacingCopy,
    privacyNotice: draft.privacyNotice,
  });

export const isOfficialDraftJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};
