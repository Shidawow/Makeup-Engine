import type { UserAppTemplate, UserAppTemplatePackage } from '../templates/schema';
import {
  validateUserAppTemplate,
  validateUserAppTemplatePackage,
} from '../template-engine/app-contract';
import {
  createInitialUserAppSession,
  USER_APP_SESSION_VERSION,
  type UserAppSessionIssue,
  type UserAppSessionState,
  type UserAppSessionTemplateProgressSnapshot,
} from './userAppSession';
import { validateTemplateDiscoveryState } from './userTemplateDiscovery';

export type UserAppSessionRecoveryStatus =
  | 'restored'
  | 'partially_restored'
  | 'reset'
  | 'blocked';

export interface UserAppSessionRecoveryWarning {
  code:
    | 'version_mismatch_reset'
    | 'selected_template_fallback'
    | 'active_step_fallback'
    | 'stale_completed_steps_removed'
    | 'stale_skipped_steps_removed'
    | 'discovery_filter_reset'
    | 'package_blocked_step_guide_disabled';
  message: string;
}

export interface UserAppSessionRecoveryReport {
  status: UserAppSessionRecoveryStatus;
  session: UserAppSessionState;
  warnings: UserAppSessionRecoveryWarning[];
  issues: UserAppSessionIssue[];
  restoredSelectedTemplateId?: string;
  restoredActiveStepId?: string;
  canRestoreStepGuide: boolean;
  localOnly: true;
  modifiesTemplatePackage: false;
  writesTrainingInput: false;
}

const uniqueStrings = (items: readonly string[]): string[] => Array.from(new Set(items));

const sortTemplates = (templates: readonly UserAppTemplate[]): UserAppTemplate[] =>
  [...templates].sort((left, right) =>
    left.appDisplayHints.sortPriority === right.appDisplayHints.sortPriority
      ? left.appTemplateId.localeCompare(right.appTemplateId)
      : right.appDisplayHints.sortPriority - left.appDisplayHints.sortPriority,
  );

const findFirstUsableTemplate = (
  packageData: UserAppTemplatePackage,
): UserAppTemplate | undefined =>
  sortTemplates(packageData.templates).find(
    (template) => validateUserAppTemplate(template).blockingIssues.length === 0,
  );

export const reconcileSelectedTemplate = (input: {
  session: UserAppSessionState;
  packageData: UserAppTemplatePackage;
}): {
  session: UserAppSessionState;
  template?: UserAppTemplate;
  warnings: UserAppSessionRecoveryWarning[];
} => {
  const selected = input.session.selectedTemplateId
    ? input.packageData.templates.find(
        (template) => template.appTemplateId === input.session.selectedTemplateId,
      )
    : undefined;

  if (selected) {
    return { session: input.session, template: selected, warnings: [] };
  }

  const fallback = findFirstUsableTemplate(input.packageData);

  if (!fallback) {
    return {
      session: {
        ...input.session,
        selectedTemplateId: undefined,
        activeStepId: undefined,
        templateProgress: undefined,
      },
      warnings: [
        {
          code: 'selected_template_fallback',
          message: 'Saved template no longer exists and no usable fallback template is available.',
        },
      ],
    };
  }

  return {
    session: {
      ...input.session,
      selectedTemplateId: fallback.appTemplateId,
      activeStepId: fallback.steps[0]?.stepId,
      templateProgress: {
        templateId: fallback.appTemplateId,
        activeStepId: fallback.steps[0]?.stepId,
        orderedStepIds: fallback.steps
          .slice()
          .sort((left, right) =>
            left.order === right.order
              ? left.stepId.localeCompare(right.stepId)
              : left.order - right.order,
          )
          .map((step) => step.stepId),
        completedStepIds: [],
        skippedStepIds: [],
        progressPercent: 0,
      },
    },
    template: fallback,
    warnings: [
      {
        code: 'selected_template_fallback',
        message: 'Saved template was not found; restored the first usable template instead.',
      },
    ],
  };
};

const orderedStepIdsForTemplate = (template: UserAppTemplate): string[] =>
  template.steps
    .slice()
    .sort((left, right) =>
      left.order === right.order
        ? left.stepId.localeCompare(right.stepId)
        : left.order - right.order,
    )
    .map((step) => step.stepId);

