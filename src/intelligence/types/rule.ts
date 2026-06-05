import type { FaceFeatures } from './face-features';
import type { MakeupRecommendation } from './makeup-recommendation';

export type FeatureCondition = Partial<FaceFeatures>;

export interface MakeupRule {
  id: string;
  when: FeatureCondition;
  then: Omit<MakeupRecommendation, 'explanations'>;
  reason: string;
  priority?: number;
}
