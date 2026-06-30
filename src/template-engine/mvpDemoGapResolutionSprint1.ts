import type {
  MvpGapResolutionSprintItem,
  MvpGapResolutionSprintPlanReport,
} from './mvpGapResolutionSprintPlan';

export type MvpDemoGapResolutionCategory =
  | 'first_run_clarity'
  | 'trial_template_consistency'
  | 'trust_wording'
  | 'mobile_demo_usability'
  | 'operator_workflow_explanation';

export type MvpDemoGapResolutionStatus =
  | 'resolved'
  | 'resolved_with_warnings'
  | 'not_resolved'
  | 'deferred';

export interface MvpDemoGapResolutionEvidence {
  evidenceId: string;
  label: string;
  detail: string;
  sourceArea: 'user_app' | 'trial_content' | 'template_studio' | 'tests' | 'docs';
}

export interface MvpDemoGapResolutionIssue {
  issueId: string;
  severity: 'warning' | 'blocking';
  message: string;
}

export interface MvpDemoGapResolutionRecommendation {
  recommendationId: string;
  message: string;
  nextPhase: '13E' | '14A';
}

export interface MvpDemoGapResolutionItem {
  itemId: string;
  sourceSprintItemId: string;
  category: MvpDemoGapResolutionCategory;
  gapTitle: string;
  resolutionSummary: string;
  changedAreas: string[];
  acceptanceCriteria: string[];
  evidence: MvpDemoGapResolutionEvidence[];
  status: MvpDemoGapResolutionStatus;
  remainingIssues: MvpDemoGapResolutionIssue[];
  nextAction: string;
}

export interface MvpDemoGapResolutionSprint1Report {
  reportId: string;
  sourceSprintPlanId: string;
  status: MvpDemoGapResolutionStatus;
  items: MvpDemoGapResolutionItem[];
  resolvedItems: MvpDemoGapResolutionItem[];
  warningItems: MvpDemoGapResolutionItem[];
  deferredItems: MvpDemoGapResolutionItem[];
  recommendations: MvpDemoGapResolutionRecommendation[];
  registryChainPausedAfter10U: true;
  realWriteAuthorizationPaused: true;
  noRegistryWrite: true;
  noRegistryMutation: true;
  noPublish: true;
  noProductionWriter: true;
  noUserAppShellReplacement: true;
  noBackend: true;
  noAnalytics: true;
  noCameraOrAr: true;
  noAiApi: true;
  noTraining: true;
  noRealUserPhotos: true;
  noBase64OrLocalPhotoPath: true;
  noPersonalData: true;
  notProductionReadiness: true;
  notRealUserResearch: true;
  jsonRoundTripStable: boolean;
  nextRecommendedPhase:
    | 'Phase 14A - Internal Founder Demo Run'
    | 'Phase 13E - MVP Demo Gap Resolution Sprint 2';
}

const categoryForSprintItem = (
  item: MvpGapResolutionSprintItem,
): MvpDemoGapResolutionCategory | null => {
  if (item.title === 'User App first-run clarity polish') return 'first_run_clarity';
  if (item.title === 'Trial template content consistency polish') {
    return 'trial_template_consistency';
  }
  if (item.title === 'Step guidance trust wording polish') return 'trust_wording';
  if (item.title === 'Mobile demo touch target / spacing polish') {
    return 'mobile_demo_usability';
  }
  if (item.title === 'Operator workflow explanation tightening') {
    return 'operator_workflow_explanation';
  }
  return null;
};

const resolutionCopy: Record<
  MvpDemoGapResolutionCategory,
  {
    summary: string;
    changedAreas: string[];
    evidence: MvpDemoGapResolutionEvidence[];
  }
> = {
  first_run_clarity: {
    summary:
      'User App first screen now explains the local makeup coaching MVP, the three-step start path, and local-only privacy boundary without administrator terms.',
    changedAreas: ['UserAppShell', 'UserAppMobileHome', 'UserAppTemplateSelection'],
    evidence: [
      {
        evidenceId: 'first-run-how-to-start',
        label: 'How-to-start copy',
        detail: '首页说明“选择妆容、查看准备、分步骤跟练”。',
        sourceArea: 'user_app',
      },
      {
        evidenceId: 'first-run-admin-hidden',
        label: 'Admin terms hidden',
        detail: '普通用户路径不展示 sprint planning / roadmap / gap resolution。',
        sourceArea: 'tests',
      },
    ],
  },
  trial_template_consistency: {
    summary:
      'The three MVP trial templates keep consistent fields, step count, tools, product placeholders, completion recap, and demo risk notes.',
    changedAreas: ['mvp-trial-content-pack.example', 'trial template content tests'],
    evidence: [
      {
        evidenceId: 'trial-template-three-complete',
        label: 'Three complete trial templates',
        detail: '新手通勤淡妆、日系温柔约会妆、韩系清透低饱和妆字段齐全且结构一致。',
        sourceArea: 'trial_content',
      },
    ],
  },
  trust_wording: {
    summary:
      'Guided steps now describe template practice and completion checks without implying the system recognized the user face, makeup, or photo.',
    changedAreas: ['UserAppStepGuide', 'step guidance trust wording tests'],
    evidence: [
      {
        evidenceId: 'trust-template-practice-copy',
        label: 'Template-practice copy',
        detail: '步骤页提示“当前步骤来自演示模板，可作为新手练习参考”。',
        sourceArea: 'user_app',
      },
    ],
  },
  mobile_demo_usability: {
    summary:
      'Mobile demo controls use larger tap targets, clearer card spacing, and bottom padding so sticky actions do not cover core step content.',
    changedAreas: ['UserAppMobileHome', 'UserAppTemplateSelection', 'UserAppStepGuide'],
    evidence: [
      {
        evidenceId: 'mobile-touch-targets',
        label: 'Touch-sized actions',
        detail: 'Primary CTAs use min-h-12 and the step guide keeps padding above sticky actions.',
        sourceArea: 'tests',
      },
    ],
  },
  operator_workflow_explanation: {
    summary:
      'Template Studio operator panels now start with what the panel does, why it is not publication, and which human-review/no-registry boundaries remain active.',
    changedAreas: [
      'MvpGapResolutionSprintPlanPanel',
      'FounderDemoReviewPanel',
      'MvpGapPrioritizationPanel',
      'PhotoToTemplateOperatorWorkflowPanel',
    ],
    evidence: [
      {
        evidenceId: 'operator-panel-boundary-copy',
        label: 'Operator explanation copy',
        detail: '后台面板突出草稿、候选、人工审核、不能发布、不能写 registry。',
        sourceArea: 'template_studio',
      },
    ],
  },
};

