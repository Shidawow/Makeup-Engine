export const MAKEUP_REGIONS = ['face', 'eye', 'lip', 'eyebrow'] as const;

export const MAKEUP_TOOLS = ['brush', 'finger', 'sponge'] as const;

export const MAKEUP_INTENSITIES = ['low', 'medium', 'high'] as const;

export const VISUAL_GOALS = [
  'enlarge_eye',
  'slim_face',
  'brighten_skin',
  'natural_glow',
  'doll_style',
] as const;

export const MAKEUP_ACTIONS = [
  'prep',
  'apply',
  'blend',
  'define',
  'brighten',
  'set',
] as const;

export const MAKEUP_STYLES = [
  'natural',
  'glam',
  'k-beauty',
  'douyin',
] as const;

export type MakeupRegion = (typeof MAKEUP_REGIONS)[number];

export type MakeupTool = (typeof MAKEUP_TOOLS)[number];

export type MakeupIntensity = (typeof MAKEUP_INTENSITIES)[number];

export type VisualGoal = (typeof VISUAL_GOALS)[number];

export type MakeupAction = (typeof MAKEUP_ACTIONS)[number];

export type MakeupStyle = (typeof MAKEUP_STYLES)[number] | (string & {});

export interface MakeupTemplateMetadata {
  style: MakeupStyle;
}

export interface MakeupStep {
  id: string;
  region: MakeupRegion;
  action: MakeupAction;
  tool: MakeupTool;
  intensity: MakeupIntensity;
  description: string;
  dependency?: string;
}

export interface MakeupTemplate {
  id: string;
  name: string;
  goals: VisualGoal[];
  steps: MakeupStep[];
  metadata: MakeupTemplateMetadata;
}
