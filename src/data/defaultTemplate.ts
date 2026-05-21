import type { MakeupTemplate } from '../types/makeup';

const now = new Date().toISOString();

export const createDefaultTemplate = (): MakeupTemplate => ({
  metadata: {
    id: 'makeup-template-v01',
    name: '柔玫日常妆',
    version: '0.1.0',
    author: 'Makeup Engine',
    description: '一个基于 specs 协议的结构化妆容模板。',
    createdAt: now,
    updatedAt: now,
  },
  styleTags: ['柔和精致', '玫瑰中性色', '日常', '结构化'],
  regions: {
    base: {
      region: 'base',
      enabled: true,
      goal: '打造均匀透气、保留自然肤质的底妆。',
      parameters: {},
    },
    brow: {
      region: 'brow',
      enabled: true,
      goal: '柔和提拉眉形，并保留毛流感。',
      parameters: {
        shape: '自然平弧眉',
        thickness: 48,
        arch_height: 35,
        tail_length: 58,
        edge_softness: 72,
      },
    },
    eye: {
      region: 'eye',
      enabled: true,
      goal: '晕染出柔和层次，并保持睫毛根部干净。',
      parameters: {
        eye_shadow: {
          placement: '眼皮外三分之一与眼褶',
          intensity: 58,
          edge_softness: 76,
          finish: '柔雾',
          color_family: '玫瑰灰棕',
        },
        eye_liner: {
          direction: '眼尾微微上扬',
          thickness: 28,
          length_ratio: 42,
          sharpness: 62,
        },
        lash: {
          curl: 64,
          density: 52,
          length_focus: '眼尾',
        },
      },
    },
    contour: {
      region: 'contour',
      enabled: true,
      goal: '增加轻微结构感，避免明显修容线。',
      parameters: {},
    },
    blush: {
      region: 'blush',
      enabled: true,
      goal: '在苹果肌上方营造清透提气色。',
      parameters: {
        placement: '颧骨上方至太阳穴方向',
        spread: 56,
        saturation: 48,
        finish: '柔光',
      },
    },
    lip: {
      region: 'lip',
      enabled: true,
      goal: '塑造平衡的柔焦唇形。',
      parameters: {
        shape: '自然圆润',
        overline: 16,
        texture: '丝绒',
        color_depth: 62,
      },
    },
  },
  steps: [
    {
      step_id: 'step-base-1',
      region: 'base',
      goal: '均匀泛红区域，同时保留自然肤质。',
      tool: {
        type: '海绵',
        subtype: '湿润美妆蛋',
      },
      product: {
        category: '底妆',
        color_family: '中性肤色',
        finish: '缎光',
      },
      action: {
        type: 'tap',
        direction: '由中心向外',
        pressure: 'light',
        repeat: 2,
      },
      placement: {
        anchor: '脸部中央',
        shape: '薄层覆盖',
        size: 58,
      },
      effect: {
        contrast: 20,
        softness: 72,
        depth: 18,
      },
    },
    {
      step_id: 'step-eye-1',
      region: 'eye',
      goal: '打造柔和上扬的眼影渐层。',
      tool: {
        type: '刷具',
        subtype: '小号晕染刷',
      },
      product: {
        category: '眼影',
        color_family: '玫瑰灰棕',
        finish: '柔雾',
      },
      action: {
        type: 'blend',
        direction: '眼尾向上',
        pressure: 'medium',
        repeat: 3,
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
    },
    {
      step_id: 'step-lip-1',
      region: 'lip',
      goal: '勾勒唇形，同时保持边缘柔和。',
      tool: {
        type: '刷具',
        subtype: '唇刷',
      },
      product: {
        category: '口红',
        color_family: '暖玫瑰',
        finish: '丝绒',
      },
      action: {
        type: 'smudge',
        direction: '边缘向内',
        pressure: 'light',
        repeat: 1,
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
    },
  ],
});