const createResolutionItem = (
  sprintItem: MvpGapResolutionSprintItem,
  category: MvpDemoGapResolutionCategory,
): MvpDemoGapResolutionItem => {
  const copy = resolutionCopy[category];

  return {
    itemId: `13d-${category}`,
    sourceSprintItemId: sprintItem.id,
    category,
    gapTitle: sprintItem.title,
    resolutionSummary: copy.summary,
    changedAreas: copy.changedAreas,
    acceptanceCriteria: sprintItem.acceptanceCriteria.map((criterion) => criterion.description),
    evidence: copy.evidence,
    status: 'resolved',
    remainingIssues: [],
    nextAction:
      category === 'operator_workflow_explanation'
        ? 'Use this wording in the founder demo and keep production gaps deferred.'
        : 'Keep regression tests in the next demo polish pass.',
  };
};

export const createMvpDemoGapResolutionSprint1Report = ({
  reportId = 'mvp-demo-gap-resolution-sprint-1-13d',
  sprintPlan,
}: {
  reportId?: string;
  sprintPlan: MvpGapResolutionSprintPlanReport;
}): MvpDemoGapResolutionSprint1Report => {
  const items = sprintPlan.phase13DItems
    .map((item) => {
      const category = categoryForSprintItem(item);
      return category ? createResolutionItem(item, category) : null;
    })
    .filter((item): item is MvpDemoGapResolutionItem => Boolean(item));

  const requiredCategories: MvpDemoGapResolutionCategory[] = [
    'first_run_clarity',
    'trial_template_consistency',
    'trust_wording',
    'mobile_demo_usability',
    'operator_workflow_explanation',
  ];
  const presentCategories = new Set(items.map((item) => item.category));
  const missingItems = requiredCategories
    .filter((category) => !presentCategories.has(category))
    .map(
      (category): MvpDemoGapResolutionItem => ({
        itemId: `13d-missing-${category}`,
        sourceSprintItemId: 'missing-source-sprint-item',
        category,
        gapTitle: category,
        resolutionSummary: 'Required 13D gap was not found in the source sprint plan.',
        changedAreas: [],
        acceptanceCriteria: [],
        evidence: [],
        status: 'not_resolved',
        remainingIssues: [
          {
            issueId: `${category}-missing`,
            severity: 'blocking',
            message: 'Required 13D gap resolution item is missing.',
          },
        ],
        nextAction: 'Restore the missing 13D sprint item before demo.',
      }),
    );

  const allItems = [...items, ...missingItems];
  const resolvedItems = allItems.filter((item) => item.status === 'resolved');
  const warningItems = allItems.filter((item) => item.status === 'resolved_with_warnings');
  const deferredItems = allItems.filter((item) => item.status === 'deferred');
  const hasBlockingIssue = allItems.some((item) =>
    item.remainingIssues.some((issue) => issue.severity === 'blocking'),
  );

  const report: MvpDemoGapResolutionSprint1Report = {
    reportId,
    sourceSprintPlanId: sprintPlan.reportId,
    status: hasBlockingIssue
      ? 'not_resolved'
      : warningItems.length > 0
        ? 'resolved_with_warnings'
        : 'resolved',
    items: allItems,
    resolvedItems,
    warningItems,
    deferredItems,
    recommendations: [
      {
        recommendationId: hasBlockingIssue ? 'continue-13e' : 'run-founder-demo',
        message: hasBlockingIssue
          ? 'Run Phase 13E before founder demo because a required 13D gap remains unresolved.'
          : '13D Sprint 1 gaps are ready for an internal founder demo run.',
        nextPhase: hasBlockingIssue ? '13E' : '14A',
      },
    ],
    registryChainPausedAfter10U: true,
    realWriteAuthorizationPaused: true,
    noRegistryWrite: true,
    noRegistryMutation: true,
    noPublish: true,
    noProductionWriter: true,
    noUserAppShellReplacement: true,
    noBackend: true,
    noAnalytics: true,
    noCameraOrAr: true,
    noAiApi: true,
    noTraining: true,
    noRealUserPhotos: true,
    noBase64OrLocalPhotoPath: true,
    noPersonalData: true,
    notProductionReadiness: true,
    notRealUserResearch: true,
    jsonRoundTripStable: false,
    nextRecommendedPhase: hasBlockingIssue
      ? 'Phase 13E - MVP Demo Gap Resolution Sprint 2'
      : 'Phase 14A - Internal Founder Demo Run',
  };

  report.jsonRoundTripStable =
    JSON.stringify(JSON.parse(JSON.stringify(report))) === JSON.stringify(report);

  return report;
};
