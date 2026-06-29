import type {
  MvpGap,
  MvpGapCategory,
  MvpGapEffort,
  MvpGapImpact,
  MvpGapPriority,
  MvpGapPrioritizationReport,
} from './mvpGapPrioritization';

export type MvpGapResolutionSprintStatus =
  | 'sprint_plan_ready'
  | 'sprint_plan_ready_with_warnings'
  | 'sprint_plan_blocked';

export type MvpGapResolutionSprintOwnerRole =
  | 'product'
  | 'makeup_content'
  | 'ux'
  | 'vision_pipeline'
  | 'operator_workflow'
  | 'trust_privacy'
  | 'engineering'
  | 'founder';

export type MvpGapResolutionSprintDecision =
  | 'do_in_13d'
  | 'do_in_13e'
  | 'defer_to_later'
  | 'needs_founder_decision'
  | 'reject_for_now'
  | 'research_first';

export type MvpGapResolutionSprintRecommendation =
  | 'prepare_phase_13d_execution'
  | 'prepare_phase_13e_follow_up'
  | 'defer_production_scope'
  | 'ask_founder_to_choose_scope'
  | 'research_before_building'
  | 'reject_until_strategy_changes';

export interface MvpGapResolutionSprintAcceptanceCriteria {
  criterionId: string;
  description: string;
  verifiable: boolean;
}

export interface MvpGapResolutionSprintRisk {
  riskId: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  mitigation: string;
}

export interface MvpGapResolutionSprintItem {
  id: string;
  title: string;
  sourceGapIds: string[];
  category: MvpGapCategory;
  priority: MvpGapPriority;
  impact: MvpGapImpact;
  effort: MvpGapEffort;
  ownerRole: MvpGapResolutionSprintOwnerRole;
  sprintDecision: MvpGapResolutionSprintDecision;
  problemStatement: string;
  proposedResolution: string;
  acceptanceCriteria: MvpGapResolutionSprintAcceptanceCriteria[];
  outOfScope: string[];
  risks: MvpGapResolutionSprintRisk[];
  dependencies: string[];
  founderDecisionRequired: boolean;
  nextAction: string;
}

export interface MvpGapResolutionSprintPlanReport {
  reportId: string;
  sourceGapReportId: string;
  status: MvpGapResolutionSprintStatus;
  items: MvpGapResolutionSprintItem[];
  phase13DItems: MvpGapResolutionSprintItem[];
  phase13EItems: MvpGapResolutionSprintItem[];
  deferredItems: MvpGapResolutionSprintItem[];
  deferredProductionGaps: MvpGapResolutionSprintItem[];
  founderDecisionItems: MvpGapResolutionSprintItem[];
  risks: MvpGapResolutionSprintRisk[];
  recommendations: MvpGapResolutionSprintRecommendation[];
  sprintPlanningNotFinalRoadmap: true;
  notRealUserResearch: true;
  noAnalytics: true;
  noBackend: true;
  noRealUserDataCollection: true;
  noRealUserPhotos: true;
  noBase64OrLocalPhotoPath: true;
  noTrainingData: true;
  registryChainPausedAfter10U: true;
  realWriteAuthorizationPaused: true;
  registryWriteBlocked: true;
  registryMutationBlocked: true;
  publishBlocked: true;
  productionWriterBlocked: true;
  userAppShellReplacementBlocked: true;
  fullyAutomaticExtractionClaimBlocked: true;
  jsonRoundTripStable: boolean;
  nextRecommendedPhase: 'Phase 13D - MVP Demo Gap Resolution Sprint 1';
}

const ownerForCategory = (
  category: MvpGapCategory,
): MvpGapResolutionSprintOwnerRole => {
  if (category === 'trial_content_quality' || category === 'makeup_domain_accuracy') {
    return 'makeup_content';
  }
  if (category === 'photo_to_template_semantics') return 'operator_workflow';
  if (category === 'mobile_polish' || category === 'user_app_experience') return 'ux';
  if (category === 'trust_and_privacy') return 'trust_privacy';
  if (category === 'demo_readiness' || category === 'market_validation') return 'product';
  return 'founder';
};

const titleForGap = (gap: MvpGap): string => {
  if (gap.gapId === 'gap-user-app-interaction-polish') {
    return 'User App first-run clarity polish';
  }
  if (gap.gapId === 'gap-trial-content-realism') {
    return 'Trial template content consistency polish';
  }
  if (gap.gapId === 'gap-step-guidance-completion-cues') {
    return 'Step guidance trust wording polish';
  }
  if (gap.gapId === 'gap-mobile-demo-polish') {
    return 'Mobile demo touch target / spacing polish';
  }
  if (gap.gapId === 'gap-photo-to-template-trust-boundary') {
    return 'Operator workflow explanation tightening';
  }
  if (gap.gapId === 'gap-trust-privacy-copy') {
    return 'Founder decision on trust copy depth';
  }
  if (gap.isProductionGap) return 'Deferred production readiness scope';
  return gap.title;
};

