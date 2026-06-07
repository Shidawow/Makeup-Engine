import type { UserAppTrialDecisionFramework } from './userAppTrialDecisionFramework';
import { createUserAppTrialDecisionFramework } from './userAppTrialDecisionFramework';
import {
  createUserAppTrialIterationBacklog,
  type UserAppTrialIterationBacklog,
  type UserAppTrialIterationBacklogItem,
  type UserAppTrialIterationOwnerArea,
} from './userAppTrialIterationBacklog';
import type { UserAppTrialIssueSummary } from './userAppTrialIssueTaxonomy';

export const USER_APP_TRIAL_ITERATION_PLAN_SCHEMA_VERSION =
  'user-app-trial-iteration-plan-v0.1' as const;

export type UserAppTrialIterationStatus =
  | 'iteration_ready'
  | 'iteration_ready_with_warnings'
  | 'iteration_blocked';

export type UserAppTrialIterationWorkstream =
  | 'template_content_iteration'
  | 'user_app_shell_iteration'
  | 'trial_pack_iteration'
  | 'privacy_boundary_iteration'
  | 'discovery_recommendation_iteration'
  | 'session_preference_iteration'
  | 'no_action_observe_more';

export interface UserAppTrialIterationGoal {
  goalId: string;
  workstream: UserAppTrialIterationWorkstream;
  title: string;
  successCriteria: string[];
}

export interface UserAppTrialIterationAction {
  actionId: string;
  workstream: UserAppTrialIterationWorkstream;
  title: string;
  nextStep: string;
  targetIteration: string;
  acceptanceCriteria: string[];
}

export interface UserAppTrialIterationRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppTrialIterationPlan {
  schemaVersion: typeof USER_APP_TRIAL_ITERATION_PLAN_SCHEMA_VERSION;
  planId: string;
  title: string;
  status: UserAppTrialIterationStatus;
  goals: UserAppTrialIterationGoal[];
  workstreams: UserAppTrialIterationWorkstream[];
  actions: UserAppTrialIterationAction[];
  risks: UserAppTrialIterationRisk[];
  backlog: UserAppTrialIterationBacklog;
  decisionFramework: UserAppTrialDecisionFramework;
  nextInternalTrialReady: boolean;
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  anonymousOrExampleOnly: true;
  productionRelease: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppTrialIterationPlanInput {
  planId?: string;
  title?: string;
  backlog?: UserAppTrialIterationBacklog;
  issueSummary?: UserAppTrialIssueSummary;
  decisionFramework?: UserAppTrialDecisionFramework;
  readyForNextInternalTrial?: boolean;
}

const workstreamByOwnerArea: Record<UserAppTrialIterationOwnerArea, UserAppTrialIterationWorkstream> = {
  template_content: 'template_content_iteration',
  user_app_shell: 'user_app_shell_iteration',
  trial_pack: 'trial_pack_iteration',
  privacy_boundary: 'privacy_boundary_iteration',
  discovery_recommendation: 'discovery_recommendation_iteration',
  session_preference: 'session_preference_iteration',
  observe_more: 'no_action_observe_more',
};

const workstreamForItem = (
  item: UserAppTrialIterationBacklogItem,
): UserAppTrialIterationWorkstream =>
  item.priorityRecommendation.priority === 'observe_more'
    ? 'no_action_observe_more'
    : workstreamByOwnerArea[item.ownerArea];

const workstreamTitle: Record<UserAppTrialIterationWorkstream, string> = {
  template_content_iteration: '模板内容迭代',
  user_app_shell_iteration: 'App Shell 体验迭代',
  trial_pack_iteration: '试用包迭代',
  privacy_boundary_iteration: '隐私与边界修复',
  discovery_recommendation_iteration: '发现与推荐迭代',
  session_preference_iteration: '本地进度与偏好迭代',
  no_action_observe_more: '继续观察',
};

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 113);

const uniqueWorkstreams = (
  items: readonly UserAppTrialIterationBacklogItem[],
  readyForNextInternalTrial: boolean,
): UserAppTrialIterationWorkstream[] => {
  const streams = items.map(workstreamForItem);
  if (streams.length === 0 || readyForNextInternalTrial) {
    streams.push('no_action_observe_more');
  }
  return Array.from(new Set(streams));
};

const goalForWorkstream = (
  workstream: UserAppTrialIterationWorkstream,
  items: readonly UserAppTrialIterationBacklogItem[],
): UserAppTrialIterationGoal => {
  const related = items.filter((item) => workstreamForItem(item) === workstream);
  const defaultCriteria =
    workstream === 'no_action_observe_more'
      ? ['下一轮继续收集匿名示例信号，不扩大范围。']
      : ['完成对应 backlog item 的验收标准后再进入下一轮内部试用。'];

  const relatedCriteria = related.flatMap((item) => item.acceptanceCriteria).slice(0, 4);

  return {
    goalId: `trial-iteration-goal-${workstream}`,
    workstream,
    title: workstreamTitle[workstream],
    successCriteria: relatedCriteria.length > 0 ? relatedCriteria : defaultCriteria,
  };
};

