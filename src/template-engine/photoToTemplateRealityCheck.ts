import type { FaceMeshRegionQaReport, MakeupAnalysisPipelineResult } from '../vision';
import type { MakeupAttributeCandidateReport } from './makeupAttributeCandidates';
import type { RuleBasedStepSequence } from './ruleBasedStepGenerator';
import type { MakeupTemplateDraftReport } from './templateDraftGenerator';

export type PhotoToTemplateRealitySourceType =
  | 'real_from_photo'
  | 'facemesh_derived'
  | 'region_qa_derived'
  | 'pixel_rule_derived'
  | 'region_pixel_derived'
  | 'color_rule_derived'
  | 'brightness_rule_derived'
  | 'saturation_rule_derived'
  | 'semantic_rule_derived'
  | 'template_rule_derived'
  | 'demo_fixture'
  | 'placeholder'
  | 'human_required'
  | 'unsupported';

export type PhotoToTemplateRealityCapabilityStatus =
  | 'draft_generation_supported_with_human_review'
  | 'draft_generation_supported_with_limitations'
  | 'draft_generation_blocked'
  | 'demo_only'
  | 'unsupported_for_automatic_extraction';

export type PhotoToTemplateRealityFieldKey =
  | 'faceDetected'
  | 'landmarkCount'
  | 'boundingBox'
  | 'readinessScore'
  | 'regionCoverage'
  | 'cosmeticRegions'
  | 'lipColor'
  | 'lipFinish'
  | 'blushPlacement'
  | 'eyeMakeupIntensity'
  | 'eyeshadowTone'
  | 'eyelinerShape'
  | 'browShape'
  | 'contourPresence'
  | 'highlightPresence'
  | 'overallMakeupStyle'
  | 'templateTitle'
  | 'templateSummary'
  | 'suitableScenario'
  | 'difficulty'
  | 'estimatedTime'
  | 'toolList'
  | 'stepSequence'
  | 'beginnerTips'
  | 'commonMistakes'
  | 'correctionTips'
  | 'userAppPreview';

export interface PhotoToTemplateRealityFieldEvidence {
  field: PhotoToTemplateRealityFieldKey;
  label: string;
  sourceTypes: PhotoToTemplateRealitySourceType[];
  capabilityStatus: PhotoToTemplateRealityCapabilityStatus;
  evidence: string[];
  humanReviewRequired: boolean;
  valuePreview?: string;
}

export interface PhotoToTemplateRealityRisk {
  id: string;
  severity: 'warning' | 'blocking';
  message: string;
}

export interface PhotoToTemplateRealityRecommendation {
  id: string;
  message: string;
  nextAction:
    | 'continue_with_human_review'
    | 'label_sources_more_clearly'
    | 'build_semantic_extraction_baseline'
    | 'keep_demo_only'
    | 'block_automatic_extraction_claim';
}

export interface PhotoToTemplateRealityGap {
  id: string;
  area:
    | 'semantic_extraction'
    | 'visual_measurement'
    | 'template_copy'
    | 'human_review'
    | 'productization_boundary';
  message: string;
}

export type PhotoToTemplateRealityDecision =
  | 'semi_automatic_draft_with_human_review'
  | 'semi_automatic_draft_with_limitations'
  | 'keep_as_demo_only'
  | 'blocked_do_not_claim_automatic_extraction';

export interface PhotoToTemplateRealityCheckReport {
  reportId: string;
  sourceImageId: string | null;
  capabilityStatus: PhotoToTemplateRealityCapabilityStatus;
  decision: PhotoToTemplateRealityDecision;
  fieldEvidence: PhotoToTemplateRealityFieldEvidence[];
  sourceSummary: Record<PhotoToTemplateRealitySourceType, number>;
  risks: PhotoToTemplateRealityRisk[];
  recommendations: PhotoToTemplateRealityRecommendation[];
  gaps: PhotoToTemplateRealityGap[];
  claims: string[];
  humanReviewRequired: true;
  readinessScoreIsRuleBased: true;
  supportsSemiAutomaticDraft: boolean;
  supportsFullyAutomaticExtraction: false;
  registryChainPausedAfter10U: true;
  noRegistryWrite: true;
  noRegistryMutation: true;
  noPublish: true;
  noProductionWriter: true;
  noUserAppShellReplacement: true;
  nextRecommendedPhase: 'Phase 12B - Makeup Semantic Extraction Baseline';
}

