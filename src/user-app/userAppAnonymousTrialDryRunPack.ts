import {
  createDefaultUserAppEvidenceCollectionAllowedItems,
  createDefaultUserAppEvidenceCollectionForbiddenItems,
  createDefaultUserAppEvidenceCollectionParticipantNotice,
  createDefaultUserAppEvidenceCollectionStopConditions,
  createUserAppEvidenceCollectionProtocol,
  type UserAppEvidenceCollectionForbiddenType,
  type UserAppEvidenceCollectionParticipantNotice,
} from './userAppEvidenceCollectionProtocol';

export const USER_APP_ANONYMOUS_TRIAL_DRY_RUN_PACK_SCHEMA_VERSION =
  'user-app-anonymous-trial-dry-run-pack-v0.1' as const;

export type UserAppAnonymousTrialDryRunScenarioId =
  | 'first_time_beginner_guided_makeup_flow'
  | 'template_discovery_and_selection_flow'
  | 'step_guidance_comprehension_flow'
  | 'privacy_notice_comprehension_flow'
  | 'admin_evidence_capture_rehearsal'
  | 'stop_condition_rehearsal';

export type UserAppAnonymousTrialDryRunStatus =
  | 'dry_run_ready'
  | 'dry_run_ready_with_warnings'
  | 'dry_run_blocked';

export interface UserAppAnonymousTrialDryRunScenario {
  scenarioId: UserAppAnonymousTrialDryRunScenarioId;
  label: string;
  objective: string;
  steps: string[];
  required: boolean;
  ready: boolean;
}

export interface UserAppAnonymousTrialDryRunSession {
  sessionId: string;
  title: string;
  script: string[];
  localOnly: true;
  anonymousOnly: true;
  mockOnly: true;
}

export type UserAppAnonymousTrialDryRunParticipantNotice =
  UserAppEvidenceCollectionParticipantNotice;

export interface UserAppAnonymousTrialDryRunAllowedEvidence {
  evidenceId: string;
  label: string;
  description: string;
  anonymousOnly: true;
  localOnly: true;
  mockEvidenceOnly: true;
}

export interface UserAppAnonymousTrialDryRunForbiddenData {
  dataId: string;
  type: UserAppEvidenceCollectionForbiddenType;
  label: string;
  reason: string;
  requested: boolean;
  blocking: true;
}

export interface UserAppAnonymousTrialDryRunStopCondition {
  conditionId: string;
  label: string;
  trigger: string;
  action: string;
  rehearsed: boolean;
  blocking: true;
}

