import type {
  MvpGapResolutionSprintItem,
  MvpGapResolutionSprintPlanReport,
} from './mvpGapResolutionSprintPlan';

export type MvpGapResolutionSprintValidationStatus =
  | 'sprint_plan_ready'
  | 'sprint_plan_ready_with_warnings'
  | 'sprint_plan_blocked';

export type MvpGapResolutionSprintValidationCheck =
  | 'p0_p1_mvp_gaps_have_resolution_items'
  | 'production_gaps_not_forced_into_mvp_sprint'
  | 'each_13d_item_has_acceptance_criteria'
  | 'each_13d_item_has_owner_role'
  | 'founder_decision_items_marked'
  | 'no_registry_write'
  | 'no_publish'
  | 'no_production_writer'
  | 'no_user_app_shell_replacement'
  | 'no_backend_or_analytics_scope'
  | 'no_fully_automatic_extraction_claim'
  | 'json_round_trip_safe';

export interface MvpGapResolutionSprintValidationIssue {
  check: MvpGapResolutionSprintValidationCheck;
  severity: 'warning' | 'blocker';
  message: string;
  itemId?: string;
}

export interface MvpGapResolutionSprintValidationResult {
  status: MvpGapResolutionSprintValidationStatus;
  checks: Record<MvpGapResolutionSprintValidationCheck, boolean>;
  issues: MvpGapResolutionSprintValidationIssue[];
  recommendations: string[];
  jsonRoundTripStable: boolean;
}

const allTextForItem = (item: MvpGapResolutionSprintItem): string =>
  [
    item.title,
    item.problemStatement,
    item.proposedResolution,
    item.nextAction,
    item.acceptanceCriteria.map((criterion) => criterion.description).join(' '),
  ].join(' ');

const containsUnsafeRegistryIntent = (text: string): boolean =>
  /(write registry|registry write\s*:\s*allowed|mutation registry|mutate registry|publish to user app|create production writer|enable production writer|replace.*User App Shell|UserAppTemplatePackage mutation|已写入|已发布|发布成功|替换当前用户 App)/i.test(
    text,
  );

const containsBackendOrAnalyticsScope = (text: string): boolean =>
  /(add backend|connect backend|database write|analytics event|analytics tracking|real user data collection|真实用户数据采集|真实用户反馈收集|保存真实用户)/i.test(
    text,
  );

const containsFullyAutomaticClaim = (text: string): boolean =>
  /(fully automatic high-quality makeup extraction|自动高质量拆妆|全自动高质量|AI 已确认|final recognition)/i.test(
    text,
  );

