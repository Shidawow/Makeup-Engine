import { describe, expect, it } from 'vitest';
import { compileToRenderInstructions } from '../src/compiler/stepCompiler';
import { buildMakeupPlan } from '../src/engine/stages/build-makeup-plan';
import { naturalDaily } from '../src/examples/naturalDaily';
import { inferStyle } from '../src/engine/stages/infer-style';
import { analyzeFace } from '../src/engine/stages/analyze-face';
import { analyzeBeauty } from '../src/engine/stages/analyze-beauty';

const faceFeatures = {
  faceShape: 'round',
  skinType: 'oily',
  skinTone: 'warm',
  eyeType: 'hooded',
  lipShape: 'full',
} as const;

describe('compiler snapshot', () => {
  it('compiles makeup plan into deterministic render instructions', async () => {
    const faceAnalysis = await analyzeFace({ features: faceFeatures, source: 'manual' });
    const beautyScore = await analyzeBeauty(faceAnalysis);
    const styleInference = await inferStyle(faceAnalysis);
    const plan = await buildMakeupPlan({
      look: naturalDaily,
      faceAnalysis,
      beautyScore,
      styleInference,
    });
    const instructions = compileToRenderInstructions(naturalDaily, plan);

    const snapshot = instructions.map((instruction) => ({
      id: instruction.id,
      stepId: instruction.stepId,
      layer: instruction.layer,
      action: instruction.action,
      region: instruction.region,
      blendMode: instruction.blendMode,
      strokeDirection: instruction.strokeDirection,
    }));

    expect(snapshot).toHaveLength(naturalDaily.steps.length);
    expect(snapshot.slice(0, 2)).toMatchInlineSnapshot(`
      [
        {
          "action": "prep",
          "blendMode": "soft",
          "id": "look-natural-daily-v01-plan-render-natural-01-skin-prep",
          "layer": {
            "id": "look-natural-daily-v01-plan-layer-1",
            "name": "face-prep",
            "opacity": 0.35,
            "order": 1,
            "region": "face",
            "zIndex": 1,
          },
          "region": "face",
          "stepId": "natural-01-skin-prep",
          "strokeDirection": "center_out",
        },
        {
          "action": "tap",
          "blendMode": "diffused",
          "id": "look-natural-daily-v01-plan-render-natural-02-even-base",
          "layer": {
            "id": "look-natural-daily-v01-plan-layer-2",
            "name": "face-tap",
            "opacity": 0.65,
            "order": 2,
            "region": "face",
            "zIndex": 2,
          },
          "region": "face",
          "stepId": "natural-02-even-base",
          "strokeDirection": "center_out",
        },
      ]
    `);
    expect(snapshot.at(-1)).toEqual({
      id: 'look-natural-daily-v01-plan-render-natural-06-set-glow',
      stepId: 'natural-06-set-glow',
      layer: {
        id: 'look-natural-daily-v01-plan-layer-6',
        name: 'face-set',
        order: 6,
        region: 'face',
        opacity: 0.35,
        zIndex: 6,
      },
      action: 'set',
      region: 'face',
      blendMode: 'diffused',
      strokeDirection: 'center_out',
    });
  });
});