export interface UserAppAnonymousTrialDryRunIssue {
  issueId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppAnonymousTrialDryRunPack {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_DRY_RUN_PACK_SCHEMA_VERSION;
  packId: string;
  title: string;
  status: UserAppAnonymousTrialDryRunStatus;
  scenarios: UserAppAnonymousTrialDryRunScenario[];
  session: UserAppAnonymousTrialDryRunSession;
  participantNotice: UserAppAnonymousTrialDryRunParticipantNotice | null;
  allowedEvidence: UserAppAnonymousTrialDryRunAllowedEvidence[];
  forbiddenData: UserAppAnonymousTrialDryRunForbiddenData[];
  stopConditions: UserAppAnonymousTrialDryRunStopCondition[];
  issues: UserAppAnonymousTrialDryRunIssue[];
  localOnly: true;
  deterministic: true;
  dryRunOnly: true;
  mockEvidenceOnly: true;
  collectsRealUserRecords: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsCamera: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppAnonymousTrialDryRunPackInput {
  packId?: string;
  title?: string;
  scenarios?: UserAppAnonymousTrialDryRunScenario[];
  session?: UserAppAnonymousTrialDryRunSession;
  participantNotice?: UserAppAnonymousTrialDryRunParticipantNotice | null;
  requestedForbiddenTypes?: UserAppEvidenceCollectionForbiddenType[];
  stopConditions?: UserAppAnonymousTrialDryRunStopCondition[];
}

const scenarioMetadata: Array<{
  scenarioId: UserAppAnonymousTrialDryRunScenarioId;
  label: string;
  objective: string;
  steps: string[];
}> = [
  {
    scenarioId: 'first_time_beginner_guided_makeup_flow',
    label: '新手首次跟练流程',
    objective: '演练新手是否能从首页进入跟练并理解主路径。',
    steps: ['打开本地 shell', '阅读首页推荐', '进入一个模板', '开始跟练'],
  },
  {
    scenarioId: 'template_discovery_and_selection_flow',
    label: '模板发现与选择流程',
    objective: '演练发现入口、推荐理由和模板选择是否清楚。',
    steps: ['进入发现妆容', '查看推荐理由', '选择一个模板', '返回跟练'],
  },
  {
    scenarioId: 'step_guidance_comprehension_flow',
    label: '分步指导理解流程',
    objective: '演练至少三个步骤、工具建议和区域说明是否容易理解。',
    steps: ['开始第 1 步', '完成至少 3 步', '查看工具建议', '查看区域说明'],
  },
  {
    scenarioId: 'privacy_notice_comprehension_flow',
    label: '隐私说明理解流程',
    objective: '演练参与者是否理解不收集照片、不上传、不训练。',
    steps: ['打开隐私说明', '复述边界', '确认没有照片和联系方式记录'],
  },
  {
    scenarioId: 'admin_evidence_capture_rehearsal',
    label: '管理员匿名证据记录演练',
    objective: '演练管理员只记录匿名观察和聚合摘要。',
    steps: ['记录匿名任务完成情况', '记录匿名卡点', '汇总问题数量'],
  },
  {
    scenarioId: 'stop_condition_rehearsal',
    label: '停止条件演练',
    objective: '演练出现照片、联系方式、上传或训练请求时立即停止。',
    steps: ['模拟禁止数据请求', '停止记录', '删除不合规内容', '回到协议修复'],
  },
];

export const createUserAppAnonymousTrialDryRunScenario = (
  scenarioId: UserAppAnonymousTrialDryRunScenarioId,
  ready = true,
): UserAppAnonymousTrialDryRunScenario => {
  const metadata =
    scenarioMetadata.find((scenario) => scenario.scenarioId === scenarioId) ??
    scenarioMetadata[0];
  return {
    scenarioId: metadata.scenarioId,
    label: metadata.label,
    objective: metadata.objective,
    steps: metadata.steps,
    required: true,
    ready,
  };
};

export const createDefaultUserAppAnonymousTrialDryRunScenarios =
  (): UserAppAnonymousTrialDryRunScenario[] =>
    scenarioMetadata.map((scenario) =>
      createUserAppAnonymousTrialDryRunScenario(scenario.scenarioId),
    );

export const createDefaultUserAppAnonymousTrialDryRunSession =
  (): UserAppAnonymousTrialDryRunSession => ({
    sessionId: 'anonymous-dry-run-session-v0',
    title: '匿名内部试用 dry run 演练脚本',
    script: [
      '开场说明：这是匿名、本地、演练阶段，不是真实试用正式开始。',
      '说明边界：不收集照片、不上传、不训练、不收集姓名、联系方式、健康或敏感身份信息。',
      '按场景演练首页、模板发现、模板详情、分步指导、隐私说明和本地进度。',
      '管理员只记录匿名观察、卡点摘要和聚合计数。',
      '触发停止条件时立即停止记录并回到协议修复。',
    ],
    localOnly: true,
    anonymousOnly: true,
    mockOnly: true,
  });

export const createDefaultUserAppAnonymousTrialDryRunAllowedEvidence =
  (): UserAppAnonymousTrialDryRunAllowedEvidence[] =>
    createDefaultUserAppEvidenceCollectionAllowedItems().map((item) => ({
      evidenceId: `dry-run-${item.itemId}`,
      label: item.label,
      description: item.description,
      anonymousOnly: true,
      localOnly: true,
      mockEvidenceOnly: true,
    }));

export const createDefaultUserAppAnonymousTrialDryRunForbiddenData = (
  requestedForbiddenTypes: readonly UserAppEvidenceCollectionForbiddenType[] = [],
): UserAppAnonymousTrialDryRunForbiddenData[] =>
  createDefaultUserAppEvidenceCollectionForbiddenItems(requestedForbiddenTypes).map((item) => ({
    dataId: `dry-run-${item.itemId}`,
    type: item.type,
    label: item.label,
    reason: item.reason,
    requested: item.requested,
    blocking: true,
  }));

export const createDefaultUserAppAnonymousTrialDryRunStopConditions =
  (): UserAppAnonymousTrialDryRunStopCondition[] =>
    createDefaultUserAppEvidenceCollectionStopConditions().map((condition) => ({
      conditionId: `dry-run-${condition.conditionId}`,
      label: condition.label,
      trigger: condition.trigger,
      action: condition.action,
      rehearsed: true,
      blocking: true,
    }));

const createIssues = (
  scenarios: readonly UserAppAnonymousTrialDryRunScenario[],
  participantNotice: UserAppAnonymousTrialDryRunParticipantNotice | null,
  forbiddenData: readonly UserAppAnonymousTrialDryRunForbiddenData[],
  stopConditions: readonly UserAppAnonymousTrialDryRunStopCondition[],
): UserAppAnonymousTrialDryRunIssue[] => {
  const issues: UserAppAnonymousTrialDryRunIssue[] = [];
  if (!participantNotice) {
    issues.push({
      issueId: 'dry-run-missing-notice',
      severity: 'critical',
      message: '缺少 dry run 参与者说明。',
      mitigation: '先补齐匿名、本地、不收集照片、不上传、不训练、不收集敏感信息说明。',
    });
  }
  if (forbiddenData.some((item) => item.requested)) {
    issues.push({
      issueId: 'dry-run-forbidden-data-request',
      severity: 'critical',
      message: 'dry run 中出现禁止数据请求。',
      mitigation: '停止演练并移除照片、联系方式、上传、训练或身份相关请求。',
    });
  }
  if (scenarios.some((scenario) => scenario.required && !scenario.ready)) {
    issues.push({
      issueId: 'dry-run-scenario-warning',
      severity: 'medium',
      message: '存在未准备好的 dry run 场景。',
      mitigation: '补齐场景步骤后再进行完整演练。',
    });
  }
  if (stopConditions.length < 4 || stopConditions.some((condition) => !condition.rehearsed)) {
    issues.push({
      issueId: 'dry-run-stop-condition-warning',
      severity: 'medium',
      message: '停止条件未完整演练。',
      mitigation: '补齐照片、联系方式、上传、训练和真实身份的停止演练。',
    });
  }
  return issues;
};

const statusFromIssues = (
  issues: readonly UserAppAnonymousTrialDryRunIssue[],
): UserAppAnonymousTrialDryRunStatus => {
  if (issues.some((issue) => issue.severity === 'critical')) return 'dry_run_blocked';
  if (issues.length > 0) return 'dry_run_ready_with_warnings';
  return 'dry_run_ready';
};

export const createUserAppAnonymousTrialDryRunPack = (
  input: CreateUserAppAnonymousTrialDryRunPackInput = {},
): UserAppAnonymousTrialDryRunPack => {
  const participantNotice =
    input.participantNotice === undefined
      ? createDefaultUserAppEvidenceCollectionParticipantNotice()
      : input.participantNotice;
  const scenarios = input.scenarios ?? createDefaultUserAppAnonymousTrialDryRunScenarios();
  const forbiddenData = createDefaultUserAppAnonymousTrialDryRunForbiddenData(
    input.requestedForbiddenTypes,
  );
  const stopConditions =
    input.stopConditions ?? createDefaultUserAppAnonymousTrialDryRunStopConditions();
  const issues = createIssues(scenarios, participantNotice, forbiddenData, stopConditions);
  const protocol = createUserAppEvidenceCollectionProtocol({
    participantNotice,
    requestedForbiddenTypes: input.requestedForbiddenTypes,
  });

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_DRY_RUN_PACK_SCHEMA_VERSION,
    packId: input.packId ?? 'anonymous-internal-trial-dry-run-pack-v0',
    title: input.title ?? '匿名内部试用 dry run 演练包',
    status: protocol.status === 'protocol_blocked' ? 'dry_run_blocked' : statusFromIssues(issues),
    scenarios,
    session: input.session ?? createDefaultUserAppAnonymousTrialDryRunSession(),
    participantNotice,
    allowedEvidence: createDefaultUserAppAnonymousTrialDryRunAllowedEvidence(),
    forbiddenData,
    stopConditions,
    issues,
    localOnly: true,
    deterministic: true,
    dryRunOnly: true,
    mockEvidenceOnly: true,
    collectsRealUserRecords: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsCamera: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
