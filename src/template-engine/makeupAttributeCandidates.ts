import type { MakeupRegion } from '../templates/schema';
import type { FaceMeshRegionQaReport } from '../vision';
import {
  createMakeupSemanticExtractionReport,
  type MakeupAnalysisPipelineResult,
  type MakeupSemanticCandidate,
  type MakeupSemanticCandidateKey,
} from '../vision';

export type MakeupAttributeCandidateStatus =
  | 'candidates_ready'
  | 'candidates_ready_with_warnings'
  | 'candidates_blocked';

export type MakeupAttributeCandidateKind =
  | 'lip_color_family'
  | 'lip_finish'
  | 'blush_placement'
  | 'blush_intensity'
  | 'eye_definition'
  | 'eyeshadow_depth'
  | 'contour_softness'
  | 'highlight_finish';

export type MakeupAttributeCandidateSource =
  | 'facemesh_region_qa'
  | 'pixel_analysis'
  | 'semantic_analysis'
  | 'makeup_semantic_extraction_baseline'
  | 'rule_based_default';

export interface MakeupAttributeCandidate {
  id: string;
  kind: MakeupAttributeCandidateKind;
  region: MakeupRegion;
  value: string;
  confidence: number;
  source: MakeupAttributeCandidateSource;
  evidence: string[];
  reviewStatus: 'needs_human_review';
  semanticCandidate?: true;
  humanReviewRequired?: true;
  notFinal?: true;
  semanticExtractionSource?: 'phase_12b_makeup_semantic_extraction_baseline';
}

export interface MakeupAttributeCandidateIssue {
  id: string;
  message: string;
  severity: 'warning' | 'blocking';
}

export interface MakeupAttributeCandidateReport {
  status: MakeupAttributeCandidateStatus;
  candidates: MakeupAttributeCandidate[];
  issues: MakeupAttributeCandidateIssue[];
  notes: string[];
}

export interface MakeupAttributeCandidateInput {
  analysis?: MakeupAnalysisPipelineResult | null;
  regionQa: FaceMeshRegionQaReport;
}

const clampConfidence = (value: number): number =>
  Math.max(0, Math.min(0.98, Number(value.toFixed(2))));

const colorFamilyFromHue = (hue: number): string => {
  if (hue >= 330 || hue < 20) {
    return 'rose_red';
  }
  if (hue < 45) {
    return 'coral_warm';
  }
  if (hue < 90) {
    return 'peach_brown';
  }
  if (hue < 210) {
    return 'muted_neutral';
  }
  return 'berry_cool';
};

const finishFromBrightness = (brightness: number): string => {
  if (brightness > 0.72) {
    return 'gloss_or_satin_candidate';
  }
  if (brightness < 0.38) {
    return 'velvet_or_matte_candidate';
  }
  return 'soft_satin_candidate';
};

const semanticConfidence = (candidate: MakeupSemanticCandidate | undefined): number =>
  candidate?.confidenceBand === 'high'
    ? 0.82
    : candidate?.confidenceBand === 'medium'
      ? 0.68
      : candidate?.confidenceBand === 'low'
        ? 0.46
        : 0.24;

const candidateEvidence = (
  candidate: MakeupSemanticCandidate | undefined,
  fallback: string[],
): string[] => {
  if (!candidate) {
    return fallback;
  }
  const evidence = candidate.evidence.flatMap((item) => [
    `${item.region} source=${candidate.sourceType}`,
    `samples=${item.sampleCount}`,
    ...(item.averageHue === undefined ? [] : [`hue=${item.averageHue}`]),
    ...(item.averageSaturation === undefined ? [] : [`saturation=${item.averageSaturation}`]),
    ...(item.averageBrightness === undefined ? [] : [`brightness=${item.averageBrightness}`]),
    ...item.notes,
  ]);

  return [
    ...evidence,
    ...candidate.limitations,
    'Phase 12B semantic output is candidate-only and requires human review.',
  ];
};

const semanticValue = (
  candidates: Partial<Record<MakeupSemanticCandidateKey, MakeupSemanticCandidate>>,
  key: MakeupSemanticCandidateKey,
  fallback: string,
): string => {
  const value = candidates[key]?.value;
  return value && value !== 'unknown' ? `${value}_candidate` : fallback;
};

const semanticSource = (
  candidate: MakeupSemanticCandidate | undefined,
  fallback: MakeupAttributeCandidateSource,
): MakeupAttributeCandidateSource =>
  candidate && candidate.sourceType !== 'insufficient_evidence'
    ? 'makeup_semantic_extraction_baseline'
    : fallback;

