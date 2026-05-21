import { create } from 'zustand';
import { createDefaultTemplate } from '../data/defaultTemplate';
import { isMakeupTemplate } from '../utils/templateValidation';
import type {
  AnyRegionParameters,
  EyeParameters,
  MakeupEffect,
  MakeupPlacement,
  MakeupProduct,
  MakeupRegion,
  MakeupStep,
  MakeupTemplate,
  MakeupTool,
  TemplateStore,
} from '../types/makeup';

const STORAGE_KEY = 'makeup-engine:template:v0.1';

const createStep = (region: MakeupRegion): MakeupStep => ({
  step_id: `step-${Date.now()}-${Math.round(Math.random() * 1000)}`,
  region,
  goal: '描述这个步骤想达到的视觉目标。',
  tool: {
    type: '化妆工具',
    subtype: '细分工具',
  },
  product: {
    category: '产品类别',
    color_family: '色系',
    finish: '妆效',
  },
  action: {
    type: 'blend',
    direction: '向外',
    pressure: 'light',
    repeat: 1,
  },
  placement: {
    anchor: '定位点',
    shape: '形状',
    size: 30,
  },
  effect: {
    contrast: 30,
    softness: 60,
    depth: 30,
  },
});

const stamp = (template: MakeupTemplate): MakeupTemplate => ({
  ...template,
  metadata: {
    ...template.metadata,
    updatedAt: new Date().toISOString(),
  },
});

const saveToStorage = (template: MakeupTemplate) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(template, null, 2));
};

const readFromStorage = () => {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isMakeupTemplate(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  template: createDefaultTemplate(),
  selectedRegion: 'base',
  selectedStepId: 'step-base-1',
  savedAt: null,

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
    set((state) => {
      const currentParameters = state.template.regions[region].parameters as Record<
        string,
        unknown
      >;

      return {
        template: stamp({
          ...state.template,
          regions: {
            ...state.template.regions,
            [region]: {
              ...state.template.regions[region],
              parameters: {
                ...currentParameters,
                ...(updates as Record<string, unknown>),
              } as AnyRegionParameters,
            },
          },
        }),
      };
    }),

  updateEyeParameters: (section, updates) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        regions: {
          ...state.template.regions,
          eye: {
            ...state.template.regions.eye,
            parameters: {
              ...state.template.regions.eye.parameters,
              [section]: {
                ...state.template.regions.eye.parameters[section],
                ...updates,
              },
            } as EyeParameters,
          },
        },
      }),
    })),

  addStep: (region) =>
    set((state) => {
      const targetRegion = region ?? state.selectedRegion;
      const step = createStep(targetRegion);

      return {
        selectedStepId: step.step_id,
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
          step.step_id === stepId ? { ...step, ...updates } : step,
        ),
      }),
    })),

  updateStepTool: (stepId, updates) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        steps: state.template.steps.map((step) =>
          step.step_id === stepId
            ? {
                ...step,
                tool: {
                  ...step.tool,
                  ...(updates as MakeupTool),
                },
              }
            : step,
        ),
      }),
    })),

  updateStepProduct: (stepId, updates) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        steps: state.template.steps.map((step) =>
          step.step_id === stepId
            ? {
                ...step,
                product: {
                  ...step.product,
                  ...(updates as MakeupProduct),
                },
              }
            : step,
        ),
      }),
    })),

  updateStepAction: (stepId, updates) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        steps: state.template.steps.map((step) =>
          step.step_id === stepId
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

  updateStepPlacement: (stepId, updates) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        steps: state.template.steps.map((step) =>
          step.step_id === stepId
            ? {
                ...step,
                placement: {
                  ...step.placement,
                  ...(updates as MakeupPlacement),
                },
              }
            : step,
        ),
      }),
    })),

  updateStepEffect: (stepId, updates) =>
    set((state) => ({
      template: stamp({
        ...state.template,
        steps: state.template.steps.map((step) =>
          step.step_id === stepId
            ? {
                ...step,
                effect: {
                  ...step.effect,
                  ...(updates as MakeupEffect),
                },
              }
            : step,
        ),
      }),
    })),

  removeStep: (stepId) =>
    set((state) => {
      const steps = state.template.steps.filter((step) => step.step_id !== stepId);
      const fallbackStepId = steps[0]?.step_id ?? '';

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
      const index = state.template.steps.findIndex((step) => step.step_id === stepId);
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
      selectedStepId: template.steps[0]?.step_id ?? '',
      savedAt: null,
    }),

  saveTemplate: () => {
    const savedAt = new Date().toISOString();
    const template = stamp(get().template);

    saveToStorage(template);
    set({ template, savedAt });
    return savedAt;
  },

  loadSavedTemplate: () => {
    const template = readFromStorage();

    if (!template) {
      return false;
    }

    set({
      template,
      selectedRegion: 'base',
      selectedStepId: template.steps[0]?.step_id ?? '',
      savedAt: template.metadata.updatedAt,
    });
    return true;
  },

  resetTemplate: () => {
    const template = createDefaultTemplate();

    set({
      template,
      selectedRegion: 'base',
      selectedStepId: template.steps[0]?.step_id ?? '',
      savedAt: null,
    });
  },
}));
