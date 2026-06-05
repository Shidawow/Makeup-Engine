export const MAKEUP_REGIONS = ['base', 'brow', 'eye', 'contour', 'blush', 'lip'] as const;

export const MAKEUP_ACTIONS = ['blend', 'tap', 'drag', 'smudge', 'line', 'fill'] as const;

export const ACTION_PRESSURES = ['light', 'medium', 'firm'] as const;

export const ACTION_SPEEDS = ['slow', 'steady', 'quick'] as const;

export const VISUAL_GOALS = {
  eye: ['enlarge_eye', 'soften_eye', 'lift_eye', 'deepen_eye', 'widen_eye'],
  face: ['reduce_midface', 'slim_face', 'increase_dimension', 'soften_contour'],
  lip: ['fuller_lip', 'softer_lip', 'youthful_lip'],
} as const;

export type MakeupRegion = (typeof MAKEUP_REGIONS)[number];

export type MakeupActionType = (typeof MAKEUP_ACTIONS)[number];

export type ActionPressure = (typeof ACTION_PRESSURES)[number];

export type ActionSpeed = (typeof ACTION_SPEEDS)[number];

export type GoalFamily = keyof typeof VISUAL_GOALS;

export type EyeVisualGoal = (typeof VISUAL_GOALS.eye)[number];

export type FaceVisualGoal = (typeof VISUAL_GOALS.face)[number];

export type LipVisualGoal = (typeof VISUAL_GOALS.lip)[number];

export type VisualGoalId = EyeVisualGoal | FaceVisualGoal | LipVisualGoal;

export interface MakeupTemplateMetadata {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseParameters {
  [key: string]: never;
}

export interface BrowParameters {
  shape: string;
  thickness: number;
  arch_height: number;
  tail_length: number;
  edge_softness: number;
}

export interface EyeShadowParameters {
  placement: string;
  intensity: number;
  edge_softness: number;
  finish: string;
  color_family: string;
}

export interface EyeLinerParameters {
  direction: string;
  thickness: number;
  length_ratio: number;
  sharpness: number;
}

export interface LashParameters {
  curl: number;
  density: number;
  length_focus: string;
}

export interface EyeParameters {
  eye_shadow: EyeShadowParameters;
  eye_liner: EyeLinerParameters;
  lash: LashParameters;
}

export interface ContourParameters {
  [key: string]: never;
}

export interface BlushParameters {
  placement: string;
  spread: number;
  saturation: number;
  finish: string;
}

export interface LipParameters {
  shape: string;
  overline: number;
  texture: string;
  color_depth: number;
}

export interface RegionParameterMap {
  base: BaseParameters;
  brow: BrowParameters;
  eye: EyeParameters;
  contour: ContourParameters;
  blush: BlushParameters;
  lip: LipParameters;
}

export type AnyRegionParameters = RegionParameterMap[MakeupRegion];

export interface MakeupRegionConfig<R extends MakeupRegion = MakeupRegion> {
  region: R;
  enabled: boolean;
  goal: string;
  parameters: RegionParameterMap[R];
}

export type MakeupRegions = {
  [Region in MakeupRegion]: MakeupRegionConfig<Region>;
};

export interface MakeupTool {
  type: string;
  subtype: string;
}

export interface MakeupProduct {
  category: string;
  color_family: string;
  finish: string;
}

export interface MakeupAction {
  type: MakeupActionType;
  direction: string;
  pressure: ActionPressure;
  repeat: number;
  speed?: ActionSpeed;
}

export interface MakeupPlacement {
  anchor: string;
  shape: string;
  size: number;
}

export interface MakeupEffect {
  contrast: number;
  softness: number;
  depth: number;
}

export interface MakeupStep {
  step_id: string;
  region: MakeupRegion;
  goal: string;
  tool: MakeupTool;
  product: MakeupProduct;
  action: MakeupAction;
  placement: MakeupPlacement;
  effect: MakeupEffect;
}

export interface MakeupTemplate {
  metadata: MakeupTemplateMetadata;
  styleTags: string[];
  regions: MakeupRegions;
  steps: MakeupStep[];
}
