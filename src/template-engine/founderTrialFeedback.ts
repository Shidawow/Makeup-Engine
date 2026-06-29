export type FounderTrialFeedbackCategory =
  | 'first_impression'
  | 'template_selection'
  | 'template_detail'
  | 'preparation'
  | 'step_guidance'
  | 'completion'
  | 'mobile_usability'
  | 'trial_content_quality'
  | 'makeup_domain_quality'
  | 'photo_to_template_workflow'
  | 'trust_and_boundaries'
  | 'privacy_confidence'
  | 'founder_confidence'
  | 'market_readiness'
  | 'technical_gap'
  | 'product_gap';

export type FounderTrialFeedbackSentiment =
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'uncertain';

export type FounderTrialFeedbackSeverity =
  | 'blocker'
  | 'high'
  | 'medium'
  | 'low'
  | 'note';

export type FounderTrialFeedbackSource =
  | 'founder_manual_review'
  | 'demo_script_trial'
  | 'operator_workflow_review'
  | 'acceptance_trial'
  | 'local_fixture_review';

export type FounderTrialFeedbackRecommendation =
  | 'keep_current_demo_path'
  | 'prioritize_user_app_interaction'
  | 'prioritize_trial_content_revision'
  | 'prioritize_makeup_domain_review'
  | 'prioritize_photo_to_template_semantics'
  | 'clarify_trust_and_privacy_copy'
  | 'defer_production_readiness'
  | 'prepare_next_founder_trial';

export interface FounderTrialFeedbackEntry {
  feedbackId: string;
  category: FounderTrialFeedbackCategory;
  sentiment: FounderTrialFeedbackSentiment;
  severity: FounderTrialFeedbackSeverity;
  source: FounderTrialFeedbackSource;
  summary: string;
  detail: string;
  linkedTemplateId?: string;
  linkedMvpGapId?: string;
  recommendation: FounderTrialFeedbackRecommendation;
  internalOnly: true;
  notRealUserResearch: true;
}

export interface FounderTrialFeedbackReport {
  reportId: string;
  title: string;
  entries: FounderTrialFeedbackEntry[];
  recommendations: FounderTrialFeedbackRecommendation[];
  internalFounderFeedbackOnly: true;
  notRealUserResearch: true;
  noPersonalData: boolean;
  noRealUserPhotos: boolean;
  noBase64OrLocalPhotoPath: boolean;
  privacyIssues: string[];
  noAnalytics: true;
  noBackend: true;
  noTrainingData: true;
  registryChainPausedAfter10U: true;
  registryWriteBlocked: true;
  publishBlocked: true;
  productionWriterBlocked: true;
  userAppShellReplacementBlocked: true;
  jsonRoundTripStable: boolean;
  nextRecommendedPhase: 'Phase 13C - MVP Gap Resolution Sprint Planning';
}

const forbiddenPersonalDataPattern =
  /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})|(\+?\d[\d\s().-]{7,}\d)|(data:image\/)|(base64)|(\/Users\/|\/private\/|C:\\)|(\bfaceEmbedding\b|\bbiometric\b|\banalyticsId\b|\buserId\b)|真实姓名|手机号|邮箱|联系方式|本地路径|照片路径|身份证|住址|健康信息/i;

export const createFounderTrialFeedbackReport = ({
  reportId = 'founder-trial-feedback-13b',
  title = 'Phase 13B Founder Trial Feedback Capture',
  entries,
}: {
  reportId?: string;
  title?: string;
  entries: FounderTrialFeedbackEntry[];
}): FounderTrialFeedbackReport => {
  const safeEntries = entries.map((entry) => {
    const combined = `${entry.summary} ${entry.detail}`;
    if (forbiddenPersonalDataPattern.test(combined)) {
      return {
        ...entry,
        severity: 'blocker' as const,
        sentiment: 'negative' as const,
        recommendation: 'clarify_trust_and_privacy_copy' as const,
      };
    }
    return entry;
  });

  const recommendations = Array.from(
    new Set(safeEntries.map((entry) => entry.recommendation)),
  );
  const noForbiddenData = safeEntries.every(
    (entry) => !forbiddenPersonalDataPattern.test(`${entry.summary} ${entry.detail}`),
  );
  const privacyIssues = noForbiddenData
    ? []
    : ['Feedback contains forbidden personal data, photo, base64, local path, biometric, or analytics marker.'];

  const report: FounderTrialFeedbackReport = {
    reportId,
    title,
    entries: safeEntries,
    recommendations,
    internalFounderFeedbackOnly: true,
    notRealUserResearch: true,
    noPersonalData: noForbiddenData,
    noRealUserPhotos: noForbiddenData,
    noBase64OrLocalPhotoPath: noForbiddenData,
    privacyIssues,
    noAnalytics: true,
    noBackend: true,
    noTrainingData: true,
    registryChainPausedAfter10U: true,
    registryWriteBlocked: true,
    publishBlocked: true,
    productionWriterBlocked: true,
    userAppShellReplacementBlocked: true,
    jsonRoundTripStable: false,
    nextRecommendedPhase: 'Phase 13C - MVP Gap Resolution Sprint Planning',
  };

  report.jsonRoundTripStable =
    JSON.stringify(JSON.parse(JSON.stringify(report))) === JSON.stringify(report);

  return report;
};
