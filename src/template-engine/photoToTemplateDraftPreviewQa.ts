import type {
  PhotoToTemplateDraftFieldKey,
  PhotoToTemplateDraftIntegrationReport,
} from './photoToTemplateDraftIntegration';
import type { PhotoToTemplateHumanReviewEditingSession } from './photoToTemplateHumanReviewEditing';
import type { TemplateDraftQaResult } from './templateDraftQa';

export type PhotoToTemplateDraftPreviewQaStatus =
  | 'draft_preview_qa_ready'
  | 'draft_preview_qa_ready_with_warnings'
  | 'draft_preview_qa_blocked';

export type PhotoToTemplateDraftPreviewQaCheckId =
  | 'user_readable_title'
  | 'user_readable_summary'
  | 'suitable_scenario_present'
  | 'difficulty_present'
  | 'estimated_time_present'
  | 'tools_present'
  | 'steps_present'
  | 'beginner_tips_present'
  | 'common_mistakes_present'
  | 'correction_tips_present'
  | 'region_guidance_present'
  | 'no_internal_source_type_visible'
  | 'no_confidence_band_visible'
  | 'no_reviewer_note_visible'
  | 'no_registry_terms_visible'
  | 'no_ai_confirmed_claim'
  | 'no_fully_automatic_claim'
  | 'no_medical_claim'
  | 'no_product_shade_hard_claim'
  | 'local_only_privacy_notice_present'
  | 'not_publish_ready'
  | 'human_review_trace_preserved_internally';

export interface PhotoToTemplateDraftPreviewQaCheck {
  id: PhotoToTemplateDraftPreviewQaCheckId;
  label: string;
  passed: boolean;
  severity: 'warning' | 'blocking';
  message: string;
}

