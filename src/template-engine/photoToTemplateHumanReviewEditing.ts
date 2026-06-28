import type {
  PhotoToTemplateDraftFieldKey,
  PhotoToTemplateDraftIntegrationReport,
  PhotoToTemplateDraftReviewerDecision,
  PhotoToTemplateDraftSemanticBinding,
} from './photoToTemplateDraftIntegration';

export type PhotoToTemplateHumanReviewEditingStatus =
  | 'human_review_editing_ready_for_draft_qa'
  | 'human_review_editing_needs_more_review'
  | 'human_review_editing_blocked';

export type PhotoToTemplateHumanReviewDecision = PhotoToTemplateDraftReviewerDecision;

export interface PhotoToTemplateHumanReviewEditableField {
  field: PhotoToTemplateDraftFieldKey;
  label: string;
  sourceType: PhotoToTemplateDraftSemanticBinding['sourceType'];
  confidenceBand: PhotoToTemplateDraftSemanticBinding['confidenceBand'];
  evidence: string[];
  limitations: string[];
  originalCandidateValue: string;
  editableDraftValue: string;
  reviewerDecision: PhotoToTemplateHumanReviewDecision;
  reviewerNote: string;
  entersDraft: boolean;
  humanReviewRequired: true;
  notFinal: true;
}

export interface PhotoToTemplateHumanReviewEdit {
  field: PhotoToTemplateDraftFieldKey;
  decision: PhotoToTemplateHumanReviewDecision;
  editedValue?: string;
  reviewerNote: string;
}

export interface PhotoToTemplateHumanReviewChecklist {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
}