const actionFromItem = (item: UserAppTrialIterationBacklogItem): UserAppTrialIterationAction => {
  const workstream = workstreamForItem(item);

  return {
    actionId: `trial-iteration-action-${Math.abs(hashText(item.itemId))}`,
    workstream,
    title: item.title,
    nextStep: item.priorityRecommendation.nextAction,
    targetIteration: item.targetIteration,
    acceptanceCriteria: item.acceptanceCriteria,
  };
};

const observeAction = (): UserAppTrialIterationAction => ({
  actionId: 'trial-iteration-action-observe-more',
  workstream: 'no_action_observe_more',
  title: '准备下一轮内部试用观察',
  nextStep: '继续使用匿名/示例级复盘框架，观察是否还有内容、Shell、试用流程或边界问题。',
  targetIteration: 'next_internal_trial',
  acceptanceCriteria: [
    '下一轮仍不收集真实姓名、联系方式、照片、健康或敏感身份信息。',
    '不上传、不训练、不写入真实用户 trial records。',
  ],
});

const risksFromBacklog = (
  backlog: UserAppTrialIterationBacklog,
): UserAppTrialIterationRisk[] => {
  if (backlog.status === 'backlog_blocked') {
    return [
      {
        riskId: 'trial-iteration-risk-boundary-blocked',
        severity: 'critical',
        message: '存在隐私、敏感数据、后端、上传、AI 分析、训练或范围边界风险。',
        mitigation: '暂停下一轮试用，先完成 privacy_boundary_iteration 并重新验收。',
      },
    ];
  }
  if (backlog.items.some((item) => item.priorityRecommendation.priority === 'observe_more')) {
    return [
      {
        riskId: 'trial-iteration-risk-low-confidence',
        severity: 'medium',
        message: '部分问题置信度不足，直接修复可能过度反应。',
        mitigation: '进入 no_action_observe_more，只补充匿名示例信号。',
      },
    ];
  }
  if (backlog.items.length > 0) {
    return [
      {
        riskId: 'trial-iteration-risk-scope-creep',
        severity: 'low',
        message: '迭代计划可能被误读为正式产品 roadmap 或生产发布计划。',
        mitigation: '保持本地、匿名、示例级说明，不接后端、不发布、不训练。',
      },
    ];
  }
  return [
    {
      riskId: 'trial-iteration-risk-evidence-small',
      severity: 'low',
      message: '当前只是内部小范围试用迭代计划，证据规模有限。',
      mitigation: '继续小范围内部试用并使用匿名复盘框架。',
    },
  ];
};

const statusFromBacklog = (
  backlog: UserAppTrialIterationBacklog,
  readyForNextInternalTrial: boolean,
): UserAppTrialIterationStatus => {
  if (backlog.status === 'backlog_blocked') return 'iteration_blocked';
  if (backlog.items.length > 0 || !readyForNextInternalTrial) {
    return 'iteration_ready_with_warnings';
  }
  return 'iteration_ready';
};

export const createUserAppTrialIterationPlan = (
  input: CreateUserAppTrialIterationPlanInput = {},
): UserAppTrialIterationPlan => {
  const decisionFramework = input.decisionFramework ?? createUserAppTrialDecisionFramework();
  const backlog =
    input.backlog ??
    createUserAppTrialIterationBacklog({
      issueSummary: input.issueSummary ?? decisionFramework.issueSummary,
    });
  const readyForNextInternalTrial = Boolean(input.readyForNextInternalTrial);
  const workstreams = uniqueWorkstreams(backlog.items, readyForNextInternalTrial);
  const actions = backlog.items.map(actionFromItem);
  if (actions.length === 0 || workstreams.includes('no_action_observe_more')) {
    actions.push(observeAction());
  }

  return {
    schemaVersion: USER_APP_TRIAL_ITERATION_PLAN_SCHEMA_VERSION,
    planId: input.planId ?? 'internal-trial-iteration-plan-v0',
    title: input.title ?? '内部试用迭代计划',
    status: statusFromBacklog(backlog, readyForNextInternalTrial),
    goals: workstreams.map((workstream) => goalForWorkstream(workstream, backlog.items)),
    workstreams,
    actions,
    risks: risksFromBacklog(backlog),
    backlog,
    decisionFramework,
    nextInternalTrialReady:
      readyForNextInternalTrial && backlog.status !== 'backlog_blocked',
    localOnly: true,
    deterministic: true,
    mockOnly: true,
    anonymousOrExampleOnly: true,
    productionRelease: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
