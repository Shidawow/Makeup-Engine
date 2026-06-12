export const USER_APP_EVIDENCE_COLLECTION_PROTOCOL_SCHEMA_VERSION =
  'user-app-evidence-collection-protocol-v0.1' as const;

export type UserAppEvidenceCollectionAllowedType =
  | 'anonymous_task_completion_notes'
  | 'anonymous_step_comprehension_notes'
  | 'anonymous_template_value_notes'
  | 'anonymous_shell_usability_notes'
  | 'anonymous_recommendation_usefulness_notes'
  | 'anonymous_privacy_clarity_notes'
  | 'anonymous_trial_ops_notes'
  | 'aggregated_issue_counts'
  | 'aggregated_severity_summary'
  | 'aggregated_iteration_priority_summary';

export type UserAppEvidenceCollectionForbiddenType =
  | 'real_name'
  | 'phone_number'
  | 'email'
  | 'precise_address'
  | 'face_photo'
  | 'makeup_photo'
  | 'skin_health_information'
  | 'health_condition'
  | 'sensitive_identity'
  | 'biometric_identifier'
  | 'face_embedding'
  | 'raw_camera_data'
  | 'uploaded_image'
  | 'training_dataset_write'
  | 'social_media_account'
  | 'payment_information'
  | 'account_credential'
  | 'free_text_identifier';

export type UserAppEvidenceCollectionProtocolStatus =
  | 'protocol_ready'
  | 'protocol_ready_with_warnings'
  | 'protocol_blocked';

export interface UserAppEvidenceCollectionAllowedItem {
  itemId: string;
  type: UserAppEvidenceCollectionAllowedType;
  label: string;
  description: string;
  anonymousOnly: true;
  aggregatedOnly: boolean;
  localOnly: true;
  collectsRealIdentity: false;
  collectsContact: false;
  collectsPhoto: false;
  collectsHealthInfo: false;
  collectsSensitiveIdentity: false;
  collectsBiometric: false;
  requestsUpload: false;
  writesTrainingInput: false;
}

export interface UserAppEvidenceCollectionForbiddenItem {
  itemId: string;
  type: UserAppEvidenceCollectionForbiddenType;
  label: string;
  reason: string;
  requested: boolean;
  blocking: true;
}

export interface UserAppEvidenceCollectionAnonymizationRule {
  ruleId: string;
  label: string;
  description: string;
  required: boolean;
}

export interface UserAppEvidenceCollectionParticipantNotice {
  noticeId: string;
  title: string;
  copy: string;
  localOnly: true;
  anonymousOnly: true;
  mentionsNoPhoto: boolean;
  mentionsNoUpload: boolean;
  mentionsNoTraining: boolean;
  mentionsNoSensitiveInfo: boolean;
}

export interface UserAppEvidenceCollectionStopCondition {
  conditionId: string;
  label: string;
  trigger: string;
  action: string;
  blocking: true;
}

