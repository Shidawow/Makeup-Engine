import type {
  AnyRegionParameters,
  MakeupAction,
  MakeupEffect,
  MakeupPlacement,
  MakeupProduct,
  MakeupRegion,
  MakeupStep,
  MakeupTemplate,
  MakeupTemplateMetadata,
  MakeupTool,
} from '../schema/legacyTypes';

export const stampTemplate = (template: MakeupTemplate): MakeupTemplate => ({
  ...template,
  metadata: {
    ...template.metadata,
    updatedAt: new Date().toISOString(),
  },
});

export const createDraftStep = (region: MakeupRegion): MakeupStep => ({
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
    speed: 'steady',
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

export const updateMetadata = (
  template: MakeupTemplate,
  metadata: Partial<MakeupTemplateMetadata>,
) =>
  stampTemplate({
    ...template,
    metadata: {
      ...template.metadata,
      ...metadata,
    },
  });

export const addStyleTag = (template: MakeupTemplate, tag: string) => {
  const normalized = tag.trim();

  if (!normalized || template.styleTags.includes(normalized)) {
    return template;
  }

  return stampTemplate({
    ...template,
    styleTags: [...template.styleTags, normalized],
  });
};

export const removeStyleTag = (template: MakeupTemplate, tag: string) =>
  stampTemplate({
    ...template,
    styleTags: template.styleTags.filter((styleTag) => styleTag !== tag),
  });

export const updateRegion = (
  template: MakeupTemplate,
  region: MakeupRegion,
  updates: Partial<{ enabled: boolean; goal: string }>,
) =>
  stampTemplate({
    ...template,
    regions: {
      ...template.regions,
      [region]: {
        ...template.regions[region],
        ...updates,
      },
    },
  });

const writeAtPath = (
  value: Record<string, unknown>,
  path: string[],
  nextValue: string | number,
): Record<string, unknown> => {
  const [head, ...tail] = path;

  if (!head) {
    return value;
  }

  if (tail.length === 0) {
    return {
      ...value,
      [head]: nextValue,
    };
  }

  const child = value[head];
  const childRecord =
    child && typeof child === 'object' && !Array.isArray(child)
      ? (child as Record<string, unknown>)
      : {};

  return {
    ...value,
    [head]: writeAtPath(childRecord, tail, nextValue),
  };
};

export const updateRegionParameterAtPath = (
  template: MakeupTemplate,
  region: MakeupRegion,
  path: string[],
  value: string | number,
) => {
  const currentParameters = template.regions[region].parameters as Record<string, unknown>;

  return stampTemplate({
    ...template,
    regions: {
      ...template.regions,
      [region]: {
        ...template.regions[region],
        parameters: writeAtPath(currentParameters, path, value) as AnyRegionParameters,
      },
    },
  });
};

export const addStep = (template: MakeupTemplate, region: MakeupRegion) =>
  stampTemplate({
    ...template,
    steps: [...template.steps, createDraftStep(region)],
  });

export const appendStep = (template: MakeupTemplate, step: MakeupStep) =>
  stampTemplate({
    ...template,
    steps: [...template.steps, step],
  });

export const updateStep = (
  template: MakeupTemplate,
  stepId: string,
  updates: Partial<MakeupStep>,
) =>
  stampTemplate({
    ...template,
    steps: template.steps.map((step) =>
      step.step_id === stepId ? { ...step, ...updates } : step,
    ),
  });

export const updateStepTool = (
  template: MakeupTemplate,
  stepId: string,
  updates: Partial<MakeupTool>,
) =>
  stampTemplate({
    ...template,
    steps: template.steps.map((step) =>
      step.step_id === stepId
        ? {
            ...step,
            tool: {
              ...step.tool,
              ...updates,
            },
          }
        : step,
    ),
  });

export const updateStepProduct = (
  template: MakeupTemplate,
  stepId: string,
  updates: Partial<MakeupProduct>,
) =>
  stampTemplate({
    ...template,
    steps: template.steps.map((step) =>
      step.step_id === stepId
        ? {
            ...step,
            product: {
              ...step.product,
              ...updates,
            },
          }
        : step,
    ),
  });

export const updateStepAction = (
  template: MakeupTemplate,
  stepId: string,
  updates: Partial<MakeupAction>,
) =>
  stampTemplate({
    ...template,
    steps: template.steps.map((step) =>
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
  });

export const updateStepPlacement = (
  template: MakeupTemplate,
  stepId: string,
  updates: Partial<MakeupPlacement>,
) =>
  stampTemplate({
    ...template,
    steps: template.steps.map((step) =>
      step.step_id === stepId
        ? {
            ...step,
            placement: {
              ...step.placement,
              ...updates,
            },
          }
        : step,
    ),
  });

export const updateStepEffect = (
  template: MakeupTemplate,
  stepId: string,
  updates: Partial<MakeupEffect>,
) =>
  stampTemplate({
    ...template,
    steps: template.steps.map((step) =>
      step.step_id === stepId
        ? {
            ...step,
            effect: {
              ...step.effect,
              ...updates,
            },
          }
        : step,
    ),
  });

export const removeStep = (template: MakeupTemplate, stepId: string) =>
  stampTemplate({
    ...template,
    steps: template.steps.filter((step) => step.step_id !== stepId),
  });

export const moveStep = (
  template: MakeupTemplate,
  stepId: string,
  direction: 'up' | 'down',
) => {
  const index = template.steps.findIndex((step) => step.step_id === stepId);
  const targetIndex = direction === 'up' ? index - 1 : index + 1;

  if (index < 0 || targetIndex < 0 || targetIndex >= template.steps.length) {
    return template;
  }

  const steps = [...template.steps];
  const [step] = steps.splice(index, 1);
  steps.splice(targetIndex, 0, step);

  return stampTemplate({
    ...template,
    steps,
  });
};
