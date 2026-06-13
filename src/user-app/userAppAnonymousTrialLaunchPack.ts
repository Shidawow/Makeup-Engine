import {
  createDefaultUserAppEvidenceCollectionAllowedItems,
  createDefaultUserAppEvidenceCollectionForbiddenItems,
  createDefaultUserAppEvidenceCollectionParticipantNotice,
  createDefaultUserAppEvidenceCollectionStopConditions,
  type UserAppEvidenceCollectionAllowedType,
  type UserAppEvidenceCollectionForbiddenType,
  type UserAppEvidenceCollectionParticipantNotice,
} from './userAppEvidenceCollectionProtocol';

export const USER_APP_ANONYMOUS_TRIAL_LAUNCH_PACK_SCHEMA_VERSION =
  'user-app-anonymous-trial-launch-pack-v0.1' as const;

export type UserAppAnonymousTrialLaunchScope =
  | 'internal_only'
  | 'small_scope'
  | 'anonymous_observation_only'
  | 'no_photo_collection'
  | 'no_contact_collection'
  | 'no_health_or_sensitive_data'
  | 'no_upload'
  | 'no_training'
  | 'no_backend_storage'
  | 'local_review_only';

export type UserAppAnonymousTrialLaunchPackStatus =
  | 'launch_pack_ready'
  | 'launch_pack_ready_with_warnings'
  | 'launch_pack_blocked';

export type UserAppAnonymousTrialParticipantNotice =
  UserAppEvidenceCollectionParticipantNotice;

export interface UserAppAnonymousTrialAdminScript {
  scriptId: string;
  title: string;
  steps: string[];
  localOnly: true;
  anonymousOnly: true;
}

export interface UserAppAnonymousTrialEvidenceCaptureSheet {
  sheetId: string;
  title: string;
  allowedEvidenceTypes: UserAppEvidenceCollectionAllowedType[];
  columns: string[];
  localOnly: true;
  anonymousOnly: true;
  aggregatedHandoffOnly: true;
  collectsRealIdentity: false;
  collectsContact: false;
  collectsPhoto: false;
  collectsHealthInfo: false;
  writesTrainingInput: false;
}

export interface UserAppAnonymousTrialStopCondition {
  conditionId: string;
  label: string;
  trigger: string;
  action: string;
  blocking: true;
}

export interface UserAppAnonymousTrialForbiddenDataRequest {
  requestId: string;
  type: UserAppEvidenceCollectionForbiddenType;
  label: string;
  reason: string;
  requested: boolean;
  blocking: true;
}

