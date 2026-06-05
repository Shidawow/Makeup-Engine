import type { CosmeticSegmentationTarget } from '../../vision';
import type { PixelFeatureVector } from '../features';

export const LIGHTWEIGHT_CLASSIFIER_SCHEMA_VERSION = 'lightweight-classifier-v0.1' as const;

export type LightweightClassifierKind =
  | 'logistic-linear'
  | 'nearest-centroid'
  | 'decision-stump'
  | 'hybrid-threshold';

export interface LogisticClassifierWeights {
  featureNames: string[];
  weights: Record<string, number>;
  bias: number;
  iterations: number;
  learningRate: number;
}

export interface NearestCentroidClassifier {
  featureNames: string[];
  positiveCentroid: Record<string, number>;
  negativeCentroid: Record<string, number>;
  distanceMetric: 'squared-euclidean';
}

export interface DecisionStumpClassifier {
  featureName: string;
  threshold: number;
  positiveDirection: 'greater-or-equal' | 'less-than';
}

export interface LightweightRegionClassifier {
  regionId: CosmeticSegmentationTarget;
  classifierKind: LightweightClassifierKind;
  positiveCentroid: Record<string, number>;
  negativeCentroid: Record<string, number>;
  featureWeights: Record<string, number>;
  bias: number;
  threshold: number;
  positiveSampleCount: number;
  negativeSampleCount: number;
  qualityWeightedSampleCount: number;
  featureNames: string[];
  logistic?: LogisticClassifierWeights;
  nearestCentroid?: NearestCentroidClassifier;
  decisionStump?: DecisionStumpClassifier;
  warnings: string[];
}

export interface LightweightClassifierTrainingSummary {
  sampleCount: number;
  trainedRegionCount: number;
  positivePixelCount: number;
  negativePixelCount: number;
  classifierKind: LightweightClassifierKind;
  warnings: string[];
}

export interface LightweightClassifierEvaluationSummary {
  evaluatedSampleCount: number;
  evaluatedRegionCount: number;
  meanHardIoU: number;
  meanDice: number;
  meanPixelF1: number;
  readinessStatus:
    | 'trained-lightweight-classifier'
    | 'evaluated-lightweight-classifier'
    | 'insufficient-feature-data'
    | 'failed-classifier-validation';
}

export interface LightweightSegmentationClassifier {
  modelId: string;
  modelVersion: string;
  schemaVersion: typeof LIGHTWEIGHT_CLASSIFIER_SCHEMA_VERSION;
  classifierKind: LightweightClassifierKind;
  createdAt: string;
  sourceDatasetId: string;
  sourcePackageId: string;
  trainingRunId: string;
  trainerConfigVersion: string;
  trainedRegions: CosmeticSegmentationTarget[];
  featureConfig: {
    featureStride: number;
    alphaPositiveThreshold: number;
    alphaNegativeThreshold: number;
    featureNames: string[];
  };
  regionClassifiers: Partial<Record<CosmeticSegmentationTarget, LightweightRegionClassifier>>;
  trainingSummary: LightweightClassifierTrainingSummary;
  evaluationSummary: LightweightClassifierEvaluationSummary;
  readinessStatus: LightweightClassifierEvaluationSummary['readinessStatus'];
  artifactChecksum: string;
}

export interface LightweightClassifierModelArtifact {
  model: LightweightSegmentationClassifier;
  relativePath: string;
  checksum: string;
  byteSize: number;
}

export type LightweightClassifierFeatureName = Exclude<keyof PixelFeatureVector, 'alphaTarget'>;
