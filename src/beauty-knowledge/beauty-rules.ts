import type { StyleTaxonomyProfile } from '../templates/schema';
import type { TemplateFaceFeatures } from '../vision';

export interface BeautyKnowledgeRule {
  id: string;
  when: Partial<TemplateFaceFeatures>;
  templateGoals: string[];
  styleAdjustments: Partial<Pick<StyleTaxonomyProfile, 'finish' | 'contrast'>>;
  rationale: string;
  priority: number;
}

export const beautyKnowledgeRules: BeautyKnowledgeRule[] = [
  {
    id: 'oily-skin-soft-matte-template',
    when: { skinType: 'oily' },
    templateGoals: ['control_shine', 'smooth_base'],
    styleAdjustments: { finish: 'soft-matte' },
    rationale: 'Oily skin templates should capture oil control and lower shine as reusable knowledge.',
    priority: 10,
  },
  {
    id: 'dry-skin-dewy-template',
    when: { skinType: 'dry' },
    templateGoals: ['hydrate_base', 'preserve_skin_texture'],
    styleAdjustments: { finish: 'dewy' },
    rationale: 'Dry skin templates should preserve hydration and avoid emphasizing texture.',
    priority: 10,
  },
  {
    id: 'round-face-lifted-placement',
    when: { faceShape: 'round' },
    templateGoals: ['lift_blush', 'soft_sculpture'],
    styleAdjustments: { contrast: 'medium' },
    rationale: 'Round face templates benefit from lifted cheek placement and soft contour structure.',
    priority: 8,
  },
  {
    id: 'hooded-eye-thin-definition',
    when: { eyeType: 'hooded' },
    templateGoals: ['preserve_lid_space', 'lift_eye'],
    styleAdjustments: {},
    rationale: 'Hooded eye templates should encode thin definition and lifted outer placement.',
    priority: 9,
  },
  {
    id: 'warm-tone-coral-family',
    when: { skinTone: 'warm' },
    templateGoals: ['warm_harmony', 'peach_coral_color_family'],
    styleAdjustments: {},
    rationale: 'Warm skin tone templates commonly use peach, coral, and warm rose families.',
    priority: 6,
  },
];

export const matchBeautyKnowledgeRules = (
  features: TemplateFaceFeatures,
): BeautyKnowledgeRule[] =>
  beautyKnowledgeRules
    .filter((rule) =>
      Object.entries(rule.when).every(
        ([key, value]) => features[key as keyof TemplateFaceFeatures] === value,
      ),
    )
    .sort((left, right) => right.priority - left.priority);
