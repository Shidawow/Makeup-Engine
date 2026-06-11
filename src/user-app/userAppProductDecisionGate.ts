import {
  createUserAppInternalTrialLearningSummary,
  type UserAppInternalTrialLearningSummary,
} from './userAppInternalTrialLearningSummary';
import type { UserAppTrialIssueCategory } from './userAppTrialIssueTaxonomy';

export const USER_APP_PRODUCT_DECISION_GATE_SCHEMA_VERSION =
  'user-app-product-decision-gate-v0.1' as const;

export type UserAppProductDecisionGateDecision =
  | 'continue_internal_trials'
  | 'revise_template_content_first'
  | 'revise_user_app_shell_first'
  | 'revise_trial_ops_first'
  | 'pause_for_privacy_or_scope_fix'
  | 'prepare_mvp_validation_plan'
  | 'prepare_production_app_discovery'
  | 'no_go';

export type UserAppProductDecisionGateStatus =
  | 'product_decision_ready'
  | 'product_decision_needs_more_evidence'
  | 'product_decision_blocked';

export interface UserAppProductDecisionGateSignal {
  signalId: string;
  category: UserAppTrialIssueCategory | 'user_value' | 'iteration_readiness';
  summary: string;
  weight: number;
  anonymousOrExampleOnly: true;
}

export interface UserAppProductDecisionGateRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  blocksProductionApp: boolean;
}

export interface UserAppProductDecisionGateRecommendation {
  recommendationId: string;
  decision: UserAppProductDecisionGateDecision;
  message: string;
  nextAction: string;
}

