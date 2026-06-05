import type {
  DatasetEvidenceSummary,
  DatasetRiskSummary,
  DatasetQualityStatus,
  DatasetReviewReason,
  TemplateEvidence,
} from '../schema';
import type { HumanCorrectionSample } from '../schema/correction-dataset.schema';
import type { ImageQualityAssessment } from '../../vision/image-quality';

export interface QualityGateInput {
  sample: HumanCorrectionSample;
  evidence?: TemplateEvidence | null;
  sourceImageQuality?: number;
  imageQualityAssessment?: ImageQualityAssessment | null;
  datasetRiskSummary?: DatasetRiskSummary | null;
}

export interface QualityGateResult {
  qualityScore: number;
  suggestedDecision: DatasetQualityStatus;
  suggestedReasons: DatasetReviewReason[];
  needsSecondReview: boolean;
  isTrainingReady: boolean;
  evidenceSummary: DatasetEvidenceSummary;
  explanation: string[];
  imageQualitySummary?: ImageQualityAssessment;
  datasetRiskSummary?: DatasetRiskSummary;
}

const round4 = (value: number): number => Number(value.toFixed(4));

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const average = (values: readonly number[]): number =>
  values.length === 0
    ? 0
    : values.reduce((sum, value) => sum + value, 0) / values.length;

export const calculateSemanticDrift = (
  sample: HumanCorrectionSample,
): number => {
  const before = sample.originalSemantics?.semanticSummary ?? [];
  const after = sample.updatedSemantics?.semanticSummary ?? [];

  if (before.length === 0 && after.length === 0) {
    return 0;
  }

  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  const union = new Set([...beforeSet, ...afterSet]);
  const intersectionCount = [...beforeSet].filter((label) => afterSet.has(label)).length;

  return round4(1 - intersectionCount / Math.max(1, union.size));
};

const evidenceConfidence = (
  evidence?: TemplateEvidence | null,
): number => {
  if (!evidence) {
    return 0.7;
  }

  return round4(
    average([
      evidence.sourceImageEvidence.confidence,
      evidence.faceGeometryEvidence.confidence,
      evidence.segmentationEvidence.confidence,
      evidence.weightedSamplingEvidence.confidence,
      evidence.humanCorrectionEvidence.confidence,
      evidence.convergenceEvidence.confidence,
      evidence.qualityEvidence.confidence,
    ]),
  );
};

export const runQualityGate = (
  input: QualityGateInput,
): QualityGateResult => {
  const sample = input.sample;
  const semanticDrift = calculateSemanticDrift(sample);
  const evidenceScore = evidenceConfidence(input.evidence);
  const sourceImageQuality = clamp01(
    input.imageQualityAssessment?.overallImageQualityScore ??
      input.sourceImageQuality ??
      1,
  );
  const reasons = new Set<DatasetReviewReason>();
  const explanation: string[] = [];
  let score =
    sample.correctionConfidence * 0.34 +
    evidenceScore * 0.22 +
    sourceImageQuality * 0.16 +
    (1 - semanticDrift) * 0.12 +
    (1 - Math.min(1, sample.maskDiff.changedAreaRatio)) * 0.08 +
    (1 - Math.min(1, sample.maskDiff.alphaDeltaMean * 2)) * 0.08;

  if (sample.correctionConfidence < 0.62) {
    reasons.add('low_confidence');
    score -= 0.18;
    explanation.push('Correction confidence is below the training threshold.');
  }

  if (sample.maskDiff.changedAreaRatio < 0.01) {
    reasons.add('insufficient_makeup_signal');
    score -= 0.12;
    explanation.push('Mask changed area is too small to be useful supervision.');
  }

  if (sample.maskDiff.changedAreaRatio > 0.72) {
    reasons.add('mask_boundary_error');
    score -= 0.18;
    explanation.push('Mask changed area is unusually large.');
  }

  if (sample.maskDiff.edgeShiftScore > 0.7) {
    reasons.add('mask_boundary_error');
    score -= 0.1;
    explanation.push('Edge shift score suggests boundary instability.');
  }

  if (sample.maskDiff.alphaDeltaMean > 0.45) {
    reasons.add('editor_uncertain');
    score -= 0.08;
    explanation.push('Alpha delta mean is high enough to need review.');
  }

  if (semanticDrift > 0.45) {
    reasons.add('semantic_drift');
    score -= 0.14;
    explanation.push('Semantic labels changed substantially after correction.');
  }

  if (sourceImageQuality < 0.55) {
    reasons.add('bad_source_image');
    score -= 0.2;
    explanation.push('Source image quality placeholder is below threshold.');
  }

  if (input.imageQualityAssessment?.suggestedDecision === 'reject_source_image') {
    reasons.add('bad_source_image');
    score -= 0.16;
    explanation.push('Image quality scorer suggests rejecting the source image.');
  }

  if (input.datasetRiskSummary?.riskLevel === 'high') {
    reasons.add('editor_uncertain');
    score -= 0.08;
    explanation.push('Dataset risk summary is high for this export context.');
  }

  if (
    sample.humanVerificationStatus === 'ai_generated' ||
    sample.humanVerificationStatus === 'rejected'
  ) {
    reasons.add('editor_uncertain');
    score -= 0.16;
    explanation.push(`Human verification status is ${sample.humanVerificationStatus}.`);
  }

  const qualityScore = round4(clamp01(score));
  const needsSecondReview =
    qualityScore >= 0.55 &&
    qualityScore < 0.74 &&
    !reasons.has('bad_source_image');
  const isTrainingReady =
    qualityScore >= 0.74 &&
    reasons.size <= 1 &&
    !reasons.has('low_confidence') &&
    !reasons.has('bad_source_image') &&
    !reasons.has('semantic_drift') &&
    sample.humanVerificationStatus !== 'rejected' &&
    sample.humanVerificationStatus !== 'ai_generated';

  if (isTrainingReady && reasons.size === 0) {
    reasons.add('accepted_clean');
    explanation.push('Sample passed quality gate cleanly.');
  } else if (isTrainingReady) {
    reasons.add('accepted_minor_issue');
    explanation.push('Sample passed quality gate with minor issue tags.');
  }

  const suggestedDecision: DatasetQualityStatus = isTrainingReady
    ? 'ready_for_training'
    : needsSecondReview
      ? 'needs_second_review'
      : qualityScore < 0.45
        ? 'rejected'
        : 'pending_review';
  const suggestedReasons = [...reasons].sort();
  const evidenceSummary: DatasetEvidenceSummary = {
    correctionConfidence: sample.correctionConfidence,
    changedAreaRatio: sample.maskDiff.changedAreaRatio,
    edgeShiftScore: sample.maskDiff.edgeShiftScore,
    alphaDeltaMean: sample.maskDiff.alphaDeltaMean,
    semanticDrift,
    evidenceConfidence: evidenceScore,
    humanVerificationStatus: sample.humanVerificationStatus,
    sourceImageQuality,
    suggestedDecision,
    suggestedReasons,
    needsSecondReview,
    isTrainingReady,
  };

  return {
    qualityScore,
    suggestedDecision,
    suggestedReasons,
    needsSecondReview,
    isTrainingReady,
    evidenceSummary,
    explanation,
    imageQualitySummary: input.imageQualityAssessment ?? undefined,
    datasetRiskSummary: input.datasetRiskSummary ?? undefined,
  };
};
