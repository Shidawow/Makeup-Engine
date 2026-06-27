import type { CosmeticRegionParameter } from './cosmetic-regions';
import type { FaceMeshRegionQaReport } from './facemeshRegionQa';
import type { MakeupAnalysisPipelineResult } from './pipeline';
import type {
  HsbColorFeature,
  MakeupPixelAnalysis,
  SkinBaselineDifference,
  WeightedColorSample,
} from './pixel-analysis';

export type MakeupSemanticSourceType =
  | 'region_pixel_derived'
  | 'facemesh_region_derived'
  | 'color_rule_derived'
  | 'brightness_rule_derived'
  | 'saturation_rule_derived'
  | 'semantic_rule_derived'
  | 'insufficient_evidence'
  | 'human_review_required';

export type MakeupSemanticConfidenceBand =
  | 'high'
  | 'medium'
  | 'low'
  | 'insufficient';

export type MakeupSemanticExtractionStatus =
  | 'semantic_extraction_ready'
  | 'semantic_extraction_ready_with_warnings'
  | 'semantic_extraction_insufficient_evidence'
  | 'semantic_extraction_blocked';

export type MakeupSemanticCandidateKey =
  | 'lipColorCandidate'
  | 'lipFinishCandidate'
  | 'blushPlacementCandidate'
  | 'blushIntensityCandidate'
  | 'eyeMakeupIntensityCandidate'
  | 'eyeshadowToneCandidate'
  | 'browDefinitionCandidate'
  | 'highlightSignalCandidate'
  | 'contourSignalCandidate'
  | 'overallStyleCandidate';

export interface MakeupSemanticRegionEvidence {
  region:
    | 'lips'
    | 'blush'
    | 'eyes'
    | 'brows'
    | 'highlight'
    | 'contour'
    | 'overall';
  sampleCount: number;
  averageHue?: number;
  averageSaturation?: number;
  averageBrightness?: number;
  contrastVsSkinBaseline?: number;
  relativeHueShift?: number;
  toneCandidate?: 'warm' | 'cool' | 'neutral' | 'unknown';
  intensityBand?: 'none_or_minimal' | 'subtle' | 'medium' | 'strong' | 'unknown';
  notes: string[];
}

export interface MakeupSemanticCandidate<TValue extends string = string> {
  id: string;
  field: MakeupSemanticCandidateKey;
  value: TValue;
  sourceType: MakeupSemanticSourceType;
  confidenceBand: MakeupSemanticConfidenceBand;
  evidence: MakeupSemanticRegionEvidence[];
  limitations: string[];
  humanReviewRequired: true;
  semanticCandidate: true;
  candidate: true;
  notFinal: true;
}

