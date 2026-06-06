export const USER_APP_INTERNAL_TRIAL_OPS_SCHEMA_VERSION =
  'user-app-internal-trial-ops-v0.1' as const;

export type UserAppInternalTrialParticipantType =
  | 'complete_beginner'
  | 'light_makeup_user'
  | 'frequent_makeup_user'
  | 'beauty_advisor_or_makeup_reviewer'
  | 'internal_product_reviewer';

export type UserAppInternalTrialOpsStatus =
  | 'ready_for_internal_trial_ops'
  | 'ready_with_warnings'
  | 'blocked';

export type UserAppInternalTrialIssueArea =
  | 'participant_coverage'
  | 'session_plan'
  | 'checklist'
  | 'risk_boundary'
  | 'privacy_collection';

export interface UserAppInternalTrialSessionPlan {
  planId: string;
  title: string;
  steps: string[];
  estimatedMinutes: number;
  localOnly: true;
  notProductionRelease: true;
}

export interface UserAppInternalTrialChecklist {
  checklistId: string;
  title: string;
  items: string[];
  required: boolean;
}

export interface UserAppInternalTrialRisk {
  riskId: string;
  label: string;
  stopCondition: string;
  mitigation: string;
}

export interface UserAppInternalTrialBoundary {
  boundaryId: string;
  label: string;
  rule: string;
  required: true;
}

export interface UserAppInternalTrialOpsIssue {
  issueId: string;
  area: UserAppInternalTrialIssueArea;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppInternalTrialOpsPack {
  schemaVersion: typeof USER_APP_INTERNAL_TRIAL_OPS_SCHEMA_VERSION;
  packId: string;
  title: string;
  status: UserAppInternalTrialOpsStatus;
  participantTypes: UserAppInternalTrialParticipantType[];
  communicationScript: string[];
  sessionPlan: UserAppInternalTrialSessionPlan;
  executionChecklist: UserAppInternalTrialChecklist;
  risks: UserAppInternalTrialRisk[];
  boundaries: UserAppInternalTrialBoundary[];
  issues: UserAppInternalTrialOpsIssue[];
  summary: string;
  localOnly: true;
  deterministic: true;
  internalTrialOnly: true;
  productionRelease: false;
  appStoreRelease: false;
  backendForm: boolean;
  usesAnalytics: boolean;
  usesCamera: boolean;
  usesAr: boolean;
  collectsRealName: boolean;
  collectsContact: boolean;
  collectsPhoto: boolean;
  collectsHealthInfo: boolean;
  collectsSensitiveIdentity: boolean;
  collectsBiometrics: boolean;
  writesTrainingInput: boolean;
  writesProjectStateUserRecords: boolean;
  mutatesTemplatePackage: boolean;
}

export interface CreateUserAppInternalTrialOpsPackInput {
  packId?: string;
  title?: string;
  participantTypes?: UserAppInternalTrialParticipantType[];
  communicationScript?: string[];
  sessionPlan?: UserAppInternalTrialSessionPlan;
  executionChecklist?: UserAppInternalTrialChecklist;
  risks?: UserAppInternalTrialRisk[];
  boundaries?: UserAppInternalTrialBoundary[];
  collectsRealName?: boolean;
  collectsContact?: boolean;
  collectsPhoto?: boolean;
  collectsHealthInfo?: boolean;
  collectsSensitiveIdentity?: boolean;
  collectsBiometrics?: boolean;
  writesTrainingInput?: boolean;
  writesProjectStateUserRecords?: boolean;
  mutatesTemplatePackage?: boolean;
  usesBackendForm?: boolean;
  usesAnalytics?: boolean;
  usesCamera?: boolean;
  usesAr?: boolean;
}

const requiredParticipantTypes: UserAppInternalTrialParticipantType[] = [
  'complete_beginner',
  'light_makeup_user',
  'frequent_makeup_user',
  'beauty_advisor_or_makeup_reviewer',
  'internal_product_reviewer',
];

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 67);

const issue = (
  input: Omit<UserAppInternalTrialOpsIssue, 'issueId'>,
): UserAppInternalTrialOpsIssue => ({
  ...input,
  issueId: `internal-trial-ops-${input.area}-${input.severity}-${Math.abs(
    hashText(input.message),
  )}`,
});

const statusFromIssues = (
  issues: readonly UserAppInternalTrialOpsIssue[],
): UserAppInternalTrialOpsStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'ready_with_warnings';
  return 'ready_for_internal_trial_ops';
};

export const createDefaultInternalTrialParticipantTypes =
  (): UserAppInternalTrialParticipantType[] => [...requiredParticipantTypes];

