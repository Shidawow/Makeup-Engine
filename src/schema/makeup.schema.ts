export const FACE_REGIONS = [
  'face',
  'eye',
  'lip',
  'eyebrow',
] as const;

export const TOOL_TYPES = [
  'brush',
  'finger',
  'sponge',
] as const;

export const ACTION_TYPES = [
  'prep',
  'apply',
  'tap',
  'blend',
  'define',
  'line',
  'fill',
  'brighten',
  'set',
] as const;

export const BLEND_MODES = [
  'none',
  'soft',
  'diffused',
  'gradient',
  'precise',
] as const;

export const LAYER_ORDERS = [
  'base',
  'structure',
  'color',
  'definition',
  'finish',
] as const;

export const STROKE_DIRECTIONS = [
  'center_out',
  'upward',
  'outward',
  'inward',
  'downward',
  'circular',
  'follow_growth',
  'lip_center_out',
] as const;

export const MAKEUP_INTENSITIES = [
  'low',
  'medium',
  'high',
] as const;

export const VISUAL_GOALS = [
  'enlarge_eye',
  'slim_face',
  'brighten_skin',
  'natural_glow',
  'doll_style',
  'glass_skin',
  'defined_brow',
  'fuller_lip',
  'lifted_eye',
  'sculpted_face',
] as const;

export const MAKEUP_STYLES = [
  'natural',
  'glam',
  'k-beauty',
  'douyin',
  'western',
] as const;

export type FaceRegion = (typeof FACE_REGIONS)[number];

export type MakeupRegion = FaceRegion;

export type ToolType = (typeof TOOL_TYPES)[number];

export type MakeupTool = ToolType;

export type ActionType = (typeof ACTION_TYPES)[number];

export type BlendMode = (typeof BLEND_MODES)[number];

export type LayerOrder = (typeof LAYER_ORDERS)[number];

export type StrokeDirection = (typeof STROKE_DIRECTIONS)[number];

export type MakeupIntensity = (typeof MAKEUP_INTENSITIES)[number];

export type VisualGoal = (typeof VISUAL_GOALS)[number];

export type MakeupStyle = (typeof MAKEUP_STYLES)[number] | (string & {});

export interface MakeupProduct {
  category: string;
  shade?: string;
  finish?: string;
}

export interface MakeupPlacement {
  area: string;
  anchor?: string;
  coverage?: 'spot' | 'small' | 'medium' | 'large' | 'full';
}

export interface MakeupTechnique {
  blendMode: BlendMode;
  strokeDirection: StrokeDirection;
  layerOrder: LayerOrder;
  repeat?: number;
}

export interface MakeupStep {
  id: string;
  region: FaceRegion;
  action: ActionType;
  tool: ToolType;
  intensity: MakeupIntensity;
  description: string;
  placement: MakeupPlacement;
  technique: MakeupTechnique;
  product?: MakeupProduct;
  dependency?: string;
  durationMs?: number;
}

export interface MakeupMetadata {
  style: MakeupStyle;
  version: '0.1';
  author?: string;
  notes?: string;
}

export interface MakeupLook {
  id: string;
  name: string;
  goals: VisualGoal[];
  steps: MakeupStep[];
  metadata: MakeupMetadata;
}