export interface MakeupSemanticExtractionIssue {
  id: string;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface MakeupSemanticExtractionRecommendation {
  id: string;
  message: string;
  nextAction:
    | 'continue_as_candidate_only'
    | 'collect_better_pixel_evidence'
    | 'request_human_review'
    | 'keep_unknown'
    | 'block_final_claim';
}

export interface MakeupSemanticExtractionReport {
  reportId: string;
  imageId: string | null;
  status: MakeupSemanticExtractionStatus;
  candidates: Record<MakeupSemanticCandidateKey, MakeupSemanticCandidate>;
  issues: MakeupSemanticExtractionIssue[];
  recommendations: MakeupSemanticExtractionRecommendation[];
  sourceSummary: Record<MakeupSemanticSourceType, number>;
  allOutputsAreCandidates: true;
  allCandidatesRequireHumanReview: true;
  noFinalClaims: true;
  noAiConfirmedClaims: true;
  noProductShadeClaims: true;
  noMedicalClaims: true;
  noFullyAutomaticExtractionClaim: true;
  registryChainPausedAfter10U: true;
  noRegistryWrite: true;
  noRegistryMutation: true;
  noPublish: true;
  noProductionWriter: true;
  noUserAppShellReplacement: true;
  jsonRoundTripStable: true;
  nextRecommendedPhase: 'Phase 12C - Photo-to-Template Draft Integration & Human Review Editing';
}

export interface MakeupSemanticExtractionInput {
  analysis?: MakeupAnalysisPipelineResult | null;
  regionQa?: FaceMeshRegionQaReport | null;
  reportId?: string;
}

const sourceSummarySeed: Record<MakeupSemanticSourceType, number> = {
  region_pixel_derived: 0,
  facemesh_region_derived: 0,
  color_rule_derived: 0,
  brightness_rule_derived: 0,
  saturation_rule_derived: 0,
  semantic_rule_derived: 0,
  insufficient_evidence: 0,
  human_review_required: 0,
};

const round4 = (value: number): number => Number(value.toFixed(4));

type WeightedSampleKey = keyof NonNullable<
  NonNullable<MakeupPixelAnalysis['weighted']>['samples']
>;

type SkinBaselineKey = keyof NonNullable<
  NonNullable<MakeupPixelAnalysis['skinBaseline']>['differences']
>;

const sampleFor = (
  pixel: MakeupPixelAnalysis | undefined,
  key: WeightedSampleKey,
): WeightedColorSample | undefined => pixel?.weighted?.samples[key];

const baselineFor = (
  pixel: MakeupPixelAnalysis | undefined,
  key: SkinBaselineKey,
): SkinBaselineDifference | undefined => pixel?.skinBaseline?.differences[key];

const cosmeticRegion = <TKind extends CosmeticRegionParameter['kind']>(
  analysis: MakeupAnalysisPipelineResult | null | undefined,
  kind: TKind,
): Extract<CosmeticRegionParameter, { kind: TKind }> | undefined =>
  analysis?.cosmeticRegions.find(
    (region): region is Extract<CosmeticRegionParameter, { kind: TKind }> =>
      region.kind === kind,
  );

const sampleCountFor = (
  pixel: MakeupPixelAnalysis | undefined,
  target: 'lips' | 'blush' | 'eyes',
): number =>
  pixel?.debug.find((item) => item.region === target)?.sampleCount ??
  (target === 'lips'
    ? pixel?.weighted?.samples.lips?.sampleCount
    : target === 'blush'
      ? pixel?.weighted?.samples.blush?.sampleCount
      : pixel?.weighted?.samples.eyeshadow?.sampleCount) ??
  0;

const hasPixelEvidence = (pixel: MakeupPixelAnalysis | undefined): pixel is MakeupPixelAnalysis =>
  Boolean(pixel);

const confidenceFromEvidence = ({
  sampleCount,
  primarySignal,
  hasBaseline = false,
  conservative = false,
}: {
  sampleCount: number;
  primarySignal: number;
  hasBaseline?: boolean;
  conservative?: boolean;
}): MakeupSemanticConfidenceBand => {
  if (sampleCount <= 0) {
    return 'insufficient';
  }
  if (conservative) {
    return primarySignal >= 0.3 && hasBaseline ? 'medium' : 'low';
  }
  if (sampleCount >= 20 && primarySignal >= 0.45 && hasBaseline) {
    return 'high';
  }
  if (sampleCount >= 8 && primarySignal >= 0.2) {
    return 'medium';
  }
  return 'low';
};

const toneFromHue = (hue: number | undefined): 'warm' | 'cool' | 'neutral' | 'unknown' => {
  if (hue === undefined) return 'unknown';
  if (hue >= 335 || hue <= 55) return 'warm';
  if (hue >= 210 && hue <= 334) return 'cool';
  return 'neutral';
};

const intensityFromSignal = (value: number | undefined): 'none_or_minimal' | 'subtle' | 'medium' | 'strong' | 'unknown' => {
  if (value === undefined) return 'unknown';
  if (value >= 0.58) return 'strong';
  if (value >= 0.32) return 'medium';
  if (value >= 0.12) return 'subtle';
  return 'none_or_minimal';
};

const regionEvidence = (
  evidence: MakeupSemanticRegionEvidence,
): MakeupSemanticRegionEvidence => ({
  ...evidence,
  sampleCount: evidence.sampleCount,
  averageHue: evidence.averageHue === undefined ? undefined : round4(evidence.averageHue),
  averageSaturation:
    evidence.averageSaturation === undefined ? undefined : round4(evidence.averageSaturation),
  averageBrightness:
    evidence.averageBrightness === undefined ? undefined : round4(evidence.averageBrightness),
  contrastVsSkinBaseline:
    evidence.contrastVsSkinBaseline === undefined
      ? undefined
      : round4(evidence.contrastVsSkinBaseline),
  relativeHueShift:
    evidence.relativeHueShift === undefined ? undefined : round4(evidence.relativeHueShift),
});

const insufficientCandidate = (
  field: MakeupSemanticCandidateKey,
  id: string,
  region: MakeupSemanticRegionEvidence['region'],
  reason: string,
): MakeupSemanticCandidate<'unknown'> => ({
  id,
  field,
  value: 'unknown',
  sourceType: 'insufficient_evidence',
  confidenceBand: 'insufficient',
  evidence: [
    regionEvidence({
      region,
      sampleCount: 0,
      toneCandidate: 'unknown',
      intensityBand: 'unknown',
      notes: [reason],
    }),
  ],
  limitations: [
    '证据不足，不能强行判断。',
    '该字段仍需人工审核。',
  ],
  humanReviewRequired: true,
  semanticCandidate: true,
  candidate: true,
  notFinal: true,
});

const candidate = <TValue extends string>({
  id,
  field,
  value,
  sourceType,
  confidenceBand,
  evidence,
  limitations,
}: {
  id: string;
  field: MakeupSemanticCandidateKey;
  value: TValue;
  sourceType: MakeupSemanticSourceType;
  confidenceBand: MakeupSemanticConfidenceBand;
  evidence: MakeupSemanticRegionEvidence[];
  limitations: string[];
}): MakeupSemanticCandidate<TValue> => ({
  id,
  field,
  value,
  sourceType,
  confidenceBand,
  evidence: evidence.map(regionEvidence),
  limitations: limitations.includes('需要人工审核。')
    ? limitations
    : [...limitations, '需要人工审核。'],
  humanReviewRequired: true,
  semanticCandidate: true,
  candidate: true,
  notFinal: true,
});

const lipColorFrom = (
  hue: number,
  saturation: number,
  brightness: number,
): 'pink' | 'rose' | 'coral' | 'red' | 'brown' | 'nude' | 'muted' | 'unknown' => {
  if (saturation < 0.12) return 'unknown';
  if (saturation < 0.22) return 'muted';
  if (saturation < 0.34 && brightness > 0.45) return 'nude';
  if (hue >= 345 || hue <= 8) return saturation > 0.5 ? 'red' : 'rose';
  if (hue > 8 && hue <= 28) return 'coral';
  if (hue > 28 && hue <= 58) return brightness < 0.45 ? 'brown' : 'nude';
  if (hue >= 300 && hue < 345) return 'pink';
  return 'muted';
};

const eyeshadowToneFrom = (
  hsv: HsbColorFeature,
): 'warm_brown' | 'cool_brown' | 'pink' | 'orange' | 'gray' | 'dark' | 'shimmer_like' | 'unknown' => {
  if (hsv.brightness < 0.26) return 'dark';
  if (hsv.saturation < 0.16) return 'gray';
  if (hsv.brightness > 0.72 && hsv.saturation > 0.28) return 'shimmer_like';
  if (hsv.hue >= 12 && hsv.hue <= 34) return 'orange';
  if (hsv.hue > 34 && hsv.hue <= 62) return 'warm_brown';
  if (hsv.hue >= 250 && hsv.hue <= 315) return 'cool_brown';
  if (hsv.hue >= 316 || hsv.hue <= 8) return 'pink';
  return 'unknown';
};

const lipColorCandidate = (
  imageId: string,
  pixel: MakeupPixelAnalysis | undefined,
): MakeupSemanticCandidate => {
  if (!hasPixelEvidence(pixel)) {
    return insufficientCandidate(
      'lipColorCandidate',
      `${imageId}-lip-color-semantic`,
      'lips',
      'Lip color requires local region pixel sampling.',
    );
  }
  const sample = sampleFor(pixel, 'lips');
  const sampleCount = sample?.sampleCount ?? sampleCountFor(pixel, 'lips');
  const hue = sample?.weightedHsvMean.hue ?? pixel.lips.dominantHue;
  const saturation = sample?.weightedSaturation ?? pixel.lips.saturation;
  const brightness = sample?.weightedBrightness ?? pixel.lips.brightness;
  const baseline = baselineFor(pixel, 'lips');
  const value = lipColorFrom(hue, saturation, brightness);

  return candidate({
    id: `${imageId}-lip-color-semantic`,
    field: 'lipColorCandidate',
    value,
    sourceType: value === 'unknown' ? 'insufficient_evidence' : 'color_rule_derived',
    confidenceBand:
      value === 'unknown'
        ? 'insufficient'
        : confidenceFromEvidence({
            sampleCount,
            primarySignal: saturation,
            hasBaseline: Boolean(baseline),
          }),
    evidence: [
      {
        region: 'lips',
        sampleCount,
        averageHue: hue,
        averageSaturation: saturation,
        averageBrightness: brightness,
        contrastVsSkinBaseline: baseline?.opacityEstimate,
        relativeHueShift: baseline?.relativeHueShift,
        toneCandidate: toneFromHue(hue),
        intensityBand: intensityFromSignal(saturation),
        notes: [
          'Lip color is derived from local hue/saturation/brightness rules.',
          baseline
            ? 'Skin baseline difference is available.'
            : 'Skin baseline difference is unavailable; confidence is conservative.',
        ],
      },
    ],
    limitations: [
      '候选色系不是具体品牌色号。',
      '光照、白平衡和遮挡可能影响色相。',
      '需要人工审核后才能进入模板内容。',
    ],
  });
};

const lipFinishCandidate = (
  imageId: string,
  pixel: MakeupPixelAnalysis | undefined,
): MakeupSemanticCandidate => {
  if (!hasPixelEvidence(pixel)) {
    return insufficientCandidate(
      'lipFinishCandidate',
      `${imageId}-lip-finish-semantic`,
      'lips',
      'Lip finish requires brightness and edge/highlight evidence.',
    );
  }
  const edge = pixel.edgeAnalysis?.features.lips;
  const sampleCount = edge?.innerSampleCount ?? sampleCountFor(pixel, 'lips');
  const brightness = pixel.lips.brightness;
  const edgeContrast = edge?.edgeContrast ?? Math.abs(1 - pixel.lips.edgeSoftness);
  const value =
    brightness > 0.72 && edgeContrast > 0.08
      ? 'glossy_like'
      : brightness < 0.46 && pixel.lips.edgeSoftness > 0.65
        ? 'matte_like'
        : 'satin_like';

  return candidate({
    id: `${imageId}-lip-finish-semantic`,
    field: 'lipFinishCandidate',
    value,
    sourceType: 'brightness_rule_derived',
    confidenceBand: confidenceFromEvidence({
      sampleCount,
      primarySignal: edgeContrast,
      hasBaseline: Boolean(edge),
      conservative: true,
    }),
    evidence: [
      {
        region: 'lips',
        sampleCount,
        averageBrightness: brightness,
        contrastVsSkinBaseline: edgeContrast,
        intensityBand: intensityFromSignal(edgeContrast),
        notes: [
          'Lip finish is a conservative brightness/edge signal.',
          edge ? 'Edge ring evidence is available.' : 'No edge ring evidence; finish confidence stays low.',
        ],
      },
    ],
    limitations: [
      '质地判断对光照和高光非常敏感。',
      '不能识别具体唇釉/口红产品。',
      '需要人工审核。',
    ],
  });
};

const blushPlacementCandidate = (
  imageId: string,
  pixel: MakeupPixelAnalysis | undefined,
): MakeupSemanticCandidate => {
  if (!hasPixelEvidence(pixel) || pixel.blush.opacity < 0.08) {
    return insufficientCandidate(
      'blushPlacementCandidate',
      `${imageId}-blush-placement-semantic`,
      'blush',
      'Cheek color evidence is too weak for placement classification.',
    );
  }
  const { y } = pixel.blush.blushCenter;
  const value =
    y < 0.44
      ? 'under_eye_blush'
      : y < 0.53
        ? 'upper_cheek'
        : pixel.blush.spreadRadius > 0.24
          ? 'diffuse'
          : 'center_cheek';

  return candidate({
    id: `${imageId}-blush-placement-semantic`,
    field: 'blushPlacementCandidate',
    value,
    sourceType: 'region_pixel_derived',
    confidenceBand: confidenceFromEvidence({
      sampleCount: sampleCountFor(pixel, 'blush'),
      primarySignal: pixel.blush.opacity,
      hasBaseline: Boolean(pixel.skinBaseline?.differences.blush),
      conservative: true,
    }),
    evidence: [
      {
        region: 'blush',
        sampleCount: sampleCountFor(pixel, 'blush'),
        contrastVsSkinBaseline: pixel.skinBaseline?.differences.blush?.opacityEstimate,
        relativeHueShift: pixel.skinBaseline?.differences.blush?.relativeHueShift,
        toneCandidate: pixel.blush.tone,
        intensityBand: intensityFromSignal(pixel.blush.opacity),
        notes: [
          `Blush center y=${pixel.blush.blushCenter.y}.`,
          `Spread radius=${pixel.blush.spreadRadius}.`,
        ],
      },
    ],
    limitations: [
      '腮红位置是区域像素候选，不是定稿判断。',
      '脸部姿态和遮挡会影响中心点。',
    ],
  });
};

const blushIntensityCandidate = (
  imageId: string,
  pixel: MakeupPixelAnalysis | undefined,
): MakeupSemanticCandidate => {
  if (!hasPixelEvidence(pixel)) {
    return insufficientCandidate(
      'blushIntensityCandidate',
      `${imageId}-blush-intensity-semantic`,
      'blush',
      'Blush intensity requires cheek saturation or skin baseline evidence.',
    );
  }
  const baseline = baselineFor(pixel, 'blush');
  const signal = baseline?.opacityEstimate ?? pixel.blush.opacity;
  const value = intensityFromSignal(signal);

  return candidate({
    id: `${imageId}-blush-intensity-semantic`,
    field: 'blushIntensityCandidate',
    value: value === 'none_or_minimal' ? 'subtle' : value,
    sourceType: 'saturation_rule_derived',
    confidenceBand: confidenceFromEvidence({
      sampleCount: sampleCountFor(pixel, 'blush'),
      primarySignal: signal,
      hasBaseline: Boolean(baseline),
    }),
    evidence: [
      {
        region: 'blush',
        sampleCount: sampleCountFor(pixel, 'blush'),
        contrastVsSkinBaseline: signal,
        relativeHueShift: baseline?.relativeHueShift,
        toneCandidate: pixel.blush.tone,
        intensityBand: value,
        notes: ['Blush intensity is estimated from saturation/skin-baseline difference.'],
      },
    ],
    limitations: [
      '腮红强度受肤色基线和光照影响。',
      '需要人工审核。',
    ],
  });
};

const eyeMakeupIntensityCandidate = (
  imageId: string,
  pixel: MakeupPixelAnalysis | undefined,
): MakeupSemanticCandidate => {
  if (!hasPixelEvidence(pixel)) {
    return insufficientCandidate(
      'eyeMakeupIntensityCandidate',
      `${imageId}-eye-intensity-semantic`,
      'eyes',
      'Eye intensity requires eye-region brightness contrast evidence.',
    );
  }
  const baseline = baselineFor(pixel, 'eyeshadow');
  const signal = baseline?.opacityEstimate ?? pixel.eyes.eyeshadowDarkness;

  return candidate({
    id: `${imageId}-eye-intensity-semantic`,
    field: 'eyeMakeupIntensityCandidate',
    value: intensityFromSignal(signal),
    sourceType: 'brightness_rule_derived',
    confidenceBand: confidenceFromEvidence({
      sampleCount: sampleCountFor(pixel, 'eyes'),
      primarySignal: signal,
      hasBaseline: Boolean(baseline),
    }),
    evidence: [
      {
        region: 'eyes',
        sampleCount: sampleCountFor(pixel, 'eyes'),
        contrastVsSkinBaseline: signal,
        relativeHueShift: baseline?.relativeHueShift,
        intensityBand: intensityFromSignal(signal),
        notes: ['Eye makeup intensity is estimated from darkness/brightness contrast.'],
      },
    ],
    limitations: [
      '不判断复杂眼线形状。',
      '不识别具体眼影产品。',
    ],
  });
};

const eyeshadowToneCandidate = (
  imageId: string,
  pixel: MakeupPixelAnalysis | undefined,
): MakeupSemanticCandidate => {
  const sample = sampleFor(pixel, 'eyeshadow');
  if (!sample) {
    return insufficientCandidate(
      'eyeshadowToneCandidate',
      `${imageId}-eyeshadow-tone-semantic`,
      'eyes',
      'No weighted eyeshadow color sample is available.',
    );
  }
  const value = eyeshadowToneFrom(sample.weightedHsvMean);

  return candidate({
    id: `${imageId}-eyeshadow-tone-semantic`,
    field: 'eyeshadowToneCandidate',
    value,
    sourceType: value === 'unknown' ? 'insufficient_evidence' : 'color_rule_derived',
    confidenceBand:
      value === 'unknown'
        ? 'insufficient'
        : confidenceFromEvidence({
            sampleCount: sample.sampleCount,
            primarySignal: sample.weightedSaturation,
            hasBaseline: Boolean(baselineFor(pixel, 'eyeshadow')),
            conservative: true,
          }),
    evidence: [
      {
        region: 'eyes',
        sampleCount: sample.sampleCount,
        averageHue: sample.weightedHsvMean.hue,
        averageSaturation: sample.weightedSaturation,
        averageBrightness: sample.weightedBrightness,
        contrastVsSkinBaseline: baselineFor(pixel, 'eyeshadow')?.opacityEstimate,
        toneCandidate: toneFromHue(sample.weightedHsvMean.hue),
        intensityBand: intensityFromSignal(sample.weightedSaturation),
        notes: ['Eyeshadow tone is a weighted local color-rule candidate.'],
      },
    ],
    limitations: [
      '眼影色调仍是候选，不能当作定稿色彩判断。',
      '珠光/亮片只作为 shimmer_like 信号。',
    ],
  });
};

const browDefinitionCandidate = (
  imageId: string,
  analysis: MakeupAnalysisPipelineResult | null | undefined,
): MakeupSemanticCandidate => {
  const brows = cosmeticRegion(analysis, 'brows');
  if (!brows) {
    return insufficientCandidate(
      'browDefinitionCandidate',
      `${imageId}-brow-definition-semantic`,
      'brows',
      'Brow region geometry is unavailable.',
    );
  }
  const definition = brows.parameters.definition;
  const value = definition >= 0.7 ? 'strong' : definition >= 0.42 ? 'defined' : 'soft';

  return candidate({
    id: `${imageId}-brow-definition-semantic`,
    field: 'browDefinitionCandidate',
    value,
    sourceType: 'facemesh_region_derived',
    confidenceBand: brows.confidence >= 0.75 ? 'medium' : 'low',
    evidence: [
      {
        region: 'brows',
        sampleCount: 0,
        intensityBand: intensityFromSignal(definition),
        notes: [
          `Brow definition parameter=${definition}.`,
          `Brow region confidence=${brows.confidence}.`,
        ],
      },
    ],
    limitations: [
      '眉毛清晰度来自 FaceMesh 区域参数，不是发丝级识别。',
      '需要人工审核。',
    ],
  });
};

const highlightSignalCandidate = (
  imageId: string,
  analysis: MakeupAnalysisPipelineResult | null | undefined,
): MakeupSemanticCandidate => {
  const highlight = cosmeticRegion(analysis, 'highlight');
  if (!highlight) {
    return insufficientCandidate(
      'highlightSignalCandidate',
      `${imageId}-highlight-signal-semantic`,
      'highlight',
      'Highlight region geometry or brightness evidence is unavailable.',
    );
  }
  const signal = highlight.parameters.glowIntensity;

  return candidate({
    id: `${imageId}-highlight-signal-semantic`,
    field: 'highlightSignalCandidate',
    value: signal >= 0.48 ? 'signal_present' : signal >= 0.22 ? 'weak_signal' : 'unknown',
    sourceType: 'facemesh_region_derived',
    confidenceBand: signal >= 0.48 ? 'medium' : 'low',
    evidence: [
      {
        region: 'highlight',
        sampleCount: 0,
        intensityBand: intensityFromSignal(signal),
        notes: [
          `Highlight glow signal=${signal}.`,
          'This is a signal candidate, not a final highlight conclusion.',
        ],
      },
    ],
    limitations: [
      '高光非常受环境光影响。',
      '这里只输出 signal candidate，不输出定稿修容/高光结论。',
    ],
  });
};

const contourSignalCandidate = (
  imageId: string,
  analysis: MakeupAnalysisPipelineResult | null | undefined,
  pixel: MakeupPixelAnalysis | undefined,
): MakeupSemanticCandidate => {
  const contour = cosmeticRegion(analysis, 'contour');
  const baseline = baselineFor(pixel, 'contour');
  if (!contour && !baseline) {
    return insufficientCandidate(
      'contourSignalCandidate',
      `${imageId}-contour-signal-semantic`,
      'contour',
      'Contour geometry or low-brightness contrast evidence is unavailable.',
    );
  }
  const signal = baseline?.opacityEstimate ?? contour?.parameters.cheekDepth ?? 0;

  return candidate({
    id: `${imageId}-contour-signal-semantic`,
    field: 'contourSignalCandidate',
    value: signal >= 0.42 ? 'signal_present' : signal >= 0.18 ? 'weak_signal' : 'unknown',
    sourceType: baseline ? 'brightness_rule_derived' : 'facemesh_region_derived',
    confidenceBand: confidenceFromEvidence({
      sampleCount: baseline?.innerSampleCount ?? 0,
      primarySignal: signal,
      hasBaseline: Boolean(baseline),
      conservative: true,
    }),
    evidence: [
      {
        region: 'contour',
        sampleCount: baseline?.innerSampleCount ?? 0,
        contrastVsSkinBaseline: signal,
        relativeHueShift: baseline?.relativeHueShift,
        intensityBand: intensityFromSignal(signal),
        notes: [
          baseline
            ? 'Contour signal uses low-brightness skin-baseline contrast.'
            : 'Contour signal uses FaceMesh region parameter fallback.',
          'This is a signal candidate only.',
        ],
      },
    ],
    limitations: [
      '修容信号可能与阴影/脸部结构混淆。',
      '必须人工审核。',
    ],
  });
};

const overallStyleFrom = (
  candidates: Partial<Record<MakeupSemanticCandidateKey, MakeupSemanticCandidate>>,
): 'natural_daily' | 'soft_korean' | 'japanese_soft' | 'clean_girl' | 'glam' | 'bold_lip' | 'eye_focused' | 'unknown' => {
  const lip = candidates.lipColorCandidate?.value;
  const blushIntensity = candidates.blushIntensityCandidate?.value;
  const eyeIntensity = candidates.eyeMakeupIntensityCandidate?.value;
  const highlight = candidates.highlightSignalCandidate?.value;

  if (!lip || lip === 'unknown') return 'unknown';
  if (['red', 'rose'].includes(lip) && eyeIntensity !== 'strong') return 'bold_lip';
  if (eyeIntensity === 'strong') return 'eye_focused';
  if (blushIntensity === 'medium' && ['pink', 'rose'].includes(lip)) return 'soft_korean';
  if (highlight === 'signal_present' && eyeIntensity === 'subtle') return 'clean_girl';
  if (blushIntensity === 'subtle' && ['nude', 'muted'].includes(lip)) return 'natural_daily';
  if (['pink', 'coral'].includes(lip)) return 'japanese_soft';
  return 'natural_daily';
};

const overallStyleCandidate = (
  imageId: string,
  candidates: Partial<Record<MakeupSemanticCandidateKey, MakeupSemanticCandidate>>,
): MakeupSemanticCandidate => {
  const value = overallStyleFrom(candidates);
  const sourceEvidence = Object.values(candidates).filter(
    (item) => item && item.confidenceBand !== 'insufficient',
  ).length;

  return candidate({
    id: `${imageId}-overall-style-semantic`,
    field: 'overallStyleCandidate',
    value,
    sourceType: 'semantic_rule_derived',
    confidenceBand: sourceEvidence >= 4 ? 'medium' : sourceEvidence >= 2 ? 'low' : 'insufficient',
    evidence: [
      {
        region: 'overall',
        sampleCount: sourceEvidence,
        toneCandidate: 'unknown',
        intensityBand: 'unknown',
        notes: [
          `Overall style assembled from ${sourceEvidence} semantic candidates.`,
          'Overall style is rule-derived and always requires human review.',
        ],
      },
    ],
    limitations: [
      '整体风格是候选组合，不是定稿风格判断。',
      '必须人工审核后才能进入模板草稿。',
    ],
  });
};

const summarizeSources = (
  candidates: Record<MakeupSemanticCandidateKey, MakeupSemanticCandidate>,
): Record<MakeupSemanticSourceType, number> => {
  const summary = { ...sourceSummarySeed };
  Object.values(candidates).forEach((item) => {
    summary[item.sourceType] += 1;
    summary.human_review_required += 1;
  });
  return summary;
};

const isJsonStable = (value: unknown): boolean =>
  JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);

