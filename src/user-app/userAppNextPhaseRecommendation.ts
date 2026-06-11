import {
  createUserAppInternalTrialLearningSummary,
  type UserAppInternalTrialLearningSummary,
} from './userAppInternalTrialLearningSummary';
import {
  createUserAppProductDecisionGate,
  type UserAppProductDecisionGate,
} from './userAppProductDecisionGate';

export const USER_APP_NEXT_PHASE_RECOMMENDATION_SCHEMA_VERSION =
  'user-app-next-phase-recommendation-v0.1' as const;

export type UserAppNextPhaseOption =
  | 'Phase 9E — Internal Trial Evidence Pack'
  | 'Phase 10A — MVP Validation Plan'
  | 'Phase 10B — Production App Discovery'
  | 'DOC-ILLUSTRATED — Illustrated Design Report & Operation Manual'
  | 'Phase 9D-Fix — Decision Gate Fixes';

export type UserAppNextPhaseReadiness =
  | 'ready'
  | 'ready_with_warnings'
  | 'blocked';

export interface UserAppNextPhaseRisk {
  riskId: string;
  message: string;
  mitigation: string;
}

export interface UserAppNextPhaseRecommendation {
  schemaVersion: typeof USER_APP_NEXT_PHASE_RECOMMENDATION_SCHEMA_VERSION;
  recommendationId: string;
  recommendedPhase: UserAppNextPhaseOption;
  readiness: UserAppNextPhaseReadiness;
  rationale: string[];
  risks: UserAppNextPhaseRisk[];
  learningSummary: UserAppInternalTrialLearningSummary;
  decisionGate: UserAppProductDecisionGate;
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  anonymousOrExampleOnly: true;
  productionBuildApproved: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppNextPhaseRecommendationInput {
  recommendationId?: string;
  learningSummary?: UserAppInternalTrialLearningSummary;
  decisionGate?: UserAppProductDecisionGate;
  documentationNeeded?: boolean;
  productionDiscoveryNeeded?: boolean;
}

export const createUserAppNextPhaseRecommendation = (
  input: CreateUserAppNextPhaseRecommendationInput = {},
): UserAppNextPhaseRecommendation => {
  const learningSummary =
    input.learningSummary ?? createUserAppInternalTrialLearningSummary();
  const decisionGate =
    input.decisionGate ??
    createUserAppProductDecisionGate({
      learningSummary,
      productionDiscoveryRequested: input.productionDiscoveryNeeded,
    });

  let recommendedPhase: UserAppNextPhaseOption =
    'Phase 9E — Internal Trial Evidence Pack';
  let readiness: UserAppNextPhaseReadiness = 'ready_with_warnings';
  const rationale: string[] = [];

  if (
    learningSummary.status === 'learning_summary_blocked' ||
    decisionGate.status === 'product_decision_blocked'
  ) {
    recommendedPhase = 'Phase 9D-Fix — Decision Gate Fixes';
    readiness = 'blocked';
    rationale.push('存在隐私、范围或 no-go blocker，必须先修复决策门。');
  } else if (input.documentationNeeded) {
    recommendedPhase = 'DOC-ILLUSTRATED — Illustrated Design Report & Operation Manual';
    readiness = 'ready';
    rationale.push('需要正式图文设计书与操作说明书沉淀系统知识。');
  } else if (decisionGate.decision === 'prepare_mvp_validation_plan') {
    recommendedPhase = 'Phase 10A — MVP Validation Plan';
    readiness = 'ready';
    rationale.push('用户价值信号和迭代准备度足够，可规划 MVP validation。');
  } else if (decisionGate.decision === 'prepare_production_app_discovery') {
    recommendedPhase = 'Phase 10B — Production App Discovery';
    readiness = 'ready_with_warnings';
    rationale.push('可以探索 production app 方向，但只能做 discovery planning。');
  } else {
    recommendedPhase = 'Phase 9E — Internal Trial Evidence Pack';
    readiness = 'ready_with_warnings';
    rationale.push('当前仍是 mock/example framework，先补内部试用证据包更稳妥。');
  }

  return {
    schemaVersion: USER_APP_NEXT_PHASE_RECOMMENDATION_SCHEMA_VERSION,
    recommendationId: input.recommendationId ?? 'next-phase-recommendation-v0',
    recommendedPhase,
    readiness,
    rationale,
    risks: [
      {
        riskId: 'next-phase-risk-overbuild',
        message: '下一阶段建议不能被误读为 production build approval。',
        mitigation: '继续明确 no backend / no camera / no AR / no training / no OpenAI API。',
      },
    ],
    learningSummary,
    decisionGate,
    localOnly: true,
    deterministic: true,
    mockOnly: true,
    anonymousOrExampleOnly: true,
    productionBuildApproved: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
