import type { MakeupRegion } from '../../templates/schema';

export const makeupRegions: MakeupRegion[] = [
  'base',
  'brow',
  'eye',
  'contour',
  'blush',
  'lip',
];

export const regionDescriptions: Record<MakeupRegion, string> = {
  base: '基础底妆区域',
  brow: '眉毛区域',
  eye: '眼妆区域',
  contour: '轮廓修饰区域',
  blush: '腮红区域',
  lip: '唇妆区域',
};