export interface PhotoToTemplateRealityCheckInput {
  analysis?: MakeupAnalysisPipelineResult | null;
  regionQa?: FaceMeshRegionQaReport | null;
  attributeCandidates?: MakeupAttributeCandidateReport | null;
  stepSequence?: RuleBasedStepSequence | null;
  templateDraft?: MakeupTemplateDraftReport | null;
  claims?: string[];
  reportId?: string;
}

const sourceSummarySeed: Record<PhotoToTemplateRealitySourceType, number> = {
  real_from_photo: 0,
  facemesh_derived: 0,
  region_qa_derived: 0,
  pixel_rule_derived: 0,
  region_pixel_derived: 0,
  color_rule_derived: 0,
  brightness_rule_derived: 0,
  saturation_rule_derived: 0,
  semantic_rule_derived: 0,
  template_rule_derived: 0,
  demo_fixture: 0,
  placeholder: 0,
  human_required: 0,
  unsupported: 0,
};

const hasSource = (
  field: PhotoToTemplateRealityFieldEvidence,
  source: PhotoToTemplateRealitySourceType,
): boolean => field.sourceTypes.includes(source);

const field = (
  fieldName: PhotoToTemplateRealityFieldKey,
  label: string,
  sourceTypes: PhotoToTemplateRealitySourceType[],
  evidence: string[],
  valuePreview?: string,
): PhotoToTemplateRealityFieldEvidence => {
  const humanReviewRequired = sourceTypes.includes('human_required');
  const capabilityStatus: PhotoToTemplateRealityCapabilityStatus =
    sourceTypes.includes('unsupported')
      ? 'unsupported_for_automatic_extraction'
      : sourceTypes.includes('demo_fixture')
        ? 'demo_only'
        : humanReviewRequired
          ? 'draft_generation_supported_with_human_review'
          : 'draft_generation_supported_with_limitations';

  return {
    field: fieldName,
    label,
    sourceTypes,
    capabilityStatus,
    evidence,
    humanReviewRequired,
    valuePreview,
  };
};

const candidateValue = (
  candidates: MakeupAttributeCandidateReport | null | undefined,
  kind: string,
): string | undefined =>
  candidates?.candidates.find((candidate) => candidate.kind === kind)?.value;

const sourceSummaryFor = (
  fields: readonly PhotoToTemplateRealityFieldEvidence[],
): Record<PhotoToTemplateRealitySourceType, number> => {
  const summary = { ...sourceSummarySeed };
  fields.forEach((item) => {
    item.sourceTypes.forEach((source) => {
      summary[source] += 1;
    });
  });
  return summary;
};

