export const MAKEUP_REGIONS = ['base', 'brow', 'eye', 'contour', 'blush', 'lip'] as const;

export const MAKEUP_ACTIONS = ['blend', 'tap', 'drag', 'smudge', 'line', 'fill'] as const;

export type MakeupRegion = (typeof MAKEUP_REGIONS)[number];

export type MakeupActionType = (typeof MAKEUP_ACTIONS)[number];

export type ActionPressure = 'light' | 'medium' | 'firm';

export type ActionSpeed = 'slow' | 'steady' | 'quick';

export type JsonPrimitive = string | number | boolean | null;

export interface MakeupTemplateMetadata {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface MakeupRegionParameters {
  coverage: string;
  intensity: number;
  finish: string;
  undertone: string;
  product: string;
  notes: string;
}

export interface MakeupRegionConfig {
  region: MakeupRegion;
  enabled: boolean;
  visualGoal: string;
  parameters: MakeupRegionParameters;
}

export interface MakeupAction {
  type: MakeupActionType;
  direction: string;
  pressure: ActionPressure;
  repeat: number;
  speed: ActionSpeed;
}

export interface MakeupStep {
  id: string;
  region: MakeupRegion;
  visualGoal: string;
  tool: string;
  action: MakeupAction;
  placement: string;
  effect: string;
}

export interface MakeupTemplate {
  metadata: MakeupTemplateMetadata;
  styleTags: string[];
  regions: Record<MakeupRegion, MakeupRegionConfig>;
  steps: MakeupStep[];
}

export interface TemplateStore {
  template: MakeupTemplate;
  selectedRegion: MakeupRegion;
  selectedStepId: string;
  setSelectedRegion: (region: MakeupRegion) => void;
  setSelectedStepId: (stepId: string) => void;
  updateMetadata: (metadata: Partial<MakeupTemplateMetadata>) => void;
  addStyleTag: (tag: string) => void;
  removeStyleTag: (tag: string) => void;
  updateRegion: (region: MakeupRegion, updates: Partial<MakeupRegionConfig>) => void;
  updateRegionParameters: (
    region: MakeupRegion,
    updates: Partial<MakeupRegionParameters>,
  ) => void;
  addStep: (region?: MakeupRegion) => void;
  updateStep: (stepId: string, updates: Partial<MakeupStep>) => void;
  updateStepAction: (stepId: string, updates: Partial<MakeupAction>) => void;
  removeStep: (stepId: string) => void;
  moveStep: (stepId: string, direction: 'up' | 'down') => void;
  importTemplate: (template: MakeupTemplate) => void;
  resetTemplate: () => void;
}
