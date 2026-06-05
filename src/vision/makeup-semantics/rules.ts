import type {
  BlushStyle,
  EyeStyle,
  LipFinish,
  LipStyle,
  MakeupSemanticAnalysis,
} from './types';
import type { MakeupPixelAnalysis } from '../pixel-analysis';

const classifyLipStyle = (analysis: MakeupPixelAnalysis): LipStyle => {
  if (
    analysis.lips.gradientDirection === 'center' &&
    analysis.lips.edgeSoftness > 0.82
  ) {
    return 'soft_gradient';
  }

  if (analysis.lips.saturation > 0.35 && analysis.lips.brightness > 0.35) {
    return 'defined_satin';
  }

  return 'muted_natural';
};

const classifyLipFinish = (analysis: MakeupPixelAnalysis): LipFinish => {
  if (analysis.lips.brightness > 0.72 && analysis.lips.saturation > 0.35) {
    return 'gloss';
  }

  if (analysis.lips.edgeSoftness > 0.78) {
    return 'velvet';
  }

  return 'satin';
};

const classifyBlushStyle = (analysis: MakeupPixelAnalysis): BlushStyle => {
  if (analysis.blush.blushCenter.y < 0.56 && analysis.blush.opacity > 0.2) {
    return 'high_lift';
  }

  if (analysis.blush.opacity > 0.12 || analysis.blush.spreadRadius > 0.12) {
    return 'soft_diffused';
  }

  return 'barely_there';
};

const classifyEyeStyle = (analysis: MakeupPixelAnalysis): EyeStyle => {
  if (analysis.eyes.eyeshadowDarkness > 0.42) {
    return 'soft_smokey';
  }

  if (analysis.eyes.eyelinerDirection === 'upward') {
    return 'clean_defined';
  }

  return 'natural_shadow';
};

export const inferMakeupSemantics = (
  analysis: MakeupPixelAnalysis,
): MakeupSemanticAnalysis => {
  const lipStyle = classifyLipStyle(analysis);
  const lipFinish = classifyLipFinish(analysis);
  const blushStyle = classifyBlushStyle(analysis);
  const eyeStyle = classifyEyeStyle(analysis);

  return {
    version: '0.1',
    sourcePixelAnalysis: analysis,
    lipStyle,
    lipFinish,
    blushStyle,
    eyeStyle,
    semanticSummary: [
      `lip_style:${lipStyle}`,
      `lip_finish:${lipFinish}`,
      `blush_style:${blushStyle}`,
      `eye_style:${eyeStyle}`,
    ],
    explanations: [
      `Lip style classified from hue ${analysis.lips.dominantHue}, saturation ${analysis.lips.saturation}, and edge softness ${analysis.lips.edgeSoftness}.`,
      `Blush style classified from center y ${analysis.blush.blushCenter.y}, spread ${analysis.blush.spreadRadius}, and opacity ${analysis.blush.opacity}.`,
      `Eye style classified from darkness ${analysis.eyes.eyeshadowDarkness}, shimmer ${analysis.eyes.shimmerEstimation}, and liner direction ${analysis.eyes.eyelinerDirection}.`,
    ],
  };
};