const progressPercent = (
  orderedStepIds: readonly string[],
  completedStepIds: readonly string[],
): number =>
  orderedStepIds.length === 0
    ? 0
    : Math.round((completedStepIds.length / orderedStepIds.length) * 100);

export const reconcileStepProgress = (input: {
  session: UserAppSessionState;
  template?: UserAppTemplate;
}): {
  session: UserAppSessionState;
  warnings: UserAppSessionRecoveryWarning[];
} => {
  if (!input.template) {
    return { session: input.session, warnings: [] };
  }

  const orderedStepIds = orderedStepIdsForTemplate(input.template);
  const validStepIds = new Set(orderedStepIds);
  const savedProgress = input.session.templateProgress;
  const completedStepIds = uniqueStrings(savedProgress?.completedStepIds ?? []).filter(
    (stepId) => validStepIds.has(stepId),
  );
  const skippedStepIds = uniqueStrings(savedProgress?.skippedStepIds ?? []).filter(
    (stepId) => validStepIds.has(stepId) && !completedStepIds.includes(stepId),
  );
  const staleCompleted = (savedProgress?.completedStepIds ?? []).filter(
    (stepId) => !validStepIds.has(stepId),
  );
  const staleSkipped = (savedProgress?.skippedStepIds ?? []).filter(
    (stepId) => !validStepIds.has(stepId),
  );
  const finished = new Set([...completedStepIds, ...skippedStepIds]);
  const fallbackStepId = orderedStepIds.find((stepId) => !finished.has(stepId)) ?? orderedStepIds[0];
  const activeStepId =
    input.session.activeStepId && validStepIds.has(input.session.activeStepId)
      ? input.session.activeStepId
      : savedProgress?.activeStepId && validStepIds.has(savedProgress.activeStepId)
        ? savedProgress.activeStepId
        : fallbackStepId;
  const nextProgress: UserAppSessionTemplateProgressSnapshot = {
    templateId: input.template.appTemplateId,
    activeStepId,
    orderedStepIds,
    completedStepIds,
    skippedStepIds,
    progressPercent: progressPercent(orderedStepIds, completedStepIds),
  };
  const warnings: UserAppSessionRecoveryWarning[] = [
    ...(activeStepId !== input.session.activeStepId
      ? [
          {
            code: 'active_step_fallback' as const,
            message: 'Saved step no longer exists; restored the next available step.',
          },
        ]
      : []),
    ...(staleCompleted.length > 0
      ? [
          {
            code: 'stale_completed_steps_removed' as const,
            message: 'Saved completed steps that no longer exist were removed.',
          },
        ]
      : []),
    ...(staleSkipped.length > 0
      ? [
          {
            code: 'stale_skipped_steps_removed' as const,
            message: 'Saved skipped steps that no longer exist were removed.',
          },
        ]
      : []),
  ];

  return {
    session: {
      ...input.session,
      activeStepId,
      templateProgress: nextProgress,
    },
    warnings,
  };
};

export const reconcileDiscoveryFilters = (
  session: UserAppSessionState,
): {
  session: UserAppSessionState;
  warnings: UserAppSessionRecoveryWarning[];
} => {
  const issues = validateTemplateDiscoveryState({
    filter: session.discovery.filter,
    sortMode: session.discovery.sortMode,
    preferredStyleTags: session.discovery.preferredStyleTags,
    localOnly: true,
    modifiesTemplatePackage: false,
    writesTrainingInput: false,
    writesProjectState: false,
  });

  if (issues.length === 0) {
    return { session, warnings: [] };
  }

  const fallback = createInitialUserAppSession({
    selectedTemplateId: session.selectedTemplateId,
    activeStepId: session.activeStepId,
    templateProgress: session.templateProgress,
    onboarding: session.onboarding,
    localPreferences: session.localPreferences,
    lastVisitedSection: session.lastVisitedSection,
    dismissedLocalWarnings: session.dismissedLocalWarnings,
  });

  return {
    session: {
      ...session,
      discovery: fallback.discovery,
    },
    warnings: [
      {
        code: 'discovery_filter_reset',
        message: 'Saved discovery filters were invalid and have been reset.',
      },
    ],
  };
};