export interface PhotoToTemplateHumanReviewIssue {
  id: string;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface PhotoToTemplateHumanReviewEditingSession {
  sessionId: string;
  sourceIntegrationId: string;
  status: PhotoToTemplateHumanReviewEditingStatus;
  editableFields: PhotoToTemplateHumanReviewEditableField[];
  edits: PhotoToTemplateHumanReviewEdit[];
  checklist: PhotoToTemplateHumanReviewChecklist[];
  issues: PhotoToTemplateHumanReviewIssue[];
  readyForDraftQa: boolean;
  allAcceptedFieldsRemainDraftOnly: boolean;
  originalCandidateTracePreserved: boolean;
  humanReviewRequiredTracePreserved: boolean;
  publishBlocked: true;
  registryWriteBlocked: true;
  registryMutationBlocked: true;
  productionWriterBlocked: true;
  userAppShellReplacementBlocked: true;
  aiAutoConfirmationBlocked: true;
  jsonRoundTripStable: boolean;
}

export interface PhotoToTemplateHumanReviewEditingInput {
  integration: PhotoToTemplateDraftIntegrationReport;
  edits?: PhotoToTemplateHumanReviewEdit[];
  checklist?: PhotoToTemplateHumanReviewChecklist[];
  sessionId?: string;
}

export const createDefaultPhotoToTemplateHumanReviewChecklist = (
  checked = false,
): PhotoToTemplateHumanReviewChecklist[] => [
  {
    id: 'confirm_candidate_only',
    label: '确认语义候选接入草稿，不是最终模板',
    checked,
    required: true,
  },
  {
    id: 'confirm_source_metadata',
    label: '确认 source type / confidence band / evidence / limitations 已保留',
    checked,
    required: true,
  },
  {
    id: 'confirm_original_and_edited_values',
    label: '确认 original candidate 与 editable draft value 都可追溯',
    checked,
    required: true,
  },
  {
    id: 'confirm_accept_is_draft_only',
    label: '确认 accept 只是进入草稿，不是定稿、发布或入 registry',
    checked,
    required: true,
  },
  {
    id: 'confirm_no_ai_auto_confirmation',
    label: '确认没有 AI 自动确认或全自动拆妆表述',
    checked,
    required: true,
  },
  {
    id: 'confirm_no_sensitive_data',
    label: '确认没有照片、身份、健康、生物识别或联系方式数据',
    checked,
    required: true,
  },
];

const unsafeReviewPattern =
  /AI 已确认|自动确认|fully automatic|全自动高质量|最终识别|最终结果|正式模板|已发布|publish|registry write|写入 registry|production writer|UserAppTemplatePackage|色号|\bshade\s*#?\b|治疗|medical|diagnos|真实姓名|手机号|邮箱|健康信息|faceEmbedding|biometric/i;

const decisionEntersDraft = (decision: PhotoToTemplateHumanReviewDecision): boolean =>
  decision === 'accept_candidate' || decision === 'edit_candidate';

const jsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const createPhotoToTemplateHumanReviewEditingSession = ({
  integration,
  edits = [],
  checklist = createDefaultPhotoToTemplateHumanReviewChecklist(false),
  sessionId = `phase-12c-human-review-editing-${integration.integrationId}`,
}: PhotoToTemplateHumanReviewEditingInput): PhotoToTemplateHumanReviewEditingSession => {
  const issues: PhotoToTemplateHumanReviewIssue[] = [];
  const editByField = new Map(edits.map((edit) => [edit.field, edit]));

  if (integration.status === 'integration_blocked') {
    issues.push({
      id: 'integration_blocked',
      severity: 'blocking',
      message: 'Draft integration is blocked, so human review editing cannot enter draft QA.',
      recommendation: 'Fix integration blockers before reviewing draft fields.',
    });
  }

  const editableFields: PhotoToTemplateHumanReviewEditableField[] = integration.bindings.map(
    (binding) => {
      const edit = editByField.get(binding.field);
      const reviewerDecision = edit?.decision ?? binding.reviewerDecision;
      const editableDraftValue =
        reviewerDecision === 'edit_candidate'
          ? edit?.editedValue ?? binding.editableDraftValue
          : binding.editableDraftValue;
      const reviewerNote = edit?.reviewerNote ?? binding.reviewerNote;

      return {
        field: binding.field,
        label: binding.label,
        sourceType: binding.sourceType,
        confidenceBand: binding.confidenceBand,
        evidence: binding.evidence,
        limitations: binding.limitations,
        originalCandidateValue: binding.originalCandidateValue,
        editableDraftValue,
        reviewerDecision,
        reviewerNote,
        entersDraft: decisionEntersDraft(reviewerDecision),
        humanReviewRequired: true,
        notFinal: true,
      };
    },
  );

  editableFields.forEach((field) => {
    const rawEditedValue = editByField.get(field.field)?.editedValue ?? '';

    if (!field.humanReviewRequired || !field.notFinal) {
      issues.push({
        id: `${field.field}_boundary_missing`,
        severity: 'blocking',
        message: `${field.label} lost humanReviewRequired or notFinal trace.`,
        recommendation: 'Regenerate the editing field from the integration binding.',
      });
    }
    if (!field.originalCandidateValue || !field.editableDraftValue) {
      issues.push({
        id: `${field.field}_value_missing`,
        severity: 'blocking',
        message: `${field.label} must preserve both original candidate and editable draft values.`,
        recommendation: 'Keep original candidate value and edited value side by side.',
      });
    }
    if (field.reviewerDecision === 'edit_candidate' && field.editableDraftValue === field.originalCandidateValue) {
      issues.push({
        id: `${field.field}_edit_without_change`,
        severity: 'warning',
        message: `${field.label} was marked edited but the editable value did not change.`,
        recommendation: 'Either change the draft value or use accept_candidate.',
      });
    }
    if (
      field.reviewerDecision === 'mark_insufficient_evidence' ||
      field.reviewerDecision === 'require_more_review'
    ) {
      issues.push({
        id: `${field.field}_needs_more_review`,
        severity: 'warning',
        message: `${field.label} is not ready for draft QA because evidence is insufficient or more review is required.`,
        recommendation: 'Keep the field editable and request reviewer clarification.',
      });
    }
    if (field.reviewerDecision === 'block_template_draft') {
      issues.push({
        id: `${field.field}_blocked_by_reviewer`,
        severity: 'blocking',
        message: `${field.label} was blocked by the reviewer.`,
        recommendation: 'Do not move this draft to QA until the block is resolved.',
      });
    }
    if (
      unsafeReviewPattern.test(
        `${field.originalCandidateValue}\n${field.editableDraftValue}\n${rawEditedValue}\n${field.reviewerNote}`,
      )
    ) {
      issues.push({
        id: `${field.field}_unsafe_review_wording`,
        severity: 'blocking',
        message: `${field.label} contains unsafe final, publish, registry, shade, medical, AI, or personal-data wording.`,
        recommendation: 'Replace with draft-only, non-sensitive, category-level copy.',
      });
    }
  });

  const missingChecklist = checklist.some((item) => item.required && !item.checked);
  if (missingChecklist) {
    issues.push({
      id: 'checklist_incomplete',
      severity: 'warning',
      message: 'Human review editing checklist is not complete.',
      recommendation: 'Complete the checklist before moving the draft into QA.',
    });
  }

  const hasBlocking = issues.some((issue) => issue.severity === 'blocking');
  const hasWarning = issues.some((issue) => issue.severity === 'warning');
  const acceptedOrEdited = editableFields.some((field) => field.entersDraft);
  const status: PhotoToTemplateHumanReviewEditingStatus = hasBlocking
    ? 'human_review_editing_blocked'
    : hasWarning || !acceptedOrEdited
      ? 'human_review_editing_needs_more_review'
      : 'human_review_editing_ready_for_draft_qa';

  const session: PhotoToTemplateHumanReviewEditingSession = {
    sessionId,
    sourceIntegrationId: integration.integrationId,
    status,
    editableFields,
    edits,
    checklist,
    issues,
    readyForDraftQa: status === 'human_review_editing_ready_for_draft_qa',
    allAcceptedFieldsRemainDraftOnly: editableFields
      .filter((field) => field.entersDraft)
      .every((field) => field.notFinal && field.humanReviewRequired),
    originalCandidateTracePreserved: editableFields.every(
      (field) => field.originalCandidateValue.length > 0,
    ),
    humanReviewRequiredTracePreserved: editableFields.every(
      (field) => field.humanReviewRequired,
    ),
    publishBlocked: true,
    registryWriteBlocked: true,
    registryMutationBlocked: true,
    productionWriterBlocked: true,
    userAppShellReplacementBlocked: true,
    aiAutoConfirmationBlocked: true,
    jsonRoundTripStable: false,
  };

  return {
    ...session,
    jsonRoundTripStable: jsonRoundTripStable(session),
  };
};
