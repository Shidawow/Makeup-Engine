import {
  createUserAppAnonymousTrialLaunchPack,
  type UserAppAnonymousTrialLaunchPack,
} from './userAppAnonymousTrialLaunchPack';
import type { UserAppEvidenceCollectionForbiddenType } from './userAppEvidenceCollectionProtocol';

export const USER_APP_ANONYMOUS_TRIAL_LAUNCH_READINESS_SCHEMA_VERSION =
  'user-app-anonymous-trial-launch-readiness-v0.1' as const;

export type UserAppAnonymousTrialLaunchReadinessDecision =
  | 'ready_to_launch_anonymous_internal_trial'
  | 'ready_with_warnings'
  | 'blocked_by_missing_notice'
  | 'blocked_by_missing_admin_script'
  | 'blocked_by_missing_stop_conditions'
  | 'blocked_by_forbidden_data_request'
  | 'blocked_by_privacy_scope_issue';

export interface UserAppAnonymousTrialLaunchReadinessCheck {
  checkId: string;
  label: string;
  passed: boolean;
  blocking: boolean;
  message: string;
}

export interface UserAppAnonymousTrialLaunchReadinessRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppAnonymousTrialLaunchReadinessRecommendation {
  recommendationId: string;
  decision: UserAppAnonymousTrialLaunchReadinessDecision;
  message: string;
  nextAction: string;
}

