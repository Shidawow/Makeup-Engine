import { describe, expect, it } from 'vitest';
import { drawVisionDebugOverlay } from '../src/components/template-studio/vision-debug-overlay';
import { runMakeupAnalysisPipeline, type MakeupPhotoInput } from '../src/vision';
import { createMockVisionProvider } from '../src/vision/providers/mock';

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
  id: 'overlay-rendering-001',
  fileName: 'overlay-rendering.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 96000,
  source: 'fixture',
};

describe('vision debug overlay rendering', () => {
  it('draws face box, landmarks, and enabled cosmetic polygons', async () => {
    const result = await runMakeupAnalysisPipeline({
      image,
      provider: createMockVisionProvider(),
    });
    const context = new FakeCanvasContext();

    drawVisionDebugOverlay(context, {
      data: {
        faceBox: result.faceDetection.box,
        faceMesh: result.faceMesh,
        cosmeticRegions: result.cosmeticRegions,
      },
      options: {
        width: 800,
        height: 1000,
        opacity: 0.8,
        zoom: 1,
        layers: {
          faceBox: true,
          landmarks: true,
          lips: true,
          eyes: true,
          brows: true,
          blush: true,
          contour: false,
          highlight: false,
          segmentationMasks: true,
          alphaHeatmap: false,
          blendedMask: true,
          weightedSampling: false,
          skinBaseline: false,
          edgeRings: false,
        },
      },
    });

    expect(context.operations[0]).toBe('clearRect');
    expect(context.operations).toContain('rect');
    expect(context.operations).toContain('arc');
    expect(context.operations.filter((operation) => operation === 'fill').length).toBeGreaterThan(1);
    expect(context.operations.at(-1)).toBe('restore');
  });
});
