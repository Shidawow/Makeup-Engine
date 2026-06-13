import {
  createUserAppAnonymousTrialLaunchReadiness,
  type UserAppAnonymousTrialLaunchReadiness,
} from './userAppAnonymousTrialLaunchReadiness';

export const USER_APP_ANONYMOUS_TRIAL_POST_LAUNCH_HANDOFF_SCHEMA_VERSION =
  'user-app-anonymous-trial-post-launch-handoff-v0.1' as const;

export type UserAppAnonymousTrialPostLaunchHandoffStatus =
  | 'post_launch_handoff_ready'
  | 'post_launch_handoff_ready_with_gaps'
  | 'post_launch_handoff_stopped';

export interface UserAppAnonymousTrialPostLaunchEvidenceHandoff {
  handoffId: string;
  label: string;
  anonymousEvidenceCollected: string[];
  evidenceGaps: string[];
  stoppedSessionReason?: string;
  privacyIncidents: string[];
  issueSummaryHandoff: string[];
  decisionGateHandoff: string[];
  nextPhaseRecommendation: string;
  localOnly: true;
  anonymousOnly: true;
  mockTemplateOnly: true;
}

export interface UserAppAnonymousTrialPostLaunchReviewStep {
  stepId: string;
  label: string;
  owner: 'admin' | 'product_reviewer' | 'privacy_reviewer';
  required: boolean;
  completed: boolean;
}

export interface UserAppAnonymousTrialPostLaunchRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppAnonymousTrialPostLaunchRecommendation {
  recommendationId: string;
  status: UserAppAnonymousTrialPostLaunchHandoffStatus;
  message: string;
  nextAction: string;
}

