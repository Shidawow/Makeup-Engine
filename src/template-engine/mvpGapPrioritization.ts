import type {
  FounderTrialFeedbackEntry,
  FounderTrialFeedbackReport,
  FounderTrialFeedbackSeverity,
} from './founderTrialFeedback';

export type MvpGapCategory =
  | 'user_app_experience'
  | 'trial_content_quality'
  | 'makeup_domain_accuracy'
  | 'photo_to_template_semantics'
  | 'human_review_workflow'
  | 'operator_workflow_clarity'
  | 'mobile_polish'
  | 'trust_and_privacy'
  | 'demo_readiness'
  | 'production_readiness'
  | 'monetization_readiness'
  | 'market_validation';

export type MvpGapPriority = 'p0' | 'p1' | 'p2' | 'p3';
export type MvpGapEffort = 'small' | 'medium' | 'large' | 'unknown';
export type MvpGapImpact = 'high' | 'medium' | 'low' | 'unknown';
export type MvpGapDecision =
  | 'do_now'
  | 'do_next'
  | 'defer'
  | 'reject'
  | 'needs_research'
  | 'needs_founder_decision';

export type MvpGapRecommendation =
  | 'fix_before_next_founder_trial'
  | 'plan_for_phase_13c'
  | 'review_content_with_makeup_domain_expert'
  | 'improve_photo_to_template_semantic_confidence'
  | 'tighten_privacy_and_boundary_copy'
  | 'defer_until_production_planning'
  | 'collect_more_founder_feedback';

export interface MvpGap {
  gapId: string;
  title: string;
  category: MvpGapCategory;
  priority: MvpGapPriority;
  impact: MvpGapImpact;
  effort: MvpGapEffort;
  decision: MvpGapDecision;
  recommendation: MvpGapRecommendation;
  sourceFeedbackIds: string[];
  isMvpDemoGap: boolean;
  isProductionGap: boolean;
  founderDecisionNeeded: boolean;
  rationale: string;
}

export interface MvpGapPrioritizationReport {
  reportId: string;
  sourceFeedbackReportId: string;
  gaps: MvpGap[];
  topMvpGaps: MvpGap[];
  deferredProductionGaps: MvpGap[];
  recommendations: MvpGapRecommendation[];
  productionGapsNotCurrentMustDo: true;
  registryChainPausedAfter10U: true;
  registryWriteBlocked: true;
  publishBlocked: true;
  productionWriterBlocked: true;
  userAppShellReplacementBlocked: true;
  noBackendCameraArAiTrainingScope: true;
  jsonRoundTripStable: boolean;
  nextRecommendedPhase: 'Phase 13C - MVP Gap Resolution Sprint Planning';
}

const categoryMap: Record<FounderTrialFeedbackEntry['category'], MvpGapCategory> = {
  first_impression: 'user_app_experience',
  template_selection: 'user_app_experience',
  template_detail: 'user_app_experience',
  preparation: 'user_app_experience',
  step_guidance: 'user_app_experience',
  completion: 'user_app_experience',
  mobile_usability: 'mobile_polish',
  trial_content_quality: 'trial_content_quality',
  makeup_domain_quality: 'makeup_domain_accuracy',
  photo_to_template_workflow: 'photo_to_template_semantics',
  trust_and_boundaries: 'trust_and_privacy',
  privacy_confidence: 'trust_and_privacy',
  founder_confidence: 'demo_readiness',
  market_readiness: 'market_validation',
  technical_gap: 'photo_to_template_semantics',
  product_gap: 'demo_readiness',
};

const priorityFromSeverity = (
  severity: FounderTrialFeedbackSeverity,
  isProductionGap: boolean,
): MvpGapPriority => {
  if (isProductionGap) return severity === 'blocker' ? 'p2' : 'p3';
  if (severity === 'blocker') return 'p0';
  if (severity === 'high') return 'p1';
  if (severity === 'medium') return 'p2';
  return 'p3';
};