export interface UserAppAnonymousTrialLaunchReadiness {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_LAUNCH_READINESS_SCHEMA_VERSION;
  readinessId: string;
  title: string;
  decision: UserAppAnonymousTrialLaunchReadinessDecision;
  pack: UserAppAnonymousTrialLaunchPack;
  checks: UserAppAnonymousTrialLaunchReadinessCheck[];
  risks: UserAppAnonymousTrialLaunchReadinessRisk[];
  recommendation: UserAppAnonymousTrialLaunchReadinessRecommendation;
  localOnly: true;
  deterministic: true;
  launchPreparationOnly: true;
  productionBuildApproved: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsCamera: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppAnonymousTrialLaunchReadinessInput {
  readinessId?: string;
  title?: string;
  pack?: UserAppAnonymousTrialLaunchPack;
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
  'free_text_identifier',
];

const noticeReady = (pack: UserAppAnonymousTrialLaunchPack): boolean =>
  Boolean(
    pack.participantNotice?.anonymousOnly &&
      pack.participantNotice.localOnly &&
      pack.participantNotice.mentionsNoPhoto &&
      pack.participantNotice.mentionsNoUpload &&
      pack.participantNotice.mentionsNoTraining &&
      pack.participantNotice.mentionsNoSensitiveInfo,
  );

const adminScriptReady = (pack: UserAppAnonymousTrialLaunchPack): boolean =>
  Boolean(pack.adminScript?.localOnly && pack.adminScript.anonymousOnly && pack.adminScript.steps.length >= 5);

const evidenceSheetReady = (pack: UserAppAnonymousTrialLaunchPack): boolean =>
  Boolean(
    pack.evidenceCaptureSheet?.localOnly &&
      pack.evidenceCaptureSheet.anonymousOnly &&
      pack.evidenceCaptureSheet.aggregatedHandoffOnly &&
      pack.evidenceCaptureSheet.allowedEvidenceTypes.length >= 8 &&
      !pack.evidenceCaptureSheet.collectsRealIdentity &&
      !pack.evidenceCaptureSheet.collectsContact &&
      !pack.evidenceCaptureSheet.collectsPhoto &&
      !pack.evidenceCaptureSheet.collectsHealthInfo &&
      !pack.evidenceCaptureSheet.writesTrainingInput,
  );

const hasForbiddenRequest = (pack: UserAppAnonymousTrialLaunchPack): boolean =>
  pack.forbiddenDataRequests.some((item) => item.requested);

const hasPrivacyScopeIssue = (pack: UserAppAnonymousTrialLaunchPack): boolean =>
  pack.forbiddenDataRequests.some(
    (item) => item.requested && privacyScopeForbiddenTypes.includes(item.type),
  );

const createChecks = (
  pack: UserAppAnonymousTrialLaunchPack,
): UserAppAnonymousTrialLaunchReadinessCheck[] => [
  {
    checkId: 'launch-readiness-pack-ready',
    label: '启动包完整',
    passed: pack.status !== 'launch_pack_blocked',
    blocking: true,
    message:
      pack.status === 'launch_pack_ready'
        ? '启动包完整。'
        : '启动包仍有提醒或阻断。',
  },
  {
    checkId: 'launch-readiness-notice-ready',
    label: '参与者说明完整',
    passed: noticeReady(pack),
    blocking: true,
    message: noticeReady(pack)
      ? '参与者说明已覆盖匿名、本地、不收集照片、不上传、不训练、不收集敏感信息。'
      : '参与者说明缺失或边界不完整。',
  },
  {
    checkId: 'launch-readiness-admin-script-ready',
    label: '管理员执行脚本完整',
    passed: adminScriptReady(pack),
    blocking: true,
    message: adminScriptReady(pack)
      ? '管理员脚本已覆盖开场、边界、任务、匿名记录、停止条件和 handoff。'
      : '管理员执行脚本缺失或步骤不足。',
  },
  {
    checkId: 'launch-readiness-evidence-sheet-ready',
    label: '匿名证据记录模板完整',
    passed: evidenceSheetReady(pack),
    blocking: true,
    message: evidenceSheetReady(pack)
      ? '证据记录模板只包含匿名、本地、聚合 handoff 字段。'
      : '证据记录模板缺失或存在边界风险。',
  },
  {
    checkId: 'launch-readiness-stop-conditions-ready',
    label: '停止条件完整',
    passed: pack.stopConditions.length >= 4,
    blocking: true,
    message:
      pack.stopConditions.length >= 4
        ? '停止条件覆盖照片/身份/健康敏感/上传训练。'
        : '停止条件不完整。',
  },
  {
    checkId: 'launch-readiness-no-forbidden-data',
    label: '没有禁止数据请求',
    passed: !hasForbiddenRequest(pack),
    blocking: true,
    message: hasForbiddenRequest(pack)
      ? '存在照片、联系方式、上传、训练或身份相关请求。'
      : '未发现禁止数据请求。',
  },
  {
    checkId: 'launch-readiness-local-boundary',
    label: '本地匿名边界',
    passed:
      pack.localOnly &&
      !pack.publicRecruitment &&
      !pack.productionBuildApproved &&
      !pack.collectsRealUserRecords &&
      !pack.backendRecordSystem &&
      !pack.usesAiAnalysis &&
      !pack.requestsCamera &&
      !pack.requestsUpload &&
      !pack.writesTrainingInput &&
      !pack.writesProjectStateUserRecords,
    blocking: true,
    message: '启动包必须保持内部、匿名、本地、非公开、无后端、无 AI 分析、无训练。',
  },
];

const decide = (
  pack: UserAppAnonymousTrialLaunchPack,
  checks: readonly UserAppAnonymousTrialLaunchReadinessCheck[],
): UserAppAnonymousTrialLaunchReadinessDecision => {
  if (hasPrivacyScopeIssue(pack)) return 'blocked_by_privacy_scope_issue';
  if (hasForbiddenRequest(pack)) return 'blocked_by_forbidden_data_request';
  if (!noticeReady(pack)) return 'blocked_by_missing_notice';
  if (!adminScriptReady(pack)) return 'blocked_by_missing_admin_script';
  if (pack.stopConditions.length < 4) return 'blocked_by_missing_stop_conditions';
  if (checks.some((check) => check.blocking && !check.passed)) {
    return 'blocked_by_privacy_scope_issue';
  }
  if (pack.status === 'launch_pack_ready_with_warnings') return 'ready_with_warnings';
  return 'ready_to_launch_anonymous_internal_trial';
};

const risksForDecision = (
  decision: UserAppAnonymousTrialLaunchReadinessDecision,
): UserAppAnonymousTrialLaunchReadinessRisk[] => {
  if (decision === 'ready_to_launch_anonymous_internal_trial') {
    return [
      {
        riskId: 'launch-risk-overclaim',
        severity: 'low',
        message: '就绪仅表示可以启动匿名内部小范围试用，不是生产发布或 MVP validation planning。',
        mitigation: '保持 no backend / no upload / no training / no real user records。',
      },
    ];
  }
  if (decision === 'ready_with_warnings') {
    return [
      {
        riskId: 'launch-risk-warning',
        severity: 'medium',
        message: '存在非阻断提醒。',
        mitigation: '启动前优先补齐范围说明或匿名摘要覆盖。',
      },
    ];
  }
  return [
    {
      riskId: `launch-risk-${decision}`,
      severity: 'critical',
      message: '匿名内部试用启动存在阻断风险。',
      mitigation: '暂停启动，先修复参与者说明、管理员脚本、停止条件、禁止数据请求或隐私边界。',
    },
  ];
};

const recommendationForDecision = (
  decision: UserAppAnonymousTrialLaunchReadinessDecision,
): UserAppAnonymousTrialLaunchReadinessRecommendation => {
  const messageByDecision: Record<UserAppAnonymousTrialLaunchReadinessDecision, string> = {
    ready_to_launch_anonymous_internal_trial:
      '可以启动小范围匿名内部试用，并只记录匿名本地证据。',
    ready_with_warnings: '可以带提醒启动匿名内部试用，但不得扩大范围或进入 production。',
    blocked_by_missing_notice: '缺少参与者说明，不能启动匿名内部试用。',
    blocked_by_missing_admin_script: '缺少管理员执行脚本，不能启动匿名内部试用。',
    blocked_by_missing_stop_conditions: '缺少停止条件，不能启动匿名内部试用。',
    blocked_by_forbidden_data_request: '存在禁止数据请求，不能启动匿名内部试用。',
    blocked_by_privacy_scope_issue: '隐私或范围边界阻断，不能启动匿名内部试用。',
  };

  return {
    recommendationId: `anonymous-trial-launch-readiness-${decision}`,
    decision,
    message: messageByDecision[decision],
    nextAction:
      decision === 'ready_to_launch_anonymous_internal_trial'
        ? '进入 Phase 9I Anonymous Internal Trial Evidence Review；仍禁止照片、上传、训练、后端、AI 分析和真实用户记录。'
        : '修复阻断项后重新运行启动就绪度判断。',
  };
};

export const createUserAppAnonymousTrialLaunchReadiness = (
  input: CreateUserAppAnonymousTrialLaunchReadinessInput = {},
): UserAppAnonymousTrialLaunchReadiness => {
  const pack = input.pack ?? createUserAppAnonymousTrialLaunchPack();
  const checks = createChecks(pack);
  const decision = decide(pack, checks);

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_LAUNCH_READINESS_SCHEMA_VERSION,
    readinessId: input.readinessId ?? 'anonymous-internal-trial-launch-readiness-v0',
    title: input.title ?? '匿名内部试用启动就绪度',
    decision,
    pack,
    checks,
    risks: risksForDecision(decision),
    recommendation: recommendationForDecision(decision),
    localOnly: true,
    deterministic: true,
    launchPreparationOnly: true,
    productionBuildApproved: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsCamera: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
