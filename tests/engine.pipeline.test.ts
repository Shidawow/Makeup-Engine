import { describe, expect, it } from 'vitest';
import { MakeupEngine } from '../src/engine/orchestrator/MakeupEngine';
import { MockRenderRuntime } from '../src/engine/runtime/render-runtime';
import { createAnalyzeBeautyStage } from '../src/engine/stages/analyze-beauty';
import { createAnalyzeFaceStage } from '../src/engine/stages/analyze-face';
import { createBuildMakeupPlanStage } from '../src/engine/stages/build-makeup-plan';
import { createCompileLayersStage } from '../src/engine/stages/compile-layers';
import { createInferStyleStage } from '../src/engine/stages/infer-style';
import { createRenderPreviewStage } from '../src/engine/stages/render-preview';
import { naturalDaily } from '../src/examples/naturalDaily';

const faceFeatures = {
  faceShape: 'round',
  skinType: 'oily',
  skinTone: 'warm',
  eyeType: 'hooded',
  lipShape: 'full',
} as const;

describe('engine pipeline', () => {
  it('runs full face-to-preview pipeline', async () => {
    const runtime = new MockRenderRuntime();
    const engine = new MakeupEngine({
      runtime,
      analyzeFaceStage: createAnalyzeFaceStage(),
      analyzeBeautyStage: createAnalyzeBeautyStage(),
      inferStyleStage: createInferStyleStage(),
      buildMakeupPlanStage: createBuildMakeupPlanStage(),
      compileLayersStage: createCompileLayersStage(),
      renderPreviewStage: createRenderPreviewStage(runtime),
    });

    const result = await engine.run({
      faceFeatures,
      look: naturalDaily,
    });

    expect(result.faceAnalysis.features.faceShape).toBe('round');
    expect(result.styleInference.recommendation.foundation).toBe('matte');
    expect(result.plan.steps).toHaveLength(naturalDaily.steps.length);
    expect(result.renderInstructions).toHaveLength(naturalDaily.steps.length);
    expect(result.renderFrame.instructions).toHaveLength(naturalDaily.steps.length);
    expect(engine.getGraph().dependencyGraph).toHaveLength(6);
    expect(engine.getGraph().layerGraph).toHaveLength(naturalDaily.steps.length);

    await engine.stop();
  });
});
