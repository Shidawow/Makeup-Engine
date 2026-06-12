import {
  createUserAppAnonymousTrialDryRunChecklist,
  type UserAppAnonymousTrialDryRunChecklist,
} from './userAppAnonymousTrialDryRunChecklist';
import {
  createUserAppAnonymousTrialDryRunPack,
  type UserAppAnonymousTrialDryRunPack,
} from './userAppAnonymousTrialDryRunPack';
import {
  createUserAppEvidenceCollectionChecklist,
  type UserAppEvidenceCollectionChecklist,
} from './userAppEvidenceCollectionChecklist';
import {
  createUserAppEvidenceCollectionProtocol,
  type UserAppEvidenceCollectionForbiddenType,
  type UserAppEvidenceCollectionProtocol,
} from './userAppEvidenceCollectionProtocol';
import {
  createUserAppEvidenceCollectionQualityGate,
  type UserAppEvidenceCollectionQualityGate,
} from './userAppEvidenceCollectionQualityGate';

export const USER_APP_ANONYMOUS_TRIAL_DRY_RUN_REVIEW_SCHEMA_VERSION =
  'user-app-anonymous-trial-dry-run-review-v0.1' as const;

export type UserAppAnonymousTrialDryRunReviewDecision =
  | 'ready_for_anonymous_internal_trial'
  | 'ready_with_warnings'
  | 'repeat_dry_run'
  | 'revise_protocol_before_trial'
  | 'revise_checklist_before_trial'
  | 'blocked_by_privacy_scope_issue'
  | 'blocked_by_missing_notice'
  | 'blocked_by_forbidden_data_request';

export interface UserAppAnonymousTrialDryRunReviewSignal {
  signalId: string;
  label: string;
  passed: boolean;
  message: string;
}