export const createDefaultInternalTrialSessionPlan =
  (): UserAppInternalTrialSessionPlan => ({
    planId: 'internal-trial-session-plan-v0',
    title: '内部小范围试用流程',
    steps: [
      '开场说明：这是本地 Web/PWA 原型，不是正式发布。',
      '提醒参与者不要提供姓名、联系方式、照片、健康或敏感身份信息。',
      '引导参与者打开 shell，并观察其是否理解首页。',
      '按 Phase 8C 试用任务完成推荐、详情、跟练、工具、区域和隐私路径。',
      '记录观察信号和阻断点，只写匿名/汇总化现象。',
      '结束时整理是否继续、修改内容、修改 shell 或暂停试用。',
    ],
    estimatedMinutes: 35,
    localOnly: true,
    notProductionRelease: true,
  });

export const createDefaultInternalTrialChecklist =
  (): UserAppInternalTrialChecklist => ({
    checklistId: 'internal-trial-execution-checklist-v0',
    title: '试用执行 checklist',
    required: true,
    items: [
      '确认 Phase 8E go/no-go 不是 no_go。',
      '确认试用模板至少包含一个 beginner / short / natural-daily 核心模板。',
      '确认参与者只按类型筛选，不记录真实身份资料。',
      '确认设备不请求相机权限、不启用上传、不启用 AR。',
      '确认反馈只使用本地文档化结构，不提交后端。',
      '确认观察记录不写入 project-state 或训练数据。',
    ],
  });

export const createDefaultInternalTrialRisks = (): UserAppInternalTrialRisk[] => [
  {
    riskId: 'sensitive-data-risk',
    label: '敏感信息误收集',
    stopCondition: '参与者被要求或主动填写真实姓名、联系方式、照片、健康或敏感身份信息。',
    mitigation: '立即停止记录，删除该信息，只保留匿名化体验现象。',
  },
  {
    riskId: 'scope-expansion-risk',
    label: '试用范围膨胀',
    stopCondition: '试用中需要后端、analytics、相机、AR、上传或训练才能继续。',
    mitigation: '暂停试用，回到 phase gate 重新定义范围。',
  },
  {
    riskId: 'copy-confusion-risk',
    label: '用户路径无法理解',
    stopCondition: '多名参与者无法找到推荐、开始跟练或理解隐私说明。',
    mitigation: '进入内容或 shell 修订，不扩大试用规模。',
  },
];

export const createDefaultInternalTrialBoundaries =
  (): UserAppInternalTrialBoundary[] => [
    {
      boundaryId: 'not-production-release',
      label: '不是正式发布',
      rule: '9A 只准备内部小范围试用运营材料，不启动线上增长、App Store/TestFlight 或生产发布。',
      required: true,
    },
    {
      boundaryId: 'no-sensitive-collection',
      label: '不收集敏感信息',
      rule: '不得收集真实姓名、联系方式、照片、健康信息、敏感身份信息或生物识别信息。',
      required: true,
    },
    {
      boundaryId: 'no-runtime-expansion',
      label: '不扩展运行时',
      rule: '不得新增后端、数据库、账号、云同步、analytics、相机、AR、OpenAI/外部 API 或训练流程。',
      required: true,
    },
    {
      boundaryId: 'contract-read-only',
      label: '合同只读',
      rule: '试用运营、观察记录和结果复盘不能修改 UserAppTemplatePackage。',
      required: true,
    },
  ];

export const validateUserAppInternalTrialOpsPack = (
  pack: UserAppInternalTrialOpsPack,
): UserAppInternalTrialOpsIssue[] => {
  const issues: UserAppInternalTrialOpsIssue[] = [];
  const missingParticipantTypes = requiredParticipantTypes.filter(
    (participantType) => !pack.participantTypes.includes(participantType),
  );

  if (missingParticipantTypes.length > 0) {
    issues.push(
      issue({
        area: 'participant_coverage',
        severity: 'warning',
        message: `参与者类型覆盖不完整：${missingParticipantTypes.join(', ')}`,
        recommendation: '补齐新手、轻度用户、高频用户、懂妆 reviewer 和内部产品 reviewer。',
      }),
    );
  }

  if (pack.sessionPlan.steps.length < 5 || pack.sessionPlan.estimatedMinutes <= 0) {
    issues.push(
      issue({
        area: 'session_plan',
        severity: 'blocking',
        message: '内部试用流程不完整。',
        recommendation: '补齐开场说明、任务执行、观察记录、反馈整理和结束复盘。',
      }),
    );
  }

  if (pack.executionChecklist.items.length < 5) {
    issues.push(
      issue({
        area: 'checklist',
        severity: 'blocking',
        message: '试用执行 checklist 不完整。',
        recommendation: '加入 no-go、模板、参与者、设备、反馈和记录边界检查。',
      }),
    );
  }

  if (pack.risks.length < 3 || pack.boundaries.length < 4) {
    issues.push(
      issue({
        area: 'risk_boundary',
        severity: 'blocking',
        message: '风险、暂停条件或边界说明不足。',
        recommendation: '至少覆盖敏感信息、范围膨胀、用户理解失败和合同只读边界。',
      }),
    );
  }

  if (
    pack.backendForm ||
    pack.usesAnalytics ||
    pack.usesCamera ||
    pack.usesAr ||
    pack.collectsRealName ||
    pack.collectsContact ||
    pack.collectsPhoto ||
    pack.collectsHealthInfo ||
    pack.collectsSensitiveIdentity ||
    pack.collectsBiometrics ||
    pack.writesTrainingInput ||
    pack.writesProjectStateUserRecords ||
    pack.mutatesTemplatePackage
  ) {
    issues.push(
      issue({
        area: 'privacy_collection',
        severity: 'blocking',
        message: '试用运营包试图收集敏感信息、扩展运行时或写入真实用户记录。',
        recommendation: '9A 只能保留本地文档化运营模板和 mock/example，不接后端、不采集照片、不训练。',
      }),
    );
  }

  return issues;
};

