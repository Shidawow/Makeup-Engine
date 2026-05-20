import type {
  MakeupRegion,
  MakeupRegionConfig,
  MakeupStep,
  MakeupTemplate,
} from '../types/makeup';
import { MAKEUP_REGIONS } from '../types/makeup';

const now = new Date().toISOString();

const regionDefaults: Record<MakeupRegion, Omit<MakeupRegionConfig, 'region'>> = {
  base: {
    enabled: true,
    visualGoal: '打造均匀透气、保留自然肤质的底妆。',
    parameters: {
      coverage: '中等',
      intensity: 45,
      finish: '缎光',
      undertone: '中性',
      product: '润色底霜 + 遮瑕',
      notes: '发际线和下颌线附近保持轻薄。',
    },
  },
  brow: {
    enabled: true,
    visualGoal: '柔和提拉眉形，并保留毛流感。',
    parameters: {
      coverage: '局部',
      intensity: 35,
      finish: '自然',
      undertone: '冷棕',
      product: '极细眉笔 + 透明眉胶',
      notes: '保留适度空隙，让眉毛更真实。',
    },
  },
  eye: {
    enabled: true,
    visualGoal: '晕染出柔和层次，并保持睫毛根部干净。',
    parameters: {
      coverage: '渐层',
      intensity: 58,
      finish: '柔雾',
      undertone: '玫瑰灰棕',
      product: '粉状眼影 + 眼线笔',
      notes: '如需加入珠光，控制在眼褶下方。',
    },
  },
  contour: {
    enabled: true,
    visualGoal: '增加轻微结构感，避免明显修容线。',
    parameters: {
      coverage: '轻薄',
      intensity: 38,
      finish: '自然哑光',
      undertone: '冷中性',
      product: '膏状修容',
      notes: '定妆前向上晕开。',
    },
  },
  blush: {
    enabled: true,
    visualGoal: '在苹果肌上方营造清透提气色。',
    parameters: {
      coverage: '可叠加',
      intensity: 52,
      finish: '柔光',
      undertone: '蜜桃玫瑰',
      product: '膏状腮红',
      notes: '颜色不要拖到鼻翼线以下。',
    },
  },
  lip: {
    enabled: true,
    visualGoal: '塑造平衡的柔焦唇形。',
    parameters: {
      coverage: '中心饱和，边缘柔化',
      intensity: 62,
      finish: '丝绒',
      undertone: '暖玫瑰',
      product: '唇线笔 + 缎光口红',
      notes: '柔化嘴角，让表情更放松。',
    },
  },
};

const defaultSteps: MakeupStep[] = [
  {
    id: 'step-base-1',
    region: 'base',
    visualGoal: '均匀泛红区域，同时保留自然肤质。',
    tool: '湿润美妆蛋',
    action: {
      type: 'tap',
      direction: '由中心向外',
      pressure: 'light',
      repeat: 2,
      speed: 'steady',
    },
    placement: '脸颊、鼻梁、额头中央、下巴',
    effect: '薄透覆盖，没有明显边界',
  },
  {
    id: 'step-eye-1',
    region: 'eye',
    visualGoal: '打造柔和上扬的眼影渐层。',
    tool: '小号晕染刷',
    action: {
      type: 'blend',
      direction: '眼尾向上',
      pressure: 'medium',
      repeat: 3,
      speed: 'slow',
    },
    placement: '眼皮外三分之一与眼褶',
    effect: '增加柔和深邃感，让眼型更舒展',
  },
  {
    id: 'step-lip-1',
    region: 'lip',
    visualGoal: '勾勒唇形，同时保持边缘柔和。',
    tool: '唇刷',
    action: {
      type: 'smudge',
      direction: '边缘向内',
      pressure: 'light',
      repeat: 1,
      speed: 'steady',
    },
    placement: '唇峰、下唇中央、嘴角',
    effect: '柔焦丝绒妆效，并平衡左右对称',
  },
];

export const createDefaultTemplate = (): MakeupTemplate => ({
  metadata: {
    id: 'makeup-template-v01',
    name: '柔玫日常妆',
    version: '0.1.0',
    author: 'Makeup Engine',
    description: '一个适合现代日常妆的结构化起始模板。',
    createdAt: now,
    updatedAt: now,
  },
  styleTags: ['柔和精致', '玫瑰中性色', '日常', '结构化'],
  regions: MAKEUP_REGIONS.reduce(
    (regions, region) => ({
      ...regions,
      [region]: {
        region,
        ...regionDefaults[region],
      },
    }),
    {} as Record<MakeupRegion, MakeupRegionConfig>,
  ),
  steps: defaultSteps,
});
