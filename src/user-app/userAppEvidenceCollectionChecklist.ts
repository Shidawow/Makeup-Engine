import {
  createUserAppEvidenceCollectionProtocol,
  type UserAppEvidenceCollectionProtocol,
} from './userAppEvidenceCollectionProtocol';

export const USER_APP_EVIDENCE_COLLECTION_CHECKLIST_SCHEMA_VERSION =
  'user-app-evidence-collection-checklist-v0.1' as const;

export type UserAppEvidenceCollectionChecklistSection =
  | 'before_trial'
  | 'during_trial'
  | 'after_trial'
  | 'privacy_boundary'
  | 'evidence_quality'
  | 'stop_conditions'
  | 'review_handoff';

export type UserAppEvidenceCollectionChecklistStatus =
  | 'checklist_ready'
  | 'checklist_ready_with_warnings'
  | 'checklist_blocked';

export interface UserAppEvidenceCollectionChecklistItem {
  itemId: string;
  section: UserAppEvidenceCollectionChecklistSection;
  label: string;
  passed: boolean;
  required: boolean;
  blocking: boolean;
  message: string;
}

export interface UserAppEvidenceCollectionChecklistRecommendation {
  recommendationId: string;
  status: UserAppEvidenceCollectionChecklistStatus;
  message: string;
  nextAction: string;
}