const decisionForGap = (gap: MvpGap): MvpGapResolutionSprintDecision => {
  if (gap.isProductionGap) return 'defer_to_later';
  if (gap.gapId === 'gap-trust-privacy-copy') return 'needs_founder_decision';
  if (gap.priority === 'p0' || gap.priority === 'p1') return 'do_in_13d';
  if (
    gap.priority === 'p2' &&
    ['user_app_experience', 'mobile_polish', 'photo_to_template_semantics'].includes(
      gap.category,
    )
  ) {
    return 'do_in_13d';
  }
  if (gap.priority === 'p2') return 'do_in_13e';
  if (gap.priority === 'p3') return 'defer_to_later';
  return 'research_first';
};

const recommendationForDecision = (
  decision: MvpGapResolutionSprintDecision,
): MvpGapResolutionSprintRecommendation => {
  if (decision === 'do_in_13d') return 'prepare_phase_13d_execution';
  if (decision === 'do_in_13e') return 'prepare_phase_13e_follow_up';
  if (decision === 'needs_founder_decision') return 'ask_founder_to_choose_scope';
  if (decision === 'research_first') return 'research_before_building';
  if (decision === 'reject_for_now') return 'reject_until_strategy_changes';
  return 'defer_production_scope';
};

const acceptanceCriteriaFor = (
  gap: MvpGap,
  decision: MvpGapResolutionSprintDecision,
): MvpGapResolutionSprintAcceptanceCriteria[] => {
  if (decision !== 'do_in_13d') return [];

  const shared = [
    {
      criterionId: `${gap.gapId}-boundary`,
      description:
        'Copy and UI keep no backend, no analytics, no registry write, no publish, and no fully automatic extraction boundaries visible where relevant.',
      verifiable: true,
    },
  ];

  if (gap.gapId === 'gap-user-app-interaction-polish') {
    return [
      {
        criterionId: `${gap.gapId}-first-run`,
        description:
          'User App first screen makes the next user action obvious without showing administrator terminology.',
        verifiable: true,
      },
      ...shared,
    ];
  }
  if (gap.gapId === 'gap-trial-content-realism') {
    return [
      {
        criterionId: `${gap.gapId}-templates`,
        description:
          'The three MVP trial templates use consistent structure, difficulty, tools, step count, and completion cues.',
        verifiable: true,
      },
      ...shared,
    ];
  }
  if (gap.gapId === 'gap-step-guidance-completion-cues') {
    return [
      {
        criterionId: `${gap.gapId}-completion-cues`,
        description:
          'Each guided step includes a concise completion cue and a correction hint without claiming automatic face or makeup recognition.',
        verifiable: true,
      },
      ...shared,
    ];
  }
  if (gap.gapId === 'gap-mobile-demo-polish') {
    return [
      {
        criterionId: `${gap.gapId}-mobile-touch`,
        description:
          'Mobile demo controls remain readable and tappable, with reduced information density in ordinary user paths.',
        verifiable: true,
      },
      ...shared,
    ];
  }
  if (gap.gapId === 'gap-photo-to-template-trust-boundary') {
    return [
      {
        criterionId: `${gap.gapId}-operator-explainability`,
        description:
          'Operator workflow explains candidate-only photo-to-template output and human review before any demo handoff.',
        verifiable: true,
      },
      ...shared,
    ];
  }

  return [
    {
      criterionId: `${gap.gapId}-done`,
      description: 'The gap has a visible, testable MVP demo improvement and does not expand production scope.',
      verifiable: true,
    },
    ...shared,
  ];
};

const outOfScopeFor = (gap: MvpGap): string[] => [
  'backend / database / account system',
  'analytics or real user feedback collection',
  'camera, AR, OpenAI API, external AI API, or training',
  'registry write, registry mutation, publish, production writer, or User App Shell package replacement',
  gap.isProductionGap
    ? 'production launch, App Store, payment, growth, and public validation'
    : 'production readiness and formal roadmap finalization',
];

