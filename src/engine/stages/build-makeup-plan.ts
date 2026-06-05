import type { MakeupLook } from '../../schema/makeup.schema';
import type { BeautyScoreResult, FaceAnalysisResult, MakeupPlan, StyleInferenceResult } from '../contracts';

export interface BuildMakeupPlanStage {
  id: 'buildMakeupPlan';
  execute(input: {
    look: MakeupLook;
    faceAnalysis: FaceAnalysisResult;
    beautyScore: BeautyScoreResult;
    styleInference: StyleInferenceResult;
  }): Promise<MakeupPlan>;
}

export const buildMakeupPlan = async (input: {
  look: MakeupLook;
  faceAnalysis: FaceAnalysisResult;
  beautyScore: BeautyScoreResult;
  styleInference: StyleInferenceResult;
}): Promise<MakeupPlan> => ({
  id: `${input.look.id}-plan`,
  name: `${input.look.name} Plan`,
  sourceLook: input.look,
  faceAnalysis: input.faceAnalysis,
  beautyScore: input.beautyScore,
  styleInference: input.styleInference,
  recommendationSummary: {
    foundation: input.styleInference.recommendation.foundation,
    eyeliner: input.styleInference.recommendation.eyeliner,
    contour: input.styleInference.recommendation.contour,
    blush: input.styleInference.recommendation.blush,
    lipstick: input.styleInference.recommendation.lipstick,
  },
  steps: input.look.steps,
});

export const createBuildMakeupPlanStage = (): BuildMakeupPlanStage => ({
  id: 'buildMakeupPlan',
  execute: buildMakeupPlan,
});
