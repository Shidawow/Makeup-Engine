import { basicRules } from '../knowledge';
import type { FaceFeatures, MakeupRecommendation, MakeupRule } from '../types';

export interface InferenceResult {
  recommendation: MakeupRecommendation;
  matchedRules: MakeupRule[];
}

const inferMatchedRules = (features: FaceFeatures) =>
  basicRules
    .filter((rule) => isMatch(features, rule.when))
    .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0));

const isMatch = (features: FaceFeatures, condition: Partial<FaceFeatures>) =>
  Object.entries(condition).every(([key, expected]) => features[key as keyof FaceFeatures] === expected);

const mergeString = (
  current: string | undefined,
  next: string | undefined,
  separator = ' · ',
) => {
  if (!current) {
    return next;
  }

  if (!next) {
    return current;
  }

  if (current.includes(next)) {
    return current;
  }

  return `${current}${separator}${next}`;
};

const mergeRecommendation = (
  base: MakeupRecommendation,
  patch: Omit<MakeupRecommendation, 'explanations'>,
) => ({
  foundation: mergeString(base.foundation, patch.foundation),
  eyeliner: mergeString(base.eyeliner, patch.eyeliner),
  contour: base.contour ?? patch.contour,
  blush: mergeString(base.blush, patch.blush),
  lipstick: mergeString(base.lipstick, patch.lipstick),
});

export function inferMakeup(features: FaceFeatures): MakeupRecommendation {
  const matchedRules = inferMatchedRules(features);

  const recommendation = matchedRules.reduce<MakeupRecommendation>(
    (acc, rule) => {
      const merged = mergeRecommendation(acc, rule.then);

      return {
        ...merged,
        explanations: [...(acc.explanations ?? []), rule.reason],
      };
    },
    { explanations: [] },
  );

  return recommendation;
}

export function inferMakeupWithTrace(features: FaceFeatures): InferenceResult {
  const matchedRules = inferMatchedRules(features);

  const recommendation = matchedRules.reduce<MakeupRecommendation>(
    (acc, rule) => {
      const merged = mergeRecommendation(acc, rule.then);

      return {
        ...merged,
        explanations: [...(acc.explanations ?? []), rule.reason],
      };
    },
    { explanations: [] },
  );

  return {
    recommendation,
    matchedRules,
  };
}
