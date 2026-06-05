import type { MakeupRule } from '../types';

export const basicRules: MakeupRule[] = [
  {
    id: 'skin-oily-matte-foundation',
    when: {
      skinType: 'oily',
    },
    then: {
      foundation: 'matte',
    },
    reason: 'Matte foundation works better for oily skin because it helps reduce visible shine.',
    priority: 10,
  },
  {
    id: 'face-round-soft-contour',
    when: {
      faceShape: 'round',
    },
    then: {
      contour: true,
      blush: 'lifted diagonal blush',
    },
    reason:
      'Round faces benefit from soft lifted contour and diagonal blush placement to add structure.',
    priority: 8,
  },
  {
    id: 'eye-hooded-thin-liner',
    when: {
      eyeType: 'hooded',
    },
    then: {
      eyeliner: 'thin lifted eyeliner',
    },
    reason:
      'Hooded eyes usually look more open with thin lifted eyeliner that does not cover lid space.',
    priority: 9,
  },
  {
    id: 'tone-warm-coral-lip',
    when: {
      skinTone: 'warm',
    },
    then: {
      blush: 'peach coral blush',
      lipstick: 'warm coral lipstick',
    },
    reason:
      'Warm skin tones are complemented by peach, coral, and warm rose color families.',
    priority: 6,
  },
  {
    id: 'skin-dry-dewy-foundation',
    when: {
      skinType: 'dry',
    },
    then: {
      foundation: 'dewy hydrating',
    },
    reason:
      'Dry skin usually benefits from hydrating or dewy foundation to avoid emphasizing texture.',
    priority: 10,
  },
  {
    id: 'eye-monolid-gradient-liner',
    when: {
      eyeType: 'monolid',
    },
    then: {
      eyeliner: 'soft gradient eyeliner',
    },
    reason:
      'Monolid eyes often benefit from softly diffused eyeliner that creates dimension without a harsh border.',
    priority: 9,
  },
  {
    id: 'lip-thin-soft-overline',
    when: {
      lipShape: 'thin',
    },
    then: {
      lipstick: 'soft blurred overline lipstick',
    },
    reason:
      'Thin lips can look fuller with a softly blurred edge rather than a sharp heavy outline.',
    priority: 5,
  },
  {
    id: 'lip-full-balanced-color',
    when: {
      lipShape: 'full',
    },
    then: {
      lipstick: 'balanced satin lipstick',
    },
    reason:
      'Full lips already carry volume, so a balanced satin finish keeps the look polished without heaviness.',
    priority: 5,
  },
];
