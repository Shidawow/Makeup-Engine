import type { MakeupTemplate } from '../templates/schema';
import type { FaceMeshRegionQaReport, MakeupAnalysisPipelineResult } from '../vision';
import type { MakeupAttributeCandidateReport } from './makeupAttributeCandidates';
import type { RuleBasedStepSequence } from './ruleBasedStepGenerator';

export type MakeupTemplateDraftStatus =
  | 'draft_ready'
  | 'draft_ready_with_warnings'
  | 'draft_blocked';

export interface MakeupTemplateDraftIssue {
  id: string;
  severity: 'warning' | 'blocking';
  message: string;
}

export interface MakeupTemplateDraftReport {
  status: MakeupTemplateDraftStatus;
  draft: MakeupTemplate | null;
  issues: MakeupTemplateDraftIssue[];
  humanReviewRequired: true;
  publishBlocked: true;
  notes: string[];
}

export interface MakeupTemplateDraftInput {
  analysis?: MakeupAnalysisPipelineResult | null;
  regionQa: FaceMeshRegionQaReport;
  attributeCandidates: MakeupAttributeCandidateReport;
  stepSequence: RuleBasedStepSequence;
  createdAt?: string;
  createdBy?: string;
}

export const generateMakeupTemplateDraft = ({
  analysis,
  regionQa,
  attributeCandidates,
  stepSequence,
  createdAt = '2026-06-15T00:00:00.000+08:00',
  createdBy = 'template-studio-phase-10a',
}: MakeupTemplateDraftInput): MakeupTemplateDraftReport => {
  const issues: MakeupTemplateDraftIssue[] = [
    ...regionQa.issues.map((issue) => ({
      id: `region_qa_${issue.id}`,
      severity: issue.severity,
      message: issue.message,
    })),
    ...attributeCandidates.issues.map((issue) => ({
      id: `candidate_${issue.id}`,
      severity: issue.severity,
      message: issue.message,
    })),
    ...stepSequence.issues.map((issue) => ({
      id: `step_${issue.id}`,
      severity: issue.severity,
      message: issue.message,
    })),
  ];

  if (!analysis) {
    return {
      status: 'draft_blocked',
      draft: null,
      issues: [
        {
          id: 'missing_analysis',
          severity: 'blocking',
          message: 'Vision analysis is required before generating a template draft.',
        },
      ],
      humanReviewRequired: true,
      publishBlocked: true,
      notes: ['No template draft was generated.'],
    };
  }

  if (
    !regionQa.canGenerateTemplateDraft ||
    attributeCandidates.status === 'candidates_blocked' ||
    stepSequence.status === 'steps_blocked'
  ) {
    return {
      status: 'draft_blocked',
      draft: null,
      issues: issues.length > 0
        ? issues
        : [
            {
              id: 'draft_blocked',
              severity: 'blocking',
              message: 'Template draft generation is blocked until upstream checks are ready.',
            },
          ],
      humanReviewRequired: true,
      publishBlocked: true,
      notes: [
        'Draft generation was blocked by FaceMesh QA, candidate, or step readiness.',
      ],
    };
  }

  const draft: MakeupTemplate = {
    id: `phase-10a-draft-${analysis.imageId}`,
    name: `FaceMesh makeup intelligence draft - ${analysis.imageId}`,
    goals: [
      'Convert real FaceMesh and local vision analysis into reviewable makeup guidance candidates.',
      'Keep every generated item draft-only until a human reviewer approves it.',
    ],
    faceStrategy: {
      id: `phase-10a-strategy-${analysis.imageId}`,
      summary: 'Use FaceMesh region coverage to anchor candidate makeup guidance for human review.',
      goals: ['candidate drafting', 'human review', 'no automatic publishing'],
      suitableFaceTypes: ['requires-human-review'],
      reasoning: [
        `FaceMesh provider: ${regionQa.provider}`,
        `${regionQa.landmarkCount} landmarks with confidence ${regionQa.confidence.toFixed(2)}`,
      ],
    },
    style: {
      family: 'natural',
      finish: 'satin',
      contrast: 'medium',
      palette: {
        temperature: 'neutral',
        dominantFamilies: ['soft_rose_or_peach'],
        accentFamilies: ['candidate_lip_color'],
      },
      signatureTraits: ['candidate', 'draft', 'human-review-required'],
      confidence: Math.min(regionQa.confidence, 0.82),
      evidence: [
        'FaceMesh and local pixel analysis generated a reviewable draft only.',
      ],
    },
    faceSuitability: {
      profile: {
        faceShapes: ['oval'],
        skinTypes: ['combination'],
        skinTones: ['neutral'],
        eyeTypes: ['double'],
        lipShapes: ['full'],
      },
      confidence: Math.min(regionQa.confidence, 0.82),
      rationale: [
        'Face suitability is placeholder-safe in Phase 10A and must be reviewed manually.',
      ],
    },
    regions: attributeCandidates.candidates.map((candidate) => ({
      region: candidate.region,
      detected: true,
      confidence: candidate.confidence,
      cues: [
        candidate.kind,
        candidate.value,
        'needs_human_review',
      ],
    })),
    eyeDesign: {
      summary: 'Draft eye guidance is generated from local candidate attributes only.',
      effects: ['lift', 'widen'],
      emphasis: 'needs human review',
    },
    lipDesign: {
      summary: 'Draft lip guidance is generated from hue/finish candidates only.',
      effects: ['balance', 'soften'],
      emphasis: 'needs human review',
    },
    contourDesign: {
      summary: 'Draft contour guidance remains conservative because face structure is reviewer-sensitive.',
      effects: ['balance'],
      emphasis: 'human reviewer must confirm placement',
    },
    steps: stepSequence.steps,
    metadata: {
      version: '0.1',
      status: 'draft',
      createdAt,
      createdBy,
      source: {
        imageId: analysis.imageId,
        fileName: analysis.imageId,
        sourceType: 'admin-upload',
      },
      styleTags: ['phase-10a', 'facemesh-driven', 'candidate-only', 'human-review-required'],
      analysisVersion: 'phase-10a-facemesh-makeup-intelligence-baseline',
      humanVerificationStatus: 'ai_generated',
      visionMetrics: {
        opacityConfidence: regionQa.confidence,
        edgeSoftness: analysis.pixelAnalysis?.lips.edgeSoftness,
        diffusionQuality: analysis.pixelAnalysis?.edgeAnalysis?.features.blush?.diffusionScore,
      },
      visionEvidence: {
        source: 'ai-only',
        maskEditCount: 0,
        adjustedRegions: [],
        evidenceNotes: [
          'FaceMesh-driven baseline generated candidate attributes and draft steps only.',
          'Human review is required before template library or user app export.',
        ],
      },
    },
    notes: [
      'Phase 10A draft only.',
      'No backend, camera capture, AR, OpenAI API, external API, training, or automatic publishing.',
    ],
  };

  return {
    status: issues.length > 0 ? 'draft_ready_with_warnings' : 'draft_ready',
    draft,
    issues,
    humanReviewRequired: true,
    publishBlocked: true,
    notes: [
      'Template draft is deterministic and local.',
      'Template draft is not a UserAppTemplatePackage export.',
      'Human review is required before any production library handoff.',
    ],
  };
};
