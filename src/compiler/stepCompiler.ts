import type { RenderInstruction, RenderLayer, MakeupPlan } from '../engine/contracts';
import type { MakeupLook } from '../schema/makeup.schema';
import { resolveGoalActionRule } from '../rules/goalRules';
import type {
  MakeupAction,
  MakeupEffect,
  MakeupPlacement,
  MakeupStep,
  MakeupTemplate,
} from '../schema/legacyTypes';
import { validateMakeupTemplate } from '../schema/validation';

export interface CompiledActionInstruction {
  type: MakeupAction['type'];
  direction: string;
  pressure: MakeupAction['pressure'];
  repeat: number;
  speed: MakeupAction['speed'];
}

export interface CompiledStep {
  id: string;
  index: number;
  region: MakeupStep['region'];
  regionGoal: string;
  stepGoal: string;
  toolLabel: string;
  productLabel: string;
  action: CompiledActionInstruction;
  placement: MakeupPlacement;
  effect: MakeupEffect;
  instruction: string;
  ruleId: string | null;
  ruleRationale: string | null;
}

export interface CompiledRegion {
  region: MakeupStep['region'];
  enabled: boolean;
  goal: string;
  stepCount: number;
}

export interface CompiledMakeupProgram {
  templateId: string;
  templateName: string;
  version: string;
  regions: CompiledRegion[];
  steps: CompiledStep[];
  validation: ReturnType<typeof validateMakeupTemplate>;
}

export interface CompiledRenderProgram {
  planId: string;
  templateId: string;
  renderInstructions: RenderInstruction[];
  validation: ReturnType<typeof validateMakeupTemplate>;
}

const compileAction = (
  step: MakeupStep,
  regionGoal: string,
): {
  action: MakeupAction;
  placement: MakeupPlacement;
  effect: MakeupEffect;
  ruleId: string | null;
  ruleRationale: string | null;
} => {
  const stepRule = resolveGoalActionRule(step.goal, step.region);
  const regionRule = stepRule ? null : resolveGoalActionRule(regionGoal, step.region);
  const rule = stepRule ?? regionRule;

  if (!rule) {
    return {
      action: step.action,
      placement: step.placement,
      effect: step.effect,
      ruleId: null,
      ruleRationale: null,
    };
  }

  return {
    action: {
      ...rule.action,
      ...step.action,
      speed: step.action.speed ?? rule.action.speed,
    },
    placement: {
      ...rule.placement,
      ...step.placement,
    },
    effect: {
      ...rule.effect,
      ...step.effect,
    },
    ruleId: rule.goal,
    ruleRationale: rule.rationale,
  };
};

const buildInstruction = (
  step: MakeupStep,
  action: MakeupAction,
  placement: MakeupPlacement,
) =>
  `${step.goal} 使用${step.tool.subtype || step.tool.type}在${placement.anchor}以${action.pressure}力度${action.direction}${action.repeat}次。`;

export const compileStep = (
  template: MakeupTemplate,
  step: MakeupStep,
  index: number,
): CompiledStep => {
  const regionGoal = (template.regions[step.region]?.goal ?? '') as string;
  const compiled = compileAction(step, regionGoal);

  return {
    id: step.step_id,
    index,
    region: step.region,
    regionGoal,
    stepGoal: step.goal,
    toolLabel: `${step.tool.type} / ${step.tool.subtype}`,
    productLabel: `${step.product.category} / ${step.product.color_family} / ${step.product.finish}`,
    action: {
      type: compiled.action.type,
      direction: compiled.action.direction,
      pressure: compiled.action.pressure,
      repeat: compiled.action.repeat,
      speed: compiled.action.speed ?? 'steady',
    },
    placement: compiled.placement,
    effect: compiled.effect,
    instruction: buildInstruction(step, compiled.action, compiled.placement),
    ruleId: compiled.ruleId,
    ruleRationale: compiled.ruleRationale,
  };
};

export const compileTemplate = (template: MakeupTemplate): CompiledMakeupProgram => {
  const validation = validateMakeupTemplate(template);
  const enabledSteps = template.steps.filter(
    (step) => template.regions[step.region]?.enabled,
  );

  return {
    templateId: template.metadata.id,
    templateName: template.metadata.name,
    version: template.metadata.version,
    regions: Object.values(template.regions).map((region) => ({
      region: region.region,
      enabled: region.enabled,
      goal: region.goal,
      stepCount: template.steps.filter((step) => step.region === region.region).length,
    })),
    steps: enabledSteps.map((step, index) => compileStep(template, step, index + 1)),
    validation,
  };
};

const resolveOpacity = (intensity: MakeupLook['steps'][number]['intensity']) => {
  switch (intensity) {
    case 'low':
      return 0.35;
    case 'medium':
      return 0.65;
    case 'high':
      return 0.9;
    default:
      return 0.5;
  }
};

const makeLayer = (
  planId: string,
  step: MakeupLook['steps'][number],
  order: number,
): RenderLayer => ({
  id: `${planId}-layer-${order}`,
  name: `${step.region}-${step.action}`,
  order,
  region: step.region,
  opacity: resolveOpacity(step.intensity),
  zIndex: order,
});

export const compileToRenderInstructions = (
  look: MakeupLook,
  plan: MakeupPlan,
): RenderInstruction[] =>
  plan.steps.map((step, index) => {
    const renderInstruction: RenderInstruction = {
      id: `${plan.id}-render-${step.id}`,
      planId: plan.id,
      stepId: step.id,
      layer: makeLayer(plan.id, step, index + 1),
      action: step.action,
      tool: step.tool,
      intensity: step.intensity,
      description: step.description,
      region: step.region,
      blendMode: step.technique.blendMode,
      strokeDirection: step.technique.strokeDirection,
      layerOrder: step.technique.layerOrder,
      repeat: step.technique.repeat ?? 1,
      durationMs: step.durationMs ?? 2000,
      explanation: [
        ...plan.styleInference.explanations,
        `Source look: ${look.name}`,
      ],
    };

    return renderInstruction;
  });

export const compilePlanToRenderProgram = (
  look: MakeupLook,
  plan: MakeupPlan,
): CompiledRenderProgram => ({
  planId: plan.id,
  templateId: look.id,
  renderInstructions: compileToRenderInstructions(look, plan),
  validation: validateMakeupTemplate(plan.sourceLook as unknown as MakeupTemplate),
});
