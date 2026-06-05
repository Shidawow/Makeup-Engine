import { describe, expect, it } from 'vitest';
import { adaptMediaPipeFaceMesh } from '../src/vision/providers/mediapipe';
import { createMockVisionProvider } from '../src/vision/providers/mock';
import type { MakeupPhotoInput } from '../src/vision';

const image: MakeupPhotoInput = {
  id: 'vision-photo-001',
  fileName: 'vision-photo-001.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 180000,
  source: 'fixture',
};

describe('vision provider architecture', () => {
  it('adapts MediaPipe FaceMesh coordinates into normalized face geometry', () => {
    const faceMesh = adaptMediaPipeFaceMesh('image-001', 'face-001', {
      confidence: 0.87,
      landmarks: [
        { x: -0.2, y: 0.1, visibility: 0.7 },
        { x: 0.5, y: 0.4, visibility: 0.9 },
        { x: 1.2, y: 0.8, visibility: 0.8 },
      ],
    });

    expect(faceMesh.imageId).toBe('image-001');
    expect(faceMesh.faceId).toBe('face-001');
    expect(faceMesh.landmarks).toHaveLength(3);
    expect(faceMesh.landmarks[0].point.x).toBe(0);
    expect(faceMesh.landmarks[2].point.x).toBe(1);
    expect(faceMesh.boundingBox.space).toBe('normalized-image');
    expect(faceMesh.confidence).toBe(0.87);
  });

  it('keeps mock vision provider deterministic for tests', async () => {
    const provider = createMockVisionProvider();
    const first = await provider.analyze(image);
    const second = await provider.analyze(image);

    expect(provider.kind).toBe('mock');
    expect(first).toEqual(second);
    expect(first.faceDetection.detected).toBe(true);
    expect(first.faceMesh.landmarks.length).toBeGreaterThan(30);
    expect(first.segmentationMasks.length).toBeGreaterThan(0);
  });
});

