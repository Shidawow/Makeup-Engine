import {
  createUserAppEvidenceCollectionChecklist,
  type UserAppEvidenceCollectionChecklist,
} from './userAppEvidenceCollectionChecklist';
import {
  createUserAppEvidenceCollectionProtocol,
  type UserAppEvidenceCollectionForbiddenType,
  type UserAppEvidenceCollectionProtocol,
} from './userAppEvidenceCollectionProtocol';

export const USER_APP_EVIDENCE_COLLECTION_QUALITY_GATE_SCHEMA_VERSION =
  'user-app-evidence-collection-quality-gate-v0.1' as const;

export type UserAppEvidenceCollectionQualityDecision =
  | 'ready_to_collect_anonymous_internal_evidence'
  | 'ready_with_warnings'
  | 'blocked_by_privacy_scope'
  | 'blocked_by_missing_protocol'
  | 'blocked_by_missing_notice'
  | 'blocked_by_forbidden_data_request';

export interface UserAppEvidenceCollectionQualityCheck {
  checkId: string;
  label: string;
  passed: boolean;
  blocking: boolean;
  message: string;
}

export interface UserAppEvidenceCollectionQualityRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppEvidenceCollectionQualityRecommendation {
  recommendationId: string;
  decision: UserAppEvidenceCollectionQualityDecision;
  message: string;
  nextAction: string;
}