export interface UserAppAnonymousTrialLaunchIssue {
  issueId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppAnonymousTrialLaunchPack {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_LAUNCH_PACK_SCHEMA_VERSION;
  packId: string;
  title: string;
  status: UserAppAnonymousTrialLaunchPackStatus;
  scope: UserAppAnonymousTrialLaunchScope[];
  participantNotice: UserAppAnonymousTrialParticipantNotice | null;
  adminScript: UserAppAnonymousTrialAdminScript | null;
  evidenceCaptureSheet: UserAppAnonymousTrialEvidenceCaptureSheet | null;
  stopConditions: UserAppAnonymousTrialStopCondition[];
  forbiddenDataRequests: UserAppAnonymousTrialForbiddenDataRequest[];
  issues: UserAppAnonymousTrialLaunchIssue[];
  localOnly: true;
  deterministic: true;
  launchPreparationOnly: true;
  publicRecruitment: false;
  productionBuildApproved: false;
  collectsRealUserRecords: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsCamera: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppAnonymousTrialLaunchPackInput {
  packId?: string;
  title?: string;
  scope?: UserAppAnonymousTrialLaunchScope[];
  participantNotice?: UserAppAnonymousTrialParticipantNotice | null;
  adminScript?: UserAppAnonymousTrialAdminScript | null;
  evidenceCaptureSheet?: UserAppAnonymousTrialEvidenceCaptureSheet | null;
  stopConditions?: UserAppAnonymousTrialStopCondition[];
  requestedForbiddenTypes?: UserAppEvidenceCollectionForbiddenType[];
}

export const createDefaultUserAppAnonymousTrialLaunchScope =
  (): UserAppAnonymousTrialLaunchScope[] => [
    'internal_only',
    'small_scope',
    'anonymous_observation_only',
    'no_photo_collection',
    'no_contact_collection',
    'no_health_or_sensitive_data',
    'no_upload',
    'no_training',
    'no_backend_storage',
    'local_review_only',
  ];

export const createDefaultUserAppAnonymousTrialParticipantNotice =
  (): UserAppAnonymousTrialParticipantNotice => ({
    ...createDefaultUserAppEvidenceCollectionParticipantNotice(),
    noticeId: 'anonymous-internal-trial-launch-notice-v0',
    title: '匿名内部试用参与者说明',
    copy:
      '本次是内部小范围匿名试用，只记录匿名观察摘要；不收集照片、姓名、联系方式、健康信息、敏感身份或生物识别信息，不上传，不训练模型，不建立真实用户记录。',
  });

export const createDefaultUserAppAnonymousTrialAdminScript =
  (): UserAppAnonymousTrialAdminScript => ({
    scriptId: 'anonymous-trial-admin-launch-script-v0',
    title: '匿名内部试用管理员执行脚本',
    steps: [
      '开场说明：这是内部小范围匿名试用，不是公开招募或正式发布。',
      '复述边界：不收集照片、姓名、联系方式、健康信息、敏感身份、生物识别信息，不上传、不训练、不接后端。',
      '请参与者按任务浏览首页、推荐模板、模板详情、至少三个跟练步骤、工具建议、区域说明、偏好和隐私说明。',
      '管理员只记录匿名任务完成、理解卡点、模板价值感、Shell 可用性、推荐有用性和隐私清晰度。',
      '如果出现照片、联系方式、上传、训练、真实身份或健康敏感信息请求，立即暂停试用和记录。',
      '结束后只 handoff 匿名摘要、证据缺口、停止原因、问题摘要和下一步决策建议。',
    ],
    localOnly: true,
    anonymousOnly: true,
  });

export const createDefaultUserAppAnonymousTrialEvidenceCaptureSheet =
  (): UserAppAnonymousTrialEvidenceCaptureSheet => ({
    sheetId: 'anonymous-trial-evidence-capture-sheet-v0',
    title: '匿名内部试用证据记录模板',
    allowedEvidenceTypes: createDefaultUserAppEvidenceCollectionAllowedItems().map(
      (item) => item.type,
    ),
    columns: [
      'anonymousSessionCode',
      'participantType',
      'taskCompletionNotes',
      'stepComprehensionNotes',
      'templateValueNotes',
      'shellUsabilityNotes',
      'recommendationUsefulnessNotes',
      'privacyClarityNotes',
      'trialOpsNotes',
      'issueSeverity',
      'iterationPriority',
      'handoffSummary',
    ],
    localOnly: true,
    anonymousOnly: true,
    aggregatedHandoffOnly: true,
    collectsRealIdentity: false,
    collectsContact: false,
    collectsPhoto: false,
    collectsHealthInfo: false,
    writesTrainingInput: false,
  });

export const createDefaultUserAppAnonymousTrialStopConditions =
  (): UserAppAnonymousTrialStopCondition[] =>
    createDefaultUserAppEvidenceCollectionStopConditions().map((condition) => ({
      conditionId: `launch-${condition.conditionId}`,
      label: condition.label,
      trigger: condition.trigger,
      action: condition.action,
      blocking: true,
    }));

export const createDefaultUserAppAnonymousTrialForbiddenDataRequests = (
  requestedForbiddenTypes: readonly UserAppEvidenceCollectionForbiddenType[] = [],
): UserAppAnonymousTrialForbiddenDataRequest[] =>
  createDefaultUserAppEvidenceCollectionForbiddenItems(requestedForbiddenTypes).map((item) => ({
    requestId: `launch-${item.itemId}`,
    type: item.type,
    label: item.label,
    reason: item.reason,
    requested: item.requested,
    blocking: true,
  }));

const requiredScope: readonly UserAppAnonymousTrialLaunchScope[] = [
  'internal_only',
  'small_scope',
  'anonymous_observation_only',
  'no_photo_collection',
  'no_contact_collection',
  'no_health_or_sensitive_data',
  'no_upload',
  'no_training',
  'no_backend_storage',
  'local_review_only',
];

const noticeReady = (notice: UserAppAnonymousTrialParticipantNotice | null): boolean =>
  Boolean(
    notice?.anonymousOnly &&
      notice.localOnly &&
      notice.mentionsNoPhoto &&
      notice.mentionsNoUpload &&
      notice.mentionsNoTraining &&
      notice.mentionsNoSensitiveInfo,
  );

const createIssues = (
  scope: readonly UserAppAnonymousTrialLaunchScope[],
  participantNotice: UserAppAnonymousTrialParticipantNotice | null,
  adminScript: UserAppAnonymousTrialAdminScript | null,
  evidenceCaptureSheet: UserAppAnonymousTrialEvidenceCaptureSheet | null,
  stopConditions: readonly UserAppAnonymousTrialStopCondition[],
  forbiddenDataRequests: readonly UserAppAnonymousTrialForbiddenDataRequest[],
): UserAppAnonymousTrialLaunchIssue[] => {
  const issues: UserAppAnonymousTrialLaunchIssue[] = [];
  if (!noticeReady(participantNotice)) {
    issues.push({
      issueId: 'launch-pack-missing-notice',
      severity: 'critical',
      message: '缺少完整参与者说明。',
      mitigation: '补齐匿名、本地、不收集照片、不上传、不训练、不收集敏感信息的说明。',
    });
  }
  if (!adminScript || adminScript.steps.length < 5) {
    issues.push({
      issueId: 'launch-pack-missing-admin-script',
      severity: 'critical',
      message: '缺少管理员执行脚本或脚本步骤不足。',
      mitigation: '补齐开场、边界说明、任务执行、匿名记录、停止条件和 handoff 步骤。',
    });
  }
  if (!evidenceCaptureSheet || evidenceCaptureSheet.allowedEvidenceTypes.length < 8) {
    issues.push({
      issueId: 'launch-pack-evidence-sheet-incomplete',
      severity: 'high',
      message: '匿名证据记录模板缺失或覆盖不足。',
      mitigation: '补齐任务完成、步骤理解、模板价值、Shell、推荐、隐私、流程和聚合摘要字段。',
    });
  }
  if (stopConditions.length < 4) {
    issues.push({
      issueId: 'launch-pack-stop-conditions-incomplete',
      severity: 'critical',
      message: '停止条件不完整。',
      mitigation: '补齐照片/相机、身份/联系方式、健康敏感、上传/训练停止条件。',
    });
  }
  if (forbiddenDataRequests.some((item) => item.requested)) {
    issues.push({
      issueId: 'launch-pack-forbidden-data-request',
      severity: 'critical',
      message: '启动包中出现禁止数据请求。',
      mitigation: '移除照片、联系方式、上传、训练、真实身份、健康敏感或生物识别请求。',
    });
  }
  const missingScope = requiredScope.filter((item) => !scope.includes(item));
  if (missingScope.length > 0) {
    issues.push({
      issueId: 'launch-pack-scope-warning',
      severity: 'medium',
      message: `启动范围缺少 ${missingScope.join(', ')}。`,
      mitigation: '补齐 internal-only / small-scope / anonymous / local-only / no upload / no training 边界。',
    });
  }
  return issues;
};

const statusFromIssues = (
  issues: readonly UserAppAnonymousTrialLaunchIssue[],
): UserAppAnonymousTrialLaunchPackStatus => {
  if (issues.some((issue) => issue.severity === 'critical' || issue.severity === 'high')) {
    return 'launch_pack_blocked';
  }
  if (issues.length > 0) return 'launch_pack_ready_with_warnings';
  return 'launch_pack_ready';
};

export const createUserAppAnonymousTrialLaunchPack = (
  input: CreateUserAppAnonymousTrialLaunchPackInput = {},
): UserAppAnonymousTrialLaunchPack => {
  const scope = input.scope ?? createDefaultUserAppAnonymousTrialLaunchScope();
  const participantNotice =
    input.participantNotice === undefined
      ? createDefaultUserAppAnonymousTrialParticipantNotice()
      : input.participantNotice;
  const adminScript =
    input.adminScript === undefined
      ? createDefaultUserAppAnonymousTrialAdminScript()
      : input.adminScript;
  const evidenceCaptureSheet =
    input.evidenceCaptureSheet === undefined
      ? createDefaultUserAppAnonymousTrialEvidenceCaptureSheet()
      : input.evidenceCaptureSheet;
  const stopConditions =
    input.stopConditions ?? createDefaultUserAppAnonymousTrialStopConditions();
  const forbiddenDataRequests = createDefaultUserAppAnonymousTrialForbiddenDataRequests(
    input.requestedForbiddenTypes,
  );
  const issues = createIssues(
    scope,
    participantNotice,
    adminScript,
    evidenceCaptureSheet,
    stopConditions,
    forbiddenDataRequests,
  );

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_LAUNCH_PACK_SCHEMA_VERSION,
    packId: input.packId ?? 'anonymous-internal-trial-launch-pack-v0',
    title: input.title ?? '匿名内部试用启动包',
    status: statusFromIssues(issues),
    scope,
    participantNotice,
    adminScript,
    evidenceCaptureSheet,
    stopConditions,
    forbiddenDataRequests,
    issues,
    localOnly: true,
    deterministic: true,
    launchPreparationOnly: true,
    publicRecruitment: false,
    productionBuildApproved: false,
    collectsRealUserRecords: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsCamera: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
