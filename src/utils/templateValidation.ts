import { MAKEUP_ACTIONS, MAKEUP_REGIONS } from '../types/makeup';
import type { MakeupTemplate } from '../types/makeup';

export const isMakeupTemplate = (value: unknown): value is MakeupTemplate => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<MakeupTemplate>;
  const hasMetadata =
    !!candidate.metadata &&
    typeof candidate.metadata === 'object' &&
    typeof candidate.metadata.name === 'string' &&
    typeof candidate.metadata.version === 'string';

  const hasRegions =
    !!candidate.regions &&
    MAKEUP_REGIONS.every((region) => candidate.regions?.[region]?.region === region);

  const hasSteps =
    Array.isArray(candidate.steps) &&
    candidate.steps.every(
      (step) =>
        MAKEUP_REGIONS.includes(step.region) &&
        MAKEUP_ACTIONS.includes(step.action.type),
    );

  return hasMetadata && Array.isArray(candidate.styleTags) && hasRegions && hasSteps;
};
