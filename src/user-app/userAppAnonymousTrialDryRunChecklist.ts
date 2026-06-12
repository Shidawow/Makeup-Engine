import {
  createUserAppAnonymousTrialDryRunPack,
  type UserAppAnonymousTrialDryRunPack,
} from './userAppAnonymousTrialDryRunPack';

export const USER_APP_ANONYMOUS_TRIAL_DRY_RUN_CHECKLIST_SCHEMA_VERSION =
  'user-app-anonymous-trial-dry-run-checklist-v0.1' as const;

export type UserAppAnonymousTrialDryRunChecklistSection =
  | 'before_dry_run'
  | 'participant_notice'
  | 'admin_rehearsal'
  | 'allowed_evidence'
  | 'forbidden_data'
  | 'during_dry_run'
  | 'stop_conditions'
  | 'after_dry_run'
  | 'review_handoff';

export type UserAppAnonymousTrialDryRunChecklistStatus =
  | 'dry_run_checklist_ready'
  | 'dry_run_checklist_ready_with_warnings'
  | 'dry_run_checklist_blocked';

export interface UserAppAnonymousTrialDryRunChecklistItem {
  itemId: string;
  section: UserAppAnonymousTrialDryRunChecklistSection;
  label: string;
  passed: boolean;
  required: boolean;
  blocking: boolean;
  message: string;
}

export interface UserAppAnonymousTrialDryRunChecklistRecommendation {
  recommendationId: string;
  status: UserAppAnonymousTrialDryRunChecklistStatus;
  message: string;
  nextAction: string;
}