const markSemanticCandidate = (
  candidate: Omit<
    MakeupAttributeCandidate,
    'semanticCandidate' | 'humanReviewRequired' | 'notFinal' | 'semanticExtractionSource'
  >,
): MakeupAttributeCandidate => ({
  ...candidate,
  semanticCandidate: true,
  humanReviewRequired: true,
  notFinal: true,
  semanticExtractionSource: 'phase_12b_makeup_semantic_extraction_baseline',
});

export const generateMakeupAttributeCandidates = ({
  analysis,
  regionQa,
}: MakeupAttributeCandidateInput): MakeupAttributeCandidateReport => {
  if (!analysis) {
    return {
      status: 'candidates_blocked',
      candidates: [],
      issues: [
        {
          id: 'missing_analysis',
          message: 'Vision analysis is required before generating makeup attribute candidates.',
          severity: 'blocking',
        },
      ],
      notes: ['Candidate generation is local and rule-based; it does not call external AI.'],
    };
  }

  if (!regionQa.canGenerateAttributeCandidates) {
    return {
      status: 'candidates_blocked',
      candidates: [],
      issues: regionQa.issues.map((issue) => ({
        id: `region_qa_${issue.id}`,
        message: issue.message,
        severity: issue.severity,
      })),
      notes: ['FaceMesh region QA blocked attribute candidate generation.'],
    };
  }

  const pixel = analysis.pixelAnalysis;
  const semantics = analysis.semanticAnalysis;
  const semanticExtraction = createMakeupSemanticExtractionReport({
    analysis,
    regionQa,
  });
  const semanticCandidates = semanticExtraction.candidates;
  const candidates: MakeupAttributeCandidate[] = [
    markSemanticCandidate({
      id: `${analysis.imageId}-lip-color-family`,
      kind: 'lip_color_family',
      region: 'lip',
      value: semanticValue(
        semanticCandidates,
        'lipColorCandidate',
        colorFamilyFromHue(pixel?.lips.dominantHue ?? 0),
      ),
      confidence: clampConfidence(
        semanticConfidence(semanticCandidates.lipColorCandidate) * regionQa.confidence,
      ),
      source: semanticSource(
        semanticCandidates.lipColorCandidate,
        pixel ? 'pixel_analysis' : 'rule_based_default',
      ),
      evidence: candidateEvidence(semanticCandidates.lipColorCandidate, [
        `lip hue ${pixel?.lips.dominantHue ?? 'unavailable'}`,
        `FaceMesh landmarks ${regionQa.landmarkCount}`,
      ]),
      reviewStatus: 'needs_human_review',
    }),
    markSemanticCandidate({
      id: `${analysis.imageId}-lip-finish`,
      kind: 'lip_finish',
      region: 'lip',
      value: semanticValue(
        semanticCandidates,
        'lipFinishCandidate',
        semantics?.lipFinish ?? finishFromBrightness(pixel?.lips.brightness ?? 0.55),
      ),
      confidence: clampConfidence(
        semanticConfidence(semanticCandidates.lipFinishCandidate) * regionQa.confidence,
      ),
      source: semanticSource(
        semanticCandidates.lipFinishCandidate,
        semantics ? 'semantic_analysis' : 'rule_based_default',
      ),
      evidence: candidateEvidence(
        semanticCandidates.lipFinishCandidate,
        semantics?.semanticSummary ?? ['semantic summary unavailable'],
      ),
      reviewStatus: 'needs_human_review',
    }),
    markSemanticCandidate({
      id: `${analysis.imageId}-blush-placement`,
      kind: 'blush_placement',
      region: 'blush',
      value: semanticValue(
        semanticCandidates,
        'blushPlacementCandidate',
        pixel?.blush.blushCenter.y && pixel.blush.blushCenter.y < 0.58
          ? 'high_lift_candidate'
          : 'soft_centered_candidate',
      ),
      confidence: clampConfidence(
        semanticConfidence(semanticCandidates.blushPlacementCandidate) * regionQa.confidence,
      ),
      source: semanticSource(
        semanticCandidates.blushPlacementCandidate,
        pixel ? 'pixel_analysis' : 'rule_based_default',
      ),
      evidence: candidateEvidence(semanticCandidates.blushPlacementCandidate, [
        `blush center y ${pixel?.blush.blushCenter.y ?? 'unavailable'}`,
        `blush opacity ${pixel?.blush.opacity ?? 'unavailable'}`,
      ]),
      reviewStatus: 'needs_human_review',
    }),
    markSemanticCandidate({
      id: `${analysis.imageId}-blush-intensity`,
      kind: 'blush_intensity',
      region: 'blush',
      value: semanticValue(
        semanticCandidates,
        'blushIntensityCandidate',
        'soft_intensity_candidate',
      ),
      confidence: clampConfidence(
        semanticConfidence(semanticCandidates.blushIntensityCandidate) * regionQa.confidence,
      ),
      source: semanticSource(
        semanticCandidates.blushIntensityCandidate,
        pixel ? 'pixel_analysis' : 'rule_based_default',
      ),
      evidence: candidateEvidence(semanticCandidates.blushIntensityCandidate, [
        `blush opacity ${pixel?.blush.opacity ?? 'unavailable'}`,
      ]),
      reviewStatus: 'needs_human_review',
    }),
    markSemanticCandidate({
      id: `${analysis.imageId}-eye-definition`,
      kind: 'eye_definition',
      region: 'eye',
      value: semanticValue(
        semanticCandidates,
        'eyeMakeupIntensityCandidate',
        pixel?.eyes.eyelinerDirection === 'upward'
          ? 'lifted_definition_candidate'
          : 'clean_definition_candidate',
      ),
      confidence: clampConfidence(
        semanticConfidence(semanticCandidates.eyeMakeupIntensityCandidate) * regionQa.confidence,
      ),
      source: semanticSource(
        semanticCandidates.eyeMakeupIntensityCandidate,
        pixel ? 'pixel_analysis' : 'rule_based_default',
      ),
      evidence: candidateEvidence(semanticCandidates.eyeMakeupIntensityCandidate, [
        `eyeliner direction ${pixel?.eyes.eyelinerDirection ?? 'unavailable'}`,
      ]),
      reviewStatus: 'needs_human_review',
    }),
    markSemanticCandidate({
      id: `${analysis.imageId}-eyeshadow-depth`,
      kind: 'eyeshadow_depth',
      region: 'eye',
      value: semanticValue(
        semanticCandidates,
        'eyeshadowToneCandidate',
        (pixel?.eyes.eyeshadowDarkness ?? 0.35) > 0.58
          ? 'medium_depth_candidate'
          : 'soft_depth_candidate',
      ),
      confidence: clampConfidence(
        semanticConfidence(semanticCandidates.eyeshadowToneCandidate) * regionQa.confidence,
      ),
      source: semanticSource(
        semanticCandidates.eyeshadowToneCandidate,
        pixel ? 'pixel_analysis' : 'rule_based_default',
      ),
      evidence: candidateEvidence(semanticCandidates.eyeshadowToneCandidate, [
        `eyeshadow darkness ${pixel?.eyes.eyeshadowDarkness ?? 'unavailable'}`,
      ]),
      reviewStatus: 'needs_human_review',
    }),
    markSemanticCandidate({
      id: `${analysis.imageId}-brow-definition`,
      kind: 'highlight_finish',
      region: 'brow',
      value: semanticValue(
        semanticCandidates,
        'browDefinitionCandidate',
        'brow_definition_unknown_candidate',
      ),
      confidence: clampConfidence(
        semanticConfidence(semanticCandidates.browDefinitionCandidate) * regionQa.confidence,
      ),
      source: semanticSource(semanticCandidates.browDefinitionCandidate, 'facemesh_region_qa'),
      evidence: candidateEvidence(semanticCandidates.browDefinitionCandidate, [
        'brow definition requires FaceMesh region parameters and human review.',
      ]),
      reviewStatus: 'needs_human_review',
    }),
    markSemanticCandidate({
      id: `${analysis.imageId}-contour-softness`,
      kind: 'contour_softness',
      region: 'contour',
      value: semanticValue(
        semanticCandidates,
        'contourSignalCandidate',
        'soft_structure_candidate',
      ),
      confidence: clampConfidence(
        semanticConfidence(semanticCandidates.contourSignalCandidate) * regionQa.confidence,
      ),
      source: semanticSource(semanticCandidates.contourSignalCandidate, 'facemesh_region_qa'),
      evidence: candidateEvidence(semanticCandidates.contourSignalCandidate, [
        'contour remains draft-only until human reviewer confirms face structure.',
      ]),
      reviewStatus: 'needs_human_review',
    }),
  ];

  const issues: MakeupAttributeCandidateIssue[] = [];
  if (!pixel) {
    issues.push({
      id: 'missing_pixel_analysis',
      message: 'Pixel analysis is unavailable; several candidates use conservative defaults.',
      severity: 'warning',
    });
  }
  if (regionQa.status === 'region_qa_ready_with_warnings') {
    issues.push({
      id: 'region_qa_warnings',
      message: 'FaceMesh region QA has warnings; candidate confidence should be reviewed.',
      severity: 'warning',
    });
  }

  return {
    status: issues.length > 0
      ? 'candidates_ready_with_warnings'
      : 'candidates_ready',
    candidates,
    issues,
    notes: [
      'All attributes are candidates only.',
      'No candidate is final until a human template reviewer approves it.',
      'Phase 12B makeup semantic extraction is a local deterministic baseline, not AI-confirmed recognition.',
      'Generation is deterministic, local, and rule-based.',
    ],
  };
};