export interface UserAppEvidenceCollectionQualityGate {
  schemaVersion: typeof USER_APP_EVIDENCE_COLLECTION_QUALITY_GATE_SCHEMA_VERSION;
  gateId: string;
  title: string;
  decision: UserAppEvidenceCollectionQualityDecision;
  checks: UserAppEvidenceCollectionQualityCheck[];
  risks: UserAppEvidenceCollectionQualityRisk[];
  recommendation: UserAppEvidenceCollectionQualityRecommendation;
  protocol: UserAppEvidenceCollectionProtocol | null;
  checklist: UserAppEvidenceCollectionChecklist | null;
  localOnly: true;
  deterministic: true;
  preparationOnly: true;
  productionBuildApproved: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsCamera: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppEvidenceCollectionQualityGateInput {
  gateId?: string;
  title?: string;
  protocol?: UserAppEvidenceCollectionProtocol | null;
  checklist?: UserAppEvidenceCollectionChecklist | null;
  requireAllChecklistItems?: boolean;
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

const noticeReady = (
  protocol: UserAppEvidenceCollectionProtocol | null,
): boolean =>
  Boolean(
    protocol?.participantNotice?.anonymousOnly &&
      protocol.participantNotice.localOnly &&
      protocol.participantNotice.mentionsNoPhoto &&
      protocol.participantNotice.mentionsNoUpload &&
      protocol.participantNotice.mentionsNoTraining &&
      protocol.participantNotice.mentionsNoSensitiveInfo,
  );

const hasForbiddenRequest = (
  protocol: UserAppEvidenceCollectionProtocol | null,
): boolean => Boolean(protocol?.forbiddenItems.some((item) => item.requested));

const hasPrivacyScopeRequest = (
  protocol: UserAppEvidenceCollectionProtocol | null,
): boolean =>
  Boolean(
    protocol?.forbiddenItems.some(
      (item) => item.requested && privacyScopeForbiddenTypes.includes(item.type),
    ),
  );

const createChecks = (
  protocol: UserAppEvidenceCollectionProtocol | null,
  checklist: UserAppEvidenceCollectionChecklist | null,
  requireAllChecklistItems: boolean,
): UserAppEvidenceCollectionQualityCheck[] => [
  {
    checkId: 'quality-check-protocol-exists',
    label: '协议存在',
    passed: Boolean(protocol),
    blocking: true,
    message: protocol ? '已提供证据收集协议。' : '缺少证据收集协议。',
  },
  {
    checkId: 'quality-check-notice-ready',
    label: '参与者说明完整',
    passed: noticeReady(protocol),
    blocking: true,
    message: noticeReady(protocol)
      ? '参与者说明已覆盖匿名、本地、不收集照片、不上传、不训练、不收集敏感信息。'
      : '参与者说明缺失或边界不完整。',
  },
  {
    checkId: 'quality-check-no-forbidden-request',
    label: '没有禁止收集项请求',
    passed: !hasForbiddenRequest(protocol),
    blocking: true,
    message: hasForbiddenRequest(protocol)
      ? '存在禁止收集项请求。'
      : '未发现禁止收集项请求。',
  },
  {
    checkId: 'quality-check-privacy-scope',
    label: '隐私和范围安全',
    passed: !hasPrivacyScopeRequest(protocol),
    blocking: true,
    message: hasPrivacyScopeRequest(protocol)
      ? '存在照片、上传、训练、真实身份、联系方式、健康、敏感或生物识别风险。'
      : '未发现照片、上传、训练、真实身份、联系方式、健康、敏感或生物识别风险。',
  },
  {
    checkId: 'quality-check-checklist-ready',
    label: 'checklist 就绪',
    passed: Boolean(
      checklist &&
        (requireAllChecklistItems
          ? checklist.status === 'checklist_ready'
          : checklist.status !== 'checklist_blocked'),
    ),
    blocking: true,
    message:
      checklist && checklist.status !== 'checklist_blocked'
        ? 'checklist 没有阻断项。'
        : 'checklist 缺失或存在阻断项。',
  },
  {
    checkId: 'quality-check-stop-conditions',
    label: '停止条件完整',
    passed: Boolean(protocol && protocol.stopConditions.length >= 4),
    blocking: true,
    message:
      protocol && protocol.stopConditions.length >= 4
        ? '停止条件覆盖照片/身份/健康敏感/上传训练。'
        : '停止条件不完整。',
  },
  {
    checkId: 'quality-check-local-only',
    label: '本地匿名边界',
    passed: Boolean(
      protocol &&
        checklist &&
        protocol.localOnly &&
        checklist.localOnly &&
        !protocol.backendRecordSystem &&
        !protocol.usesAiAnalysis &&
        !protocol.writesTrainingInput &&
        !protocol.writesProjectStateUserRecords,
    ),
    blocking: true,
    message:
      protocol && checklist
        ? '协议和 checklist 保持本地、匿名、不接后端、不训练、不写真实用户记录。'
        : '缺少协议或 checklist，无法确认本地匿名边界。',
  },
];

const decide = (
  protocol: UserAppEvidenceCollectionProtocol | null,
  checklist: UserAppEvidenceCollectionChecklist | null,
  checks: readonly UserAppEvidenceCollectionQualityCheck[],
): UserAppEvidenceCollectionQualityDecision => {
  if (!protocol) return 'blocked_by_missing_protocol';
  if (hasPrivacyScopeRequest(protocol)) return 'blocked_by_privacy_scope';
  if (hasForbiddenRequest(protocol)) return 'blocked_by_forbidden_data_request';
  if (!noticeReady(protocol)) return 'blocked_by_missing_notice';
  if (!checklist) return 'blocked_by_missing_protocol';
  if (checks.some((check) => check.blocking && !check.passed)) {
    return 'blocked_by_privacy_scope';
  }
  if (
    protocol.status === 'protocol_ready_with_warnings' ||
    checklist.status === 'checklist_ready_with_warnings'
  ) {
    return 'ready_with_warnings';
  }
  return 'ready_to_collect_anonymous_internal_evidence';
};

const risksForDecision = (
  decision: UserAppEvidenceCollectionQualityDecision,
): UserAppEvidenceCollectionQualityRisk[] => {
  if (decision === 'ready_to_collect_anonymous_internal_evidence') {
    return [
      {
        riskId: 'quality-risk-overclaim',
        severity: 'low',
        message: '就绪仅表示可以做匿名内部 dry run，不是生产发布或真实数据系统。',
        mitigation: '保持 no backend / no upload / no training / no real user records。',
      },
    ];
  }
  if (decision === 'ready_with_warnings') {
    return [
      {
        riskId: 'quality-risk-warning',
        severity: 'medium',
        message: '存在非阻断准备缺口。',
        mitigation: '优先补齐匿名证据覆盖或聚合摘要，再开始 dry run。',
      },
    ];
  }
  return [
    {
      riskId: `quality-risk-${decision}`,
      severity: 'critical',
      message: '证据收集准备存在阻断风险。',
      mitigation: '暂停 dry run，先修复协议、参与者说明、禁止数据请求或隐私边界。',
    },
  ];
};

const recommendationForDecision = (
  decision: UserAppEvidenceCollectionQualityDecision,
): UserAppEvidenceCollectionQualityRecommendation => {
  const messageByDecision: Record<UserAppEvidenceCollectionQualityDecision, string> = {
    ready_to_collect_anonymous_internal_evidence:
      '可以开始 anonymous internal trial dry run 的准备执行。',
    ready_with_warnings: '可以带着非阻断提醒准备 dry run，但不应进入 MVP validation planning。',
    blocked_by_privacy_scope: '隐私或范围边界阻断，不能开始记录。',
    blocked_by_missing_protocol: '缺少协议或 checklist，不能开始记录。',
    blocked_by_missing_notice: '缺少参与者说明，不能开始记录。',
    blocked_by_forbidden_data_request: '存在禁止数据请求，不能开始记录。',
  };

  return {
    recommendationId: `evidence-collection-quality-${decision}`,
    decision,
    message: messageByDecision[decision],
    nextAction:
      decision === 'ready_to_collect_anonymous_internal_evidence'
        ? '进入 Phase 9G Anonymous Internal Trial Dry Run Pack；继续禁止照片、上传、训练、后端、AI 分析和真实用户记录。'
        : '修复阻断项后重新运行质量门。',
  };
};

export const createUserAppEvidenceCollectionQualityGate = (
  input: CreateUserAppEvidenceCollectionQualityGateInput = {},
): UserAppEvidenceCollectionQualityGate => {
  const protocol =
    input.protocol === undefined ? createUserAppEvidenceCollectionProtocol() : input.protocol;
  const checklist =
    input.checklist === undefined
      ? protocol
        ? createUserAppEvidenceCollectionChecklist({ protocol })
        : null
      : input.checklist;
  const checks = createChecks(protocol, checklist, input.requireAllChecklistItems ?? true);
  const decision = decide(protocol, checklist, checks);

  return {
    schemaVersion: USER_APP_EVIDENCE_COLLECTION_QUALITY_GATE_SCHEMA_VERSION,
    gateId: input.gateId ?? 'evidence-collection-quality-gate-v0',
    title: input.title ?? '证据收集质量门',
    decision,
    checks,
    risks: risksForDecision(decision),
    recommendation: recommendationForDecision(decision),
    protocol,
    checklist,
    localOnly: true,
    deterministic: true,
    preparationOnly: true,
    productionBuildApproved: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsCamera: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
