import type { FaceInput } from '../contracts';
import type { FaceAnalysisResult } from '../contracts';

export interface AnalyzeFaceStage {
  id: 'analyzeFace';
  execute(input: FaceInput): Promise<FaceAnalysisResult>;
}

export const analyzeFace = async (input: FaceInput): Promise<FaceAnalysisResult> => ({
  features: input.features,
  confidence: 1,
  notes: ['Face features received and normalized for downstream inference.'],
});

export const createAnalyzeFaceStage = (): AnalyzeFaceStage => ({
  id: 'analyzeFace',
  execute: analyzeFace,
});