const impactFromSeverity = (severity: FounderTrialFeedbackSeverity): MvpGapImpact => {
  if (severity === 'blocker' || severity === 'high') return 'high';
  if (severity === 'medium') return 'medium';
  if (severity === 'low' || severity === 'note') return 'low';
  return 'unknown';
};

const decisionFor = (
  priority: MvpGapPriority,
  isProductionGap: boolean,
): MvpGapDecision => {
  if (isProductionGap) return 'defer';
  if (priority === 'p0') return 'do_now';
  if (priority === 'p1') return 'do_next';
  if (priority === 'p2') return 'needs_research';
  return 'defer';
};

const recommendationFor = (
  category: MvpGapCategory,
  isProductionGap: boolean,
): MvpGapRecommendation => {
  if (isProductionGap) return 'defer_until_production_planning';
  if (category === 'trial_content_quality') {
    return 'review_content_with_makeup_domain_expert';
  }
  if (category === 'photo_to_template_semantics') {
    return 'improve_photo_to_template_semantic_confidence';
  }
  if (category === 'trust_and_privacy') {
    return 'tighten_privacy_and_boundary_copy';
  }
  return 'plan_for_phase_13c';
};

export const createMvpGapPrioritizationReport = ({
  reportId = 'mvp-gap-prioritization-13b',
  feedback,
}: {
  reportId?: string;
  feedback: FounderTrialFeedbackReport;
}): MvpGapPrioritizationReport => {
  const gaps = feedback.entries.map((entry): MvpGap => {
    const category = categoryMap[entry.category];
    const isProductionGap =
      category === 'production_readiness' ||
      category === 'monetization_readiness' ||
      entry.summary.toLowerCase().includes('production') ||
      entry.summary.includes('正式发布');
    const priority = priorityFromSeverity(entry.severity, isProductionGap);
    const decision = decisionFor(priority, isProductionGap);

    return {
      gapId: entry.linkedMvpGapId ?? `gap-${entry.feedbackId}`,
      title: entry.summary,
      category,
      priority,
      impact: impactFromSeverity(entry.severity),
      effort:
        category === 'photo_to_template_semantics' || category === 'makeup_domain_accuracy'
          ? 'large'
          : entry.severity === 'low' || entry.severity === 'note'
            ? 'small'
            : 'medium',
      decision,
      recommendation: recommendationFor(category, isProductionGap),
      sourceFeedbackIds: [entry.feedbackId],
      isMvpDemoGap: !isProductionGap,
      isProductionGap,
      founderDecisionNeeded: decision === 'needs_founder_decision',
      rationale: isProductionGap
        ? 'Production readiness gap is documented but not treated as current must-do during Phase 13B.'
        : 'Founder/internal feedback can be converted into a next MVP iteration item.',
    };
  });

  const topMvpGaps = gaps
    .filter((gap) => gap.isMvpDemoGap && ['p0', 'p1'].includes(gap.priority))
    .slice(0, 5);
  const deferredProductionGaps = gaps.filter((gap) => gap.isProductionGap);
  const recommendations = Array.from(
    new Set(gaps.map((gap) => gap.recommendation)),
  );

  const report: MvpGapPrioritizationReport = {
    reportId,
    sourceFeedbackReportId: feedback.reportId,
    gaps,
    topMvpGaps,
    deferredProductionGaps,
    recommendations,
    productionGapsNotCurrentMustDo: true,
    registryChainPausedAfter10U: true,
    registryWriteBlocked: true,
    publishBlocked: true,
    productionWriterBlocked: true,
    userAppShellReplacementBlocked: true,
    noBackendCameraArAiTrainingScope: true,
    jsonRoundTripStable: false,
    nextRecommendedPhase: 'Phase 13C - MVP Gap Resolution Sprint Planning',
  };

  report.jsonRoundTripStable =
    JSON.stringify(JSON.parse(JSON.stringify(report))) === JSON.stringify(report);

  return report;
};