export const createMakeupSemanticExtractionReport = ({
  analysis = null,
  regionQa = null,
  reportId = 'phase-12b-makeup-semantic-extraction-baseline',
}: MakeupSemanticExtractionInput): MakeupSemanticExtractionReport => {
  const imageId = analysis?.imageId ?? 'makeup-semantic-unavailable';
  const pixel = analysis?.pixelAnalysis;
  const partial: Partial<Record<MakeupSemanticCandidateKey, MakeupSemanticCandidate>> = {
    lipColorCandidate: lipColorCandidate(imageId, pixel),
    lipFinishCandidate: lipFinishCandidate(imageId, pixel),
    blushPlacementCandidate: blushPlacementCandidate(imageId, pixel),
    blushIntensityCandidate: blushIntensityCandidate(imageId, pixel),
    eyeMakeupIntensityCandidate: eyeMakeupIntensityCandidate(imageId, pixel),
    eyeshadowToneCandidate: eyeshadowToneCandidate(imageId, pixel),
    browDefinitionCandidate: browDefinitionCandidate(imageId, analysis),
    highlightSignalCandidate: highlightSignalCandidate(imageId, analysis),
    contourSignalCandidate: contourSignalCandidate(imageId, analysis, pixel),
  };
  partial.overallStyleCandidate = overallStyleCandidate(imageId, partial);
  const candidates = partial as Record<MakeupSemanticCandidateKey, MakeupSemanticCandidate>;
  const insufficientCount = Object.values(candidates).filter(
    (item) => item.confidenceBand === 'insufficient' || item.sourceType === 'insufficient_evidence',
  ).length;
  const issues: MakeupSemanticExtractionIssue[] = [
    ...(!analysis
      ? [
          {
            id: 'missing_analysis',
            severity: 'blocking' as const,
            message: 'Vision analysis is required before semantic extraction.',
            recommendation: 'Run local Vision Analysis before using semantic candidates.',
          },
        ]
      : []),
    ...(!pixel
      ? [
          {
            id: 'missing_pixel_analysis',
            severity: 'warning' as const,
            message: 'Pixel analysis is missing; color and brightness candidates are insufficient.',
            recommendation: 'Provide local image pixel data or corrected masks for semantic extraction.',
          },
        ]
      : []),
    ...(regionQa?.status === 'region_qa_blocked'
      ? [
          {
            id: 'region_qa_blocked',
            severity: 'blocking' as const,
            message: 'FaceMesh region QA is blocked.',
            recommendation: 'Fix FaceMesh/region QA before using candidates in template drafting.',
          },
        ]
      : []),
    ...(insufficientCount > 0
      ? [
          {
            id: 'insufficient_candidate_evidence',
            severity: 'warning' as const,
            message: `${insufficientCount} semantic candidates have insufficient evidence.`,
            recommendation: 'Keep unknown candidates or ask a human reviewer to fill them.',
          },
        ]
      : []),
  ];
  const blocked = issues.some((issue) => issue.severity === 'blocking');
  const warning = issues.some((issue) => issue.severity === 'warning');
  const status: MakeupSemanticExtractionStatus = blocked
    ? 'semantic_extraction_blocked'
    : insufficientCount >= Object.keys(candidates).length - 1
      ? 'semantic_extraction_insufficient_evidence'
      : warning
        ? 'semantic_extraction_ready_with_warnings'
        : 'semantic_extraction_ready';
  const report: MakeupSemanticExtractionReport = {
    reportId,
    imageId: analysis?.imageId ?? null,
    status,
    candidates,
    issues,
    recommendations: [
      {
        id: 'candidate_only',
        message: 'All semantic outputs must remain candidates until human review.',
        nextAction: 'continue_as_candidate_only',
      },
      {
        id: 'no_shade_claims',
        message: 'Do not turn color families into brand shade claims.',
        nextAction: 'request_human_review',
      },
      {
        id: 'no_final_claims',
        message: 'Block fully automatic extraction and final recognition wording.',
        nextAction: 'block_final_claim',
      },
    ],
    sourceSummary: summarizeSources(candidates),
    allOutputsAreCandidates: true,
    allCandidatesRequireHumanReview: true,
    noFinalClaims: true,
    noAiConfirmedClaims: true,
    noProductShadeClaims: true,
    noMedicalClaims: true,
    noFullyAutomaticExtractionClaim: true,
    registryChainPausedAfter10U: true,
    noRegistryWrite: true,
    noRegistryMutation: true,
    noPublish: true,
    noProductionWriter: true,
    noUserAppShellReplacement: true,
    jsonRoundTripStable: true,
    nextRecommendedPhase:
      'Phase 12C - Photo-to-Template Draft Integration & Human Review Editing',
  };

  return {
    ...report,
    jsonRoundTripStable: isJsonStable(report) as true,
  };
};
