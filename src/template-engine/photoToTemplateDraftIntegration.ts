import type {
  MakeupSemanticCandidate,
  MakeupSemanticCandidateKey,
  MakeupSemanticConfidenceBand,
  MakeupSemanticExtractionReport,
  MakeupSemanticSourceType,
} from '../vision';
import type { MakeupAttributeCandidateReport } from './makeupAttributeCandidates';
import type { RuleBasedStepSequence } from './ruleBasedStepGenerator';
import type { MakeupTemplateDraftReport } from './templateDraftGenerator';

export type PhotoToTemplateDraftIntegrationStatus =
  | 'integration_ready_for_human_review'
  | 'integration_ready_with_warnings'
  | 'integration_blocked'
  | 'demo_only'
  | 'insufficient_semantic_evidence';

export type PhotoToTemplateDraftReviewerDecision =
  | 'pending_review'
  | 'accept_candidate'
  | 'edit_candidate'
  | 'reject_candidate'
  | 'mark_insufficient_evidence'
  | 'require_more_review'
  | 'block_template_draft';

export type PhotoToTemplateDraftFieldKey =
  | 'title'
  | 'summary'
  | 'styleCandidate'
  | 'suitableScenario'
  | 'difficulty'
  | 'estimatedTime'
  | 'toolList'
  | 'stepSequence'
  | 'beginnerTips'
  | 'commonMistakes'
  | 'correctionTips'
  | 'regionGuidance'
  | 'userAppPreviewNotes';

export interface PhotoToTemplateDraftFieldSource {
  field: PhotoToTemplateDraftFieldKey;
  sourceType: MakeupSemanticSourceType | 'semantic_candidate_integrated';
  confidenceBand: MakeupSemanticConfidenceBand;
  evidence: string[];
  limitations: string[];
  humanReviewRequired: true;
  notFinal: true;
}

export interface PhotoToTemplateDraftSemanticBinding extends PhotoToTemplateDraftFieldSource {
  bindingId: string;
  label: string;
  semanticCandidateKey: MakeupSemanticCandidateKey;
  originalCandidateValue: string;
  editableDraftValue: string;
  reviewerDecision: PhotoToTemplateDraftReviewerDecision;
  reviewerNote: string;
}

export interface PhotoToTemplateDraftEditState {
  editable: true;
  localOnly: true;
  fields: PhotoToTemplateDraftSemanticBinding[];
  acceptedIntoDraftCount: number;
  rejectedCount: number;
  blockedCount: number;
  pendingReviewCount: number;
}

