import type { MakeupTemplate, StyleTaxonomyFamily } from '../schema';

const now = '2026-05-26T00:00:00.000Z';

const families: StyleTaxonomyFamily[] = [
  'natural',
  'clean-girl',
  'k-beauty',
  'j-beauty',
  'douyin',
  'western',
  'glam',
];

const names = [
  ['template-natural-workday', '自然通勤妆', 'natural', '保留肤质、轻提气色、眼尾微提拉'],
  ['template-clean-girl-glow', 'Clean Girl 光泽妆', 'clean-girl', '清透底妆、毛流眉、低对比气色'],
  ['template-korean-glass-skin', '韩系水光妆', 'k-beauty', '水光底妆、卧蚕提亮、柔和唇色'],
  ['template-japanese-soft-blush', '日系软腮红妆', 'j-beauty', '高位腮红、柔焦眼妆、轻盈唇色'],
  ['template-douyin-doll-eye', '豆音放大眼妆', 'douyin', '放大眼型、强调卧蚕、清晰唇峰'],
  ['template-western-soft-glam', '欧美柔雾 Glam', 'western', '立体修容、清晰眉眼、缎光唇妆'],
  ['template-evening-glam', '晚宴高对比妆', 'glam', '高对比眼妆、精确修容、饱满唇色'],
  ['template-rose-date', '玫瑰约会妆', 'natural', '玫瑰色系、柔边眼影、自然提亮'],
  ['template-camera-ready', '上镜轮廓妆', 'western', '镜头友好底妆、轮廓增强、眼线提神'],
  ['template-warm-coral', '暖调珊瑚妆', 'k-beauty', '珊瑚腮红、暖调唇色、轻透底妆'],
  ['template-soft-matte-office', '柔雾办公室妆', 'clean-girl', '控油柔雾、低饱和色彩、干净线条'],
  ['template-lifted-mature', '提拉减龄妆', 'j-beauty', '上移视觉重心、柔和轮廓、自然唇部饱满'],
] as const;

