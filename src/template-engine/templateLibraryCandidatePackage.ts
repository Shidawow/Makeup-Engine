import type { MakeupTemplate, MakeupStep } from '../templates/schema';
import type { MakeupAttributeCandidateReport } from './makeupAttributeCandidates';
import type { RuleBasedStepSequence } from './ruleBasedStepGenerator';
import type { MakeupTemplateDraftReport } from './templateDraftGenerator';
import type { TemplateDraftHumanReview } from './templateDraftHumanReview';
import type { TemplateDraftQaResult } from './templateDraftQa';
import type { TemplateDraftReviewWorkflow } from './templateDraftReviewWorkflow';

export type TemplateLibraryCandidatePackageStatus =
  | 'candidate_package_ready'
  | 'candidate_package_ready_with_warnings'
  | 'candidate_package_blocked'
  | 'candidate_package_example_only';

export interface TemplateLibraryCandidatePackageSource {
  sourceDraftId: string | null;
  sourceReviewWorkflowId: string;
  sourceType: 'template_draft_review_workflow';
  approvedHumanReviewDecision: TemplateDraftHumanReview['decision'];
}

export interface TemplateLibraryCandidatePackageSection {
  id: string;
  label: string;
  status: 'ready' | 'warning' | 'blocked';
  summary: string;
}

export interface TemplateLibraryCandidatePackageWarning {
  id: string;
  message: string;
  recommendation: string;
}

export interface TemplateLibraryCandidatePackageBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface TemplateLibraryCandidatePackageReviewTrace {
  qaStatus: TemplateDraftQaResult['status'];
  humanReviewStatus: TemplateDraftHumanReview['status'];
  reviewWorkflowStatus: TemplateDraftReviewWorkflow['queueItem']['status'];
  qaIssueIds: string[];
  humanReviewIssueIds: string[];
  publishBlocked: true;
  notPublished: true;
  formalTemplateLibraryWriteBlocked: true;
  userAppTemplatePackageGenerationBlocked: true;
}

export interface TemplateLibraryCandidatePackage {
  candidateId: string;
  sourceDraftId: string | null;
  sourceReviewWorkflowId: string;
  approvedHumanReviewDecision: TemplateDraftHumanReview['decision'];
  title: string;
  summary: string;
  styleTags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  suitableScenarios: string[];
  regionGuidance: string[];
  reviewedAttributeCandidates: Array<{
    id: string;
    region: string;
    kind: string;
    value: string;
    confidence: number;
    reviewStatus: string;
  }>;
  reviewedSteps: MakeupStep[];
  toolsChecklist: string[];
  productSuggestionPlaceholders: Array<{
    category: string;
    colorFamily?: string;
    finish?: string;
    placeholderOnly: true;
  }>;
  qaTrace: TemplateLibraryCandidatePackageReviewTrace;
  humanReviewTrace: TemplateLibraryCandidatePackageReviewTrace;
  privacyBoundaryTrace: {
    noRawImageReference: boolean;
    noRealPersonalData: boolean;
    noUpload: true;
    noTraining: true;
    noBackend: true;
  };
  sections: TemplateLibraryCandidatePackageSection[];
  packagingWarnings: TemplateLibraryCandidatePackageWarning[];
  blockedReasons: TemplateLibraryCandidatePackageBlockedReason[];
  packageStatus: TemplateLibraryCandidatePackageStatus;
  notPublished: true;
  formalTemplateLibraryWriteBlocked: true;
  userAppTemplatePackageGenerationBlocked: true;
}

export interface CreateTemplateLibraryCandidatePackageInput {
  attributeCandidates: MakeupAttributeCandidateReport;
  stepSequence: RuleBasedStepSequence;
  templateDraft: MakeupTemplateDraftReport;
  draftQa: TemplateDraftQaResult;
  humanReview: TemplateDraftHumanReview;
  reviewWorkflow: TemplateDraftReviewWorkflow;
  candidateId?: string;
}

const rawImageReferencePattern =
  /data:image|blob:|object URL|base64|\/Users\/|\/private\/|[A-Z]:\\|file:\/\/|face_landmarker\.task|vision_wasm/i;
const personalDataPattern =
  /真实姓名|手机号|邮箱|联系方式|身份证|健康信息|过敏|faceEmbedding|biometricId|biometric identifier|raw camera/i;
const finalClaimPattern =
  /最终识别完成|最终识别为|最终结果|final result|final recognition|final approval|AI 已确认|正式模板/i;
const medicalClaimPattern = /治疗|修复皮肤病|痤疮治疗|过敏改善|medical|diagnos/i;
const shadeClaimPattern = /色号|shade\s*#?|mac\s|nars\s|armani\s|dior\s|ysl\s|chanel\s/i;
const userAppMutationPattern =
  /generatedUserAppTemplatePackage|mutatesUserAppTemplatePackage|appTemplateId|packageId|UserAppTemplatePackage mutation/i;

