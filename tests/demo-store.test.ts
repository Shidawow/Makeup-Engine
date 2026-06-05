import { describe, expect, it } from 'vitest';
import { useDemoStore } from '../src/store/demoStore';

describe('demo store', () => {
  it('bootstraps local analysis state and stores pipeline result', async () => {
    useDemoStore.getState().reset();
    useDemoStore.getState().setPhoto({
      fileName: 'dry-cool-oval-mono-thin.png',
      size: 2000,
      type: 'image/png',
      previewUrl: 'blob:test',
    });

    await useDemoStore.getState().analyze();
    const state = useDemoStore.getState();

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.result?.faceAnalysis.features).toEqual({
      faceShape: 'oval',
      skinType: 'dry',
      skinTone: 'cool',
      eyeType: 'monolid',
      lipShape: 'thin',
    });
    expect(state.result?.styleInference.recommendation.foundation).toBe('dewy hydrating');
    expect(state.logs.length).toBeGreaterThan(0);
  });
});
