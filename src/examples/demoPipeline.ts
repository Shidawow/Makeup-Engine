import {
  MakeupEngine,
  MockRenderRuntime,
  createAnalyzeBeautyStage,
  createAnalyzeFaceStage,
  createBuildMakeupPlanStage,
  createCompileLayersStage,
  createInferStyleStage,
  createRenderPreviewStage,
} from '../engine';
import type {
  BeautyScoreResult,
  FaceAnalysisResult,
  MakeupPlan,
  RenderInstruction,
  StyleInferenceResult,
} from '../engine';
import { mockFaceFeatures } from '../intelligence/analysis';
import type { MockPhotoInput } from '../intelligence/analysis';
import { scoreRecommendation } from '../intelligence/scoring';
import type { RecommendationScore } from '../intelligence/scoring';
import { naturalDaily } from './naturalDaily';

export interface DemoPipelineLog {
  message: string;
  timestamp: string;
}

export interface DemoPipelineResult {
  photo: MockPhotoInput;
  faceAnalysis: FaceAnalysisResult;
  beautyScore: BeautyScoreResult;
  styleInference: StyleInferenceResult;
  recommendationScore: RecommendationScore;
  plan: MakeupPlan;
  renderInstructions: RenderInstruction[];
  logs: DemoPipelineLog[];
}

const log = (message: string): DemoPipelineLog => ({
  message,
  timestamp: new Date().toISOString(),
});

export const runDemoPipeline = async (
  photo: MockPhotoInput,
): Promise<DemoPipelineResult> => {
  const logs: DemoPipelineLog[] = [log(`Loaded local photo input: ${photo.fileName}`)];
  const faceFeatures = await mockFaceFeatures(photo);
  logs.push(log('Mock face analysis completed.'));

  const runtime = new MockRenderRuntime();
  const engine = new MakeupEngine({
    runtime,
    analyzeFaceStage: createAnalyzeFaceStage(),
    analyzeBeautyStage: createAnalyzeBeautyStage(),
    inferStyleStage: createInferStyleStage(),
    buildMakeupPlanStage: createBuildMakeupPlanStage(),
    compileLayersStage: createCompileLayersStage(),
    renderPreviewStage: createRenderPreviewStage(runtime),
  });

  const output = await engine.run({
    faceFeatures,
    look: naturalDaily,
  });
  logs.push(log('Makeup engine pipeline executed.'));

  const recommendationScore = scoreRecommendation(output.styleInference.recommendation);
  logs.push(log('Recommendation scoring completed.'));

  await engine.stop();
  logs.push(log('Runtime renderer completed local preview frame.'));

  return {
    photo,
    faceAnalysis: output.faceAnalysis,
    beautyScore: output.beautyScore,
    styleInference: output.styleInference,
    recommendationScore,
    plan: output.plan,
    renderInstructions: output.renderInstructions,
    logs,
  };
};
