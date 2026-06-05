import { describe, expect, it } from 'vitest';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import { encodeRgbaPngImage } from '../src/training/artifacts';
import {
  artifactBindingMapKey,
  createSourceImageArtifactBinding,
  resolveBestBoundArtifactForAnalysis,
} from '../src/templates/storage';

const createTestFile = (bytes: Uint8Array, name: string, type: string): File =>
  ({
    name,
    size: bytes.byteLength,
    type,
    arrayBuffer: async () =>
      bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    text: async () => new TextDecoder().decode(bytes),
  }) as File;

describe('source image artifact binding schema', () => {
  it('creates a validated normalized png binding from an explicit file selection', async () => {
    const manifest = createDemoSourceImageManifest();
    const entry = {
      ...manifest.entries[0]!,
      normalizedArtifactLinks: [
        {
          kind: 'normalized-png' as const,
          uri: 'normalized-png/demo-ready-lips.png',
          width: 2,
          height: 2,
          format: 'png-image',
        },
      ],
    };
    const file = createTestFile(
      encodeRgbaPngImage({
        width: 2,
        height: 2,
        rgba: [
          255, 0, 0, 255, 0, 0, 255, 255,
          0, 255, 0, 255, 255, 255, 255, 255,
        ],
      }),
      'demo-ready-lips.png',
      'image/png',
    );

    const binding = await createSourceImageArtifactBinding({
      sourceImageId: entry.sourceImageId,
      sourceImagePackageId: manifest.packageId,
      manifestArtifactReference: entry.normalizedArtifactLinks[0]!,
      file,
      objectUrlApi: {
        createObjectURL: () => 'blob:demo-ready-lips',
        revokeObjectURL: () => undefined,
      },
    });

    expect(binding.bindingId).toContain('source-image-artifact-binding');
    expect(binding.status).toBe('validated');
    expect(binding.browserResource?.browserReadable).toBe(true);
    expect(binding.objectUrl).toBe('blob:demo-ready-lips');
    expect(artifactBindingMapKey(entry.sourceImageId, entry.normalizedArtifactLinks[0]!.uri)).toContain(entry.sourceImageId);
    expect(resolveBestBoundArtifactForAnalysis(
      { [artifactBindingMapKey(entry.sourceImageId, entry.normalizedArtifactLinks[0]!.uri)]: binding },
      entry.sourceImageId,
    )?.bindingId).toBe(binding.bindingId);
  });
});
