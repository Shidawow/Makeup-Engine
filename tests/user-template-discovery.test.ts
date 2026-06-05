import { describe, expect, it } from 'vitest';
import {
  createInitialTemplateDiscoveryState,
  filterTemplatesForDiscovery,
  sortTemplatesForDiscovery,
  summarizeTemplateDiscoveryResults,
  validateTemplateDiscoveryState,
} from '../src/user-app';
import { userAppTemplateDiscoveryExamplePackage } from '../src/templates/examples';

describe('user template discovery model', () => {
  it('filters discovery results by difficulty, duration, style, and blocked status', () => {
    const state = createInitialTemplateDiscoveryState({
      filter: {
        difficulties: ['easy'],
        maxEstimatedDurationMinutes: 8,
        styleTags: ['natural'],
        suitableOccasions: [],
        requiredTools: [],
        statuses: [],
        compatibilityTargets: [],
        includeBlocked: false,
      },
      preferredStyleTags: ['natural'],
    });
    const results = filterTemplatesForDiscovery({
      packageData: userAppTemplateDiscoveryExamplePackage,
      state,
    });

    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results.every((result) => result.difficulty === 'easy')).toBe(true);
    expect(results.every((result) => result.estimatedDurationMinutes <= 8)).toBe(true);
    expect(results.every((result) => result.status !== 'blocked')).toBe(true);
  });

  it('sorts deterministically by duration, difficulty, steps, and style match', () => {
    const state = createInitialTemplateDiscoveryState({
      preferredStyleTags: ['natural', 'minimal'],
    });
    const results = filterTemplatesForDiscovery({
      packageData: userAppTemplateDiscoveryExamplePackage,
      state,
    });

    expect(sortTemplatesForDiscovery(results, 'shortest_duration')[0].estimatedDurationMinutes).toBe(5);
    expect(sortTemplatesForDiscovery(results, 'easiest')[0].difficulty).toBe('easy');
    expect(sortTemplatesForDiscovery(results, 'most_steps')[0].stepCount).toBeGreaterThanOrEqual(6);
    expect(sortTemplatesForDiscovery(results, 'style_match')[0].styleMatchCount).toBeGreaterThan(0);
  });

  it('summarizes discovery state without template mutation or training output', () => {
    const state = createInitialTemplateDiscoveryState();
    const results = filterTemplatesForDiscovery({
      packageData: userAppTemplateDiscoveryExamplePackage,
      state,
    });
    const summary = summarizeTemplateDiscoveryResults({
      packageData: userAppTemplateDiscoveryExamplePackage,
      results,
      state,
    });

    expect(summary.totalTemplates).toBe(8);
    expect(summary.blockedTemplates).toBe(1);
    expect(summary.localOnly).toBe(true);
    expect(summary.modifiesTemplatePackage).toBe(false);
    expect(summary.writesTrainingInput).toBe(false);
    expect(validateTemplateDiscoveryState(state)).toEqual([]);
  });
});