const risksFor = (
  gap: MvpGap,
  decision: MvpGapResolutionSprintDecision,
): MvpGapResolutionSprintRisk[] => [
  {
    riskId: `${gap.gapId}-scope-creep`,
    severity: gap.isProductionGap ? 'high' : 'medium',
    description:
      decision === 'defer_to_later'
        ? 'Deferred production gap could be mistaken for current MVP sprint scope.'
        : 'Sprint item could accidentally expand into production readiness or registry work.',
    mitigation:
      'Keep acceptance criteria demo-scoped and preserve explicit no registry, no analytics, no backend boundaries.',
  },
];

const nextActionFor = (decision: MvpGapResolutionSprintDecision): string => {
  if (decision === 'do_in_13d') return 'Prepare implementation-ready task for Phase 13D.';
  if (decision === 'do_in_13e') return 'Keep as Phase 13E follow-up candidate.';
  if (decision === 'needs_founder_decision') {
    return 'Ask founder to choose whether the item enters 13D, 13E, or remains deferred.';
  }
  if (decision === 'research_first') return 'Gather more internal evidence before implementation.';
  if (decision === 'reject_for_now') return 'Do not schedule unless strategy changes.';
  return 'Document as deferred production scope.';
};

export const createMvpGapResolutionSprintPlan = ({
  reportId = 'mvp-gap-resolution-sprint-plan-13c',
  gapReport,
}: {
  reportId?: string;
  gapReport: MvpGapPrioritizationReport;
}): MvpGapResolutionSprintPlanReport => {
  const items = gapReport.gaps.map((gap): MvpGapResolutionSprintItem => {
    const sprintDecision = decisionForGap(gap);
    const founderDecisionRequired =
      sprintDecision === 'needs_founder_decision' || gap.founderDecisionNeeded;

    return {
      id: `sprint-${gap.gapId}`,
      title: titleForGap(gap),
      sourceGapIds: [gap.gapId],
      category: gap.category,
      priority: gap.priority,
      impact: gap.impact,
      effort: gap.effort,
      ownerRole: founderDecisionRequired ? 'founder' : ownerForCategory(gap.category),
      sprintDecision,
      problemStatement: gap.title,
      proposedResolution:
        sprintDecision === 'defer_to_later'
          ? 'Keep this as deferred production scope and do not schedule it for the immediate MVP demo sprint.'
          : 'Turn the founder/internal feedback into a small, testable local MVP demo improvement.',
      acceptanceCriteria: acceptanceCriteriaFor(gap, sprintDecision),
      outOfScope: outOfScopeFor(gap),
      risks: risksFor(gap, sprintDecision),
      dependencies:
        sprintDecision === 'needs_founder_decision'
          ? ['founder scope choice']
          : ['Phase 13B founder/internal feedback fixture'],
      founderDecisionRequired,
      nextAction: nextActionFor(sprintDecision),
    };
  });

  const phase13DItems = items.filter((item) => item.sprintDecision === 'do_in_13d');
  const phase13EItems = items.filter((item) => item.sprintDecision === 'do_in_13e');
  const deferredItems = items.filter((item) => item.sprintDecision === 'defer_to_later');
  const founderDecisionItems = items.filter((item) => item.founderDecisionRequired);
  const deferredProductionGaps = items.filter((item) =>
    gapReport.deferredProductionGaps.some((gap) => item.sourceGapIds.includes(gap.gapId)),
  );
  const risks = items.flatMap((item) => item.risks);
  const recommendations = Array.from(
    new Set(items.map((item) => recommendationForDecision(item.sprintDecision))),
  );

  const report: MvpGapResolutionSprintPlanReport = {
    reportId,
    sourceGapReportId: gapReport.reportId,
    status: 'sprint_plan_ready',
    items,
    phase13DItems,
    phase13EItems,
    deferredItems,
    deferredProductionGaps,
    founderDecisionItems,
    risks,
    recommendations,
    sprintPlanningNotFinalRoadmap: true,
    notRealUserResearch: true,
    noAnalytics: true,
    noBackend: true,
    noRealUserDataCollection: true,
    noRealUserPhotos: true,
    noBase64OrLocalPhotoPath: true,
    noTrainingData: true,
    registryChainPausedAfter10U: true,
    realWriteAuthorizationPaused: true,
    registryWriteBlocked: true,
    registryMutationBlocked: true,
    publishBlocked: true,
    productionWriterBlocked: true,
    userAppShellReplacementBlocked: true,
    fullyAutomaticExtractionClaimBlocked: true,
    jsonRoundTripStable: false,
    nextRecommendedPhase: 'Phase 13D - MVP Demo Gap Resolution Sprint 1',
  };

  report.jsonRoundTripStable =
    JSON.stringify(JSON.parse(JSON.stringify(report))) === JSON.stringify(report);

  return report;
};