export interface UserAppEvidenceCollectionChecklist {
  schemaVersion: typeof USER_APP_EVIDENCE_COLLECTION_CHECKLIST_SCHEMA_VERSION;
  checklistId: string;
  title: string;
  status: UserAppEvidenceCollectionChecklistStatus;
  protocol: UserAppEvidenceCollectionProtocol;
  sections: UserAppEvidenceCollectionChecklistSection[];
  items: UserAppEvidenceCollectionChecklistItem[];
  recommendation: UserAppEvidenceCollectionChecklistRecommendation;
  localOnly: true;
  deterministic: true;
  preparationOnly: true;
  collectsRealUserRecords: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppEvidenceCollectionChecklistInput {
  checklistId?: string;
  title?: string;
  protocol?: UserAppEvidenceCollectionProtocol;
  overrides?: Record<string, boolean>;
}

const createItem = (
  item: Omit<UserAppEvidenceCollectionChecklistItem, 'blocking' | 'message'>,
): UserAppEvidenceCollectionChecklistItem => ({
  ...item,
  blocking: item.required && !item.passed,
  message: item.passed ? '已确认。' : item.required ? '必填确认未通过。' : '建议补齐。',
});

const createDefaultItems = (
  protocol: UserAppEvidenceCollectionProtocol,
  overrides: Record<string, boolean> = {},
): UserAppEvidenceCollectionChecklistItem[] => {
  const hasForbiddenRequest = protocol.forbiddenItems.some((item) => item.requested);
  const noticeReady = Boolean(protocol.participantNotice);
  const baseItems: Array<Omit<UserAppEvidenceCollectionChecklistItem, 'blocking' | 'message'>> = [
    {
      itemId: 'check-before-protocol-ready',
      section: 'before_trial',
      label: '已确认证据收集协议可用',
      passed: protocol.status !== 'protocol_blocked',
      required: true,
    },
    {
      itemId: 'check-before-participant-notice',
      section: 'before_trial',
      label: '已向参与者说明匿名、本地、准备阶段',
      passed: noticeReady,
      required: true,
    },
    {
      itemId: 'check-privacy-no-photo',
      section: 'privacy_boundary',
      label: '已说明不收集照片',
      passed: Boolean(protocol.participantNotice?.mentionsNoPhoto),
      required: true,
    },
    {
      itemId: 'check-privacy-no-upload',
      section: 'privacy_boundary',
      label: '已说明不上传',
      passed: Boolean(protocol.participantNotice?.mentionsNoUpload),
      required: true,
    },
    {
      itemId: 'check-privacy-no-training',
      section: 'privacy_boundary',
      label: '已说明不训练',
      passed: Boolean(protocol.participantNotice?.mentionsNoTraining),
      required: true,
    },
    {
      itemId: 'check-privacy-no-sensitive',
      section: 'privacy_boundary',
      label: '已说明不收集敏感信息',
      passed: Boolean(protocol.participantNotice?.mentionsNoSensitiveInfo),
      required: true,
    },
    {
      itemId: 'check-during-anonymous-only',
      section: 'during_trial',
      label: '已确认只记录匿名观察',
      passed: protocol.allowedItems.every((item) => item.anonymousOnly),
      required: true,
    },
    {
      itemId: 'check-after-no-project-state-records',
      section: 'after_trial',
      label: '已确认不保存真实用户记录到 project-state',
      passed: !protocol.writesProjectStateUserRecords,
      required: true,
    },
    {
      itemId: 'check-after-no-ai-analysis',
      section: 'after_trial',
      label: '已确认不使用 AI 自动分析',
      passed: !protocol.usesAiAnalysis,
      required: true,
    },
    {
      itemId: 'check-evidence-quality-aggregated',
      section: 'evidence_quality',
      label: '已确认会后只保留聚合摘要',
      passed: protocol.allowedItems.some((item) => item.aggregatedOnly),
      required: false,
    },
    {
      itemId: 'check-stop-conditions-ready',
      section: 'stop_conditions',
      label: '已确认停止条件完整',
      passed: protocol.stopConditions.length >= 4,
      required: true,
    },
    {
      itemId: 'check-stop-no-forbidden-request',
      section: 'stop_conditions',
      label: '已确认没有禁止收集项请求',
      passed: !hasForbiddenRequest,
      required: true,
    },
    {
      itemId: 'check-review-handoff-local-only',
      section: 'review_handoff',
      label: '已确认复盘交接只用本地匿名摘要',
      passed: protocol.localOnly && protocol.preparationOnly,
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
  items: readonly UserAppEvidenceCollectionChecklistItem[],
): UserAppEvidenceCollectionChecklistSection[] =>
  Array.from(new Set(items.map((item) => item.section)));

const statusFromItems = (
  items: readonly UserAppEvidenceCollectionChecklistItem[],
): UserAppEvidenceCollectionChecklistStatus => {
  if (items.some((item) => item.blocking)) return 'checklist_blocked';
  if (items.some((item) => !item.passed)) return 'checklist_ready_with_warnings';
  return 'checklist_ready';
};

const recommendationForStatus = (
  status: UserAppEvidenceCollectionChecklistStatus,
): UserAppEvidenceCollectionChecklistRecommendation => {
  const messageByStatus: Record<UserAppEvidenceCollectionChecklistStatus, string> = {
    checklist_ready: '证据收集 checklist 已准备好，可交给质量门最终判断。',
    checklist_ready_with_warnings: 'checklist 有非阻断提醒，建议补齐后再 dry run。',
    checklist_blocked: 'checklist 存在阻断项，不能开始匿名内部 dry run。',
  };

  return {
    recommendationId: `evidence-collection-checklist-${status}`,
    status,
    message: messageByStatus[status],
    nextAction:
      status === 'checklist_blocked'
        ? '先修复参与者说明、隐私边界或停止条件。'
        : '继续保持本地、匿名、不上传、不训练、不写真实用户记录。',
  };
};

export const createUserAppEvidenceCollectionChecklist = (
  input: CreateUserAppEvidenceCollectionChecklistInput = {},
): UserAppEvidenceCollectionChecklist => {
  const protocol = input.protocol ?? createUserAppEvidenceCollectionProtocol();
  const items = createDefaultItems(protocol, input.overrides);
  const status = statusFromItems(items);

  return {
    schemaVersion: USER_APP_EVIDENCE_COLLECTION_CHECKLIST_SCHEMA_VERSION,
    checklistId: input.checklistId ?? 'evidence-collection-checklist-v0',
    title: input.title ?? '证据收集 checklist',
    status,
    protocol,
    sections: sectionsFromItems(items),
    items,
    recommendation: recommendationForStatus(status),
    localOnly: true,
    deterministic: true,
    preparationOnly: true,
    collectsRealUserRecords: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