const stringifyPackageInput = (input: CreateTemplateLibraryCandidatePackageInput): string =>
  JSON.stringify(
    {
      candidates: input.attributeCandidates.candidates,
      steps: input.stepSequence.steps,
      draft: input.templateDraft.draft,
      draftNotes: input.templateDraft.notes,
      reviewComments: input.humanReview.comments,
    },
    null,
    2,
  );

const unique = (items: readonly string[]): string[] =>
  Array.from(new Set(items.filter((item) => item.trim().length > 0)));

const createBlockedReason = (
  id: string,
  message: string,
  recommendation: string,
): TemplateLibraryCandidatePackageBlockedReason => ({ id, message, recommendation });

const createTrace = (
  draftQa: TemplateDraftQaResult,
  humanReview: TemplateDraftHumanReview,
  reviewWorkflow: TemplateDraftReviewWorkflow,
): TemplateLibraryCandidatePackageReviewTrace => ({
  qaStatus: draftQa.status,
  humanReviewStatus: humanReview.status,
  reviewWorkflowStatus: reviewWorkflow.queueItem.status,
  qaIssueIds: draftQa.issues.map((issue) => issue.id),
  humanReviewIssueIds: humanReview.issues.map((issue) => issue.id),
  publishBlocked: true,
  notPublished: true,
  formalTemplateLibraryWriteBlocked: true,
  userAppTemplatePackageGenerationBlocked: true,
});

const difficultyForSteps = (steps: readonly MakeupStep[]): TemplateLibraryCandidatePackage['difficulty'] => {
  if (steps.length <= 4) {
    return 'beginner';
  }
  if (steps.length <= 7) {
    return 'intermediate';
  }
  return 'advanced';
};

const createEmptyDraftTitle = (draft: MakeupTemplate | null): string =>
  draft?.name ?? '未生成模板草稿';