export const createPhotoToTemplateRealityCheckReport = ({
  analysis = null,
  regionQa = null,
  attributeCandidates = null,
  stepSequence = null,
  templateDraft = null,
  claims = [
    'Current capability is semi-automatic template draft generation with human review.',
    'Readiness Score is rule-based detection usability scoring.',
    'Current system does not claim high-quality automatic makeup extraction.',
  ],
  reportId = 'phase-12a-photo-to-template-reality-check',
}: PhotoToTemplateRealityCheckInput): PhotoToTemplateRealityCheckReport => {
  const fields: PhotoToTemplateRealityFieldEvidence[] = [
    field(
      'faceDetected',
      'Face detected',
      analysis?.faceDetection.detected
        ? ['real_from_photo', 'facemesh_derived']
        : ['unsupported', 'human_required'],
      [
        analysis
          ? `Face detection detected=${analysis.faceDetection.detected}.`
          : 'No local image analysis result is available.',
      ],
      analysis ? String(analysis.faceDetection.detected) : 'unavailable',
    ),
    field(
      'landmarkCount',
      'FaceMesh landmarks',
      regionQa ? ['real_from_photo', 'facemesh_derived'] : ['unsupported'],
      [
        regionQa
          ? `${regionQa.landmarkCount} FaceMesh landmarks are available from ${regionQa.provider}.`
          : 'FaceMesh landmarks are unavailable until Vision Analysis runs.',
      ],
      regionQa ? String(regionQa.landmarkCount) : 'unavailable',
    ),
    field(
      'boundingBox',
      'Face bounding box',
      regionQa?.boundingBox ? ['facemesh_derived'] : ['unsupported'],
      [
        regionQa?.boundingBox
          ? 'Bounding box is derived from FaceMesh runtime geometry.'
          : 'Bounding box is unavailable.',
      ],
      regionQa?.boundingBox
        ? `${regionQa.boundingBox.x.toFixed(2)},${regionQa.boundingBox.y.toFixed(2)},${regionQa.boundingBox.width.toFixed(2)},${regionQa.boundingBox.height.toFixed(2)}`
        : 'unavailable',
    ),
    field(
      'readinessScore',
      'Readiness Score',
      regionQa ? ['region_qa_derived', 'template_rule_derived'] : ['unsupported'],
      [
        'Readiness Score is a rule-based usability score from landmark count, normalized coordinates, region coverage, and crop margin.',
        'It is not MediaPipe model raw confidence.',
      ],
      regionQa ? String(regionQa.readinessScore) : 'unavailable',
    ),
    field(
      'regionCoverage',
      'Region coverage',
      regionQa ? ['region_qa_derived'] : ['unsupported'],
      [
        regionQa
          ? `${regionQa.regionCoverage.filter((region) => region.ready).length}/${regionQa.regionCoverage.length} makeup regions are ready.`
          : 'Region coverage is unavailable.',
      ],
    ),
    field(
      'cosmeticRegions',
      'Cosmetic regions',
      regionQa
        ? ['facemesh_derived', 'region_qa_derived', 'human_required']
        : ['placeholder', 'human_required'],
      [
        analysis?.cosmeticRegions.length
          ? `${analysis.cosmeticRegions.length} cosmetic regions were built from FaceMesh polygons and local segmentation hints.`
          : regionQa
            ? 'Cosmetic region capability is anchored by FaceMesh region coverage; this example still needs reviewer-visible region content.'
            : 'Cosmetic region content falls back to placeholder/demo structure until analysis runs.',
      ],
    ),
    field(
      'lipColor',
      'Lip color family',
      ['pixel_rule_derived', 'region_pixel_derived', 'color_rule_derived', 'human_required'],
      [
        'Lip color family is classified from local pixel hue/saturation rules when pixel analysis is present.',
        'Phase 12B adds color-rule semantic candidates, but they remain candidate-only.',
      ],
      candidateValue(attributeCandidates, 'lip_color_family') ?? 'candidate unavailable',
    ),
    field(
      'lipFinish',
      'Lip finish',
      ['semantic_rule_derived', 'pixel_rule_derived', 'brightness_rule_derived', 'human_required'],
      [
        'Lip finish comes from local semantic rules over pixel analysis or conservative defaults.',
        'Brightness/edge finish signals are lighting-sensitive and cannot be treated as final.',
        'It must be reviewed before becoming template guidance.',
      ],
      candidateValue(attributeCandidates, 'lip_finish') ?? 'candidate unavailable',
    ),
    field(
      'blushPlacement',
      'Blush placement',
      ['pixel_rule_derived', 'region_pixel_derived', 'region_qa_derived', 'human_required'],
      [
        'Blush placement uses local pixel center/opacity rules plus FaceMesh region coverage.',
        'Placement is not a final visual semantic extraction result.',
      ],
      candidateValue(attributeCandidates, 'blush_placement') ?? 'candidate unavailable',
    ),
    field(
      'eyeMakeupIntensity',
      'Eye makeup intensity',
      ['pixel_rule_derived', 'brightness_rule_derived', 'human_required'],
      [
        'Eye intensity is inferred from local eyeshadow darkness and eyeliner direction rules.',
      ],
      candidateValue(attributeCandidates, 'eye_definition') ?? 'candidate unavailable',
    ),
    field(
      'eyeshadowTone',
      'Eyeshadow tone',
      ['pixel_rule_derived', 'color_rule_derived', 'human_required', 'unsupported'],
      [
        'Phase 12B can produce conservative eyeshadow tone candidates when weighted samples exist.',
        'Exact eyeshadow tone remains unsupported for automatic extraction.',
      ],
      candidateValue(attributeCandidates, 'eyeshadow_depth') ?? 'exact tone unsupported',
    ),
    field(
      'eyelinerShape',
      'Eyeliner shape',
      ['pixel_rule_derived', 'human_required'],
      [
        'Eyeliner shape is a local direction/intensity candidate and must be manually checked.',
      ],
    ),
    field(
      'browShape',
      'Brow shape',
      ['placeholder', 'human_required', 'unsupported'],
      ['Brow shape is not yet extracted as a reliable makeup semantic field.'],
    ),
    field(
      'contourPresence',
      'Contour presence',
      ['facemesh_derived', 'brightness_rule_derived', 'template_rule_derived', 'human_required'],
      [
        'Contour guidance remains conservative because face structure and photo angle are reviewer-sensitive.',
      ],
      candidateValue(attributeCandidates, 'contour_softness') ?? 'soft_structure_candidate',
    ),
    field(
      'highlightPresence',
      'Highlight presence',
      ['placeholder', 'human_required', 'unsupported'],
      ['Highlight presence is not yet reliably separated from lighting or skin sheen.'],
    ),
    field(
      'overallMakeupStyle',
      'Overall makeup style',
      ['semantic_rule_derived', 'template_rule_derived', 'human_required'],
      [
        'Overall style is assembled from local semantic candidates and template drafting defaults.',
        'It is not final recognition and must be reviewed.',
      ],
      templateDraft?.draft?.style.family ?? 'natural draft default',
    ),
    field(
      'templateTitle',
      'Template title',
      ['template_rule_derived', 'human_required'],
      ['Template title is generated from draft metadata, not directly recognized from the photo.'],
      templateDraft?.draft?.name ?? 'draft title unavailable',
    ),
    field(
      'templateSummary',
      'Template summary',
      ['template_rule_derived', 'human_required'],
      ['Template summary is editor/reviewer copy derived from draft structure.'],
    ),
    field(
      'suitableScenario',
      'Suitable scenario',
      ['demo_fixture', 'placeholder', 'human_required'],
      ['Suitable scenario is demo/user-app copy until a reviewer writes app-facing guidance.'],
    ),
    field(
      'difficulty',
      'Difficulty',
      ['template_rule_derived', 'demo_fixture', 'human_required'],
      ['Difficulty is a local UX/rule estimate, not measured from the photo.'],
    ),
    field(
      'estimatedTime',
      'Estimated time',
      ['template_rule_derived', 'demo_fixture', 'human_required'],
      ['Estimated time is derived from step count and demo copy.'],
      stepSequence ? `${stepSequence.steps.length} draft steps` : 'step count unavailable',
    ),
    field(
      'toolList',
      'Tool list',
      ['template_rule_derived', 'human_required'],
      ['Tool list comes from generated draft steps and must be reviewed.'],
    ),
    field(
      'stepSequence',
      'Step sequence',
      ['template_rule_derived', 'human_required'],
      [
        'Step sequence is generated by deterministic rules from candidate attributes.',
        'Every step is draft-only and requires human review.',
      ],
      stepSequence ? `${stepSequence.steps.length} steps` : 'steps unavailable',
    ),
    field(
      'beginnerTips',
      'Beginner tips',
      ['placeholder', 'demo_fixture', 'human_required'],
      ['Beginner tips are UX copy placeholders until reviewed for the specific template.'],
    ),
    field(
      'commonMistakes',
      'Common mistakes',
      ['placeholder', 'human_required'],
      ['Common mistakes are instructional copy, not extracted from the photo.'],
    ),
    field(
      'correctionTips',
      'Correction tips',
      ['placeholder', 'human_required'],
      ['Correction tips require human template editing and user-app copy review.'],
    ),
    field(
      'userAppPreview',
      'User App preview',
      ['demo_fixture', 'template_rule_derived', 'human_required'],
      ['User App preview remains local/demo-facing and is not a published package.'],
    ),
  ];

  const sourceSummary = sourceSummaryFor(fields);
  const hasDraft = Boolean(templateDraft?.draft && templateDraft.status !== 'draft_blocked');
  const hasAnalysis = Boolean(analysis && regionQa);
  const hasUnsupported = fields.some((item) => hasSource(item, 'unsupported'));

  const capabilityStatus: PhotoToTemplateRealityCapabilityStatus = !hasAnalysis
    ? 'demo_only'
    : !hasDraft
      ? 'draft_generation_blocked'
      : hasUnsupported
        ? 'draft_generation_supported_with_limitations'
        : 'draft_generation_supported_with_human_review';

  const risks: PhotoToTemplateRealityRisk[] = [
    {
      id: 'automatic_extraction_overclaim',
      severity: 'blocking',
      message: 'Do not describe the current system as fully automatic high-quality makeup extraction.',
    },
    {
      id: 'candidate_confidence_overclaim',
      severity: 'warning',
      message: 'Candidate confidence and readiness are local rule/metadata signals, not final model certainty.',
    },
    {
      id: 'demo_fixture_overclaim',
      severity: 'warning',
      message: 'Demo/user-app copy must not be described as real photo-derived makeup semantics.',
    },
  ];

  const gaps: PhotoToTemplateRealityGap[] = [
    {
      id: 'semantic_color_extraction_gap',
      area: 'semantic_extraction',
      message: 'Need a baseline for reliable lip, blush, eyeshadow, brow, contour, and highlight semantic extraction.',
    },
    {
      id: 'lighting_and_shade_gap',
      area: 'visual_measurement',
      message: 'Need lighting-aware color/shimmer/finish normalization before claiming precise makeup recognition.',
    },
    {
      id: 'copy_review_gap',
      area: 'template_copy',
      message: 'Need reviewer-authored user-facing tips, mistakes, correction hints, and scenario copy.',
    },
  ];

  const recommendations: PhotoToTemplateRealityRecommendation[] = [
    {
      id: 'continue_as_semi_automatic_draft',
      message: 'Current chain can support semi-automatic template draft generation with human review.',
      nextAction: 'continue_with_human_review',
    },
    {
      id: 'phase_12b_semantic_baseline',
      message: 'Next phase should build Makeup Semantic Extraction Baseline before claiming stronger photo understanding.',
      nextAction: 'build_semantic_extraction_baseline',
    },
    {
      id: 'block_automatic_claim',
      message: 'Block any claim that arbitrary photos can be converted into high-quality templates automatically.',
      nextAction: 'block_automatic_extraction_claim',
    },
  ];

  const decision: PhotoToTemplateRealityDecision =
    capabilityStatus === 'demo_only'
      ? 'keep_as_demo_only'
      : capabilityStatus === 'draft_generation_blocked'
        ? 'blocked_do_not_claim_automatic_extraction'
        : capabilityStatus === 'draft_generation_supported_with_limitations'
          ? 'semi_automatic_draft_with_limitations'
          : 'semi_automatic_draft_with_human_review';

  return {
    reportId,
    sourceImageId: analysis?.imageId ?? null,
    capabilityStatus,
    decision,
    fieldEvidence: fields,
    sourceSummary,
    risks,
    recommendations,
    gaps,
    claims,
    humanReviewRequired: true,
    readinessScoreIsRuleBased: true,
    supportsSemiAutomaticDraft: hasDraft,
    supportsFullyAutomaticExtraction: false,
    registryChainPausedAfter10U: true,
    noRegistryWrite: true,
    noRegistryMutation: true,
    noPublish: true,
    noProductionWriter: true,
    noUserAppShellReplacement: true,
    nextRecommendedPhase: 'Phase 12B - Makeup Semantic Extraction Baseline',
  };
};
