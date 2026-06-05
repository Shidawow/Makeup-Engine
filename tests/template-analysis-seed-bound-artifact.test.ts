import { describe, expect, it } from 'vitest';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import { encodeRgbaPngImage } from '../src/training/artifacts';
import {
  createSourceImageArtifactBinding,
  createTemplateAnalysisSeedFromEntry,
  loadTemplateAnalysisSeedImageData,
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

describe('TemplateAnalysisSeed bound artifact', () => {
  it('upgrades readiness when a validated normalized png binding exists', async () => {
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
    const binding = await createSourceImageArtifactBinding({
      sourceImageId: entry.sourceImageId,
      sourceImagePackageId: manifest.packageId,
      manifestArtifactReference: entry.normalizedArtifactLinks[0]!,
      file: createTestFile(
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
      ),
      objectUrlApi: {
        createObjectURL: () => 'blob:demo-ready-lips',
        revokeObjectURL: () => undefined,
      },
    });
    const seed = createTemplateAnalysisSeedFromEntry(manifest, entry, {
      artifactBinding: binding,
    });
    const imageData = loadTemplateAnalysisSeedImageData(seed);

    expect(seed.readiness).toBe('ready_for_vision_analysis');
    expect(seed.boundArtifactResource?.objectUrl).toBe('blob:demo-ready-lips');
    expect(imageData.canRunBrowserAnalysis).toBe(true);
  });
});
