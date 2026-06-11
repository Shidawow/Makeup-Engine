import {
  createUserAppInternalTrialLearningSummary,
  type UserAppInternalTrialLearningSignal,
  type UserAppInternalTrialLearningSummary,
} from './userAppInternalTrialLearningSummary';
import {
  createUserAppProductDecisionGate,
  type UserAppProductDecisionGate,
} from './userAppProductDecisionGate';

export const USER_APP_INTERNAL_TRIAL_EVIDENCE_PACK_SCHEMA_VERSION =
  'user-app-internal-trial-evidence-pack-v0.1' as const;

export type UserAppInternalTrialEvidenceType =
  | 'anonymous_observation'
  | 'task_completion_signal'
  | 'step_comprehension_signal'
  | 'template_value_signal'
  | 'shell_usability_signal'
  | 'privacy_trust_signal'
  | 'trial_ops_signal'
  | 'issue_taxonomy_signal'
  | 'iteration_priority_signal'
  | 'product_decision_signal'
  | 'blocked_boundary_signal';

export type UserAppInternalTrialEvidenceSource =
  | 'phase_9a_trial_ops'
  | 'phase_9b_result_review'
  | 'phase_9c_iteration_plan'
  | 'phase_9d_learning_decision'
  | 'mock_example';

export type UserAppInternalTrialEvidencePackStatus =
  | 'evidence_pack_ready'
  | 'evidence_pack_ready_with_warnings'
  | 'evidence_pack_blocked';

export interface UserAppInternalTrialEvidenceItem {
  evidenceId: string;
  type: UserAppInternalTrialEvidenceType;
  source: UserAppInternalTrialEvidenceSource;
  summary: string;
  strength: 'weak' | 'medium' | 'strong' | 'blocked';
  evidenceCount: number;
  supportsDecision: boolean;
  anonymousOrExampleOnly: true;
  containsRealName: boolean;
  containsContact: boolean;
  containsPhoto: boolean;
  containsHealthInfo: boolean;
  containsSensitiveIdentity: boolean;
  containsBiometric: boolean;
  requestsUpload: boolean;
  writesTrainingInput: boolean;
}

export interface UserAppInternalTrialEvidenceRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppInternalTrialEvidencePack {
  schemaVersion: typeof USER_APP_INTERNAL_TRIAL_EVIDENCE_PACK_SCHEMA_VERSION;
  packId: string;
  title: string;
  status: UserAppInternalTrialEvidencePackStatus;
  evidenceItems: UserAppInternalTrialEvidenceItem[];
  evidenceTypes: UserAppInternalTrialEvidenceType[];
  risks: UserAppInternalTrialEvidenceRisk[];
  learningSummary: UserAppInternalTrialLearningSummary;
  productDecisionGate: UserAppProductDecisionGate;
  evidenceChain: string[];
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  anonymousOrExampleOnly: true;
  productionRelease: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  collectsRealName: false;
  collectsContact: false;
  collectsPhotos: false;
  collectsHealthInfo: false;
  collectsSensitiveIdentity: false;
  collectsBiometrics: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppInternalTrialEvidencePackInput {
  packId?: string;
  title?: string;
  learningSummary?: UserAppInternalTrialLearningSummary;
  productDecisionGate?: UserAppProductDecisionGate;
  additionalEvidence?: UserAppInternalTrialEvidenceItem[];
  includeDerivedEvidence?: boolean;
  minimumEvidenceItems?: number;
}

const evidenceTypeFromLearningSignal = (
  signal: UserAppInternalTrialLearningSignal,
): UserAppInternalTrialEvidenceType => {
  if (signal.theme === 'user_value_signal') return 'template_value_signal';
  if (signal.theme === 'template_content_signal') return 'step_comprehension_signal';
  if (signal.theme === 'shell_usability_signal') return 'shell_usability_signal';
  if (signal.theme === 'guidance_clarity_signal') return 'step_comprehension_signal';
  if (signal.theme === 'recommendation_signal') return 'template_value_signal';
  if (signal.theme === 'privacy_trust_signal') return 'privacy_trust_signal';
  if (signal.theme === 'trial_ops_signal') return 'trial_ops_signal';
  if (signal.theme === 'iteration_readiness_signal') return 'iteration_priority_signal';
  return 'blocked_boundary_signal';
};

const evidenceSourceFromLearningSignal = (
  signal: UserAppInternalTrialLearningSignal,
): UserAppInternalTrialEvidenceSource => {
  if (signal.source === 'phase_9a_trial_ops') return 'phase_9a_trial_ops';
  if (signal.source === 'phase_9b_result_review') return 'phase_9b_result_review';
  if (signal.source === 'phase_9c_iteration_plan') return 'phase_9c_iteration_plan';
  return 'mock_example';
};

const safeEvidence = (
  item: Omit<
    UserAppInternalTrialEvidenceItem,
    | 'anonymousOrExampleOnly'
    | 'containsRealName'
    | 'containsContact'
    | 'containsPhoto'
    | 'containsHealthInfo'
    | 'containsSensitiveIdentity'
    | 'containsBiometric'
    | 'requestsUpload'
    | 'writesTrainingInput'
  >,
): UserAppInternalTrialEvidenceItem => ({
  ...item,
  anonymousOrExampleOnly: true,
  containsRealName: false,
  containsContact: false,
  containsPhoto: false,
  containsHealthInfo: false,
  containsSensitiveIdentity: false,
  containsBiometric: false,
  requestsUpload: false,
  writesTrainingInput: false,
});

const evidenceFromLearningSummary = (
  summary: UserAppInternalTrialLearningSummary,
): UserAppInternalTrialEvidenceItem[] =>
  summary.signals.map((signal) =>
    safeEvidence({
      evidenceId: `evidence-${signal.signalId}`,
      type: evidenceTypeFromLearningSignal(signal),
      source: evidenceSourceFromLearningSignal(signal),
      summary: signal.summary,
      strength: signal.strength,
      evidenceCount: signal.evidenceCount,
      supportsDecision: signal.strength !== 'blocked',
    }),
  );

const evidenceFromDecisionGate = (
  gate: UserAppProductDecisionGate,
): UserAppInternalTrialEvidenceItem[] => [
  safeEvidence({
    evidenceId: `evidence-${gate.gateId}-decision`,
    type:
      gate.status === 'product_decision_blocked'
        ? 'blocked_boundary_signal'
        : 'product_decision_signal',
    source: 'phase_9d_learning_decision',
    summary: gate.recommendation.message,
    strength: gate.status === 'product_decision_ready' ? 'strong' : 'medium',
    evidenceCount: gate.signals.length,
    supportsDecision: gate.status !== 'product_decision_blocked',
  }),
];

const hasUnsafeEvidence = (item: UserAppInternalTrialEvidenceItem): boolean =>
  item.containsRealName ||
  item.containsContact ||
  item.containsPhoto ||
  item.containsHealthInfo ||
  item.containsSensitiveIdentity ||
  item.containsBiometric ||
  item.requestsUpload ||
  item.writesTrainingInput;

const risksFromEvidence = (
  items: readonly UserAppInternalTrialEvidenceItem[],
): UserAppInternalTrialEvidenceRisk[] => {
  const risks: UserAppInternalTrialEvidenceRisk[] = [];
  if (items.length === 0) {
    risks.push({
      riskId: 'evidence-risk-missing',
      severity: 'high',
      message: '当前没有匿名试用证据，不能支持 MVP validation planning。',
      mitigation: '先准备 Phase 9F 内部试用证据收集，不记录真实个人资料。',
    });
  }
  if (items.some(hasUnsafeEvidence)) {
    risks.push({
      riskId: 'evidence-risk-unsafe-data',
      severity: 'critical',
      message: '证据条目包含真实身份、联系方式、照片、健康、敏感身份、上传或训练风险。',
      mitigation: '删除不安全字段，只保留匿名/示例级摘要后再复盘。',
    });
  }
  if (items.some((item) => item.type === 'blocked_boundary_signal' || item.strength === 'blocked')) {
    risks.push({
      riskId: 'evidence-risk-boundary-blocker',
      severity: 'critical',
      message: '证据链包含隐私或范围边界阻断。',
      mitigation: '暂停推进，先修复边界，不进入 MVP validation planning。',
    });
  }
  return risks;
};

const uniqueEvidenceTypes = (
  items: readonly UserAppInternalTrialEvidenceItem[],
): UserAppInternalTrialEvidenceType[] =>
  Array.from(new Set(items.map((item) => item.type)));

const statusFromEvidence = (
  items: readonly UserAppInternalTrialEvidenceItem[],
  risks: readonly UserAppInternalTrialEvidenceRisk[],
  minimumEvidenceItems: number,
): UserAppInternalTrialEvidencePackStatus => {
  if (risks.some((risk) => risk.severity === 'critical')) return 'evidence_pack_blocked';
  if (items.length < minimumEvidenceItems || risks.length > 0) {
    return 'evidence_pack_ready_with_warnings';
  }
  return 'evidence_pack_ready';
};

export const createUserAppInternalTrialEvidencePack = (
  input: CreateUserAppInternalTrialEvidencePackInput = {},
): UserAppInternalTrialEvidencePack => {
  const learningSummary =
    input.learningSummary ?? createUserAppInternalTrialLearningSummary();
  const productDecisionGate =
    input.productDecisionGate ??
    createUserAppProductDecisionGate({
      learningSummary,
    });
  const includeDerivedEvidence = input.includeDerivedEvidence ?? true;
  const evidenceItems = [
    ...(includeDerivedEvidence ? evidenceFromLearningSummary(learningSummary) : []),
    ...(includeDerivedEvidence ? evidenceFromDecisionGate(productDecisionGate) : []),
    ...(input.additionalEvidence ?? []),
  ];
  const risks = risksFromEvidence(evidenceItems);

  return {
    schemaVersion: USER_APP_INTERNAL_TRIAL_EVIDENCE_PACK_SCHEMA_VERSION,
    packId: input.packId ?? 'internal-trial-evidence-pack-v0',
    title: input.title ?? '内部试用证据包',
    status: statusFromEvidence(evidenceItems, risks, input.minimumEvidenceItems ?? 7),
    evidenceItems,
    evidenceTypes: uniqueEvidenceTypes(evidenceItems),
    risks,
    learningSummary,
    productDecisionGate,
    evidenceChain: [
      '9A internal trial operations',
      '9B result review and issue taxonomy',
      '9C iteration plan and priority',
      '9D learning summary and product decision gate',
      '9E evidence pack and sufficiency gate',
    ],
    localOnly: true,
    deterministic: true,
    mockOnly: true,
    anonymousOrExampleOnly: true,
    productionRelease: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    collectsRealName: false,
    collectsContact: false,
    collectsPhotos: false,
    collectsHealthInfo: false,
    collectsSensitiveIdentity: false,
    collectsBiometrics: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
