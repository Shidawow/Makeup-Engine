import type { MakeupRegion, MakeupStep } from '../../templates/schema';
import type {
  UserAppMakeupDifficulty,
  UserAppMakeupStep,
  UserAppProductSuggestion,
  UserAppRegionInstruction,
  UserAppRegionType,
  UserAppStepIntensity,
  UserAppToolSuggestion,
} from '../../templates/schema/user-app-template-contract.schema';

const REGION_ORDER: UserAppRegionType[] = [
  'skin-prep',
  'base',
  'brows',
  'eyeshadow',
  'eyeliner',
  'lashes',
  'blush',
  'contour',
  'highlight',
  'lips',
  'setting',
  'unknown',
];

const regionDisplayNames: Record<UserAppRegionType, string> = {
  'skin-prep': 'Skin prep',
  base: 'Base',
  brows: 'Brows',
  eyeshadow: 'Eyeshadow',
  eyeliner: 'Eyeliner',
  lashes: 'Lashes',
  blush: 'Blush',
  contour: 'Contour',
  highlight: 'Highlight',
  lips: 'Lips',
  setting: 'Setting',
  unknown: 'Unknown',
};

export const mapTemplateRegionToAppRegion = (region: MakeupRegion): UserAppRegionType => {
  switch (region) {
    case 'base':
      return 'base';
    case 'brow':
      return 'brows';
    case 'eye':
      return 'eyeshadow';
    case 'contour':
      return 'contour';
    case 'blush':
      return 'blush';
    case 'lip':
      return 'lips';
    default:
      return 'unknown';
  }
};

const regionOrderIndex = (region: UserAppRegionType): number => REGION_ORDER.indexOf(region);

export const orderMakeupStepsForApp = (steps: readonly MakeupStep[]): MakeupStep[] =>
  [...steps].sort((left, right) => {
    const leftRegion = mapTemplateRegionToAppRegion(left.region);
    const rightRegion = mapTemplateRegionToAppRegion(right.region);
    const regionDelta = regionOrderIndex(leftRegion) - regionOrderIndex(rightRegion);

    return regionDelta === 0 ? left.order - right.order : regionDelta;
  });

export const inferStepDuration = (step: MakeupStep): number => {
  const baseSecondsByIntensity: Record<UserAppStepIntensity, number> = {
    low: 40,
    medium: 70,
    high: 110,
  };
  const regionMultiplier = step.region === 'eye' ? 1.4 : step.region === 'base' ? 1.25 : 1;

  return Math.max(20, Math.round(baseSecondsByIntensity[step.intensity] * regionMultiplier));
};

export const inferStepDifficulty = (step: MakeupStep): UserAppMakeupDifficulty => {
  if (step.region === 'eye' && ['line', 'define'].includes(step.action)) {
    return 'advanced';
  }

  if (step.intensity === 'high' || ['contour', 'brow'].includes(step.region)) {
    return 'medium';
  }

  return 'easy';
};

export const createStepCorrectionTips = (step: MakeupStep): string[] => {
  const tips = [`Keep the ${step.region} placement inside ${step.placement.area}.`];

  if (step.action === 'blend') {
    tips.push('Soften visible edges before adding more product.');
  }

  if (step.intensity === 'high') {
    tips.push('Build intensity in thin layers instead of applying at full strength.');
  }

  return tips;
};

const createToolId = (step: MakeupStep): string => `tool-${step.tool}`;