export interface UserAppAnonymousTrialDryRunChecklist {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_DRY_RUN_CHECKLIST_SCHEMA_VERSION;
  checklistId: string;
  title: string;
  status: UserAppAnonymousTrialDryRunChecklistStatus;
  pack: UserAppAnonymousTrialDryRunPack;
  sections: UserAppAnonymousTrialDryRunChecklistSection[];
  items: UserAppAnonymousTrialDryRunChecklistItem[];
  recommendation: UserAppAnonymousTrialDryRunChecklistRecommendation;
  localOnly: true;
  deterministic: true;
  dryRunOnly: true;
  mockEvidenceOnly: true;
  collectsRealUserRecords: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppAnonymousTrialDryRunChecklistInput {
  checklistId?: string;
  title?: string;
  pack?: UserAppAnonymousTrialDryRunPack;
  overrides?: Record<string, boolean>;
}

const createItem = (
  item: Omit<UserAppAnonymousTrialDryRunChecklistItem, 'blocking' | 'message'>,
): UserAppAnonymousTrialDryRunChecklistItem => ({
  ...item,
  blocking: item.required && !item.passed,
  message: item.passed ? '已确认。' : item.required ? '必填确认未通过。' : '建议补齐。',
});

const createDefaultItems = (
  pack: UserAppAnonymousTrialDryRunPack,
  overrides: Record<string, boolean> = {},
): UserAppAnonymousTrialDryRunChecklistItem[] => {
  const notice = pack.participantNotice;
  const hasForbiddenRequest = pack.forbiddenData.some((item) => item.requested);
  const baseItems: Array<Omit<UserAppAnonymousTrialDryRunChecklistItem, 'blocking' | 'message'>> = [
    {
      itemId: 'dry-run-check-before-pack-ready',
      section: 'before_dry_run',
      label: '已确认 dry run pack 可用',
      passed: pack.status !== 'dry_run_blocked',
      required: true,
    },
    {
      itemId: 'dry-run-check-before-scenarios-ready',
      section: 'before_dry_run',
      label: '已确认六个演练场景已准备',
      passed: pack.scenarios.length >= 6 && pack.scenarios.every((scenario) => scenario.ready),
      required: true,
    },
    {
      itemId: 'dry-run-check-notice-local-anonymous',
      section: 'participant_notice',
      label: '已说明匿名、本地、演练阶段',
      passed: Boolean(notice?.anonymousOnly && notice.localOnly),
      required: true,
    },
    {
      itemId: 'dry-run-check-notice-no-photo',
      section: 'participant_notice',
      label: '已说明不收集照片',
      passed: Boolean(notice?.mentionsNoPhoto),
      required: true,
    },
    {
      itemId: 'dry-run-check-notice-no-upload',
      section: 'participant_notice',
      label: '已说明不上传',
      passed: Boolean(notice?.mentionsNoUpload),
      required: true,
    },
    {
      itemId: 'dry-run-check-notice-no-training',
      section: 'participant_notice',
      label: '已说明不训练',
      passed: Boolean(notice?.mentionsNoTraining),
      required: true,
    },
    {
      itemId: 'dry-run-check-notice-no-sensitive',
      section: 'participant_notice',
      label: '已说明不收集姓名/联系方式/健康/敏感身份',
      passed: Boolean(notice?.mentionsNoSensitiveInfo),
      required: true,
    },
    {
      itemId: 'dry-run-check-admin-script',
      section: 'admin_rehearsal',
      label: '管理员演练脚本已准备',
      passed: pack.session.script.length >= 4,
      required: true,
    },
    {
      itemId: 'dry-run-check-allowed-anonymous',
      section: 'allowed_evidence',
      label: '已确认只记录匿名观察',
      passed: pack.allowedEvidence.every((item) => item.anonymousOnly && item.localOnly),
      required: true,
    },
    {
      itemId: 'dry-run-check-allowed-aggregate-template',
      section: 'allowed_evidence',
      label: '已准备聚合摘要模板',
      passed: pack.allowedEvidence.some((item) => item.label.includes('聚合')),
      required: false,
    },
    {
      itemId: 'dry-run-check-forbidden-none-requested',
      section: 'forbidden_data',
      label: '已确认没有照片/联系方式/上传/训练等禁止数据请求',
      passed: !hasForbiddenRequest,
      required: true,
    },
    {
      itemId: 'dry-run-check-during-local-only',
      section: 'during_dry_run',
      label: '演练中只使用本地 mock/匿名记录',
      passed: pack.localOnly && pack.mockEvidenceOnly,
      required: true,
    },
    {
      itemId: 'dry-run-check-stop-ready',
      section: 'stop_conditions',
      label: '已确认 stop condition 已准备',
      passed: pack.stopConditions.length >= 4 && pack.stopConditions.every((item) => item.rehearsed),
      required: true,
    },
    {
      itemId: 'dry-run-check-after-no-project-state-records',
      section: 'after_dry_run',
      label: '已确认不保存真实用户记录到 project-state',
      passed: !pack.writesProjectStateUserRecords,
      required: true,
    },
    {
      itemId: 'dry-run-check-after-no-ai-analysis',
      section: 'after_dry_run',
      label: '已确认不使用 AI 自动分析',
      passed: !pack.usesAiAnalysis,
      required: true,
    },
    {
      itemId: 'dry-run-check-review-handoff-anonymous',
      section: 'review_handoff',
      label: '复盘交接只使用匿名摘要',
      passed: pack.collectsRealUserRecords === false && pack.backendRecordSystem === false,
      required: true,
    },
  ];

  return baseItems.map((item) =>
    createItem({
      ...item,
      passed: overrides[item.itemId] ?? item.passed,
    }),
  );
};

const sectionsFromItems = (
  items: readonly UserAppAnonymousTrialDryRunChecklistItem[],
): UserAppAnonymousTrialDryRunChecklistSection[] =>
  Array.from(new Set(items.map((item) => item.section)));

const statusFromItems = (
  items: readonly UserAppAnonymousTrialDryRunChecklistItem[],
): UserAppAnonymousTrialDryRunChecklistStatus => {
  if (items.some((item) => item.blocking)) return 'dry_run_checklist_blocked';
  if (items.some((item) => !item.passed)) return 'dry_run_checklist_ready_with_warnings';
  return 'dry_run_checklist_ready';
};

const recommendationForStatus = (
  status: UserAppAnonymousTrialDryRunChecklistStatus,
): UserAppAnonymousTrialDryRunChecklistRecommendation => {
  const messageByStatus: Record<UserAppAnonymousTrialDryRunChecklistStatus, string> = {
    dry_run_checklist_ready: 'dry run checklist 已准备好，可进入复盘判断。',
    dry_run_checklist_ready_with_warnings: 'checklist 有非阻断提醒，建议先补齐再演练。',
    dry_run_checklist_blocked: 'checklist 存在阻断项，不能开始 dry run。',
  };

  return {
    recommendationId: `anonymous-dry-run-checklist-${status}`,
    status,
    message: messageByStatus[status],
    nextAction:
      status === 'dry_run_checklist_blocked'
        ? '先修复参与者说明、禁止数据请求或停止条件。'
        : '继续保持匿名、本地、不上传、不训练、不写真实用户记录。',
  };
};

export const createUserAppAnonymousTrialDryRunChecklist = (
  input: CreateUserAppAnonymousTrialDryRunChecklistInput = {},
): UserAppAnonymousTrialDryRunChecklist => {
  const pack = input.pack ?? createUserAppAnonymousTrialDryRunPack();
  const items = createDefaultItems(pack, input.overrides);
  const status = statusFromItems(items);

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_DRY_RUN_CHECKLIST_SCHEMA_VERSION,
    checklistId: input.checklistId ?? 'anonymous-trial-dry-run-checklist-v0',
    title: input.title ?? '匿名内部试用 dry run checklist',
    status,
    pack,
    sections: sectionsFromItems(items),
    items,
    recommendation: recommendationForStatus(status),
    localOnly: true,
    deterministic: true,
    dryRunOnly: true,
    mockEvidenceOnly: true,
    collectsRealUserRecords: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
