import { inferMakeup, inferMakeupWithTrace } from '../runtime';
import { scoreRecommendation } from '../scoring';
import type { FaceFeatures } from '../types';

const demoFeatures: FaceFeatures = {
  faceShape: 'round',
  skinType: 'oily',
  skinTone: 'warm',
  eyeType: 'hooded',
  lipShape: 'full',
};

const recommendation = inferMakeup(demoFeatures);
const trace = inferMakeupWithTrace(demoFeatures);
const score = scoreRecommendation(recommendation);

export const demoOutput = {
  features: demoFeatures,
  recommendation,
  matchedRules: trace.matchedRules.map((rule) => rule.id),
  score,
};

console.log(JSON.stringify(demoOutput, null, 2));