export interface PhotoToTemplateDraftIntegrationIssue {
  id: string;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface PhotoToTemplateDraftIntegrationRecommendation {
  id: string;
  message: string;
  nextAction:
    | 'continue_to_human_review_editing'
    | 'request_more_semantic_evidence'
    | 'request_reviewer_edit'
    | 'block_template_draft'
    | 'keep_demo_only';
}

export interface PhotoToTemplateDraftIntegrationReport {
  integrationId: string;
  sourceSemanticReportId: string;
  sourceTemplateDraftStatus: MakeupTemplateDraftReport['status'] | 'missing';
  status: PhotoToTemplateDraftIntegrationStatus;
  bindings: PhotoToTemplateDraftSemanticBinding[];
  fieldSources: PhotoToTemplateDraftFieldSource[];
  editState: PhotoToTemplateDraftEditState;
  issues: PhotoToTemplateDraftIntegrationIssue[];
  recommendations: PhotoToTemplateDraftIntegrationRecommendation[];
  allBindingsHumanReviewRequired: boolean;
  allBindingsNotFinal: boolean;
  sourceMetadataPreserved: boolean;
  publishBlocked: true;
  registryWriteBlocked: true;
  registryMutationBlocked: true;
  productionWriterBlocked: true;
  userAppShellReplacementBlocked: true;
  fullyAutomaticExtractionClaimBlocked: true;
  userAppTemplatePackageMutationBlocked: true;
  jsonRoundTripStable: boolean;
  nextRecommendedPhase: 'Phase 12D - Photo-to-Template Operator Workflow & Draft Preview QA';
}

export interface PhotoToTemplateDraftIntegrationInput {
  semanticReport?: MakeupSemanticExtractionReport | null;
  attributeCandidates?: MakeupAttributeCandidateReport | null;
  stepSequence?: RuleBasedStepSequence | null;
  templateDraft?: MakeupTemplateDraftReport | null;
  reviewerDecisions?: Partial<
    Record<
      PhotoToTemplateDraftFieldKey,
      {
        decision?: PhotoToTemplateDraftReviewerDecision;
        editableDraftValue?: string;
        reviewerNote?: string;
      }
    >
  >;
  integrationId?: string;
}

interface FieldSpec {
  field: PhotoToTemplateDraftFieldKey;
  label: string;
  semanticCandidateKey: MakeupSemanticCandidateKey;
  draftValue: (input: {
    candidate: MakeupSemanticCandidate;
    templateDraft?: MakeupTemplateDraftReport | null;
    attributeCandidates?: MakeupAttributeCandidateReport | null;
    stepSequence?: RuleBasedStepSequence | null;
  }) => string;
}

const unknownCandidate = 'unknown';

const fieldSpecs: FieldSpec[] = [
  {
    field: 'title',
    label: '标题草稿',
    semanticCandidateKey: 'overallStyleCandidate',
    draftValue: ({ candidate, templateDraft }) =>
      `${templateDraft?.draft?.style.family ?? '自然'}妆容草稿（${candidate.value} 候选）`,
  },
  {
    field: 'summary',
    label: '摘要草稿',
    semanticCandidateKey: 'overallStyleCandidate',
    draftValue: ({ candidate }) =>
      `基于本地语义候选整理的妆容草稿摘要：${candidate.value}。需人工审核后才能进入模板草稿。`,
  },
  {
    field: 'styleCandidate',
    label: '整体风格候选',
    semanticCandidateKey: 'overallStyleCandidate',
    draftValue: ({ candidate }) => `${candidate.value}_draft_style`,
  },
  {
    field: 'suitableScenario',
    label: '适用场景草稿',
    semanticCandidateKey: 'overallStyleCandidate',
    draftValue: ({ candidate }) =>
      candidate.value.includes('fresh') ? '日常通勤候选场景' : '日常练习候选场景',
  },
  {
    field: 'difficulty',
    label: '难度草稿',
    semanticCandidateKey: 'eyeMakeupIntensityCandidate',
    draftValue: ({ candidate }) =>
      candidate.value.includes('dramatic') || candidate.value.includes('defined') ? '中等候选难度' : '新手友好候选难度',
  },
  {
    field: 'estimatedTime',
    label: '预计耗时草稿',
    semanticCandidateKey: 'overallStyleCandidate',
    draftValue: ({ stepSequence }) => `${stepSequence?.steps.length ?? 0} 个草稿步骤，约 8-12 分钟`,
  },
  {
    field: 'toolList',
    label: '工具清单草稿',
    semanticCandidateKey: 'overallStyleCandidate',
    draftValue: ({ stepSequence }) =>
      Array.from(new Set(stepSequence?.steps.map((step) => step.tool).filter(Boolean) ?? []))
        .join('、') || '工具清单待人工补充',
  },
  {
    field: 'stepSequence',
    label: '步骤草稿',
    semanticCandidateKey: 'overallStyleCandidate',
    draftValue: ({ stepSequence }) =>
      stepSequence?.steps.map((step) => `${step.order}. ${step.region}: ${step.instruction}`).join(' / ') ??
      '步骤草稿待生成',
  },
  {
    field: 'beginnerTips',
    label: '新手提示草稿',
    semanticCandidateKey: 'lipFinishCandidate',
    draftValue: ({ candidate }) =>
      `先少量叠加并观察 ${candidate.value} 候选效果，必要时让审核者调整文案。`,
  },
  {
    field: 'commonMistakes',
    label: '常见错误草稿',
    semanticCandidateKey: 'blushPlacementCandidate',
    draftValue: ({ candidate }) =>
      `不要把 ${candidate.value} 候选直接当作固定位置；实际区域需人工复核。`,
  },
  {
    field: 'correctionTips',
    label: '修正提示草稿',
    semanticCandidateKey: 'blushIntensityCandidate',
    draftValue: ({ candidate }) =>
      `若 ${candidate.value} 候选偏强，先降低用量再由审核者确认表达。`,
  },
  {
    field: 'regionGuidance',
    label: '区域说明草稿',
    semanticCandidateKey: 'eyeMakeupIntensityCandidate',
    draftValue: ({ candidate }) =>
      `眼部区域参考 ${candidate.value} 候选，但范围、层次和教学口吻必须人工确认。`,
  },
  {
    field: 'userAppPreviewNotes',
    label: '用户 App 预览备注草稿',
    semanticCandidateKey: 'overallStyleCandidate',
    draftValue: ({ candidate }) =>
      `用户侧只展示自然语言草稿，不展示 source/confidence/evidence：${candidate.value}。`,
  },
];

const evidenceText = (candidate: MakeupSemanticCandidate): string[] =>
  candidate.evidence.flatMap((item) => [
    `${item.region}: samples=${item.sampleCount}`,
    ...(item.averageHue === undefined ? [] : [`hue=${item.averageHue}`]),
    ...(item.averageSaturation === undefined ? [] : [`saturation=${item.averageSaturation}`]),
    ...(item.averageBrightness === undefined ? [] : [`brightness=${item.averageBrightness}`]),
    ...item.notes,
  ]);

const metadataPreserved = (binding: PhotoToTemplateDraftSemanticBinding): boolean =>
  Boolean(binding.sourceType) &&
  Boolean(binding.confidenceBand) &&
  binding.evidence.length > 0 &&
  binding.limitations.length > 0 &&
  binding.humanReviewRequired === true &&
  binding.notFinal === true;

const jsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const unsafeDraftPattern =
  /fully automatic|全自动高质量|AI 已确认|最终识别|最终结果|正式模板|已发布|registry write|写入 registry|production writer|UserAppTemplatePackage mutation|generatedUserAppTemplatePackage/i;

export const createPhotoToTemplateDraftIntegrationReport = ({
  semanticReport = null,
  attributeCandidates = null,
  stepSequence = null,
  templateDraft = null,
  reviewerDecisions = {},
  integrationId = 'phase-12c-photo-to-template-draft-integration',
}: PhotoToTemplateDraftIntegrationInput): PhotoToTemplateDraftIntegrationReport => {
  const issues: PhotoToTemplateDraftIntegrationIssue[] = [];

  if (!semanticReport) {
    issues.push({
      id: 'missing_semantic_report',
      severity: 'blocking',
      message: 'Makeup semantic extraction report is required before draft integration.',
      recommendation: 'Run Phase 12B semantic extraction before binding draft fields.',
    });
  }

  if (semanticReport?.status === 'semantic_extraction_blocked') {
    issues.push({
      id: 'semantic_extraction_blocked',
      severity: 'blocking',
      message: 'Blocked semantic extraction cannot feed a ready draft integration.',
      recommendation: 'Fix region QA or pixel evidence before draft integration.',
    });
  }

  if (!templateDraft || templateDraft.status === 'draft_blocked' || !templateDraft.draft) {
    issues.push({
      id: 'missing_template_draft',
      severity: 'blocking',
      message: 'A draft-only template is required before semantic candidates can be integrated.',
      recommendation: 'Generate a local template draft and keep publishBlocked true.',
    });
  }

  const bindings: PhotoToTemplateDraftSemanticBinding[] = semanticReport
    ? fieldSpecs.map((spec) => {
        const candidate = semanticReport.candidates[spec.semanticCandidateKey];
        const override = reviewerDecisions[spec.field];
        const editableDraftValue =
          override?.editableDraftValue ??
          spec.draftValue({
            candidate,
            templateDraft,
            attributeCandidates,
            stepSequence,
          });

        return {
          bindingId: `${integrationId}-${spec.field}`,
          field: spec.field,
          label: spec.label,
          semanticCandidateKey: spec.semanticCandidateKey,
          sourceType: candidate.sourceType,
          confidenceBand: candidate.confidenceBand,
          evidence: evidenceText(candidate),
          limitations: candidate.limitations,
          humanReviewRequired: true,
          notFinal: true,
          originalCandidateValue: candidate.value,
          editableDraftValue,
          reviewerDecision: override?.decision ?? 'pending_review',
          reviewerNote:
            override?.reviewerNote ??
            '待人工审核。接受候选也只是进入草稿，不是定稿或发布。',
        };
      })
    : [];

  bindings.forEach((binding) => {
    if (!metadataPreserved(binding)) {
      issues.push({
        id: `${binding.field}_metadata_missing`,
        severity: 'blocking',
        message: `${binding.label} is missing source, confidence, evidence, limitations, notFinal, or human review trace.`,
        recommendation: 'Regenerate the binding and preserve all semantic candidate metadata.',
      });
    }
    if (binding.sourceType === 'insufficient_evidence' || binding.confidenceBand === 'insufficient') {
      issues.push({
        id: `${binding.field}_insufficient_evidence`,
        severity: 'warning',
        message: `${binding.label} has insufficient semantic evidence.`,
        recommendation: 'Keep the field editable and ask the reviewer to fill or reject it.',
      });
    }
    if (unsafeDraftPattern.test(`${binding.originalCandidateValue}\n${binding.editableDraftValue}\n${binding.reviewerNote}`)) {
      issues.push({
        id: `${binding.field}_unsafe_claim`,
        severity: 'blocking',
        message: `${binding.label} contains final, AI-confirmed, publish, registry, or production wording.`,
        recommendation: 'Replace unsafe wording with candidate-only draft language.',
      });
    }
  });

  const allBindingsHumanReviewRequired = bindings.every(
    (binding) => binding.humanReviewRequired === true,
  );
  const allBindingsNotFinal = bindings.every((binding) => binding.notFinal === true);
  const sourceMetadataPreserved = bindings.length > 0 && bindings.every(metadataPreserved);
  const insufficientCount = bindings.filter(
    (binding) =>
      binding.sourceType === 'insufficient_evidence' ||
      binding.confidenceBand === 'insufficient',
  ).length;
  const acceptedIntoDraftCount = bindings.filter(
    (binding) => binding.reviewerDecision === 'accept_candidate' || binding.reviewerDecision === 'edit_candidate',
  ).length;
  const rejectedCount = bindings.filter(
    (binding) => binding.reviewerDecision === 'reject_candidate',
  ).length;
  const blockedCount = bindings.filter(
    (binding) => binding.reviewerDecision === 'block_template_draft',
  ).length;
  const pendingReviewCount = bindings.filter(
    (binding) => binding.reviewerDecision === 'pending_review' || binding.reviewerDecision === 'require_more_review',
  ).length;

  if (!allBindingsHumanReviewRequired || !allBindingsNotFinal || !sourceMetadataPreserved) {
    issues.push({
      id: 'semantic_metadata_boundary_broken',
      severity: 'blocking',
      message: 'Semantic candidate bindings must remain notFinal and human-review-required with full metadata.',
      recommendation: 'Block draft integration until all candidate metadata is preserved.',
    });
  }

  const hasBlocking = issues.some((issue) => issue.severity === 'blocking');
  const hasWarnings = issues.some((issue) => issue.severity === 'warning');
  const status: PhotoToTemplateDraftIntegrationStatus = hasBlocking
    ? 'integration_blocked'
    : !semanticReport?.imageId
      ? 'demo_only'
      : insufficientCount >= Math.ceil(bindings.length / 2)
        ? 'insufficient_semantic_evidence'
        : hasWarnings
          ? 'integration_ready_with_warnings'
          : 'integration_ready_for_human_review';

  const report: PhotoToTemplateDraftIntegrationReport = {
    integrationId,
    sourceSemanticReportId: semanticReport?.reportId ?? 'missing-semantic-report',
    sourceTemplateDraftStatus: templateDraft?.status ?? 'missing',
    status,
    bindings,
    fieldSources: bindings.map(
      ({
        field,
        sourceType,
        confidenceBand,
        evidence,
        limitations,
        humanReviewRequired,
        notFinal,
      }) => ({
        field,
        sourceType,
        confidenceBand,
        evidence,
        limitations,
        humanReviewRequired,
        notFinal,
      }),
    ),
    editState: {
      editable: true,
      localOnly: true,
      fields: bindings,
      acceptedIntoDraftCount,
      rejectedCount,
      blockedCount,
      pendingReviewCount,
    },
    issues,
    recommendations: [
      {
        id: 'continue_to_human_review_editing',
        message: '语义候选已接入草稿字段后，必须进入人工审核编辑。',
        nextAction: hasBlocking ? 'block_template_draft' : 'continue_to_human_review_editing',
      },
      {
        id: 'keep_candidate_metadata',
        message: '保留 source type、confidence band、evidence、limitations、original candidate 和 edited draft value。',
        nextAction: sourceMetadataPreserved ? 'request_reviewer_edit' : 'request_more_semantic_evidence',
      },
      {
        id: 'block_publish_registry',
        message: '12C 不发布、不写 registry、不替换 User App Shell package。',
        nextAction: 'block_template_draft',
      },
    ],
    allBindingsHumanReviewRequired,
    allBindingsNotFinal,
    sourceMetadataPreserved,
    publishBlocked: true,
    registryWriteBlocked: true,
    registryMutationBlocked: true,
    productionWriterBlocked: true,
    userAppShellReplacementBlocked: true,
    fullyAutomaticExtractionClaimBlocked: true,
    userAppTemplatePackageMutationBlocked: true,
    jsonRoundTripStable: false,
    nextRecommendedPhase: 'Phase 12D - Photo-to-Template Operator Workflow & Draft Preview QA',
  };

  return {
    ...report,
    jsonRoundTripStable: jsonRoundTripStable(report),
  };
};
