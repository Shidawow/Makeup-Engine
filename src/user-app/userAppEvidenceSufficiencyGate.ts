import {
  createUserAppInternalTrialEvidencePack,
  type UserAppInternalTrialEvidencePack,
  type UserAppInternalTrialEvidenceType,
} from './userAppInternalTrialEvidencePack';
import {
  createUserAppTrialEvidenceSummary,
  type UserAppTrialEvidenceSummary,
} from './userAppTrialEvidenceSummary';

export const USER_APP_EVIDENCE_SUFFICIENCY_GATE_SCHEMA_VERSION =
  'user-app-evidence-sufficiency-gate-v0.1' as const;

export type UserAppEvidenceSufficiencyDecision =
  | 'sufficient_for_next_internal_trial'
  | 'sufficient_for_mvp_validation_planning'
  | 'insufficient_collect_more_internal_evidence'
  | 'blocked_by_privacy_or_scope_issue'
  | 'blocked_by_missing_trial_evidence';

export interface UserAppEvidenceSufficiencyCheck {
  checkId: string;
  label: string;
  passed: boolean;
  blocking: boolean;
  message: string;
}

export interface UserAppEvidenceSufficiencyRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppEvidenceSufficiencyRecommendation {
  recommendationId: string;
  decision: UserAppEvidenceSufficiencyDecision;
  message: string;
  nextAction: string;
}

