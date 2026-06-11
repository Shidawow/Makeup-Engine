import {
  createUserAppInternalTrialEvidencePack,
  type UserAppInternalTrialEvidenceItem,
  type UserAppInternalTrialEvidencePack,
  type UserAppInternalTrialEvidenceType,
} from './userAppInternalTrialEvidencePack';

export const USER_APP_TRIAL_EVIDENCE_SUMMARY_SCHEMA_VERSION =
  'user-app-trial-evidence-summary-v0.1' as const;

export type UserAppTrialEvidenceTheme =
  | 'user_value_evidence'
  | 'template_content_evidence'
  | 'shell_usability_evidence'
  | 'guidance_clarity_evidence'
  | 'recommendation_usefulness_evidence'
  | 'privacy_trust_evidence'
  | 'trial_ops_evidence'
  | 'iteration_readiness_evidence'
  | 'decision_readiness_evidence';

export interface UserAppTrialEvidenceInsight {
  insightId: string;
  theme: UserAppTrialEvidenceTheme;
  title: string;
  summary: string;
  evidenceIds: string[];
}

export interface UserAppTrialEvidenceGap {
  gapId: string;
  theme: UserAppTrialEvidenceTheme;
  message: string;
  blocksMvpValidationPlanning: boolean;
}

export interface UserAppTrialEvidenceRecommendation {
  recommendationId: string;
  message: string;
  nextAction: string;
}

export interface UserAppTrialEvidenceSummary {
  schemaVersion: typeof USER_APP_TRIAL_EVIDENCE_SUMMARY_SCHEMA_VERSION;
  summaryId: string;
  title: string;
  evidencePack: UserAppInternalTrialEvidencePack;
  themes: UserAppTrialEvidenceTheme[];
  insights: UserAppTrialEvidenceInsight[];
  gaps: UserAppTrialEvidenceGap[];
  recommendations: UserAppTrialEvidenceRecommendation[];
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  anonymousOrExampleOnly: true;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppTrialEvidenceSummaryInput {
  summaryId?: string;
  title?: string;
  evidencePack?: UserAppInternalTrialEvidencePack;
}

const themeByType: Record<UserAppInternalTrialEvidenceType, UserAppTrialEvidenceTheme> = {
  anonymous_observation: 'user_value_evidence',
  task_completion_signal: 'shell_usability_evidence',
  step_comprehension_signal: 'guidance_clarity_evidence',
  template_value_signal: 'recommendation_usefulness_evidence',
  shell_usability_signal: 'shell_usability_evidence',
  privacy_trust_signal: 'privacy_trust_evidence',
  trial_ops_signal: 'trial_ops_evidence',
  issue_taxonomy_signal: 'template_content_evidence',
  iteration_priority_signal: 'iteration_readiness_evidence',
  product_decision_signal: 'decision_readiness_evidence',
  blocked_boundary_signal: 'privacy_trust_evidence',
};

const requiredThemes: UserAppTrialEvidenceTheme[] = [
  'user_value_evidence',
  'template_content_evidence',
  'shell_usability_evidence',
  'guidance_clarity_evidence',
  'recommendation_usefulness_evidence',
  'privacy_trust_evidence',
  'trial_ops_evidence',
  'iteration_readiness_evidence',
  'decision_readiness_evidence',
];

const themeTitle: Record<UserAppTrialEvidenceTheme, string> = {
  user_value_evidence: '用户价值证据',
  template_content_evidence: '模板内容证据',
  shell_usability_evidence: 'Shell 可用性证据',
  guidance_clarity_evidence: '跟练清晰度证据',
  recommendation_usefulness_evidence: '推荐有效性证据',
  privacy_trust_evidence: '隐私信任证据',
  trial_ops_evidence: '试用流程证据',
  iteration_readiness_evidence: '迭代准备证据',
  decision_readiness_evidence: '决策准备证据',
};

const itemsForTheme = (
  items: readonly UserAppInternalTrialEvidenceItem[],
  theme: UserAppTrialEvidenceTheme,
): UserAppInternalTrialEvidenceItem[] =>
  items.filter((item) => themeByType[item.type] === theme);

const insightForTheme = (
  theme: UserAppTrialEvidenceTheme,
  items: readonly UserAppInternalTrialEvidenceItem[],
): UserAppTrialEvidenceInsight => {
  const related = itemsForTheme(items, theme);
  const strongCount = related.filter((item) => item.strength === 'strong').length;
  return {
    insightId: `trial-evidence-insight-${theme}`,
    theme,
    title: themeTitle[theme],
    summary:
      related.length === 0
        ? '该主题还没有匿名/示例证据。'
        : strongCount > 0
          ? '该主题已有较强匿名/示例证据，可进入 sufficiency gate 判断。'
          : '该主题已有证据，但仍需要更多样本或更清晰的观察摘要。',
    evidenceIds: related.map((item) => item.evidenceId),
  };
};

const gapsFromThemes = (
  items: readonly UserAppInternalTrialEvidenceItem[],
): UserAppTrialEvidenceGap[] =>
  requiredThemes
    .filter((theme) => itemsForTheme(items, theme).length === 0)
    .map((theme) => ({
      gapId: `trial-evidence-gap-${theme}`,
      theme,
      message: `${themeTitle[theme]}不足，不能过度推进产品判断。`,
      blocksMvpValidationPlanning: true,
    }));

const recommendationsFromGaps = (
  gaps: readonly UserAppTrialEvidenceGap[],
): UserAppTrialEvidenceRecommendation[] => {
  if (gaps.length === 0) {
    return [
      {
        recommendationId: 'trial-evidence-recommendation-sufficiency-gate',
        message: '证据主题覆盖完整，可以进入证据充分性判断。',
        nextAction: '继续保持匿名、本地、示例级边界，不上传、不训练。',
      },
    ];
  }
  return [
    {
      recommendationId: 'trial-evidence-recommendation-collect-more',
      message: '证据主题仍有缺口，不应直接进入 MVP validation planning。',
      nextAction: '准备下一轮内部试用证据收集，补足缺口主题。',
    },
  ];
};

export const createUserAppTrialEvidenceSummary = (
  input: CreateUserAppTrialEvidenceSummaryInput = {},
): UserAppTrialEvidenceSummary => {
  const evidencePack = input.evidencePack ?? createUserAppInternalTrialEvidencePack();
  const themes = Array.from(
    new Set(evidencePack.evidenceItems.map((item) => themeByType[item.type])),
  );
  const gaps = gapsFromThemes(evidencePack.evidenceItems);

  return {
    schemaVersion: USER_APP_TRIAL_EVIDENCE_SUMMARY_SCHEMA_VERSION,
    summaryId: input.summaryId ?? 'trial-evidence-summary-v0',
    title: input.title ?? '试用证据摘要',
    evidencePack,
    themes,
    insights: requiredThemes.map((theme) => insightForTheme(theme, evidencePack.evidenceItems)),
    gaps,
    recommendations: recommendationsFromGaps(gaps),
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
