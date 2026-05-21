export const MAKEUP_REGIONS = ['base', 'brow', 'eye', 'contour', 'blush', 'lip'] as const;

export const MAKEUP_ACTIONS = ['blend', 'tap', 'drag', 'smudge', 'line', 'fill'] as const;

export type MakeupRegion = (typeof MAKEUP_REGIONS)[number];

export type MakeupActionType = (typeof MAKEUP_ACTIONS)[number];

export type ActionPressure = 'light' | 'medium' | 'firm';

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

export interface TemplateStore {
  template: MakeupTemplate;
  selectedRegion: MakeupRegion;
  selectedStepId: string;
  savedAt: string | null;
  setSelectedRegion: (region: MakeupRegion) => void;
  setSelectedStepId: (stepId: string) => void;
  updateMetadata: (metadata: Partial<MakeupTemplateMetadata>) => void;
  addStyleTag: (tag: string) => void;
  removeStyleTag: (tag: string) => void;
  updateRegion: (
    region: MakeupRegion,
    updates: Partial<Omit<MakeupRegionConfig, 'region' | 'parameters'>>,
  ) => void;
  updateRegionParameters: (
    region: MakeupRegion,
    updates: Partial<AnyRegionParameters>,
  ) => void;
  updateEyeParameters: (
    section: keyof EyeParameters,
    updates: Partial<EyeShadowParameters | EyeLinerParameters | LashParameters>,
  ) => void;
  addStep: (region?: MakeupRegion) => void;
  updateStep: (stepId: string, updates: Partial<MakeupStep>) => void;
  updateStepTool: (stepId: string, updates: Partial<MakeupTool>) => void;
  updateStepProduct: (stepId: string, updates: Partial<MakeupProduct>) => void;
  updateStepAction: (stepId: string, updates: Partial<MakeupAction>) => void;
  updateStepPlacement: (stepId: string, updates: Partial<MakeupPlacement>) => void;
  updateStepEffect: (stepId: string, updates: Partial<MakeupEffect>) => void;
  removeStep: (stepId: string) => void;
  moveStep: (stepId: string, direction: 'up' | 'down') => void;
  importTemplate: (template: MakeupTemplate) => void;
  saveTemplate: () => string;
  loadSavedTemplate: () => boolean;
  resetTemplate: () => void;
}