export const createUserAppInternalTrialOpsPack = (
  input: CreateUserAppInternalTrialOpsPackInput = {},
): UserAppInternalTrialOpsPack => {
  const packBase = {
    schemaVersion: USER_APP_INTERNAL_TRIAL_OPS_SCHEMA_VERSION,
    packId: input.packId ?? 'internal-trial-ops-pack-v0',
    title: input.title ?? '内部小范围试用运营包',
    status: 'blocked' as UserAppInternalTrialOpsStatus,
    participantTypes: input.participantTypes ?? createDefaultInternalTrialParticipantTypes(),
    communicationScript:
      input.communicationScript ?? [
        '这次试用只看你是否能理解和愿意跟练，不是正式发布。',
        '请不要提供姓名、联系方式、照片、健康信息或敏感身份信息。',
        '当前不会上传、不会训练、不会启用相机或 AR，也没有后端账号。',
      ],
    sessionPlan: input.sessionPlan ?? createDefaultInternalTrialSessionPlan(),
    executionChecklist: input.executionChecklist ?? createDefaultInternalTrialChecklist(),
    risks: input.risks ?? createDefaultInternalTrialRisks(),
    boundaries: input.boundaries ?? createDefaultInternalTrialBoundaries(),
    issues: [] as UserAppInternalTrialOpsIssue[],
    summary: '',
    localOnly: true,
    deterministic: true,
    internalTrialOnly: true,
    productionRelease: false,
    appStoreRelease: false,
    backendForm: Boolean(input.usesBackendForm),
    usesAnalytics: Boolean(input.usesAnalytics),
    usesCamera: Boolean(input.usesCamera),
    usesAr: Boolean(input.usesAr),
    collectsRealName: Boolean(input.collectsRealName),
    collectsContact: Boolean(input.collectsContact),
    collectsPhoto: Boolean(input.collectsPhoto),
    collectsHealthInfo: Boolean(input.collectsHealthInfo),
    collectsSensitiveIdentity: Boolean(input.collectsSensitiveIdentity),
    collectsBiometrics: Boolean(input.collectsBiometrics),
    writesTrainingInput: Boolean(input.writesTrainingInput),
    writesProjectStateUserRecords: Boolean(input.writesProjectStateUserRecords),
    mutatesTemplatePackage: Boolean(input.mutatesTemplatePackage),
  } satisfies Omit<UserAppInternalTrialOpsPack, 'summary'> & { summary: string };

  const issues = validateUserAppInternalTrialOpsPack(packBase);
  const status = statusFromIssues(issues);
  return {
    ...packBase,
    status,
    issues,
    summary:
      status === 'ready_for_internal_trial_ops'
        ? '内部试用运营包已覆盖参与者类型、流程、沟通话术、checklist、风险和边界。'
        : status === 'ready_with_warnings'
          ? '内部试用运营包可用于准备，但需要在试用前补齐 warning。'
          : '内部试用运营包存在阻断项，不能进入真实参与者试用准备。',
  };
};

export const summarizeUserAppInternalTrialOpsPack = (
  pack: UserAppInternalTrialOpsPack,
): string =>
  [
    `status: ${pack.status}`,
    `participantTypes: ${pack.participantTypes.length}`,
    `issues: ${pack.issues.length}`,
    `localOnly: ${String(pack.localOnly)}`,
    `collectsPhoto: ${String(pack.collectsPhoto)}`,
    `writesTrainingInput: ${String(pack.writesTrainingInput)}`,
  ].join('\n');
