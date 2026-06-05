import { create } from 'zustand';
import { compileTemplate } from '../compiler/stepCompiler';
import {
  addStep as addStepToTemplate,
  addStyleTag as addStyleTagToTemplate,
  createDraftStep,
  moveStep as moveStepInTemplate,
  removeStep as removeStepFromTemplate,
  removeStyleTag as removeStyleTagFromTemplate,
  stampTemplate,
  updateMetadata as updateTemplateMetadata,
  updateRegion as updateTemplateRegion,
  updateRegionParameterAtPath,
  updateStep as updateTemplateStep,
  updateStepAction as updateTemplateStepAction,
  updateStepEffect as updateTemplateStepEffect,
  updateStepPlacement as updateTemplateStepPlacement,
  updateStepProduct as updateTemplateStepProduct,
  updateStepTool as updateTemplateStepTool,
} from '../core/templateOperations';
import { createDefaultTemplate } from '../examples/defaultTemplate';
import {
  ACTION_PRESSURES,
  MAKEUP_ACTIONS,
  MAKEUP_REGIONS,
} from '../schema/legacyTypes';
import type {
  ActionPressure,
  AnyRegionParameters,
  EyeLinerParameters,
  EyeParameters,
  EyeShadowParameters,
  LashParameters,
  MakeupAction,
  MakeupActionType,
  MakeupEffect,
  MakeupPlacement,
  MakeupProduct,
  MakeupRegion,
  MakeupStep,
  MakeupTemplate,
  MakeupTemplateMetadata,
  MakeupTool,
} from '../schema/legacyTypes';
import { createTemplateFileName, toTemplateJson } from '../schema/json';
import {
  actionLabels,
  pressureLabels,
  regionLabels,
  regionParameterSchema,
} from '../schema/taxonomy';
import type { ParameterFieldSchema } from '../schema/taxonomy';
import {
  isMakeupTemplate,
  validateMakeupTemplate,
} from '../schema/validation';

export type { ActionPressure, MakeupActionType, MakeupRegion } from '../schema/legacyTypes';

const STORAGE_KEY = 'makeup-engine:template:v0.1';

export interface RuntimeOption<T extends string = string> {
  value: T;
  label: string;
}

export interface RuntimeParameterField extends ParameterFieldSchema {
  value: string | number;
}

export interface RuntimeParameterGroup {
  id: string;
  title: string;
  fields: RuntimeParameterField[];
}

export interface StepTabModel {
  id: string;
  label: string;
  active: boolean;
}

export interface RuntimeMessage {
  kind: 'success' | 'error' | 'info';
  text: string;
}

export interface EngineRuntimeState {
  template: MakeupTemplate;
  selectedRegion: MakeupRegion;
  selectedStepId: string;
  savedAt: string | null;
  message: RuntimeMessage | null;
  copied: boolean;
  setSelectedRegion: (region: MakeupRegion) => void;
  setSelectedStepId: (stepId: string) => void;
  clearMessage: () => void;
  setCopied: (copied: boolean) => void;
  updateMetadata: (metadata: Partial<MakeupTemplateMetadata>) => void;
  addStyleTag: (tag: string) => void;
  removeStyleTag: (tag: string) => void;
  updateRegion: (
    region: MakeupRegion,
    updates: Partial<Pick<MakeupTemplate['regions'][MakeupRegion], 'enabled' | 'goal'>>,
  ) => void;
  updateRegionParameter: (
    region: MakeupRegion,
    path: string[],
    value: string | number,
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
  importTemplateJson: (raw: string) => boolean;
  saveTemplate: () => string | null;
  loadSavedTemplate: () => boolean;
  resetTemplate: () => void;
  downloadTemplate: () => boolean;
}

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

const saveToStorage = (template: MakeupTemplate) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(template, null, 2));
};

