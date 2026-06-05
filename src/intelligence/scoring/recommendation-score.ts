import type { MakeupRecommendation } from '../types';

export interface RecommendationScore {
  score: number;
  confidence: number;
}

const weight = (value: string | boolean | undefined) => {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  if (typeof value === 'string') {
    return value.length > 0 ? 1 : 0;
  }

  return 0;
};

export function scoreRecommendation(recommendation: MakeupRecommendation): RecommendationScore {
  const foundationScore = weight(recommendation.foundation);
  const eyelinerScore = weight(recommendation.eyeliner);
  const contourScore = weight(recommendation.contour);
  const blushScore = weight(recommendation.blush);
  const lipstickScore = weight(recommendation.lipstick);

  const score = foundationScore + eyelinerScore + contourScore + blushScore + lipstickScore;

  return {
    score,
    confidence: Math.min(1, score / 5),
  };
}
