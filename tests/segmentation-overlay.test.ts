import { describe, expect, it } from 'vitest';
import { drawVisionDebugOverlay } from '../src/components/template-studio/vision-debug-overlay';
import { runMakeupAnalysisPipeline, type MakeupPhotoInput } from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';
import { createMockSegmentationProvider } from '../src/vision/segmentation/providers/mock';

class FakeCanvasContext {
  fillStyle = '';
  globalAlpha = 1;
  lineWidth = 1;
  strokeStyle = '';
  readonly operations: string[] = [];

  beginPath() {
    this.operations.push('beginPath');
  }

  clearRect() {
    this.operations.push('clearRect');
  }

  fill() {
    this.operations.push('fill');
  }

  fillRect() {
    this.operations.push('fillRect');
  }

  lineTo() {
    this.operations.push('lineTo');
  }

  moveTo() {
    this.operations.push('moveTo');
  }

  rect() {
    this.operations.push('rect');
  }

  restore() {
    this.operations.push('restore');
  }

  save() {
    this.operations.push('save');
  }

  scale() {
    this.operations.push('scale');
  }

  stroke() {
    this.operations.push('stroke');
  }

  arc() {
    this.operations.push('arc');
  }
}

const image: MakeupPhotoInput = {
  id: 'segmentation-overlay-fixture',
  fileName: 'segmentation-overlay-fixture.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 128000,
  source: 'fixture',
};

describe('segmentation overlay', () => {
  it('renders segmentation mask and blended heatmap layers', async () => {
    const result = await runMakeupAnalysisPipeline({
      image,
      provider: createMockVisionProvider(),
      segmentationProvider: createMockSegmentationProvider(),
    });
    const context = new FakeCanvasContext();

    drawVisionDebugOverlay(context, {
      data: {
        faceBox: result.faceDetection.box,
        faceMesh: result.faceMesh,
        cosmeticRegions: result.cosmeticRegions,
        cosmeticSegmentation: result.cosmeticSegmentation,
      },
      options: {
        width: 640,
        height: 800,
        opacity: 0.8,
        zoom: 1,
        layers: {
          faceBox: false,
          landmarks: false,
          lips: false,
          eyes: false,
          brows: false,
          blush: false,
          contour: false,
          highlight: false,
          segmentationMasks: true,
          alphaHeatmap: true,
          blendedMask: true,
          weightedSampling: true,
          skinBaseline: true,
          edgeRings: true,
        },
      },
    });

    expect(context.operations[0]).toBe('clearRect');
    expect(context.operations.filter((operation) => operation === 'fillRect').length).toBeGreaterThan(20);
    expect(context.operations.at(-1)).toBe('restore');
  });
});