export interface UserAppProductDecisionGate {
  schemaVersion: typeof USER_APP_PRODUCT_DECISION_GATE_SCHEMA_VERSION;
  gateId: string;
  title: string;
  status: UserAppProductDecisionGateStatus;
  decision: UserAppProductDecisionGateDecision;
  rationale: string[];
  signals: UserAppProductDecisionGateSignal[];
  risks: UserAppProductDecisionGateRisk[];
  recommendation: UserAppProductDecisionGateRecommendation;
  learningSummary: UserAppInternalTrialLearningSummary;
  productionAppDiscoveryOnly: boolean;
  productionBuildApproved: false;
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  anonymousOrExampleOnly: true;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppProductDecisionGateInput {
  gateId?: string;
  title?: string;
  learningSummary?: UserAppInternalTrialLearningSummary;
  minimumSignals?: number;
  strongValueSignal?: boolean;
  productionDiscoveryRequested?: boolean;
  noGo?: boolean;
}

const countIssues = (
  summary: UserAppInternalTrialLearningSummary,
  categories: readonly UserAppTrialIssueCategory[],
): number =>
  categories.reduce(
    (total, category) => total + summary.resultReview.issueSummary.categoryCounts[category],
    0,
  );

const hasBoundaryBlocker = (summary: UserAppInternalTrialLearningSummary): boolean =>
  summary.status === 'learning_summary_blocked' ||
  summary.risks.some((risk) => risk.severity === 'critical') ||
  countIssues(summary, ['blocked_boundary_issue', 'privacy_copy_issue']) > 0;

const hasStrongUserValue = (
  summary: UserAppInternalTrialLearningSummary,
  override?: boolean,
): boolean =>
  Boolean(override) ||
  summary.signals.some(
    (signal) => signal.theme === 'user_value_signal' && signal.strength === 'strong',
  );

const hasHighIterationReadiness = (summary: UserAppInternalTrialLearningSummary): boolean =>
  summary.iterationPlan.status === 'iteration_ready' ||
  summary.iterationPlan.nextInternalTrialReady;

const signalsFromSummary = (
  summary: UserAppInternalTrialLearningSummary,
): UserAppProductDecisionGateSignal[] => [
  {
    signalId: 'decision-signal-user-value',
    category: 'user_value',
    summary: hasStrongUserValue(summary)
      ? '匿名/示例信号显示用户能理解模板价值。'
      : '用户价值信号仍需要更多内部试用证据。',
    weight: hasStrongUserValue(summary) ? 3 : 1,
    anonymousOrExampleOnly: true,
  },
  {
    signalId: 'decision-signal-content',
    category: 'content_issue',
    summary: `内容相关问题数量：${countIssues(summary, [
      'content_issue',
      'guidance_clarity_issue',
      'recommendation_issue',
      'template_selection_issue',
    ])}`,
    weight: countIssues(summary, [
      'content_issue',
      'guidance_clarity_issue',
      'recommendation_issue',
      'template_selection_issue',
    ]),
    anonymousOrExampleOnly: true,
  },
  {
    signalId: 'decision-signal-shell',
    category: 'shell_usability_issue',
    summary: `Shell 可用性问题数量：${countIssues(summary, ['shell_usability_issue'])}`,
    weight: countIssues(summary, ['shell_usability_issue']),
    anonymousOrExampleOnly: true,
  },
  {
    signalId: 'decision-signal-trial-ops',
    category: 'trial_ops_issue',
    summary: `试用流程问题数量：${countIssues(summary, ['trial_ops_issue'])}`,
    weight: countIssues(summary, ['trial_ops_issue']),
    anonymousOrExampleOnly: true,
  },
  {
    signalId: 'decision-signal-iteration-readiness',
    category: 'iteration_readiness',
    summary: hasHighIterationReadiness(summary)
      ? '9C 迭代计划显示下一轮内部试用准备度较高。'
      : '9C 迭代计划仍有警告或待补证据。',
    weight: hasHighIterationReadiness(summary) ? 3 : 1,
    anonymousOrExampleOnly: true,
  },
];

const risksFromSummary = (
  summary: UserAppInternalTrialLearningSummary,
): UserAppProductDecisionGateRisk[] => {
  if (hasBoundaryBlocker(summary)) {
    return [
      {
        riskId: 'product-decision-risk-boundary',
        severity: 'critical',
        message: '存在隐私、敏感数据、上传、后端、AI 分析、训练或范围边界阻断。',
        blocksProductionApp: true,
      },
    ];
  }
  return [
    {
      riskId: 'product-decision-risk-overclaim',
      severity: 'medium',
      message: '当前仍是匿名/mock/example 级内部试用学习，不能直接推导生产 App 开发。',
      blocksProductionApp: true,
    },
  ];
};

const decide = (
  summary: UserAppInternalTrialLearningSummary,
  input: CreateUserAppProductDecisionGateInput,
): {
  status: UserAppProductDecisionGateStatus;
  decision: UserAppProductDecisionGateDecision;
  rationale: string[];
} => {
  if (input.noGo) {
    return {
      status: 'product_decision_blocked',
      decision: 'no_go',
      rationale: ['产品决策门被显式标记为 no-go。'],
    };
  }
  if (hasBoundaryBlocker(summary)) {
    return {
      status: 'product_decision_blocked',
      decision: 'pause_for_privacy_or_scope_fix',
      rationale: ['发现隐私、敏感数据、上传、训练、后端或范围边界风险，必须暂停。'],
    };
  }

  const minimumSignals = input.minimumSignals ?? 8;
  if (summary.signals.length < minimumSignals) {
    return {
      status: 'product_decision_needs_more_evidence',
      decision: 'continue_internal_trials',
      rationale: ['学习信号不足，继续内部试用或补充匿名证据，不过度判断。'],
    };
  }

  const contentIssues = countIssues(summary, [
    'content_issue',
    'guidance_clarity_issue',
    'recommendation_issue',
    'template_selection_issue',
  ]);
  const shellIssues = countIssues(summary, ['shell_usability_issue']);
  const trialOpsIssues = countIssues(summary, ['trial_ops_issue']);

  if (contentIssues >= 2) {
    return {
      status: 'product_decision_ready',
      decision: 'revise_template_content_first',
      rationale: ['模板内容、跟练说明、推荐或模板选择问题占主导，先修内容。'],
    };
  }
  if (shellIssues >= 2) {
    return {
      status: 'product_decision_ready',
      decision: 'revise_user_app_shell_first',
      rationale: ['Shell 可用性问题占主导，先修移动 Web Shell。'],
    };
  }
  if (trialOpsIssues >= 2) {
    return {
      status: 'product_decision_ready',
      decision: 'revise_trial_ops_first',
      rationale: ['试用流程问题占主导，先修 trial ops。'],
    };
  }
  if (input.productionDiscoveryRequested) {
    return {
      status: 'product_decision_ready',
      decision: 'prepare_production_app_discovery',
      rationale: ['可以探索 production app 方向，但只能做 discovery planning，不等于开始开发。'],
    };
  }
  if (hasStrongUserValue(summary, input.strongValueSignal) && hasHighIterationReadiness(summary)) {
    return {
      status: 'product_decision_ready',
      decision: 'prepare_mvp_validation_plan',
      rationale: ['用户价值信号较强、无 critical blocker，且迭代准备度较高。'],
    };
  }
  return {
    status: 'product_decision_needs_more_evidence',
    decision: 'continue_internal_trials',
    rationale: ['没有足够强的推进或修订信号，继续内部小范围试用。'],
  };
};

const recommendationForDecision = (
  decision: UserAppProductDecisionGateDecision,
): UserAppProductDecisionGateRecommendation => {
  const messageByDecision: Record<UserAppProductDecisionGateDecision, string> = {
    continue_internal_trials: '继续内部小范围试用，补充匿名/示例证据。',
    revise_template_content_first: '先修订模板内容、步骤、区域说明、工具/产品和推荐理由。',
    revise_user_app_shell_first: '先修订 User App Shell 的首页、导航、按钮、状态和管理员分区。',
    revise_trial_ops_first: '先修订试用脚本、观察模板和反馈整理方式。',
    pause_for_privacy_or_scope_fix: '暂停试用推进，先修复隐私或范围边界。',
    prepare_mvp_validation_plan: '准备 Phase 10A MVP Validation Plan，但仍不做生产发布。',
    prepare_production_app_discovery:
      '准备 production app discovery planning；这不是 production build approval。',
    no_go: '停止当前方向，等待产品负责人重新定义目标和边界。',
  };

  return {
    recommendationId: `product-decision-${decision}`,
    decision,
    message: messageByDecision[decision],
    nextAction:
      decision === 'prepare_production_app_discovery'
        ? '只输出探索问题、风险和 gate，不创建生产 App、后端、相机或 AR。'
        : '保持本地、匿名、示例级，不上传、不训练、不写真实用户记录。',
  };
};

export const createUserAppProductDecisionGate = (
  input: CreateUserAppProductDecisionGateInput = {},
): UserAppProductDecisionGate => {
  const learningSummary =
    input.learningSummary ?? createUserAppInternalTrialLearningSummary();
  const result = decide(learningSummary, input);

  return {
    schemaVersion: USER_APP_PRODUCT_DECISION_GATE_SCHEMA_VERSION,
    gateId: input.gateId ?? 'internal-trial-product-decision-gate-v0',
    title: input.title ?? '产品决策门',
    status: result.status,
    decision: result.decision,
    rationale: result.rationale,
    signals: signalsFromSummary(learningSummary),
    risks: risksFromSummary(learningSummary),
    recommendation: recommendationForDecision(result.decision),
    learningSummary,
    productionAppDiscoveryOnly: result.decision === 'prepare_production_app_discovery',
    productionBuildApproved: false,
    localOnly: true,
    deterministic: true,
    mockOnly: true,
    anonymousOrExampleOnly: true,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
