import { describe, expect, it } from 'vitest';
import {
  createMediaPipeFaceMeshProvider,
  type MakeupPhotoInput,
  type MediaPipeFaceMeshRuntime,
  type MediaPipeRuntimeState,
} from '../src/vision';

const createLandmarks = () =>
  Array.from({ length: 468 }, (_, index) => ({
    x: 0.2 + (index % 18) * 0.03,
    y: 0.1 + Math.floor(index / 18) * 0.025,
    z: index * 0.0001,
    visibility: 0.9,
  }));

class FakeMediaPipeRuntime implements MediaPipeFaceMeshRuntime {
  state: MediaPipeRuntimeState = 'idle';
  initialized = false;
  warmedUp = false;
  disposed = false;

  async initialize(): Promise<void> {
    this.initialized = true;
    this.state = 'ready';
  }

  async warmup(): Promise<void> {
    this.warmedUp = true;
  }

  async detect() {
    await this.initialize();
    return {
      landmarks: createLandmarks(),
      confidence: 0.94,
    };
  }

  dispose(): void {
    this.disposed = true;
    this.state = 'disposed';
  }
}

const image: MakeupPhotoInput = {
  id: 'real-facemesh-fixture',
  fileName: 'real-facemesh-fixture.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 300000,
  source: 'fixture',
  imageUrl: 'blob://fixture',
};

describe('MediaPipe FaceMesh provider', () => {
  it('uses runtime lifecycle and emits 468 normalized landmarks', async () => {
    const runtime = new FakeMediaPipeRuntime();
    const provider = createMediaPipeFaceMeshProvider({ runtime });

    await provider.initialize();
    await provider.warmup();
    const result = await provider.analyze(image);
    provider.dispose();

    expect(runtime.initialized).toBe(true);
    expect(runtime.warmedUp).toBe(true);
    expect(runtime.disposed).toBe(true);
    expect(result.providerId).toBe('mediapipe-facemesh');
    expect(result.faceDetection.detected).toBe(true);
    expect(result.faceMesh.landmarks).toHaveLength(468);
    expect(result.debug.some((artifact) => artifact.label.includes('landmarks'))).toBe(true);
  });
});

