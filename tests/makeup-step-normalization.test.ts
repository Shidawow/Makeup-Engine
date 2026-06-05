import { describe, expect, it } from 'vitest';
import {
  inferStepDifficulty,
  mapTemplateRegionToAppRegion,
  normalizeMakeupStepsForApp,
  orderMakeupStepsForApp,
} from '../src/template-engine/app-contract';
import { createTemplateLibraryTestTemplate } from './templateLibraryTestUtils';

describe('Makeup step normalization for app contract', () => {
  it('orders and maps template steps into app-facing regions without fake steps', () => {
    const template = createTemplateLibraryTestTemplate();
    const reversed = [...template.steps].reverse();
    const ordered = orderMakeupStepsForApp(reversed);
    const normalized = normalizeMakeupStepsForApp({
      steps: reversed,
      evidenceReferences: ['evidence:test'],
    });

    expect(ordered.map((step) => step.region)).toEqual(['blush', 'lip']);
    expect(normalized.map((step) => step.order)).toEqual([1, 2]);
    expect(normalized.map((step) => step.region)).toEqual(['blush', 'lips']);
    expect(normalized).toHaveLength(template.steps.length);
    expect(mapTemplateRegionToAppRegion('brow')).toBe('brows');
    expect(inferStepDifficulty(template.steps[0]!)).toBe('easy');
  });
});

