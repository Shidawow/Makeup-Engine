import type { MakeupRegion } from '../templates/schema';
import type { FaceMeshRegionQaReport } from '../vision';
import type { MakeupAnalysisPipelineResult } from '../vision';

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
  const candidates: MakeupAttributeCandidate[] = [
    {
      id: `${analysis.imageId}-lip-color-family`,
      kind: 'lip_color_family',
      region: 'lip',
      value: colorFamilyFromHue(pixel?.lips.dominantHue ?? 0),
      confidence: clampConfidence((pixel?.lips.saturation ?? 0.5) * regionQa.confidence),
      source: pixel ? 'pixel_analysis' : 'rule_based_default',
      evidence: [
        `lip hue ${pixel?.lips.dominantHue ?? 'unavailable'}`,
        `FaceMesh landmarks ${regionQa.landmarkCount}`,
      ],
      reviewStatus: 'needs_human_review',
    },
    {
      id: `${analysis.imageId}-lip-finish`,
      kind: 'lip_finish',
      region: 'lip',
      value: semantics?.lipFinish ?? finishFromBrightness(pixel?.lips.brightness ?? 0.55),
      confidence: clampConfidence(regionQa.confidence * 0.78),
      source: semantics ? 'semantic_analysis' : 'rule_based_default',
      evidence: semantics?.semanticSummary ?? ['semantic summary unavailable'],
      reviewStatus: 'needs_human_review',
    },
    {
      id: `${analysis.imageId}-blush-placement`,
      kind: 'blush_placement',
      region: 'blush',
      value: pixel?.blush.blushCenter.y && pixel.blush.blushCenter.y < 0.58
        ? 'high_lift_candidate'
        : 'soft_centered_candidate',
      confidence: clampConfidence((pixel?.blush.opacity ?? 0.45) + 0.25),
      source: pixel ? 'pixel_analysis' : 'rule_based_default',
      evidence: [
        `blush center y ${pixel?.blush.blushCenter.y ?? 'unavailable'}`,
        `blush opacity ${pixel?.blush.opacity ?? 'unavailable'}`,
      ],
      reviewStatus: 'needs_human_review',
    },
    {
      id: `${analysis.imageId}-eye-definition`,
      kind: 'eye_definition',
      region: 'eye',
      value: pixel?.eyes.eyelinerDirection === 'upward'
        ? 'lifted_definition_candidate'
        : 'clean_definition_candidate',
      confidence: clampConfidence(regionQa.confidence * 0.74),
      source: pixel ? 'pixel_analysis' : 'rule_based_default',
      evidence: [
        `eyeliner direction ${pixel?.eyes.eyelinerDirection ?? 'unavailable'}`,
      ],
      reviewStatus: 'needs_human_review',
    },
    {
      id: `${analysis.imageId}-eyeshadow-depth`,
      kind: 'eyeshadow_depth',
      region: 'eye',
      value: (pixel?.eyes.eyeshadowDarkness ?? 0.35) > 0.58
        ? 'medium_depth_candidate'
        : 'soft_depth_candidate',
      confidence: clampConfidence(regionQa.confidence * 0.72),
      source: pixel ? 'pixel_analysis' : 'rule_based_default',
      evidence: [
        `eyeshadow darkness ${pixel?.eyes.eyeshadowDarkness ?? 'unavailable'}`,
      ],
      reviewStatus: 'needs_human_review',
    },
    {
      id: `${analysis.imageId}-contour-softness`,
      kind: 'contour_softness',
      region: 'contour',
      value: 'soft_structure_candidate',
      confidence: clampConfidence(regionQa.confidence * 0.64),
      source: 'facemesh_region_qa',
      evidence: ['contour remains draft-only until human reviewer confirms face structure.'],
      reviewStatus: 'needs_human_review',
    },
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
      'Generation is deterministic, local, and rule-based.',
    ],
  };
};