const downloadJson = (template: MakeupTemplate) => {
  const blob = new Blob([toTemplateJson(template)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = createTemplateFileName(template);
  anchor.click();
  URL.revokeObjectURL(url);
};

const readAtPath = (value: unknown, path: string[]): string | number => {
  const result = path.reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, value);

  return typeof result === 'number' || typeof result === 'string' ? result : '';
};

export const useMakeupRuntime = create<EngineRuntimeState>((set, get) => {
  const initialTemplate = createDefaultTemplate();

  return {
    template: initialTemplate,
    selectedRegion: 'base',
    selectedStepId: initialTemplate.steps[0]?.step_id ?? '',
    savedAt: null,
    message: null,
    copied: false,

    setSelectedRegion: (region) => set({ selectedRegion: region }),

    setSelectedStepId: (stepId) => set({ selectedStepId: stepId }),

    clearMessage: () => set({ message: null }),

    setCopied: (copied) => set({ copied }),

    updateMetadata: (metadata) =>
      set((state) => ({
        template: updateTemplateMetadata(state.template, metadata),
      })),

    addStyleTag: (tag) =>
      set((state) => ({
        template: addStyleTagToTemplate(state.template, tag),
      })),

    removeStyleTag: (tag) =>
      set((state) => ({
        template: removeStyleTagFromTemplate(state.template, tag),
      })),

    updateRegion: (region, updates) =>
      set((state) => ({
        template: updateTemplateRegion(state.template, region, updates),
      })),

    updateRegionParameter: (region, path, value) =>
      set((state) => ({
        template: updateRegionParameterAtPath(state.template, region, path, value),
      })),

    updateRegionParameters: (region, updates) =>
      set((state) => {
        let template = state.template;

        Object.entries(updates as Record<string, string | number>).forEach(
          ([key, value]) => {
            template = updateRegionParameterAtPath(template, region, [key], value);
          },
        );

        return { template };
      }),

    updateEyeParameters: (section, updates) =>
      set((state) => {
        let template = state.template;

        Object.entries(updates as Record<string, string | number>).forEach(
          ([key, value]) => {
            template = updateRegionParameterAtPath(template, 'eye', [section, key], value);
          },
        );

        return { template };
      }),

    addStep: (region) =>
      set((state) => {
        const targetRegion = region ?? state.selectedRegion;
        const step = createDraftStep(targetRegion);

        return {
          selectedStepId: step.step_id,
          template: stampTemplate({
            ...state.template,
            steps: [...state.template.steps, step],
          }),
        };
      }),

    updateStep: (stepId, updates) =>
      set((state) => ({
        template: updateTemplateStep(state.template, stepId, updates),
      })),

    updateStepTool: (stepId, updates) =>
      set((state) => ({
        template: updateTemplateStepTool(state.template, stepId, updates),
      })),

    updateStepProduct: (stepId, updates) =>
      set((state) => ({
        template: updateTemplateStepProduct(state.template, stepId, updates),
      })),

    updateStepAction: (stepId, updates) =>
      set((state) => ({
        template: updateTemplateStepAction(state.template, stepId, updates),
      })),

    updateStepPlacement: (stepId, updates) =>
      set((state) => ({
        template: updateTemplateStepPlacement(state.template, stepId, updates),
      })),

    updateStepEffect: (stepId, updates) =>
      set((state) => ({
        template: updateTemplateStepEffect(state.template, stepId, updates),
      })),

    removeStep: (stepId) =>
      set((state) => {
        const template = removeStepFromTemplate(state.template, stepId);
        const fallbackStepId = template.steps[0]?.step_id ?? '';

        return {
          selectedStepId:
            state.selectedStepId === stepId ? fallbackStepId : state.selectedStepId,
          template,
        };
      }),

    moveStep: (stepId, direction) =>
      set((state) => ({
        template: moveStepInTemplate(state.template, stepId, direction),
      })),

    importTemplate: (template) =>
      set({
        template: stampTemplate(template),
        selectedRegion: 'base',
        selectedStepId: template.steps[0]?.step_id ?? '',
        savedAt: null,
        message: { kind: 'success', text: `已导入：${template.metadata.name}。` },
      }),

    importTemplateJson: (raw) => {
      try {
        const parsed = JSON.parse(raw) as unknown;

        if (!isMakeupTemplate(parsed)) {
          const result = validateMakeupTemplate(parsed);
          set({
            message: {
              kind: 'error',
              text: result.issues[0]?.message ?? '无效的妆容模板 JSON。',
            },
          });
          return false;
        }

        get().importTemplate(parsed);
        return true;
      } catch {
        set({ message: { kind: 'error', text: '无法解析所选 JSON。' } });
        return false;
      }
    },

    saveTemplate: () => {
      const template = stampTemplate(get().template);
      const validation = validateMakeupTemplate(template);

      if (!validation.valid) {
        set({ message: { kind: 'error', text: '模板未通过校验，暂不保存。' } });
        return null;
      }

      saveToStorage(template);
      set({
        template,
        savedAt: template.metadata.updatedAt,
        message: {
          kind: 'success',
          text: `已保存：${new Date(template.metadata.updatedAt).toLocaleString()}。`,
        },
      });
      return template.metadata.updatedAt;
    },

    loadSavedTemplate: () => {
      const template = readFromStorage();

      if (!template) {
        set({ message: { kind: 'info', text: '没有找到可载入的本地模板。' } });
        return false;
      }

      set({
        template,
        selectedRegion: 'base',
        selectedStepId: template.steps[0]?.step_id ?? '',
        savedAt: template.metadata.updatedAt,
        message: { kind: 'success', text: '已载入本地保存模板。' },
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
        message: null,
      });
    },

    downloadTemplate: () => {
      const template = get().template;
      const validation = validateMakeupTemplate(template);

      if (!validation.valid) {
        set({ message: { kind: 'error', text: '模板未通过校验，暂不导出。' } });
        return false;
      }

      downloadJson(template);
      set({ message: { kind: 'success', text: 'JSON 已导出。' } });
      return true;
    },
  };
});

export const useSidebarPanel = () => {
  const template = useMakeupRuntime((state) => state.template);
  const selectedRegion = useMakeupRuntime((state) => state.selectedRegion);
  const setSelectedRegion = useMakeupRuntime((state) => state.setSelectedRegion);

  return {
    title: template.metadata.name,
    version: template.metadata.version,
    stats: {
      steps: template.steps.length,
      tags: template.styleTags.length,
      enabledRegions: MAKEUP_REGIONS.filter((region) => template.regions[region].enabled)
        .length,
    },
    regions: MAKEUP_REGIONS.map((region) => ({
      value: region,
      label: regionLabels[region],
      enabled: template.regions[region].enabled,
      active: selectedRegion === region,
    })),
    selectRegion: setSelectedRegion,
  };
};

export const useTemplatePanel = () => {
  const template = useMakeupRuntime((state) => state.template);
  const updateMetadata = useMakeupRuntime((state) => state.updateMetadata);
  const addStyleTag = useMakeupRuntime((state) => state.addStyleTag);
  const removeStyleTag = useMakeupRuntime((state) => state.removeStyleTag);
  const resetTemplate = useMakeupRuntime((state) => state.resetTemplate);

  return {
    metadata: template.metadata,
    styleTags: template.styleTags,
    updateMetadata,
    addStyleTag,
    removeStyleTag,
    resetTemplate,
  };
};

export const useRegionPanel = () => {
  const template = useMakeupRuntime((state) => state.template);
  const selectedRegion = useMakeupRuntime((state) => state.selectedRegion);
  const updateRegion = useMakeupRuntime((state) => state.updateRegion);
  const updateRegionParameter = useMakeupRuntime(
    (state) => state.updateRegionParameter,
  );
  const region = template.regions[selectedRegion];
  const groups = regionParameterSchema[selectedRegion] ?? [];

  return {
    selectedRegion,
    title: `${regionLabels[selectedRegion]}区域`,
    emptyParameterText: `当前 taxonomy 未定义 ${regionLabels[selectedRegion]} 的专属参数；此区域仅编辑启用状态与视觉目标。`,
    region: {
      enabled: region.enabled,
      goal: region.goal,
    },
    parameterGroups: groups.map<RuntimeParameterGroup>((group) => ({
      id: group.id,
      title: group.title,
      fields: group.fields.map((field) => ({
        ...field,
        value: readAtPath(region.parameters, field.path),
      })),
    })),
    setEnabled: (enabled: boolean) => updateRegion(selectedRegion, { enabled }),
    setGoal: (goal: string) => updateRegion(selectedRegion, { goal }),
    updateParameter: (path: string[], value: string | number) =>
      updateRegionParameter(selectedRegion, path, value),
  };
};

export const useStepPanel = () => {
  const template = useMakeupRuntime((state) => state.template);
  const selectedRegion = useMakeupRuntime((state) => state.selectedRegion);
  const selectedStepId = useMakeupRuntime((state) => state.selectedStepId);
  const setSelectedStepId = useMakeupRuntime((state) => state.setSelectedStepId);
  const addStep = useMakeupRuntime((state) => state.addStep);
  const updateStep = useMakeupRuntime((state) => state.updateStep);
  const updateStepTool = useMakeupRuntime((state) => state.updateStepTool);
  const updateStepProduct = useMakeupRuntime((state) => state.updateStepProduct);
  const updateStepAction = useMakeupRuntime((state) => state.updateStepAction);
  const updateStepPlacement = useMakeupRuntime((state) => state.updateStepPlacement);
  const updateStepEffect = useMakeupRuntime((state) => state.updateStepEffect);
  const removeStep = useMakeupRuntime((state) => state.removeStep);
  const moveStep = useMakeupRuntime((state) => state.moveStep);
  const activeStep =
    template.steps.find((step) => step.step_id === selectedStepId) ?? template.steps[0];
  const activeStepIndex = activeStep
    ? template.steps.findIndex((step) => step.step_id === activeStep.step_id)
    : -1;

  return {
    steps: template.steps,
    tabs: template.steps.map<StepTabModel>((step, index) => ({
      id: step.step_id,
      label: `${index + 1}. ${regionLabels[step.region]}`,
      active: step.step_id === activeStep?.step_id,
    })),
    activeStep,
    activeStepIndex,
    selectedRegion,
    regionOptions: MAKEUP_REGIONS.map<RuntimeOption<MakeupRegion>>((region) => ({
      value: region,
      label: regionLabels[region],
    })),
    actionOptions: MAKEUP_ACTIONS.map<RuntimeOption<MakeupActionType>>((action) => ({
      value: action,
      label: actionLabels[action],
    })),
    pressureOptions: ACTION_PRESSURES.map<RuntimeOption<ActionPressure>>((pressure) => ({
      value: pressure,
      label: pressureLabels[pressure],
    })),
    selectStep: setSelectedStepId,
    addStep,
    updateStep,
    updateStepTool,
    updateStepProduct,
    updateStepAction,
    updateStepPlacement,
    updateStepEffect,
    removeStep,
    moveStep,
  };
};

export const useJsonPanel = () => {
  const template = useMakeupRuntime((state) => state.template);
  const savedAt = useMakeupRuntime((state) => state.savedAt);
  const message = useMakeupRuntime((state) => state.message);
  const copied = useMakeupRuntime((state) => state.copied);
  const setCopied = useMakeupRuntime((state) => state.setCopied);
  const saveTemplate = useMakeupRuntime((state) => state.saveTemplate);
  const loadSavedTemplate = useMakeupRuntime((state) => state.loadSavedTemplate);
  const importTemplateJson = useMakeupRuntime((state) => state.importTemplateJson);
  const downloadTemplate = useMakeupRuntime((state) => state.downloadTemplate);
  const compiledProgram = compileTemplate(template);

  return {
    json: toTemplateJson(template),
    validation: compiledProgram.validation,
    compiledProgram,
    savedAt,
    message,
    copied,
    setCopied,
    saveTemplate,
    loadSavedTemplate,
    importTemplateJson,
    downloadTemplate,
  };
};
