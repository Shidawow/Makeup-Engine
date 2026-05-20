import { create } from 'zustand';
import { createDefaultTemplate } from '../data/defaultTemplate';
import type {
  MakeupRegion,
  MakeupStep,
  MakeupTemplate,
  TemplateStore,
} from '../types/makeup';

const createStep = (region: MakeupRegion): MakeupStep => ({
  id: `step-${Date.now()}-${Math.round(Math.random() * 1000)}`,
  region,
  visualGoal: '描述这个步骤想达到的视觉目标。',
  tool: '化妆刷',
  action: {
    type: 'blend',
    direction: '向外',
    pressure: 'light',
    repeat: 1,
    speed: 'steady',
  },
  placement: '目标区域',
  effect: '期望呈现的效果',
});

const stamp = (template: MakeupTemplate): MakeupTemplate => ({
  ...template,
  metadata: {
    ...template.metadata,
    updatedAt: new Date().toISOString(),
  },
});

export const useTemplateStore = create<TemplateStore>((set) => ({
  template: createDefaultTemplate(),
  selectedRegion: 'base',
  selectedStepId: 'step-base-1',

  setSelectedRegion: (region) => set({ selectedRegion: region }),

  setSelectedStepId: (stepId) => set({ selectedStepId: stepId }),

  updateMetadata: (metadata) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        metadata: {
          ...state.template.metadata,
          ...metadata,
        },
      }),
    })),

  addStyleTag: (tag) =>
    set((state) => {
      const normalized = tag.trim();

      if (!normalized || state.template.styleTags.includes(normalized)) {
        return state;
      }

      return {
        template: stamp({
          ...state.template,
          styleTags: [...state.template.styleTags, normalized],
        }),
      };
    }),

  removeStyleTag: (tag) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        styleTags: state.template.styleTags.filter((styleTag) => styleTag !== tag),
      }),
    })),

  updateRegion: (region, updates) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        regions: {
          ...state.template.regions,
          [region]: {
            ...state.template.regions[region],
            ...updates,
          },
        },
      }),
    })),

  updateRegionParameters: (region, updates) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        regions: {
          ...state.template.regions,
          [region]: {
            ...state.template.regions[region],
            parameters: {
              ...state.template.regions[region].parameters,
              ...updates,
            },
          },
        },
      }),
    })),

  addStep: (region) =>
    set((state) => {
      const targetRegion = region ?? state.selectedRegion;
      const step = createStep(targetRegion);

      return {
        selectedStepId: step.id,
        template: stamp({
          ...state.template,
          steps: [...state.template.steps, step],
        }),
      };
    }),

  updateStep: (stepId, updates) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        steps: state.template.steps.map((step) =>
          step.id === stepId ? { ...step, ...updates } : step,
        ),
      }),
    })),

  updateStepAction: (stepId, updates) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        steps: state.template.steps.map((step) =>
          step.id === stepId
            ? {
                ...step,
                action: {
                  ...step.action,
                  ...updates,
                },
              }
            : step,
        ),
      }),
    })),

  removeStep: (stepId) =>
    set((state) => {
      const steps = state.template.steps.filter((step) => step.id !== stepId);
      const fallbackStepId = steps[0]?.id ?? '';

      return {
        selectedStepId:
          state.selectedStepId === stepId ? fallbackStepId : state.selectedStepId,
        template: stamp({
          ...state.template,
          steps,
        }),
      };
    }),

  moveStep: (stepId, direction) =>
    set((state) => {
      const index = state.template.steps.findIndex((step) => step.id === stepId);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (index < 0 || targetIndex < 0 || targetIndex >= state.template.steps.length) {
        return state;
      }

      const steps = [...state.template.steps];
      const [step] = steps.splice(index, 1);
      steps.splice(targetIndex, 0, step);

      return {
        template: stamp({
          ...state.template,
          steps,
        }),
      };
    }),

  importTemplate: (template) =>
    set({
      template: stamp(template),
      selectedRegion: 'base',
      selectedStepId: template.steps[0]?.id ?? '',
    }),

  resetTemplate: () => {
    const template = createDefaultTemplate();

    set({
      template,
      selectedRegion: 'base',
      selectedStepId: template.steps[0]?.id ?? '',
    });
  },
}));