export interface UserAppEvidenceSufficiencyGate {
  schemaVersion: typeof USER_APP_EVIDENCE_SUFFICIENCY_GATE_SCHEMA_VERSION;
  gateId: string;
  title: string;
  decision: UserAppEvidenceSufficiencyDecision;
  checks: UserAppEvidenceSufficiencyCheck[];
  risks: UserAppEvidenceSufficiencyRisk[];
  recommendation: UserAppEvidenceSufficiencyRecommendation;
  evidencePack: UserAppInternalTrialEvidencePack;
  evidenceSummary: UserAppTrialEvidenceSummary;
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

export interface CreateUserAppEvidenceSufficiencyGateInput {
  gateId?: string;
  title?: string;
  evidencePack?: UserAppInternalTrialEvidencePack;
  evidenceSummary?: UserAppTrialEvidenceSummary;
  minimumMvpEvidenceItems?: number;
}

const countType = (
  pack: UserAppInternalTrialEvidencePack,
  type: UserAppInternalTrialEvidenceType,
): number => pack.evidenceItems.filter((item) => item.type === type).length;

const hasAny = (
  pack: UserAppInternalTrialEvidencePack,
  types: readonly UserAppInternalTrialEvidenceType[],
): boolean => types.some((type) => countType(pack, type) > 0);

const hasUnsafeOrBoundaryBlocker = (pack: UserAppInternalTrialEvidencePack): boolean =>
  pack.status === 'evidence_pack_blocked' ||
  pack.risks.some((risk) => risk.severity === 'critical');

const createChecks = (
  pack: UserAppInternalTrialEvidencePack,
  summary: UserAppTrialEvidenceSummary,
  minimumMvpEvidenceItems: number,
): UserAppEvidenceSufficiencyCheck[] => {
  const hasObservation = countType(pack, 'anonymous_observation') > 0;
  const hasUserValue = countType(pack, 'template_value_signal') > 0;
  const hasShell = hasAny(pack, ['shell_usability_signal', 'task_completion_signal']);
  const hasContent = hasAny(pack, ['step_comprehension_signal', 'issue_taxonomy_signal']);
  const hasPrivacy = countType(pack, 'privacy_trust_signal') > 0;
  const hasTrialOps = countType(pack, 'trial_ops_signal') > 0;
  const hasDecision = countType(pack, 'product_decision_signal') > 0;

  return [
    {
      checkId: 'evidence-check-has-evidence',
      label: '存在试用证据',
      passed: pack.evidenceItems.length > 0,
      blocking: true,
      message: pack.evidenceItems.length > 0 ? '已有匿名/示例证据。' : '没有证据，不能推进。',
    },
    {
      checkId: 'evidence-check-anonymous-observation',
      label: '匿名观察证据',
      passed: hasObservation,
      blocking: true,
      message: hasObservation
        ? '已有匿名观察证据。'
        : '没有匿名观察证据，不得判定足够进入 MVP validation planning。',
    },
    {
      checkId: 'evidence-check-privacy-safe',
      label: '隐私与范围安全',
      passed: !hasUnsafeOrBoundaryBlocker(pack),
      blocking: true,
      message: hasUnsafeOrBoundaryBlocker(pack)
        ? '发现隐私、敏感、上传、训练或范围 blocker。'
        : '未发现隐私或范围 blocker。',
    },
    {
      checkId: 'evidence-check-user-value',
      label: '用户价值证据',
      passed: hasUserValue,
      blocking: true,
      message: hasUserValue ? '已有用户价值相关证据。' : '用户价值证据不足。',
    },
    {
      checkId: 'evidence-check-content-shell-ops',
      label: '内容 / Shell / 试用流程证据',
      passed: hasContent && hasShell && hasTrialOps,
      blocking: false,
      message:
        hasContent && hasShell && hasTrialOps
          ? '内容、Shell、试用流程证据都有覆盖。'
          : '内容、Shell 或试用流程证据仍有缺口。',
    },
    {
      checkId: 'evidence-check-decision-readiness',
      label: '决策准备证据',
      passed: hasPrivacy && hasDecision && summary.gaps.length === 0,
      blocking: false,
      message:
        hasPrivacy && hasDecision && summary.gaps.length === 0
          ? '隐私、决策和主题覆盖完整。'
          : '隐私、决策或主题覆盖仍有缺口。',
    },
    {
      checkId: 'evidence-check-mvp-threshold',
      label: 'MVP validation evidence threshold',
      passed: pack.evidenceItems.length >= minimumMvpEvidenceItems,
      blocking: false,
      message:
        pack.evidenceItems.length >= minimumMvpEvidenceItems
          ? '证据数量达到 MVP validation planning 阈值。'
          : '证据数量不足以支持 MVP validation planning。',
    },
  ];
};

const decide = (
  pack: UserAppInternalTrialEvidencePack,
  summary: UserAppTrialEvidenceSummary,
  checks: readonly UserAppEvidenceSufficiencyCheck[],
): UserAppEvidenceSufficiencyDecision => {
  if (hasUnsafeOrBoundaryBlocker(pack)) return 'blocked_by_privacy_or_scope_issue';
  if (pack.evidenceItems.length === 0) return 'blocked_by_missing_trial_evidence';

  const hasObservation = checks.find((check) => check.checkId === 'evidence-check-anonymous-observation')?.passed;
  const hasUserValue = checks.find((check) => check.checkId === 'evidence-check-user-value')?.passed;
  const hasContentShellOps = checks.find((check) => check.checkId === 'evidence-check-content-shell-ops')?.passed;
  const hasDecisionReadiness = checks.find((check) => check.checkId === 'evidence-check-decision-readiness')?.passed;
  const hasMvpThreshold = checks.find((check) => check.checkId === 'evidence-check-mvp-threshold')?.passed;

  if (!hasObservation || !hasUserValue) {
    return 'insufficient_collect_more_internal_evidence';
  }
  if (hasContentShellOps && hasDecisionReadiness && hasMvpThreshold && summary.gaps.length === 0) {
    return 'sufficient_for_mvp_validation_planning';
  }
  return 'sufficient_for_next_internal_trial';
};

const risksForDecision = (
  decision: UserAppEvidenceSufficiencyDecision,
): UserAppEvidenceSufficiencyRisk[] => {
  if (decision === 'blocked_by_privacy_or_scope_issue') {
    return [
      {
        riskId: 'evidence-sufficiency-risk-privacy-scope',
        severity: 'critical',
        message: '存在隐私、敏感数据、上传、训练或范围 blocker。',
        mitigation: '暂停推进，删除不安全证据并重新收集匿名摘要。',
      },
    ];
  }
  if (decision === 'blocked_by_missing_trial_evidence') {
    return [
      {
        riskId: 'evidence-sufficiency-risk-missing',
        severity: 'high',
        message: '没有内部试用证据，不能支持 MVP validation planning。',
        mitigation: '先准备内部试用证据收集流程。',
      },
    ];
  }
  return [
    {
      riskId: 'evidence-sufficiency-risk-overclaim',
      severity: 'medium',
      message: '当前证据仍是匿名/mock/example 本地框架，不能被误读为生产发布批准。',
      mitigation: '下一阶段继续保持 no backend / no upload / no training。',
    },
  ];
};

const recommendationForDecision = (
  decision: UserAppEvidenceSufficiencyDecision,
): UserAppEvidenceSufficiencyRecommendation => {
  const messageByDecision: Record<UserAppEvidenceSufficiencyDecision, string> = {
    sufficient_for_next_internal_trial: '证据足够支持下一轮内部小范围试用。',
    sufficient_for_mvp_validation_planning:
      '证据足够支持 Phase 10A MVP Validation Plan，但仍不是生产发布。',
    insufficient_collect_more_internal_evidence: '证据不足，需要继续收集匿名内部试用证据。',
    blocked_by_privacy_or_scope_issue: '隐私或范围问题阻断，必须暂停。',
    blocked_by_missing_trial_evidence: '缺少试用证据，必须先补证据。',
  };

  return {
    recommendationId: `evidence-sufficiency-${decision}`,
    decision,
    message: messageByDecision[decision],
    nextAction:
      decision === 'sufficient_for_mvp_validation_planning'
        ? '只规划 MVP validation，不创建生产 App、后端、相机、AR、训练或真实用户数据系统。'
        : '保持匿名、本地、示例级证据链，不上传、不训练、不写真实用户记录。',
  };
};

export const createUserAppEvidenceSufficiencyGate = (
  input: CreateUserAppEvidenceSufficiencyGateInput = {},
): UserAppEvidenceSufficiencyGate => {
  const evidencePack = input.evidencePack ?? createUserAppInternalTrialEvidencePack();
  const evidenceSummary =
    input.evidenceSummary ?? createUserAppTrialEvidenceSummary({ evidencePack });
  const checks = createChecks(
    evidencePack,
    evidenceSummary,
    input.minimumMvpEvidenceItems ?? 8,
  );
  const decision = decide(evidencePack, evidenceSummary, checks);

  return {
    schemaVersion: USER_APP_EVIDENCE_SUFFICIENCY_GATE_SCHEMA_VERSION,
    gateId: input.gateId ?? 'evidence-sufficiency-gate-v0',
    title: input.title ?? '证据充分性判断',
    decision,
    checks,
    risks: risksForDecision(decision),
    recommendation: recommendationForDecision(decision),
    evidencePack,
    evidenceSummary,
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