export interface UserAppAnonymousTrialDryRunReviewIssue {
  issueId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppAnonymousTrialDryRunReviewRecommendation {
  recommendationId: string;
  decision: UserAppAnonymousTrialDryRunReviewDecision;
  message: string;
  nextAction: string;
}

export interface UserAppAnonymousTrialDryRunReview {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_DRY_RUN_REVIEW_SCHEMA_VERSION;
  reviewId: string;
  title: string;
  decision: UserAppAnonymousTrialDryRunReviewDecision;
  pack: UserAppAnonymousTrialDryRunPack;
  checklist: UserAppAnonymousTrialDryRunChecklist;
  evidenceProtocol: UserAppEvidenceCollectionProtocol;
  evidenceChecklist: UserAppEvidenceCollectionChecklist;
  evidenceQualityGate: UserAppEvidenceCollectionQualityGate;
  signals: UserAppAnonymousTrialDryRunReviewSignal[];
  issues: UserAppAnonymousTrialDryRunReviewIssue[];
  recommendation: UserAppAnonymousTrialDryRunReviewRecommendation;
  localOnly: true;
  deterministic: true;
  dryRunOnly: true;
  productionBuildApproved: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsCamera: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppAnonymousTrialDryRunReviewInput {
  reviewId?: string;
  title?: string;
  pack?: UserAppAnonymousTrialDryRunPack;
  checklist?: UserAppAnonymousTrialDryRunChecklist;
  evidenceProtocol?: UserAppEvidenceCollectionProtocol;
  evidenceChecklist?: UserAppEvidenceCollectionChecklist;
  evidenceQualityGate?: UserAppEvidenceCollectionQualityGate;
}

const privacyScopeForbiddenTypes: readonly UserAppEvidenceCollectionForbiddenType[] = [
  'real_name',
  'phone_number',
  'email',
  'precise_address',
  'face_photo',
  'makeup_photo',
  'skin_health_information',
  'health_condition',
  'sensitive_identity',
  'biometric_identifier',
  'face_embedding',
  'raw_camera_data',
  'uploaded_image',
  'training_dataset_write',
  'social_media_account',
  'payment_information',
  'account_credential',
];

const hasForbiddenDataRequest = (pack: UserAppAnonymousTrialDryRunPack): boolean =>
  pack.forbiddenData.some((item) => item.requested);

const hasPrivacyScopeIssue = (pack: UserAppAnonymousTrialDryRunPack): boolean =>
  pack.forbiddenData.some(
    (item) => item.requested && privacyScopeForbiddenTypes.includes(item.type),
  );

const createSignals = (
  pack: UserAppAnonymousTrialDryRunPack,
  checklist: UserAppAnonymousTrialDryRunChecklist,
  gate: UserAppEvidenceCollectionQualityGate,
): UserAppAnonymousTrialDryRunReviewSignal[] => [
  {
    signalId: 'dry-run-review-pack-ready',
    label: 'dry run pack 完整',
    passed: pack.status === 'dry_run_ready',
    message:
      pack.status === 'dry_run_ready'
        ? '演练包完整。'
        : '演练包仍有提醒或阻断。',
  },
  {
    signalId: 'dry-run-review-checklist-ready',
    label: 'dry run checklist 完整',
    passed: checklist.status === 'dry_run_checklist_ready',
    message:
      checklist.status === 'dry_run_checklist_ready'
        ? 'checklist 完整。'
        : 'checklist 仍有提醒或阻断。',
  },
  {
    signalId: 'dry-run-review-notice-ready',
    label: '参与者说明完整',
    passed: Boolean(pack.participantNotice),
    message: pack.participantNotice ? '参与者说明已准备。' : '缺少参与者说明。',
  },
  {
    signalId: 'dry-run-review-stop-ready',
    label: '停止条件完整',
    passed: pack.stopConditions.length >= 4 && pack.stopConditions.every((item) => item.rehearsed),
    message: '停止条件需要覆盖照片、联系方式、上传、训练和真实身份请求。',
  },
  {
    signalId: 'dry-run-review-evidence-gate-ready',
    label: '9F 证据收集质量门通过',
    passed: gate.decision === 'ready_to_collect_anonymous_internal_evidence',
    message: `当前 9F 质量门结论：${gate.decision}`,
  },
  {
    signalId: 'dry-run-review-no-forbidden-data',
    label: '没有禁止数据请求',
    passed: !hasForbiddenDataRequest(pack),
    message: hasForbiddenDataRequest(pack)
      ? '存在照片、联系方式、上传、训练或身份相关请求。'
      : '未发现禁止数据请求。',
  },
];

const createIssues = (
  pack: UserAppAnonymousTrialDryRunPack,
  checklist: UserAppAnonymousTrialDryRunChecklist,
  gate: UserAppEvidenceCollectionQualityGate,
): UserAppAnonymousTrialDryRunReviewIssue[] => {
  const issues: UserAppAnonymousTrialDryRunReviewIssue[] = [];
  if (!pack.participantNotice) {
    issues.push({
      issueId: 'dry-run-review-missing-notice',
      severity: 'critical',
      message: '缺少参与者说明。',
      mitigation: '补齐匿名、本地、不收集照片、不上传、不训练、不收集敏感信息的说明。',
    });
  }
  if (hasForbiddenDataRequest(pack)) {
    issues.push({
      issueId: 'dry-run-review-forbidden-data',
      severity: 'critical',
      message: '出现禁止数据请求。',
      mitigation: '停止 dry run，移除照片、联系方式、上传、训练或身份相关请求。',
    });
  }
  if (pack.status === 'dry_run_ready_with_warnings') {
    issues.push({
      issueId: 'dry-run-review-pack-warning',
      severity: 'medium',
      message: 'dry run pack 有非阻断提醒。',
      mitigation: '建议重复 dry run 或补齐未准备好的场景。',
    });
  }
  if (checklist.status === 'dry_run_checklist_ready_with_warnings') {
    issues.push({
      issueId: 'dry-run-review-checklist-warning',
      severity: 'medium',
      message: 'dry run checklist 有非阻断提醒。',
      mitigation: '补齐 checklist 后再正式进入匿名内部试用。',
    });
  }
  if (gate.decision === 'ready_with_warnings') {
    issues.push({
      issueId: 'dry-run-review-gate-warning',
      severity: 'medium',
      message: '9F 证据收集质量门有非阻断提醒。',
      mitigation: '补齐协议或聚合摘要覆盖后再启动匿名内部试用。',
    });
  }
  return issues;
};

const decide = (
  pack: UserAppAnonymousTrialDryRunPack,
  checklist: UserAppAnonymousTrialDryRunChecklist,
  gate: UserAppEvidenceCollectionQualityGate,
): UserAppAnonymousTrialDryRunReviewDecision => {
  if (hasPrivacyScopeIssue(pack)) return 'blocked_by_privacy_scope_issue';
  if (hasForbiddenDataRequest(pack)) return 'blocked_by_forbidden_data_request';
  if (!pack.participantNotice) return 'blocked_by_missing_notice';
  if (
    gate.decision === 'blocked_by_privacy_scope' ||
    gate.decision === 'blocked_by_forbidden_data_request'
  ) {
    return 'blocked_by_privacy_scope_issue';
  }
  if (gate.decision === 'blocked_by_missing_notice') return 'blocked_by_missing_notice';
  if (gate.decision === 'blocked_by_missing_protocol') return 'revise_protocol_before_trial';
  if (pack.status === 'dry_run_blocked') return 'revise_protocol_before_trial';
  if (checklist.status === 'dry_run_checklist_blocked') return 'revise_checklist_before_trial';
  if (
    pack.status === 'dry_run_ready_with_warnings' ||
    checklist.status === 'dry_run_checklist_ready_with_warnings'
  ) {
    return 'repeat_dry_run';
  }
  if (gate.decision === 'ready_with_warnings') return 'ready_with_warnings';
  return 'ready_for_anonymous_internal_trial';
};

const recommendationForDecision = (
  decision: UserAppAnonymousTrialDryRunReviewDecision,
): UserAppAnonymousTrialDryRunReviewRecommendation => {
  const messageByDecision: Record<UserAppAnonymousTrialDryRunReviewDecision, string> = {
    ready_for_anonymous_internal_trial:
      'dry run 通过，可以进入匿名内部试用 launch pack 准备。',
    ready_with_warnings: 'dry run 可带提醒进入下一步，但需要在 launch 前补齐非阻断项。',
    repeat_dry_run: 'dry run 有非阻断缺口，建议重复演练。',
    revise_protocol_before_trial: '协议或演练包存在缺口，需要先修复。',
    revise_checklist_before_trial: 'checklist 存在缺口，需要先修复。',
    blocked_by_privacy_scope_issue: '隐私或范围问题阻断，不能进入匿名内部试用。',
    blocked_by_missing_notice: '缺少参与者说明，不能进入匿名内部试用。',
    blocked_by_forbidden_data_request: '存在禁止数据请求，不能进入匿名内部试用。',
  };

  return {
    recommendationId: `anonymous-dry-run-review-${decision}`,
    decision,
    message: messageByDecision[decision],
    nextAction:
      decision === 'ready_for_anonymous_internal_trial'
        ? '进入 Phase 9H Anonymous Internal Trial Launch Pack；仍禁止照片、上传、训练、后端、AI 分析和真实用户记录。'
        : '先修复阻断项或重复 dry run，再重新复盘。',
  };
};

export const createUserAppAnonymousTrialDryRunReview = (
  input: CreateUserAppAnonymousTrialDryRunReviewInput = {},
): UserAppAnonymousTrialDryRunReview => {
  const pack = input.pack ?? createUserAppAnonymousTrialDryRunPack();
  const checklist = input.checklist ?? createUserAppAnonymousTrialDryRunChecklist({ pack });
  const evidenceProtocol =
    input.evidenceProtocol ??
    createUserAppEvidenceCollectionProtocol({
      participantNotice: pack.participantNotice,
      requestedForbiddenTypes: pack.forbiddenData
        .filter((item) => item.requested)
        .map((item) => item.type),
    });
  const evidenceChecklist =
    input.evidenceChecklist ?? createUserAppEvidenceCollectionChecklist({ protocol: evidenceProtocol });
  const evidenceQualityGate =
    input.evidenceQualityGate ??
    createUserAppEvidenceCollectionQualityGate({
      protocol: evidenceProtocol,
      checklist: evidenceChecklist,
    });
  const signals = createSignals(pack, checklist, evidenceQualityGate);
  const issues = createIssues(pack, checklist, evidenceQualityGate);
  const decision = decide(pack, checklist, evidenceQualityGate);

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_DRY_RUN_REVIEW_SCHEMA_VERSION,
    reviewId: input.reviewId ?? 'anonymous-trial-dry-run-review-v0',
    title: input.title ?? '匿名内部试用 dry run 复盘',
    decision,
    pack,
    checklist,
    evidenceProtocol,
    evidenceChecklist,
    evidenceQualityGate,
    signals,
    issues,
    recommendation: recommendationForDecision(decision),
    localOnly: true,
    deterministic: true,
    dryRunOnly: true,
    productionBuildApproved: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsCamera: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
