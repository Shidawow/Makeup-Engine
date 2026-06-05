import type { MakeupAction, MakeupEffect, MakeupPlacement, MakeupRegion, VisualGoalId } from '../schema/legacyTypes';

export interface GoalActionRule {
  goal: VisualGoalId;
  region: MakeupRegion;
  action: MakeupAction;
  placement: MakeupPlacement;
  effect: MakeupEffect;
  rationale: string;
}

export const goalActionRules: GoalActionRule[] = [
  {
    goal: 'enlarge_eye',
    region: 'eye',
    action: {
      type: 'blend',
      direction: '眼中到眼尾向外打开',
      pressure: 'medium',
      repeat: 3,
      speed: 'steady',
    },
    placement: {
      anchor: '上眼皮外侧与下眼影后三分之一',
      shape: '横向扩展渐层',
      size: 54,
    },
    effect: {
      contrast: 48,
      softness: 72,
      depth: 46,
    },
    rationale: '通过横向扩展和边界柔化放大眼型。',
  },
  {
    goal: 'soften_eye',
    region: 'eye',
    action: {
      type: 'blend',
      direction: '边界向外轻扫',
      pressure: 'light',
      repeat: 2,
      speed: 'slow',
    },
    placement: {
      anchor: '眼影外缘',
      shape: '柔雾边界',
      size: 40,
    },
    effect: {
      contrast: 28,
      softness: 86,
      depth: 30,
    },
    rationale: '降低边界对比，让眼妆更柔和。',
  },
  {
    goal: 'lift_eye',
    region: 'eye',
    action: {
      type: 'blend',
      direction: '眼尾向上',
      pressure: 'medium',
      repeat: 3,
      speed: 'slow',
    },
    placement: {
      anchor: '眼尾外三分之一',
      shape: '上扬三角',
      size: 44,
    },
    effect: {
      contrast: 46,
      softness: 78,
      depth: 52,
    },
    rationale: '把视觉重量放在外上方，形成提拉感。',
  },
  {
    goal: 'deepen_eye',
    region: 'eye',
    action: {
      type: 'tap',
      direction: '眼褶与睫毛根部轻压',
      pressure: 'medium',
      repeat: 2,
      speed: 'slow',
    },
    placement: {
      anchor: '睫毛根部与眼尾眼褶',
      shape: '窄带加深',
      size: 34,
    },
    effect: {
      contrast: 62,
      softness: 58,
      depth: 70,
    },
    rationale: '增加根部和眼褶深度，让眼窝更立体。',
  },
  {
    goal: 'widen_eye',
    region: 'eye',
    action: {
      type: 'line',
      direction: '眼尾水平拉长',
      pressure: 'light',
      repeat: 1,
      speed: 'slow',
    },
    placement: {
      anchor: '上眼线眼尾',
      shape: '细长延伸',
      size: 30,
    },
    effect: {
      contrast: 56,
      softness: 48,
      depth: 50,
    },
    rationale: '用眼尾线条把眼型横向拉开。',
  },
  {
    goal: 'reduce_midface',
    region: 'contour',
    action: {
      type: 'blend',
      direction: '苹果肌上方向太阳穴过渡',
      pressure: 'light',
      repeat: 2,
      speed: 'steady',
    },
    placement: {
      anchor: '颧骨上方',
      shape: '斜向短带',
      size: 42,
    },
    effect: {
      contrast: 34,
      softness: 78,
      depth: 36,
    },
    rationale: '把视觉重点上移，减少中庭留白感。',
  },
  {
    goal: 'slim_face',
    region: 'contour',
    action: {
      type: 'drag',
      direction: '脸侧向内轻带',
      pressure: 'light',
      repeat: 2,
      speed: 'steady',
    },
    placement: {
      anchor: '下颌线与脸侧',
      shape: '窄长阴影',
      size: 46,
    },
    effect: {
      contrast: 42,
      softness: 72,
      depth: 50,
    },
    rationale: '在轮廓边缘建立轻阴影，收窄脸部视觉宽度。',
  },
  {
    goal: 'increase_dimension',
    region: 'contour',
    action: {
      type: 'blend',
      direction: '结构边界向外融合',
      pressure: 'medium',
      repeat: 2,
      speed: 'steady',
    },
    placement: {
      anchor: '颧骨下方与鼻侧',
      shape: '轻结构阴影',
      size: 48,
    },
    effect: {
      contrast: 46,
      softness: 70,
      depth: 56,
    },
    rationale: '提高明暗层次，但保留自然边界。',
  },
  {
    goal: 'soften_contour',
    region: 'contour',
    action: {
      type: 'blend',
      direction: '修容边缘向外晕开',
      pressure: 'light',
      repeat: 3,
      speed: 'slow',
    },
    placement: {
      anchor: '修容外缘',
      shape: '柔化过渡',
      size: 52,
    },
    effect: {
      contrast: 24,
      softness: 88,
      depth: 34,
    },
    rationale: '降低线条感，让结构更像自然阴影。',
  },
  {
    goal: 'fuller_lip',
    region: 'lip',
    action: {
      type: 'fill',
      direction: '唇中向外薄铺',
      pressure: 'medium',
      repeat: 2,
      speed: 'steady',
    },
    placement: {
      anchor: '上唇峰与下唇中央',
      shape: '饱满椭圆',
      size: 44,
    },
    effect: {
      contrast: 42,
      softness: 64,
      depth: 46,
    },
    rationale: '强化唇中面积和饱满度。',
  },
  {
    goal: 'softer_lip',
    region: 'lip',
    action: {
      type: 'smudge',
      direction: '边缘向内',
      pressure: 'light',
      repeat: 1,
      speed: 'slow',
    },
    placement: {
      anchor: '唇峰与下唇中央',
      shape: '柔焦边缘',
      size: 36,
    },
    effect: {
      contrast: 38,
      softness: 82,
      depth: 44,
    },
    rationale: '柔化唇线，形成雾面过渡。',
  },
  {
    goal: 'youthful_lip',
    region: 'lip',
    action: {
      type: 'tap',
      direction: '唇中点压并向外扩散',
      pressure: 'light',
      repeat: 2,
      speed: 'quick',
    },
    placement: {
      anchor: '上下唇中央',
      shape: '渐淡圆点',
      size: 34,
    },
    effect: {
      contrast: 34,
      softness: 76,
      depth: 36,
    },
    rationale: '保持唇边轻盈，把气色集中在唇中。',
  },
];

export const resolveGoalActionRule = (goal: string, region?: MakeupRegion) => {
  const normalizedGoal = goal.trim();

  return goalActionRules.find(
    (rule) => rule.goal === normalizedGoal && (!region || rule.region === region),
  );
};
