import { inferMakeupWithTrace } from '../../intelligence/runtime';
import type { FaceAnalysisResult, StyleInferenceResult } from '../contracts';

export interface InferStyleStage {
  id: 'inferStyle';
  execute(input: FaceAnalysisResult): Promise<StyleInferenceResult>;
}

export const inferStyle = async (
  input: FaceAnalysisResult,
): Promise<StyleInferenceResult> => {
  const recommendation = inferMakeupWithTrace(input.features);

  return {
    styleName: 'intelligence-default',
    recommendation: recommendation.recommendation,
    explanations: recommendation.recommendation.explanations ?? [],
    confidence: recommendation.matchedRules.length > 0 ? 1 : 0.5,
  };
};

export const createInferStyleStage = (): InferStyleStage => ({
  id: 'inferStyle',
  execute: inferStyle,
});