const createProductId = (step: MakeupStep): string =>
  `product-${step.productCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

export const createToolSuggestionFromStep = (step: MakeupStep): UserAppToolSuggestion => ({
  toolId: createToolId(step),
  displayName: step.tool,
  toolType: step.tool,
  required: true,
  usageNotes: [`Use for ${step.action} on ${step.region}.`],
});

export const createProductSuggestionFromStep = (step: MakeupStep): UserAppProductSuggestion => ({
  productId: createProductId(step),
  displayName: step.productCategory,
  productCategory: step.productCategory,
  colorHint: step.colorFamily,
  finish: step.finish,
  required: true,
  usageNotes: [`Recommended for ${step.region} ${step.action}.`],
});

export const normalizeMakeupStepsForApp = (input: {
  steps: readonly MakeupStep[];
  evidenceReferences?: readonly string[];
}): UserAppMakeupStep[] =>
  orderMakeupStepsForApp(input.steps).map((step, index) => {
    const appRegion = mapTemplateRegionToAppRegion(step.region);
    const warnings =
      input.evidenceReferences && input.evidenceReferences.length > 0
        ? []
        : ['missing evidence references for this app step'];

    return {
      stepId: `app-step-${step.id}`,
      order: index + 1,
      title: `${regionDisplayNames[appRegion]} ${step.action}`,
      instructionText: step.instruction,
      region: appRegion,
      technique: step.action,
      targetEffect: step.visualEffects.join(', ') || step.rationale,
      colorHint: step.colorFamily,
      intensity: step.intensity,
      toolIds: [createToolId(step)],
      productIds: [createProductId(step)],
      estimatedSeconds: inferStepDuration(step),
      commonMistakes: [`Applying outside ${step.placement.area}.`],
      correctionTips: createStepCorrectionTips(step),
      visualReference: step.sourceRegionId
        ? {
            referenceId: step.sourceRegionId,
            referenceKind: 'evidence-reference',
            description: `Reviewed region reference for ${step.region}.`,
          }
        : undefined,
      evidenceReferences: [...(input.evidenceReferences ?? [])],
      warnings,
    };
  });

export const validateAppMakeupStep = (step: UserAppMakeupStep): string[] => {
  const issues: string[] = [];

  if (!step.title.trim()) {
    issues.push(`step ${step.stepId} missing title`);
  }

  if (!step.instructionText.trim()) {
    issues.push(`step ${step.stepId} missing instructionText`);
  }

  if (step.region === 'unknown') {
    issues.push(`step ${step.stepId} has unknown region`);
  }

  if (step.estimatedSeconds <= 0) {
    issues.push(`step ${step.stepId} has invalid estimatedSeconds`);
  }

  return issues;
};

export const createRegionInstructionsForApp = (
  steps: readonly UserAppMakeupStep[],
): UserAppRegionInstruction[] => {
  const regions = [...new Set(steps.map((step) => step.region))].filter(
    (region) => region !== 'unknown',
  );

  return regions.map((region) => {
    const regionSteps = steps.filter((step) => step.region === region);
    const intensityValues = regionSteps.map((step) =>
      step.intensity === 'high' ? 1 : step.intensity === 'medium' ? 0.65 : 0.35,
    );
    const recommended =
      intensityValues.length === 0
        ? 0.5
        : Number(
            (
              intensityValues.reduce((sum, value) => sum + value, 0) / intensityValues.length
            ).toFixed(2),
          );

    return {
      regionId: `app-region-${region}`,
      regionType: region,
      displayName: regionDisplayNames[region],
      normalizedRegionReference: `normalized-region:${region}`,
      applicationAreaDescription: regionSteps
        .map((step) => step.instructionText)
        .join(' '),
      intensityRange: {
        min: Math.max(0.1, Number((recommended - 0.25).toFixed(2))),
        max: Math.min(1, Number((recommended + 0.25).toFixed(2))),
        recommended,
      },
      blendDirection: region === 'blush' || region === 'contour' ? 'outward and upward' : 'follow natural shape',
      edgeSoftness: region === 'eyeliner' || region === 'brows' ? 'crisp' : 'soft',
      symmetryHint:
        region === 'blush' || region === 'brows' || region === 'eyeshadow'
          ? 'Compare left and right sides before setting the look.'
          : 'Keep placement centered and balanced.',
      userGuidanceText: `Apply ${regionDisplayNames[region]} steps with controlled ${regionSteps[0]?.intensity ?? 'medium'} intensity.`,
    };
  });
};

export const summarizeAppMakeupSteps = (steps: readonly UserAppMakeupStep[]): string =>
  JSON.stringify({
    stepCount: steps.length,
    totalSeconds: steps.reduce((sum, step) => sum + step.estimatedSeconds, 0),
    regions: [...new Set(steps.map((step) => step.region))],
    warnings: steps.reduce((sum, step) => sum + step.warnings.length, 0),
  });