export const reconcileSessionWithTemplatePackage = (input: {
  session: UserAppSessionState;
  packageData?: UserAppTemplatePackage | null;
}): UserAppSessionRecoveryReport => {
  if (!input.packageData) {
    const resetSession = createInitialUserAppSession({ status: 'reset' });

    return createSessionRecoveryReport({
      session: resetSession,
      warnings: [
        {
          code: 'selected_template_fallback',
          message: 'No UserAppTemplatePackage is available; local session was reset.',
        },
      ],
      issues: [],
      canRestoreStepGuide: false,
      status: 'reset',
    });
  }

  if (input.session.schemaVersion !== USER_APP_SESSION_VERSION) {
    const resetSession = createInitialUserAppSession({ status: 'reset' });

    return createSessionRecoveryReport({
      session: resetSession,
      warnings: [
        {
          code: 'version_mismatch_reset',
          message: 'Saved session version is not compatible; local session was reset.',
        },
      ],
      issues: [],
      canRestoreStepGuide: false,
      status: 'reset',
    });
  }

  const packageValidation = validateUserAppTemplatePackage(input.packageData);
  const selected = reconcileSelectedTemplate({
    session: input.session,
    packageData: input.packageData,
  });
  const progress = reconcileStepProgress({
    session: selected.session,
    template: selected.template,
  });
  const discovery = reconcileDiscoveryFilters(progress.session);
  const packageBlocked = packageValidation.blockingIssues.length > 0;
  const blockedWarnings: UserAppSessionRecoveryWarning[] = packageBlocked
    ? [
        {
          code: 'package_blocked_step_guide_disabled',
          message: 'Current package has blocking issues; step guide restore is disabled.',
        },
      ]
    : [];
  const canRestoreStepGuide =
    !packageBlocked &&
    Boolean(discovery.session.selectedTemplateId && discovery.session.activeStepId);
  const recoveredSession: UserAppSessionState = {
    ...discovery.session,
    status: packageBlocked ? 'blocked' : 'restored',
    activeStepId: canRestoreStepGuide ? discovery.session.activeStepId : undefined,
    lastVisitedSection:
      packageBlocked && discovery.session.lastVisitedSection === 'guidance'
        ? 'session'
        : discovery.session.lastVisitedSection,
  };
  const warnings = [
    ...selected.warnings,
    ...progress.warnings,
    ...discovery.warnings,
    ...blockedWarnings,
  ];

  return createSessionRecoveryReport({
    session: recoveredSession,
    warnings,
    issues: [],
    canRestoreStepGuide,
    status: packageBlocked
      ? 'blocked'
      : warnings.length > 0
        ? 'partially_restored'
        : 'restored',
  });
};

export const recoverUserAppSession = (input: {
  session?: UserAppSessionState | null;
  packageData?: UserAppTemplatePackage | null;
  issues?: UserAppSessionIssue[];
}): UserAppSessionRecoveryReport => {
  if (!input.session || (input.issues?.length ?? 0) > 0) {
    return createSessionRecoveryReport({
      session: createInitialUserAppSession({ status: 'reset' }),
      warnings: [
        {
          code: 'version_mismatch_reset',
          message: 'Saved session could not be loaded safely; local session was reset.',
        },
      ],
      issues: input.issues ?? [],
      canRestoreStepGuide: false,
      status: 'reset',
    });
  }

  return reconcileSessionWithTemplatePackage({
    session: input.session,
    packageData: input.packageData,
  });
};

export const createSessionRecoveryReport = (input: {
  session: UserAppSessionState;
  warnings: UserAppSessionRecoveryWarning[];
  issues: UserAppSessionIssue[];
  canRestoreStepGuide: boolean;
  status: UserAppSessionRecoveryStatus;
}): UserAppSessionRecoveryReport => ({
  status: input.status,
  session: input.session,
  warnings: input.warnings,
  issues: input.issues,
  restoredSelectedTemplateId: input.session.selectedTemplateId,
  restoredActiveStepId: input.session.activeStepId,
  canRestoreStepGuide: input.canRestoreStepGuide,
  localOnly: true,
  modifiesTemplatePackage: false,
  writesTrainingInput: false,
});

export const createSessionRecoveryWarnings = (
  report: UserAppSessionRecoveryReport,
): string[] => [
  ...report.warnings.map((warning) => warning.message),
  ...report.issues.map((issue) => issue.message),
];