export const createTemplateLibraryCandidatePackage = (
  input: CreateTemplateLibraryCandidatePackageInput,
): TemplateLibraryCandidatePackage => {
  const draft = input.templateDraft.draft;
  const sourceDraftId = draft?.id ?? null;
  const sourceText = stringifyPackageInput(input);
  const blockedReasons: TemplateLibraryCandidatePackageBlockedReason[] = [];
  const packagingWarnings: TemplateLibraryCandidatePackageWarning[] = [];

  if (
    input.humanReview.status !== 'approved_as_template_library_candidate' ||
    input.reviewWorkflow.queueItem.status !== 'approved_as_library_candidate' ||
    input.humanReview.decision !== 'approve_for_template_library_candidate'
  ) {
    blockedReasons.push(
      createBlockedReason(
        'missing_human_review_approval',
        'Candidate package requires approved human review decision from Phase 10B.',
        'Complete human review and approve as template library candidate before packaging.',
      ),
    );
  }

  if (input.draftQa.status === 'draft_qa_blocked' || input.templateDraft.status === 'draft_blocked') {
    blockedReasons.push(
      createBlockedReason(
        'qa_blocked',
        'QA is blocked, so a ready candidate package cannot be created.',
        'Fix draft QA or upstream region QA before packaging.',
      ),
    );
  }

  if (/privacy|scope|photo|biometric|contract|UserAppTemplatePackage/i.test(sourceText)) {
    const hasBlockingPrivacy = [...input.draftQa.issues, ...input.humanReview.issues].some(
      (issue) => /privacy|scope|photo|biometric|contract|UserAppTemplatePackage/i.test(issue.id + issue.message),
    );
    if (hasBlockingPrivacy) {
      blockedReasons.push(
        createBlockedReason(
          'privacy_or_scope_risk',
          'Privacy, scope, biometric, or user app contract risk blocks candidate packaging.',
          'Remove unsafe data or scope claims before packaging.',
        ),
      );
    }
  }

  if (rawImageReferencePattern.test(sourceText)) {
    blockedReasons.push(
      createBlockedReason(
        'raw_image_reference',
        'Candidate package must not contain image bytes, base64, object URLs, local paths, or MediaPipe runtime assets.',
        'Keep only durable review trace and template metadata in the candidate package.',
      ),
    );
  }

  if (personalDataPattern.test(sourceText)) {
    blockedReasons.push(
      createBlockedReason(
        'real_personal_data',
        'Candidate package must not contain real personal, health, contact, or biometric data.',
        'Remove personal data and keep the package anonymous.',
      ),
    );
  }

  if (userAppMutationPattern.test(sourceText)) {
    blockedReasons.push(
      createBlockedReason(
        'user_app_template_package_mutation',
        'Candidate packaging must not mutate or generate UserAppTemplatePackage fields.',
        'Move app contract generation to a later explicit phase.',
      ),
    );
  }

  if (finalClaimPattern.test(sourceText)) {
    blockedReasons.push(
      createBlockedReason(
        'unsupported_final_claim',
        'Candidate package must not contain final recognition, final approval, or formal-template claims.',
        'Use candidate and draft wording until later review stages.',
      ),
    );
  }

  if (medicalClaimPattern.test(sourceText)) {
    blockedReasons.push(
      createBlockedReason(
        'medical_claim',
        'Candidate package must not contain medical or skin-health claims.',
        'Remove treatment or diagnosis wording before packaging.',
      ),
    );
  }

  if (shadeClaimPattern.test(sourceText)) {
    blockedReasons.push(
      createBlockedReason(
        'product_shade_claim',
        'Candidate package must not contain brand-specific or shade-specific product claims.',
        'Keep product suggestions as category placeholders only.',
      ),
    );
  }

  if (input.draftQa.status === 'draft_qa_ready_with_warnings') {
    packagingWarnings.push({
      id: 'qa_ready_with_warnings',
      message: 'Draft QA is ready with warnings.',
      recommendation: 'Let candidate library reviewers check warning details before any later packaging.',
    });
  }

  const reviewedSteps = input.stepSequence.steps;
  const productSuggestionPlaceholders = reviewedSteps.map((step) => ({
    category: step.productCategory,
    colorFamily: step.colorFamily,
    finish: step.finish,
    placeholderOnly: true as const,
  }));
  const trace = createTrace(input.draftQa, input.humanReview, input.reviewWorkflow);
  const packageStatus: TemplateLibraryCandidatePackageStatus =
    input.humanReview.status === 'example_only'
      ? 'candidate_package_example_only'
      : blockedReasons.length > 0
        ? 'candidate_package_blocked'
        : packagingWarnings.length > 0
          ? 'candidate_package_ready_with_warnings'
          : 'candidate_package_ready';

  return {
    candidateId: input.candidateId ?? `candidate-package-${sourceDraftId ?? input.reviewWorkflow.id}`,
    sourceDraftId,
    sourceReviewWorkflowId: input.reviewWorkflow.id,
    approvedHumanReviewDecision: input.humanReview.decision,
    title: createEmptyDraftTitle(draft),
    summary: draft?.faceStrategy.summary ?? '模板库候选包需要有效模板草稿摘要。',
    styleTags: draft?.metadata.styleTags ?? ['candidate-only'],
    difficulty: difficultyForSteps(reviewedSteps),
    estimatedTime: `${Math.max(1, reviewedSteps.length) * 3} min`,
    suitableScenarios: draft?.goals ?? ['candidate library review'],
    regionGuidance: reviewedSteps.map(
      (step) => `${step.region}: ${step.placement.area} / ${step.instruction}`,
    ),
    reviewedAttributeCandidates: input.attributeCandidates.candidates.map((candidate) => ({
      id: candidate.id,
      region: candidate.region,
      kind: candidate.kind,
      value: candidate.value,
      confidence: candidate.confidence,
      reviewStatus: candidate.reviewStatus,
    })),
    reviewedSteps,
    toolsChecklist: unique(reviewedSteps.map((step) => step.tool)),
    productSuggestionPlaceholders,
    qaTrace: trace,
    humanReviewTrace: trace,
    privacyBoundaryTrace: {
      noRawImageReference: !rawImageReferencePattern.test(sourceText),
      noRealPersonalData: !personalDataPattern.test(sourceText),
      noUpload: true,
      noTraining: true,
      noBackend: true,
    },
    sections: [
      {
        id: 'candidate_package',
        label: 'Candidate Package',
        status: blockedReasons.length > 0 ? 'blocked' : packagingWarnings.length > 0 ? 'warning' : 'ready',
        summary: 'Template draft, reviewed candidates, steps, QA trace, human review trace, and privacy trace are packaged locally.',
      },
      {
        id: 'candidate_validation',
        label: 'Candidate Validation',
        status: blockedReasons.length > 0 ? 'blocked' : 'ready',
        summary: 'Validation runs separately before candidate library review.',
      },
      {
        id: 'candidate_handoff',
        label: 'Candidate Handoff',
        status: blockedReasons.length > 0 ? 'blocked' : 'ready',
        summary: 'Handoff is for later candidate library review only, not publication.',
      },
    ],
    packagingWarnings,
    blockedReasons,
    packageStatus,
    notPublished: true,
    formalTemplateLibraryWriteBlocked: true,
    userAppTemplatePackageGenerationBlocked: true,
  };
};