const makeTemplate = (
  index: number,
  [id, name, family, summary]: (typeof names)[number],
): MakeupTemplate => ({
  id,
  name,
  goals: ['structure_beauty_knowledge', 'extract_reusable_steps', 'support_future_coaching'],
  faceStrategy: {
    id: `${id}-strategy`,
    summary,
    goals: ['balance_face', 'enhance_key_features', 'preserve_style_identity'],
    suitableFaceTypes:
      index % 3 === 0
        ? ['round', 'hooded', 'full']
        : index % 3 === 1
          ? ['oval', 'double', 'thin']
          : ['heart', 'monolid', 'full'],
    reasoning: [
      'The template records why placement and intensity choices suit the target face.',
      'The strategy is designed for later conversion into step-by-step coaching.',
    ],
  },
  style: {
    family: family as StyleTaxonomyFamily,
    finish: index % 4 === 0 ? 'dewy' : index % 4 === 1 ? 'natural' : index % 4 === 2 ? 'soft-matte' : 'satin',
    contrast: index % 4 === 2 ? 'medium' : family === 'glam' || family === 'western' ? 'high' : 'low',
    palette: {
      temperature: index % 2 === 0 ? 'warm' : 'neutral',
      dominantFamilies: index % 2 === 0 ? ['peach', 'coral', 'warm rose'] : ['rose', 'taupe', 'soft brown'],
      accentFamilies: ['soft brown', 'champagne'],
    },
    signatureTraits: [summary, 'structured placement', 'soft transition control'],
    confidence: 0.86,
    evidence: ['Fixture template created for schema validation and studio editing.'],
  },
  faceSuitability: {
    profile: {
      faceShapes: index % 2 === 0 ? ['round', 'oval'] : ['oval', 'heart'],
      skinTypes: index % 2 === 0 ? ['oily', 'combination'] : ['dry', 'combination'],
      skinTones: index % 2 === 0 ? ['warm', 'neutral'] : ['cool', 'neutral'],
      eyeTypes: index % 2 === 0 ? ['hooded', 'double'] : ['monolid', 'double'],
      lipShapes: ['thin', 'full'],
    },
    confidence: 0.82,
    rationale: ['Suitability records which face inputs this template should serve later.'],
  },
  regions: ['base', 'brow', 'eye', 'contour', 'blush', 'lip'].map((region, regionIndex) => ({
    region: region as MakeupTemplate['regions'][number]['region'],
    detected: true,
    confidence: Number((0.78 + regionIndex * 0.03).toFixed(2)),
    cues: [`${region} placement and finish captured from reference makeup.`],
  })),
  eyeDesign: {
    summary: family === 'douyin' ? '扩大眼型并强调卧蚕明暗。' : '用柔和边界提升眼部精神度。',
    effects: family === 'douyin' ? ['widen', 'brighten', 'lift'] : ['lift', 'soften'],
    emphasis: family === 'western' || family === 'glam' ? 'outer corner definition' : 'soft outer lift',
  },
  lipDesign: {
    summary: '用唇中颜色与边缘柔化建立风格完成度。',
    effects: ['balance', 'soften'],
    emphasis: index % 2 === 0 ? 'soft center color' : 'defined but not harsh edge',
  },
  contourDesign: {
    summary: '根据风格强度决定修容是否可见。',
    effects: family === 'western' || family === 'glam' ? ['deepen', 'shrink'] : ['soften', 'balance'],
    emphasis: family === 'western' || family === 'glam' ? 'cheekbone and jawline' : 'barely visible structure',
  },
  steps: [
    {
      id: `${id}-base`,
      order: 1,
      region: 'base',
      action: 'apply',
      tool: 'sponge',
      intensity: 'medium',
      layerOrder: 'base',
      placement: { region: 'base', area: 'center face to outer edge', coverage: 'full' },
      productCategory: 'base',
      finish: 'natural',
      colorFamily: 'skin match',
      visualEffects: ['brighten', 'glow'],
      instruction: 'Build a thin even base and keep texture readable.',
      rationale: 'The base should support later color and structure without masking the face.',
    },
    {
      id: `${id}-eye`,
      order: 2,
      region: 'eye',
      action: 'blend',
      tool: 'brush',
      intensity: family === 'douyin' || family === 'glam' ? 'high' : 'low',
      layerOrder: 'color',
      placement: { region: 'eye', area: 'outer third and lower eye detail', coverage: 'medium' },
      productCategory: 'eyeshadow',
      finish: 'soft-matte',
      colorFamily: 'taupe rose',
      visualEffects: ['lift', 'widen'],
      instruction: 'Blend the outer eye upward and keep the inner transition soft.',
      rationale: 'Eye placement explains how the template changes perceived eye shape.',
    },
    {
      id: `${id}-lip`,
      order: 3,
      region: 'lip',
      action: 'fill',
      tool: 'finger',
      intensity: 'low',
      layerOrder: 'finish',
      placement: { region: 'lip', area: 'lip center and softened edge', coverage: 'medium' },
      productCategory: 'lip color',
      finish: 'satin',
      colorFamily: 'rose',
      visualEffects: ['balance', 'soften'],
      instruction: 'Press color into the lip center and soften the border.',
      rationale: 'Lip strategy records finish and edge softness for later coaching.',
    },
  ],
  metadata: {
    version: '0.1',
    status: 'draft',
    createdAt: now,
    createdBy: 'template-system',
    source: {
      imageId: `${id}-source`,
      fileName: `${id}.jpg`,
      sourceType: 'fixture',
    },
    styleTags: [family, summary],
  },
  notes: ['Example template for Makeup Template Studio and schema validation.'],
});

export const exampleMakeupTemplates: MakeupTemplate[] = names.map((entry, index) =>
  makeTemplate(index, entry),
);