export interface UserAppEvidenceCollectionProtocolIssue {
  issueId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppEvidenceCollectionProtocol {
  schemaVersion: typeof USER_APP_EVIDENCE_COLLECTION_PROTOCOL_SCHEMA_VERSION;
  protocolId: string;
  title: string;
  status: UserAppEvidenceCollectionProtocolStatus;
  allowedItems: UserAppEvidenceCollectionAllowedItem[];
  forbiddenItems: UserAppEvidenceCollectionForbiddenItem[];
  anonymizationRules: UserAppEvidenceCollectionAnonymizationRule[];
  participantNotice: UserAppEvidenceCollectionParticipantNotice | null;
  stopConditions: UserAppEvidenceCollectionStopCondition[];
  issues: UserAppEvidenceCollectionProtocolIssue[];
  localOnly: true;
  deterministic: true;
  preparationOnly: true;
  collectsRealUserRecords: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsCamera: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppEvidenceCollectionProtocolInput {
  protocolId?: string;
  title?: string;
  allowedItems?: UserAppEvidenceCollectionAllowedItem[];
  forbiddenItems?: UserAppEvidenceCollectionForbiddenItem[];
  requestedForbiddenTypes?: UserAppEvidenceCollectionForbiddenType[];
  anonymizationRules?: UserAppEvidenceCollectionAnonymizationRule[];
  participantNotice?: UserAppEvidenceCollectionParticipantNotice | null;
  stopConditions?: UserAppEvidenceCollectionStopCondition[];
}

const allowedMetadata: Array<{
  type: UserAppEvidenceCollectionAllowedType;
  label: string;
  description: string;
  aggregatedOnly: boolean;
}> = [
  {
    type: 'anonymous_task_completion_notes',
    label: '匿名任务完成记录',
    description: '只记录任务是否完成和卡点摘要，不记录个人身份。',
    aggregatedOnly: false,
  },
  {
    type: 'anonymous_step_comprehension_notes',
    label: '匿名步骤理解记录',
    description: '记录用户是否理解步骤，不记录照片、姓名或联系方式。',
    aggregatedOnly: false,
  },
  {
    type: 'anonymous_template_value_notes',
    label: '匿名模板价值记录',
    description: '记录用户是否觉得模板有价值，保持匿名摘要。',
    aggregatedOnly: false,
  },
  {
    type: 'anonymous_shell_usability_notes',
    label: '匿名 Shell 可用性记录',
    description: '记录本地 shell 的导航、按钮、可读性问题。',
    aggregatedOnly: false,
  },
  {
    type: 'anonymous_recommendation_usefulness_notes',
    label: '匿名推荐有用性记录',
    description: '记录推荐理由是否有帮助，不建立用户画像。',
    aggregatedOnly: false,
  },
  {
    type: 'anonymous_privacy_clarity_notes',
    label: '匿名隐私清晰度记录',
    description: '记录用户是否理解不上传、不训练、不收集照片。',
    aggregatedOnly: false,
  },
  {
    type: 'anonymous_trial_ops_notes',
    label: '匿名试用流程记录',
    description: '记录试用流程是否顺畅，不记录真实参与者资料。',
    aggregatedOnly: false,
  },
  {
    type: 'aggregated_issue_counts',
    label: '聚合问题数量',
    description: '只汇总问题计数，不保留个人级记录。',
    aggregatedOnly: true,
  },
  {
    type: 'aggregated_severity_summary',
    label: '聚合严重度摘要',
    description: '只汇总低中高阻断级别，不记录个人身份。',
    aggregatedOnly: true,
  },
  {
    type: 'aggregated_iteration_priority_summary',
    label: '聚合迭代优先级摘要',
    description: '只汇总下一轮迭代优先级，不写入训练数据。',
    aggregatedOnly: true,
  },
];

const forbiddenMetadata: Array<{
  type: UserAppEvidenceCollectionForbiddenType;
  label: string;
  reason: string;
}> = [
  { type: 'real_name', label: '真实姓名', reason: '会形成可识别个人资料。' },
  { type: 'phone_number', label: '手机号', reason: '联系方式不得进入试用证据。' },
  { type: 'email', label: '邮箱', reason: '联系方式不得进入试用证据。' },
  { type: 'precise_address', label: '精确地址', reason: '精确身份信息不得收集。' },
  { type: 'face_photo', label: '面部照片', reason: '本阶段不收集照片或面部数据。' },
  { type: 'makeup_photo', label: '妆容照片', reason: '本阶段不上传、不保存妆容照片。' },
  { type: 'skin_health_information', label: '皮肤健康信息', reason: '健康相关信息不得收集。' },
  { type: 'health_condition', label: '健康状况', reason: '健康信息不属于本阶段范围。' },
  { type: 'sensitive_identity', label: '敏感身份', reason: '敏感身份信息不得收集。' },
  { type: 'biometric_identifier', label: '生物识别标识', reason: '生物识别信息不得收集。' },
  { type: 'face_embedding', label: '面部 embedding', reason: '不得生成或保存生物识别向量。' },
  { type: 'raw_camera_data', label: '相机原始数据', reason: '不得调用相机或记录相机数据。' },
  { type: 'uploaded_image', label: '上传图片', reason: '本阶段不上传图片。' },
  { type: 'training_dataset_write', label: '写入训练数据', reason: '试用反馈不得写入训练数据集。' },
  { type: 'social_media_account', label: '社交账号', reason: '社交账号属于可识别资料。' },
  { type: 'payment_information', label: '支付信息', reason: '支付信息完全不在试用范围。' },
  { type: 'account_credential', label: '账号凭据', reason: '本阶段不做账号系统。' },
  { type: 'free_text_identifier', label: '自由文本身份线索', reason: '自由文本不能包含可识别个人线索。' },
];

export const createUserAppEvidenceCollectionAllowedItem = (
  type: UserAppEvidenceCollectionAllowedType,
): UserAppEvidenceCollectionAllowedItem => {
  const metadata = allowedMetadata.find((item) => item.type === type) ?? allowedMetadata[0];
  return {
    itemId: `allowed-${metadata.type}`,
    type: metadata.type,
    label: metadata.label,
    description: metadata.description,
    anonymousOnly: true,
    aggregatedOnly: metadata.aggregatedOnly,
    localOnly: true,
    collectsRealIdentity: false,
    collectsContact: false,
    collectsPhoto: false,
    collectsHealthInfo: false,
    collectsSensitiveIdentity: false,
    collectsBiometric: false,
    requestsUpload: false,
    writesTrainingInput: false,
  };
};

export const createUserAppEvidenceCollectionForbiddenItem = (
  type: UserAppEvidenceCollectionForbiddenType,
  requested = false,
): UserAppEvidenceCollectionForbiddenItem => {
  const metadata =
    forbiddenMetadata.find((item) => item.type === type) ?? forbiddenMetadata[0];
  return {
    itemId: `forbidden-${metadata.type}`,
    type: metadata.type,
    label: metadata.label,
    reason: metadata.reason,
    requested,
    blocking: true,
  };
};

export const createDefaultUserAppEvidenceCollectionParticipantNotice =
  (): UserAppEvidenceCollectionParticipantNotice => ({
    noticeId: 'evidence-collection-notice-v0',
    title: '内部匿名试用说明',
    copy:
      '本次只准备记录匿名观察摘要，不收集照片、不上传、不训练模型、不收集姓名、联系方式、健康信息、敏感身份或生物识别信息。',
    localOnly: true,
    anonymousOnly: true,
    mentionsNoPhoto: true,
    mentionsNoUpload: true,
    mentionsNoTraining: true,
    mentionsNoSensitiveInfo: true,
  });

export const createDefaultUserAppEvidenceCollectionAnonymizationRules =
  (): UserAppEvidenceCollectionAnonymizationRule[] => [
    {
      ruleId: 'anonymize-no-identity',
      label: '不记录身份',
      description: '观察记录只写 participant type 或匿名编号，不写姓名、联系方式或账号。',
      required: true,
    },
    {
      ruleId: 'anonymize-no-photo',
      label: '不记录照片',
      description: '不拍摄、不上传、不保存面部或妆容照片。',
      required: true,
    },
    {
      ruleId: 'anonymize-aggregate-after-session',
      label: '会后聚合',
      description: '会后只保留主题、问题数量、严重度和优先级摘要。',
      required: true,
    },
  ];

export const createDefaultUserAppEvidenceCollectionStopConditions =
  (): UserAppEvidenceCollectionStopCondition[] => [
    {
      conditionId: 'stop-photo-request',
      label: '出现照片或相机请求',
      trigger: '任何人要求拍照、上传图片、打开相机或保存图片。',
      action: '立即停止记录，删除该请求，并重申本阶段不收集照片。',
      blocking: true,
    },
    {
      conditionId: 'stop-identity-request',
      label: '出现真实身份或联系方式请求',
      trigger: '记录中出现姓名、手机号、邮箱、社交账号、地址或账号凭据。',
      action: '立即停止记录并移除可识别信息。',
      blocking: true,
    },
    {
      conditionId: 'stop-health-sensitive',
      label: '出现健康或敏感信息',
      trigger: '记录中出现皮肤健康、健康状况、敏感身份或生物识别内容。',
      action: '停止试用记录，不进入证据包或 project-state。',
      blocking: true,
    },
    {
      conditionId: 'stop-upload-training',
      label: '出现上传或训练用途',
      trigger: '有人要求上传、同步、训练模型、写入数据集或调用 AI 自动分析。',
      action: '暂停推进，回到边界修复。',
      blocking: true,
    },
  ];

export const createDefaultUserAppEvidenceCollectionAllowedItems =
  (): UserAppEvidenceCollectionAllowedItem[] =>
    allowedMetadata.map((item) => createUserAppEvidenceCollectionAllowedItem(item.type));

export const createDefaultUserAppEvidenceCollectionForbiddenItems = (
  requestedForbiddenTypes: readonly UserAppEvidenceCollectionForbiddenType[] = [],
): UserAppEvidenceCollectionForbiddenItem[] =>
  forbiddenMetadata.map((item) =>
    createUserAppEvidenceCollectionForbiddenItem(
      item.type,
      requestedForbiddenTypes.includes(item.type),
    ),
  );

const noticeReady = (
  notice: UserAppEvidenceCollectionParticipantNotice | null,
): boolean =>
  Boolean(
    notice?.localOnly &&
      notice.anonymousOnly &&
      notice.mentionsNoPhoto &&
      notice.mentionsNoUpload &&
      notice.mentionsNoTraining &&
      notice.mentionsNoSensitiveInfo,
  );

const issuesForProtocol = (
  allowedItems: readonly UserAppEvidenceCollectionAllowedItem[],
  forbiddenItems: readonly UserAppEvidenceCollectionForbiddenItem[],
  anonymizationRules: readonly UserAppEvidenceCollectionAnonymizationRule[],
  participantNotice: UserAppEvidenceCollectionParticipantNotice | null,
  stopConditions: readonly UserAppEvidenceCollectionStopCondition[],
): UserAppEvidenceCollectionProtocolIssue[] => {
  const issues: UserAppEvidenceCollectionProtocolIssue[] = [];
  if (forbiddenItems.some((item) => item.requested)) {
    issues.push({
      issueId: 'protocol-issue-forbidden-request',
      severity: 'critical',
      message: '协议中出现禁止收集项请求。',
      mitigation: '删除照片、联系方式、上传、训练、健康、敏感身份或生物识别请求。',
    });
  }
  if (!noticeReady(participantNotice)) {
    issues.push({
      issueId: 'protocol-issue-notice-missing',
      severity: 'critical',
      message: '参与者说明缺失或没有完整说明不收集照片、不上传、不训练、不收集敏感信息。',
      mitigation: '先补齐参与者说明，再开始任何内部 dry run。',
    });
  }
  if (allowedItems.length < allowedMetadata.length) {
    issues.push({
      issueId: 'protocol-issue-allowed-coverage',
      severity: 'medium',
      message: '允许收集的匿名证据类型覆盖不完整。',
      mitigation: '补齐任务完成、步骤理解、模板价值、Shell、隐私和聚合摘要证据类型。',
    });
  }
  if (anonymizationRules.filter((rule) => rule.required).length < 3) {
    issues.push({
      issueId: 'protocol-issue-anonymization-rules',
      severity: 'medium',
      message: '匿名化规则不足。',
      mitigation: '至少保留不记录身份、不记录照片、会后聚合三条规则。',
    });
  }
  if (stopConditions.length < 4) {
    issues.push({
      issueId: 'protocol-issue-stop-conditions',
      severity: 'medium',
      message: '停止条件覆盖不完整。',
      mitigation: '补齐照片/相机、身份/联系方式、健康/敏感、上传/训练停止条件。',
    });
  }
  return issues;
};

const statusFromIssues = (
  issues: readonly UserAppEvidenceCollectionProtocolIssue[],
): UserAppEvidenceCollectionProtocolStatus => {
  if (issues.some((issue) => issue.severity === 'critical')) return 'protocol_blocked';
  if (issues.length > 0) return 'protocol_ready_with_warnings';
  return 'protocol_ready';
};

export const createUserAppEvidenceCollectionProtocol = (
  input: CreateUserAppEvidenceCollectionProtocolInput = {},
): UserAppEvidenceCollectionProtocol => {
  const allowedItems = input.allowedItems ?? createDefaultUserAppEvidenceCollectionAllowedItems();
  const forbiddenItems =
    input.forbiddenItems ??
    createDefaultUserAppEvidenceCollectionForbiddenItems(input.requestedForbiddenTypes);
  const anonymizationRules =
    input.anonymizationRules ?? createDefaultUserAppEvidenceCollectionAnonymizationRules();
  const participantNotice =
    input.participantNotice === undefined
      ? createDefaultUserAppEvidenceCollectionParticipantNotice()
      : input.participantNotice;
  const stopConditions =
    input.stopConditions ?? createDefaultUserAppEvidenceCollectionStopConditions();
  const issues = issuesForProtocol(
    allowedItems,
    forbiddenItems,
    anonymizationRules,
    participantNotice,
    stopConditions,
  );

  return {
    schemaVersion: USER_APP_EVIDENCE_COLLECTION_PROTOCOL_SCHEMA_VERSION,
    protocolId: input.protocolId ?? 'evidence-collection-protocol-v0',
    title: input.title ?? '内部试用证据收集协议',
    status: statusFromIssues(issues),
    allowedItems,
    forbiddenItems,
    anonymizationRules,
    participantNotice,
    stopConditions,
    issues,
    localOnly: true,
    deterministic: true,
    preparationOnly: true,
    collectsRealUserRecords: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsCamera: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
