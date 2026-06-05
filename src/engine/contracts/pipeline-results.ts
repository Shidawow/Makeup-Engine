import type { FaceFeatures, MakeupRecommendation } from '../../intelligence/types';
import type { MakeupLook } from '../../schema/makeup.schema';

export interface FaceAnalysisResult {
  features: FaceFeatures;
  confidence: number;
  notes: string[];
}

export interface BeautyScoreResult {
  score: number;
  confidence: number;
  dimensions: {
    skinBalance: number;
    symmetry: number;
    eyeDefinition: number;
    lipBalance: number;
  };
  notes: string[];
}

export interface StyleInferenceResult {
  styleName: string;
  recommendation: MakeupRecommendation;
  explanations: string[];
  confidence: number;
}

export interface MakeupPlan {
  id: string;
  name: string;
  sourceLook: MakeupLook;
  faceAnalysis: FaceAnalysisResult;
  beautyScore: BeautyScoreResult;
  styleInference: StyleInferenceResult;
  recommendationSummary: {
    foundation?: string;
    eyeliner?: string;
    contour?: boolean;
    blush?: string;
    lipstick?: string;
  };
  steps: MakeupLook['steps'];
}

export interface RenderLayer {
  id: string;
  name: string;
  order: number;
  region: MakeupLook['steps'][number]['region'];
  opacity: number;
  zIndex: number;
}

export interface RenderInstruction {
  id: string;
  planId: string;
  stepId: string;
  layer: RenderLayer;
  action: MakeupLook['steps'][number]['action'];
  tool: MakeupLook['steps'][number]['tool'];
  intensity: MakeupLook['steps'][number]['intensity'];
  description: string;
  region: MakeupLook['steps'][number]['region'];
  blendMode: MakeupLook['steps'][number]['technique']['blendMode'];
  strokeDirection: MakeupLook['steps'][number]['technique']['strokeDirection'];
  layerOrder: MakeupLook['steps'][number]['technique']['layerOrder'];
  repeat: number;
  durationMs: number;
  explanation: string[];
}