export interface PhotoToTemplateDraftPreviewQaIssue {
  id: string;
  checkId: PhotoToTemplateDraftPreviewQaCheckId;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface PhotoToTemplateDraftPreviewQaRecommendation {
  id: string;
  message: string;
  nextAction:
    | 'continue_operator_review'
    | 'request_user_copy_revision'
    | 'request_human_review_edit'
    | 'block_user_app_preview'
    | 'keep_operator_only';
}

export interface PhotoToTemplateDraftPreviewQaUserVisibleField {
  field: PhotoToTemplateDraftFieldKey;
  label: string;
  value: string;
}

export interface PhotoToTemplateDraftPreviewQaReport {
  reportId: string;
  sourceIntegrationId: string;
  sourceHumanReviewSessionId: string;
  sourceDraftQaStatus: TemplateDraftQaResult['status'] | 'missing';
  status: PhotoToTemplateDraftPreviewQaStatus;
  userVisibleFields: PhotoToTemplateDraftPreviewQaUserVisibleField[];
  checks: PhotoToTemplateDraftPreviewQaCheck[];
  issues: PhotoToTemplateDraftPreviewQaIssue[];
  recommendations: PhotoToTemplateDraftPreviewQaRecommendation[];
  userAppPreviewSuitable: boolean;
  localOnlyPrivacyNoticePresent: boolean;
  internalFieldsHiddenFromUserPath: boolean;
  humanReviewTracePreservedInternally: boolean;
  notProductionReady: true;
  notPublishReady: true;
  publishBlocked: true;
  registryWriteBlocked: true;
  registryMutationBlocked: true;
  productionWriterBlocked: true;
  userAppShellReplacementBlocked: true;
  userAppTemplatePackageGenerationBlocked: true;
  jsonRoundTripStable: boolean;
  nextRecommendedPhase: 'Phase 12E - Photo-to-Template End-to-End Demo Script & Acceptance Trial';
}

export interface PhotoToTemplateDraftPreviewQaInput {
  integration: PhotoToTemplateDraftIntegrationReport;
  humanReviewEditing: PhotoToTemplateHumanReviewEditingSession;
  draftQa?: TemplateDraftQaResult | null;
  privacyNotice?: string;
  userVisibleOverrides?: Partial<Record<PhotoToTemplateDraftFieldKey, string>>;
  reportId?: string;
}

const requiredFieldLabels: Record<PhotoToTemplateDraftFieldKey, string> = {
  title: '标题',
  summary: '摘要',
  styleCandidate: '风格候选',
  suitableScenario: '适用场景',
  difficulty: '难度',
  estimatedTime: '预计耗时',
  toolList: '工具清单',
  stepSequence: '步骤引导',
  beginnerTips: '新手提示',
  commonMistakes: '常见错误',
  correctionTips: '修正提示',
  regionGuidance: '区域说明',
  userAppPreviewNotes: '用户 App 预览说明',
};

const requiredFields: PhotoToTemplateDraftFieldKey[] = [
  'title',
  'summary',
  'suitableScenario',
  'difficulty',
  'estimatedTime',
  'toolList',
  'stepSequence',
  'beginnerTips',
  'commonMistakes',
  'correctionTips',
  'regionGuidance',
];

const internalSourcePattern =
  /sourceType|source type|confidenceBand|confidence band|evidence|limitations|reviewerDecision|reviewer decision|humanReviewRequired|notFinal|Draft Integration|Human Review Editing|Operator Workflow|Draft Preview QA|Template Studio|Pipeline Trace|debug JSON/i;
const confidenceBandPattern = /confidenceBand|confidence band|\b(high|medium|low|insufficient)\s+confidence\b/i;
const reviewerNotePattern = /reviewerNote|reviewer note|审核备注|review note/i;
const registryPattern =
  /registry|production writer|publish|published|已发布|发布到用户 App|写入 registry|production ready|正式上线/i;
const aiConfirmedPattern = /AI 已确认|AI confirmed|auto confirmed|自动确认/i;
const fullyAutomaticPattern =
  /fully automatic extraction|fully automatic high-quality|全自动高质量拆妆|任意照片自动拆妆|自动准确拆妆/i;
const medicalPattern = /治疗|修复皮肤病|痤疮治疗|过敏改善|medical|diagnos|skin condition/i;
const shadeHardClaimPattern =
  /色号|shade\s*#|mac\s|nars\s|armani\s|dior\s|ysl\s|chanel\s|精准匹配.*色/i;

const jsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const check = (
  id: PhotoToTemplateDraftPreviewQaCheckId,
  label: string,
  passed: boolean,
  severity: 'warning' | 'blocking',
  message: string,
): PhotoToTemplateDraftPreviewQaCheck => ({ id, label, passed, severity, message });

const issueRecommendation: Record<PhotoToTemplateDraftPreviewQaCheckId, string> = {
  user_readable_title: '补充用户可读标题后再预览。',
  user_readable_summary: '补充用户可读摘要后再预览。',
  suitable_scenario_present: '补充适用场景，避免用户不知道何时使用。',
  difficulty_present: '补充难度说明。',
  estimated_time_present: '补充预计耗时。',
  tools_present: '补充工具清单。',
  steps_present: '补充步骤引导。',
  beginner_tips_present: '补充新手提示。',
  common_mistakes_present: '补充常见错误提示。',
  correction_tips_present: '补充修正提示。',
  region_guidance_present: '补充区域说明。',
  no_internal_source_type_visible: '移除 source/evidence/review 等后台字段，只保留自然语言用户文案。',
  no_confidence_band_visible: '移除 confidence band 或置信度分档。',
  no_reviewer_note_visible: '移除 reviewer note 或审核备注。',
  no_registry_terms_visible: '移除 registry、publish、production writer 或 production ready 词。',
  no_ai_confirmed_claim: '改为“人工审核草稿”表述，不能说 AI 已确认。',
  no_fully_automatic_claim: '改为 semi-automatic draft with human review，不要说全自动拆妆。',
  no_medical_claim: '移除医疗、皮肤诊断或治疗表述。',
  no_product_shade_hard_claim: '移除品牌色号或精准色号匹配表述。',
  local_only_privacy_notice_present: '补充本地预览、不上传、不训练的隐私说明。',
  not_publish_ready: '保持 preview-only，不要标记发布或生产就绪。',
  human_review_trace_preserved_internally: '保留内部人工审核 trace，但不要展示给普通用户。',
};

const issueForCheck = (
  item: PhotoToTemplateDraftPreviewQaCheck,
): PhotoToTemplateDraftPreviewQaIssue | null => {
  if (item.passed) return null;
  return {
    id: `${item.id}_${item.severity}`,
    checkId: item.id,
    severity: item.severity,
    message: item.message,
    recommendation: issueRecommendation[item.id],
  };
};

export const createPhotoToTemplateDraftPreviewQaReport = ({
  integration,
  humanReviewEditing,
  draftQa = null,
  privacyNotice = '本地草稿预览：不上传照片，不用于训练。',
  userVisibleOverrides = {},
  reportId = `phase-12d-draft-preview-qa-${integration.integrationId}`,
}: PhotoToTemplateDraftPreviewQaInput): PhotoToTemplateDraftPreviewQaReport => {
  const editByField = new Map(
    humanReviewEditing.editableFields.map((field) => [field.field, field]),
  );
  const bindingByField = new Map(integration.bindings.map((binding) => [binding.field, binding]));
  const userVisibleFields: PhotoToTemplateDraftPreviewQaUserVisibleField[] =
    requiredFields.map((field) => {
      const edit = editByField.get(field);
      const binding = bindingByField.get(field);
      return {
        field,
        label: requiredFieldLabels[field],
        value:
          userVisibleOverrides[field] ??
          edit?.editableDraftValue ??
          binding?.editableDraftValue ??
          '',
      };
    });

  const textForUser = `${privacyNotice}\n${userVisibleFields
    .map((field) => `${field.label}: ${field.value}`)
    .join('\n')}`;
  const valueFor = (field: PhotoToTemplateDraftFieldKey): string =>
    userVisibleFields.find((item) => item.field === field)?.value.trim() ?? '';
  const hasAnySteps = valueFor('stepSequence').length > 0;
  const hasAnyTools = valueFor('toolList').length > 0;
  const hasMissingReviewerDecision = humanReviewEditing.editableFields.some(
    (field) => !field.reviewerDecision || field.reviewerDecision === 'pending_review',
  );
  const humanReviewTracePreservedInternally =
    integration.allBindingsHumanReviewRequired &&
    integration.allBindingsNotFinal &&
    humanReviewEditing.humanReviewRequiredTracePreserved &&
    humanReviewEditing.originalCandidateTracePreserved;
  const localOnlyPrivacyNoticePresent =
    /本地|local/i.test(privacyNotice) &&
    /不上传|no upload/i.test(privacyNotice) &&
    /不用于训练|不会用于训练|no training/i.test(privacyNotice);

  const checks: PhotoToTemplateDraftPreviewQaCheck[] = [
    check('user_readable_title', 'User readable title', valueFor('title').length >= 4, 'blocking', 'Draft preview needs a user-readable title.'),
    check('user_readable_summary', 'User readable summary', valueFor('summary').length >= 10, 'blocking', 'Draft preview needs a user-readable summary.'),
    check('suitable_scenario_present', 'Suitable scenario present', valueFor('suitableScenario').length > 0, 'warning', 'Draft preview should include a suitable scenario.'),
    check('difficulty_present', 'Difficulty present', valueFor('difficulty').length > 0, 'warning', 'Draft preview should include difficulty.'),
    check('estimated_time_present', 'Estimated time present', valueFor('estimatedTime').length > 0, 'warning', 'Draft preview should include estimated time.'),
    check('tools_present', 'Tools present', hasAnyTools, 'blocking', 'Draft preview needs a tool checklist.'),
    check('steps_present', 'Steps present', hasAnySteps, 'blocking', 'Draft preview needs step guidance.'),
    check('beginner_tips_present', 'Beginner tips present', valueFor('beginnerTips').length > 0, 'warning', 'Draft preview should include beginner tips.'),
    check('common_mistakes_present', 'Common mistakes present', valueFor('commonMistakes').length > 0, 'warning', 'Draft preview should include common mistakes.'),
    check('correction_tips_present', 'Correction tips present', valueFor('correctionTips').length > 0, 'warning', 'Draft preview should include correction tips.'),
    check('region_guidance_present', 'Region guidance present', valueFor('regionGuidance').length > 0, 'blocking', 'Draft preview needs region guidance.'),
    check('no_internal_source_type_visible', 'No internal source fields visible', !internalSourcePattern.test(textForUser), 'blocking', 'User-visible draft preview must not expose internal source, evidence, or review terms.'),
    check('no_confidence_band_visible', 'No confidence band visible', !confidenceBandPattern.test(textForUser), 'blocking', 'User-visible draft preview must not expose confidence bands.'),
    check('no_reviewer_note_visible', 'No reviewer note visible', !reviewerNotePattern.test(textForUser), 'blocking', 'User-visible draft preview must not expose reviewer notes.'),
    check('no_registry_terms_visible', 'No registry terms visible', !registryPattern.test(textForUser), 'blocking', 'User-visible draft preview must not expose registry, publish, production writer, or production-ready wording.'),
    check('no_ai_confirmed_claim', 'No AI confirmed claim', !aiConfirmedPattern.test(textForUser), 'blocking', 'User-visible draft preview must not claim AI confirmation.'),
    check('no_fully_automatic_claim', 'No fully automatic claim', !fullyAutomaticPattern.test(textForUser), 'blocking', 'User-visible draft preview must not claim fully automatic extraction.'),
    check('no_medical_claim', 'No medical claim', !medicalPattern.test(textForUser), 'blocking', 'User-visible draft preview must not contain medical or skin diagnosis claims.'),
    check('no_product_shade_hard_claim', 'No product shade hard claim', !shadeHardClaimPattern.test(textForUser), 'blocking', 'User-visible draft preview must not contain brand shade hard claims.'),
    check('local_only_privacy_notice_present', 'Local-only privacy notice present', localOnlyPrivacyNoticePresent, 'blocking', 'Draft preview needs local-only, no-upload, no-training privacy copy.'),
    check('not_publish_ready', 'Not publish ready', draftQa?.status !== 'draft_qa_blocked' && !/production ready|publish ready|可发布|发布就绪/i.test(textForUser), 'blocking', 'Draft preview can be suitable for review but must not be publish ready.'),
    check('human_review_trace_preserved_internally', 'Human review trace preserved internally', humanReviewTracePreservedInternally && !hasMissingReviewerDecision, hasMissingReviewerDecision ? 'warning' : 'blocking', hasMissingReviewerDecision ? 'Some editable fields still need reviewer decisions before a clean demo preview.' : 'Human review trace must be preserved internally.'),
  ];

  if (!draftQa) {
    checks.push(
      check('not_publish_ready', 'Draft QA source present', false, 'blocking', 'Draft preview QA requires a draft QA result.'),
    );
  }
  if (draftQa?.status === 'draft_qa_blocked') {
    checks.push(
      check('not_publish_ready', 'Draft QA not blocked', false, 'blocking', 'Draft QA is blocked, so preview QA is blocked.'),
    );
  }

  const issues = checks
    .map(issueForCheck)
    .filter((issue): issue is PhotoToTemplateDraftPreviewQaIssue => Boolean(issue));
  const hasBlocking = issues.some((issue) => issue.severity === 'blocking');
  const hasWarning = issues.some((issue) => issue.severity === 'warning');
  const status: PhotoToTemplateDraftPreviewQaStatus = hasBlocking
    ? 'draft_preview_qa_blocked'
    : hasWarning
      ? 'draft_preview_qa_ready_with_warnings'
      : 'draft_preview_qa_ready';

  const report: PhotoToTemplateDraftPreviewQaReport = {
    reportId,
    sourceIntegrationId: integration.integrationId,
    sourceHumanReviewSessionId: humanReviewEditing.sessionId,
    sourceDraftQaStatus: draftQa?.status ?? 'missing',
    status,
    userVisibleFields,
    checks,
    issues,
    recommendations: [
      {
        id: 'preview_only',
        message: 'Draft preview QA 只判断用户可读草稿预览，不发布、不写 registry。',
        nextAction: status === 'draft_preview_qa_blocked' ? 'block_user_app_preview' : 'continue_operator_review',
      },
      {
        id: 'hide_internal_fields',
        message: 'source type、confidence band、evidence、limitations、reviewer note 只留在后台。',
        nextAction: 'keep_operator_only',
      },
      {
        id: 'human_review_required',
        message: '预览适合演示前仍需人工审核；不能声称全自动拆妆。',
        nextAction: hasWarning ? 'request_human_review_edit' : 'continue_operator_review',
      },
    ],
    userAppPreviewSuitable: status !== 'draft_preview_qa_blocked',
    localOnlyPrivacyNoticePresent,
    internalFieldsHiddenFromUserPath: !internalSourcePattern.test(textForUser),
    humanReviewTracePreservedInternally,
    notProductionReady: true,
    notPublishReady: true,
    publishBlocked: true,
    registryWriteBlocked: true,
    registryMutationBlocked: true,
    productionWriterBlocked: true,
    userAppShellReplacementBlocked: true,
    userAppTemplatePackageGenerationBlocked: true,
    jsonRoundTripStable: false,
    nextRecommendedPhase:
      'Phase 12E - Photo-to-Template End-to-End Demo Script & Acceptance Trial',
  };

  return {
    ...report,
    jsonRoundTripStable: jsonRoundTripStable(report),
  };
};