export interface UserAppAnonymousTrialPostLaunchHandoff {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_POST_LAUNCH_HANDOFF_SCHEMA_VERSION;
  handoffId: string;
  title: string;
  status: UserAppAnonymousTrialPostLaunchHandoffStatus;
  launchReadiness: UserAppAnonymousTrialLaunchReadiness;
  evidenceHandoff: UserAppAnonymousTrialPostLaunchEvidenceHandoff;
  reviewSteps: UserAppAnonymousTrialPostLaunchReviewStep[];
  risks: UserAppAnonymousTrialPostLaunchRisk[];
  recommendation: UserAppAnonymousTrialPostLaunchRecommendation;
  localOnly: true;
  deterministic: true;
  templateOnly: true;
  productionBuildApproved: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppAnonymousTrialPostLaunchHandoffInput {
  handoffId?: string;
  title?: string;
  launchReadiness?: UserAppAnonymousTrialLaunchReadiness;
  evidenceHandoff?: UserAppAnonymousTrialPostLaunchEvidenceHandoff;
  reviewSteps?: UserAppAnonymousTrialPostLaunchReviewStep[];
}

export const createDefaultUserAppAnonymousTrialPostLaunchEvidenceHandoff =
  (): UserAppAnonymousTrialPostLaunchEvidenceHandoff => ({
    handoffId: 'anonymous-trial-post-launch-evidence-handoff-v0',
    label: '匿名内部试用后证据交接模板',
    anonymousEvidenceCollected: [
      '匿名任务完成摘要',
      '匿名步骤理解摘要',
      '匿名模板价值摘要',
      '匿名 Shell 可用性摘要',
      '匿名推荐有用性摘要',
      '匿名隐私清晰度摘要',
      '聚合问题数量和严重度摘要',
    ],
    evidenceGaps: [],
    privacyIncidents: [],
    issueSummaryHandoff: [
      '按内容问题、Shell 问题、推荐问题、隐私文案问题、试用流程问题分类。',
      '只交接匿名问题摘要和聚合严重度，不交接个人记录。',
    ],
    decisionGateHandoff: [
      '回到 evidence review 和 product decision gate 判断。',
      '如出现隐私事件，先暂停后续试用并修复边界。',
    ],
    nextPhaseRecommendation: 'Phase 9I — Anonymous Internal Trial Evidence Review',
    localOnly: true,
    anonymousOnly: true,
    mockTemplateOnly: true,
  });

export const createDefaultUserAppAnonymousTrialPostLaunchReviewSteps =
  (): UserAppAnonymousTrialPostLaunchReviewStep[] => [
    {
      stepId: 'post-launch-review-evidence-gaps',
      label: '整理匿名证据缺口',
      owner: 'admin',
      required: true,
      completed: true,
    },
    {
      stepId: 'post-launch-review-privacy-incidents',
      label: '确认是否出现隐私或范围事件',
      owner: 'privacy_reviewer',
      required: true,
      completed: true,
    },
    {
      stepId: 'post-launch-review-issue-summary',
      label: '交接问题分类摘要',
      owner: 'product_reviewer',
      required: true,
      completed: true,
    },
    {
      stepId: 'post-launch-review-decision-gate',
      label: '交接到 evidence / review / decision 流程',
      owner: 'product_reviewer',
      required: true,
      completed: true,
    },
  ];

const createRisks = (
  evidenceHandoff: UserAppAnonymousTrialPostLaunchEvidenceHandoff,
  reviewSteps: readonly UserAppAnonymousTrialPostLaunchReviewStep[],
): UserAppAnonymousTrialPostLaunchRisk[] => {
  const risks: UserAppAnonymousTrialPostLaunchRisk[] = [];
  if (evidenceHandoff.privacyIncidents.length > 0) {
    risks.push({
      riskId: 'post-launch-risk-privacy-incident',
      severity: 'critical',
      message: '试用后 handoff 中出现隐私或范围事件。',
      mitigation: '暂停后续试用，先清除不合规内容并修复启动包。',
    });
  }
  if (evidenceHandoff.stoppedSessionReason) {
    risks.push({
      riskId: 'post-launch-risk-stopped-session',
      severity: 'high',
      message: `存在停止会话原因：${evidenceHandoff.stoppedSessionReason}`,
      mitigation: '先复盘停止原因，再决定是否重复匿名内部试用。',
    });
  }
  if (evidenceHandoff.evidenceGaps.length > 0) {
    risks.push({
      riskId: 'post-launch-risk-evidence-gaps',
      severity: 'medium',
      message: '匿名证据存在缺口。',
      mitigation: '在 Phase 9I 证据复盘中标记缺口，不要过度声明结论。',
    });
  }
  if (reviewSteps.some((step) => step.required && !step.completed)) {
    risks.push({
      riskId: 'post-launch-risk-review-incomplete',
      severity: 'medium',
      message: '试用后 review step 未完成。',
      mitigation: '补齐证据缺口、隐私事件、问题摘要或决策门交接。',
    });
  }
  return risks;
};

const statusFromRisks = (
  risks: readonly UserAppAnonymousTrialPostLaunchRisk[],
): UserAppAnonymousTrialPostLaunchHandoffStatus => {
  if (risks.some((risk) => risk.severity === 'critical' || risk.severity === 'high')) {
    return 'post_launch_handoff_stopped';
  }
  if (risks.length > 0) return 'post_launch_handoff_ready_with_gaps';
  return 'post_launch_handoff_ready';
};

const recommendationForStatus = (
  status: UserAppAnonymousTrialPostLaunchHandoffStatus,
): UserAppAnonymousTrialPostLaunchRecommendation => {
  const messageByStatus: Record<UserAppAnonymousTrialPostLaunchHandoffStatus, string> = {
    post_launch_handoff_ready:
      '试用后 handoff 模板完整，可进入匿名内部试用证据复盘。',
    post_launch_handoff_ready_with_gaps:
      'handoff 有证据缺口，需要在下一阶段明确标记。',
    post_launch_handoff_stopped:
      'handoff 出现停止原因或隐私事件，不能继续推进。',
  };

  return {
    recommendationId: `anonymous-trial-post-launch-${status}`,
    status,
    message: messageByStatus[status],
    nextAction:
      status === 'post_launch_handoff_ready'
        ? '进入 Phase 9I Anonymous Internal Trial Evidence Review；只使用匿名摘要和聚合证据。'
        : '先复盘缺口或停止原因，再决定是否重复匿名内部试用。',
  };
};

export const createUserAppAnonymousTrialPostLaunchHandoff = (
  input: CreateUserAppAnonymousTrialPostLaunchHandoffInput = {},
): UserAppAnonymousTrialPostLaunchHandoff => {
  const launchReadiness =
    input.launchReadiness ?? createUserAppAnonymousTrialLaunchReadiness();
  const evidenceHandoff =
    input.evidenceHandoff ?? createDefaultUserAppAnonymousTrialPostLaunchEvidenceHandoff();
  const reviewSteps =
    input.reviewSteps ?? createDefaultUserAppAnonymousTrialPostLaunchReviewSteps();
  const risks = createRisks(evidenceHandoff, reviewSteps);
  const status = statusFromRisks(risks);

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_POST_LAUNCH_HANDOFF_SCHEMA_VERSION,
    handoffId: input.handoffId ?? 'anonymous-internal-trial-post-launch-handoff-v0',
    title: input.title ?? '匿名内部试用后 handoff',
    status,
    launchReadiness,
    evidenceHandoff,
    reviewSteps,
    risks,
    recommendation: recommendationForStatus(status),
    localOnly: true,
    deterministic: true,
    templateOnly: true,
    productionBuildApproved: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
