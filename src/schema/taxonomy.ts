import type { ActionPressure, MakeupActionType, MakeupRegion } from './legacyTypes';

export type ParameterFieldKind = 'text' | 'range';

export interface ParameterFieldSchema {
  key: string;
  label: string;
  kind: ParameterFieldKind;
  path: string[];
  min?: number;
  max?: number;
}

export interface ParameterGroupSchema {
  id: string;
  title: string;
  fields: ParameterFieldSchema[];
}

export const regionLabels: Record<MakeupRegion, string> = {
  base: '底妆',
  brow: '眉毛',
  eye: '眼妆',
  contour: '修容',
  blush: '腮红',
  lip: '唇妆',
};

export const actionLabels: Record<MakeupActionType, string> = {
  blend: '晕染',
  tap: '轻拍',
  drag: '推开',
  smudge: '柔化',
  line: '描线',
  fill: '填色',
};

export const pressureLabels: Record<ActionPressure, string> = {
  light: '轻',
  medium: '中',
  firm: '较重',
};

export const regionParameterSchema: Partial<Record<MakeupRegion, ParameterGroupSchema[]>> = {
  brow: [
    {
      id: 'brow',
      title: '眉毛参数',
      fields: [
        { key: 'shape', label: '眉形', kind: 'text', path: ['shape'] },
        {
          key: 'thickness',
          label: '粗细',
          kind: 'range',
          path: ['thickness'],
          min: 0,
          max: 100,
        },
        {
          key: 'arch_height',
          label: '眉峰高度',
          kind: 'range',
          path: ['arch_height'],
          min: 0,
          max: 100,
        },
        {
          key: 'tail_length',
          label: '眉尾长度',
          kind: 'range',
          path: ['tail_length'],
          min: 0,
          max: 100,
        },
        {
          key: 'edge_softness',
          label: '边缘柔和度',
          kind: 'range',
          path: ['edge_softness'],
          min: 0,
          max: 100,
        },
      ],
    },
  ],
  eye: [
    {
      id: 'eye_shadow',
      title: '眼影参数',
      fields: [
        {
          key: 'placement',
          label: '位置',
          kind: 'text',
          path: ['eye_shadow', 'placement'],
        },
        {
          key: 'intensity',
          label: '强度',
          kind: 'range',
          path: ['eye_shadow', 'intensity'],
          min: 0,
          max: 100,
        },
        {
          key: 'edge_softness',
          label: '边缘柔和度',
          kind: 'range',
          path: ['eye_shadow', 'edge_softness'],
          min: 0,
          max: 100,
        },
        {
          key: 'finish',
          label: '妆效',
          kind: 'text',
          path: ['eye_shadow', 'finish'],
        },
        {
          key: 'color_family',
          label: '色系',
          kind: 'text',
          path: ['eye_shadow', 'color_family'],
        },
      ],
    },
    {
      id: 'eye_liner',
      title: '眼线参数',
      fields: [
        {
          key: 'direction',
          label: '方向',
          kind: 'text',
          path: ['eye_liner', 'direction'],
        },
        {
          key: 'thickness',
          label: '粗细',
          kind: 'range',
          path: ['eye_liner', 'thickness'],
          min: 0,
          max: 100,
        },
        {
          key: 'length_ratio',
          label: '长度比例',
          kind: 'range',
          path: ['eye_liner', 'length_ratio'],
          min: 0,
          max: 100,
        },
        {
          key: 'sharpness',
          label: '锐利度',
          kind: 'range',
          path: ['eye_liner', 'sharpness'],
          min: 0,
          max: 100,
        },
      ],
    },
    {
      id: 'lash',
      title: '睫毛参数',
      fields: [
        {
          key: 'curl',
          label: '卷翘度',
          kind: 'range',
          path: ['lash', 'curl'],
          min: 0,
          max: 100,
        },
        {
          key: 'density',
          label: '浓密度',
          kind: 'range',
          path: ['lash', 'density'],
          min: 0,
          max: 100,
        },
        {
          key: 'length_focus',
          label: '长度重点',
          kind: 'text',
          path: ['lash', 'length_focus'],
        },
      ],
    },
  ],
  blush: [
    {
      id: 'blush',
      title: '腮红参数',
      fields: [
        { key: 'placement', label: '位置', kind: 'text', path: ['placement'] },
        {
          key: 'spread',
          label: '扩散范围',
          kind: 'range',
          path: ['spread'],
          min: 0,
          max: 100,
        },
        {
          key: 'saturation',
          label: '饱和度',
          kind: 'range',
          path: ['saturation'],
          min: 0,
          max: 100,
        },
        { key: 'finish', label: '妆效', kind: 'text', path: ['finish'] },
      ],
    },
  ],
  lip: [
    {
      id: 'lip',
      title: '唇妆参数',
      fields: [
        { key: 'shape', label: '唇形', kind: 'text', path: ['shape'] },
        {
          key: 'overline',
          label: '外扩程度',
          kind: 'range',
          path: ['overline'],
          min: 0,
          max: 100,
        },
        { key: 'texture', label: '质地', kind: 'text', path: ['texture'] },
        {
          key: 'color_depth',
          label: '颜色深度',
          kind: 'range',
          path: ['color_depth'],
          min: 0,
          max: 100,
        },
      ],
    },
  ],
};
