export const MAKEUP_TEMPLATE_REGIONS = [
  'base',
  'brow',
  'eye',
  'contour',
  'blush',
  'lip',
] as const;

export const TEMPLATE_TECHNIQUE_ACTIONS = [
  'prep',
  'apply',
  'tap',
  'blend',
  'define',
  'line',
  'fill',
  'set',
] as const;

export const TEMPLATE_TOOLS = ['brush', 'finger', 'sponge', 'puff', 'wand'] as const;

export const TEMPLATE_INTENSITIES = ['low', 'medium', 'high'] as const;

export const TEMPLATE_LAYER_ROLES = [
  'base',
  'structure',
  'color',
  'definition',
  'finish',
] as const;

export const VISUAL_EFFECTS = [
  'brighten',
  'soften',
  'lift',
  'deepen',
  'widen',
  'shrink',
  'glow',
  'balance',
] as const;

export type MakeupRegion = (typeof MAKEUP_TEMPLATE_REGIONS)[number];

export type MakeupStepRegion = MakeupRegion;

export type TemplateTechniqueAction = (typeof TEMPLATE_TECHNIQUE_ACTIONS)[number];

export type TemplateTool = (typeof TEMPLATE_TOOLS)[number];

export type MakeupIntensity = (typeof TEMPLATE_INTENSITIES)[number];

export type TemplateLayerOrder = (typeof TEMPLATE_LAYER_ROLES)[number];

export type VisualEffect = (typeof VISUAL_EFFECTS)[number];

export interface MakeupStepPlacement {
  region: MakeupRegion;
  area: string;
  anchor?: string;
  coverage: 'spot' | 'small' | 'medium' | 'large' | 'full';
}

export interface MakeupStep {
  id: string;
  order: number;
  region: MakeupRegion;
  action: TemplateTechniqueAction;
  tool: TemplateTool;
  intensity: MakeupIntensity;
  layerOrder: TemplateLayerOrder;
  placement: MakeupStepPlacement;
  productCategory: string;
  finish?: string;
  colorFamily?: string;
  visualEffects: VisualEffect[];
  instruction: string;
  rationale: string;
  sourceRegionId?: string;
}

export interface FaceStrategy {
  id: string;
  summary: string;
  goals: string[];
  suitableFaceTypes: string[];
  reasoning: string[];
}

export interface EyeDesign {
  summary: string;
  effects: VisualEffect[];
  emphasis: string;
}

export interface LipDesign {
  summary: string;
  effects: VisualEffect[];
  emphasis: string;
}

export interface ContourDesign {
  summary: string;
  effects: VisualEffect[];
  emphasis: string;
}

export type MakeupTechnique = MakeupStep;

export type TemplateLayerRole = TemplateLayerOrder;
