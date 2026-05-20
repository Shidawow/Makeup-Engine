import type {
  ActionPressure,
  ActionSpeed,
  MakeupActionType,
  MakeupRegion,
} from '../types/makeup';

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

export const speedLabels: Record<ActionSpeed, string> = {
  slow: '慢速',
  steady: '匀速',
  quick: '快速',
};