export const validateMvpGapResolutionSprintPlan = (
  plan: MvpGapResolutionSprintPlanReport,
): MvpGapResolutionSprintValidationResult => {
  const issues: MvpGapResolutionSprintValidationIssue[] = [];

  const p0p1HaveItems = plan.items
    .filter((item) => ['p0', 'p1'].includes(item.priority))
    .every((item) => item.sprintDecision === 'do_in_13d' || item.founderDecisionRequired);
  if (!p0p1HaveItems) {
    issues.push({
      check: 'p0_p1_mvp_gaps_have_resolution_items',
      severity: 'blocker',
      message: 'Every p0/p1 MVP demo gap must have a 13D resolution item or founder decision marker.',
    });
  }

  const productionForced = plan.deferredProductionGaps.some(
    (item) => item.sprintDecision === 'do_in_13d' && !item.founderDecisionRequired,
  );
  if (productionForced) {
    issues.push({
      check: 'production_gaps_not_forced_into_mvp_sprint',
      severity: 'blocker',
      message: 'Production readiness gaps cannot be forced into the immediate MVP sprint.',
    });
  }

  for (const item of plan.phase13DItems) {
    if (item.acceptanceCriteria.length === 0) {
      issues.push({
        check: 'each_13d_item_has_acceptance_criteria',
        severity: 'blocker',
        message: 'Every Phase 13D item needs explicit acceptance criteria.',
        itemId: item.id,
      });
    }
    if (!item.ownerRole) {
      issues.push({
        check: 'each_13d_item_has_owner_role',
        severity: 'blocker',
        message: 'Every Phase 13D item needs an owner role.',
        itemId: item.id,
      });
    }
  }

  const founderDecisionMarked = plan.founderDecisionItems.every(
    (item) => item.founderDecisionRequired && item.sprintDecision === 'needs_founder_decision',
  );
  if (!founderDecisionMarked) {
    issues.push({
      check: 'founder_decision_items_marked',
      severity: 'warning',
      message: 'Founder decision items should be explicitly marked as founder-decision-required.',
    });
  }

  const combinedText = plan.items.map(allTextForItem).join(' ');
  const unsafeRegistryIntent =
    !plan.registryWriteBlocked ||
    !plan.registryMutationBlocked ||
    containsUnsafeRegistryIntent(combinedText);
  if (unsafeRegistryIntent) {
    issues.push({
      check: 'no_registry_write',
      severity: 'blocker',
      message: 'Sprint planning cannot authorize registry write, mutation, publish, shell replacement, or production writer scope.',
    });
  }

  if (!plan.publishBlocked) {
    issues.push({
      check: 'no_publish',
      severity: 'blocker',
      message: 'Sprint planning cannot publish anything.',
    });
  }

  if (!plan.productionWriterBlocked) {
    issues.push({
      check: 'no_production_writer',
      severity: 'blocker',
      message: 'Sprint planning cannot create or enable a production writer.',
    });
  }

  if (!plan.userAppShellReplacementBlocked) {
    issues.push({
      check: 'no_user_app_shell_replacement',
      severity: 'blocker',
      message: 'Sprint planning cannot replace the current User App Shell package.',
    });
  }

  const backendOrAnalyticsScope =
    !plan.noBackend ||
    !plan.noAnalytics ||
    !plan.noRealUserDataCollection ||
    containsBackendOrAnalyticsScope(combinedText);
  if (backendOrAnalyticsScope) {
    issues.push({
      check: 'no_backend_or_analytics_scope',
      severity: 'blocker',
      message: 'Sprint planning cannot add backend, analytics, or real user data collection scope.',
    });
  }

  if (!plan.fullyAutomaticExtractionClaimBlocked || containsFullyAutomaticClaim(combinedText)) {
    issues.push({
      check: 'no_fully_automatic_extraction_claim',
      severity: 'blocker',
      message: 'Sprint planning cannot claim fully automatic high-quality makeup extraction.',
    });
  }

  if (!plan.jsonRoundTripStable) {
    issues.push({
      check: 'json_round_trip_safe',
      severity: 'blocker',
      message: 'Sprint plan must be stable through JSON round-trip.',
    });
  }

  const hasBlocker = issues.some((issue) => issue.severity === 'blocker');
  const status: MvpGapResolutionSprintValidationStatus = hasBlocker
    ? 'sprint_plan_blocked'
    : issues.length > 0
      ? 'sprint_plan_ready_with_warnings'
      : 'sprint_plan_ready';

  const checks: Record<MvpGapResolutionSprintValidationCheck, boolean> = {
    p0_p1_mvp_gaps_have_resolution_items: p0p1HaveItems,
    production_gaps_not_forced_into_mvp_sprint: !productionForced,
    each_13d_item_has_acceptance_criteria: plan.phase13DItems.every(
      (item) => item.acceptanceCriteria.length > 0,
    ),
    each_13d_item_has_owner_role: plan.phase13DItems.every((item) => Boolean(item.ownerRole)),
    founder_decision_items_marked: founderDecisionMarked,
    no_registry_write: !unsafeRegistryIntent,
    no_publish: plan.publishBlocked,
    no_production_writer: plan.productionWriterBlocked,
    no_user_app_shell_replacement: plan.userAppShellReplacementBlocked,
    no_backend_or_analytics_scope: !backendOrAnalyticsScope,
    no_fully_automatic_extraction_claim:
      plan.fullyAutomaticExtractionClaimBlocked && !containsFullyAutomaticClaim(combinedText),
    json_round_trip_safe: plan.jsonRoundTripStable,
  };

  const result: MvpGapResolutionSprintValidationResult = {
    status,
    checks,
    issues,
    recommendations: hasBlocker
      ? ['Fix blockers before Phase 13D scope can be trusted.']
      : ['Proceed to Phase 13D MVP Demo Gap Resolution Sprint 1.'],
    jsonRoundTripStable: false,
  };

  result.jsonRoundTripStable =
    JSON.stringify(JSON.parse(JSON.stringify(result))) === JSON.stringify(result);

  return result;
};
