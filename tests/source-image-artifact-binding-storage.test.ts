import { describe, expect, it } from 'vitest';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import { encodeRgbaPngImage } from '../src/training/artifacts';
import {
  createSourceImageArtifactBinding,
  loadTemplateAnalysisSeedImageData,
  resolveBestBoundArtifactForAnalysis,
  serializeArtifactBindingSession,
  restoreArtifactBindingSession,
  updateTemplateAnalysisSeedWithBoundArtifact,
  validateArtifactBindingAgainstManifestReference,
  createTemplateAnalysisSeedFromEntry,
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

describe('source image artifact binding storage', () => {
  it('marks ready source images without browser-readable artifacts as blocked until bound', () => {
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
    const seed = createTemplateAnalysisSeedFromEntry(manifest, entry);

    expect(seed.readiness).toBe('blocked_by_missing_artifact');
    expect(loadTemplateAnalysisSeedImageData(seed).canRunBrowserAnalysis).toBe(false);
  });

  it('updates a seed to ready_for_vision_analysis once a validated binding exists', async () => {
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
    const seed = createTemplateAnalysisSeedFromEntry(manifest, entry, {
      artifactBinding: binding,
    });
    const updated = updateTemplateAnalysisSeedWithBoundArtifact(seed, binding);
    const snapshot = serializeArtifactBindingSession({
      [binding.bindingId]: binding,
    });
    const restored = restoreArtifactBindingSession(snapshot);

    expect(binding.status).toBe('validated');
    expect(updated.readiness).toBe('ready_for_vision_analysis');
    expect(updated.browserPreviewUrl).toBe('blob:demo-ready-lips');
    expect(resolveBestBoundArtifactForAnalysis(restored, entry.sourceImageId)).toBeUndefined();
  });

  it('reports mismatch when checksum does not match the manifest reference', async () => {
    const manifest = createDemoSourceImageManifest();
    const entry = {
      ...manifest.entries[0]!,
      normalizedArtifactLinks: [
        {
          kind: 'normalized-png' as const,
          uri: 'normalized-png/demo-ready-lips.png',
          checksum: 'expected-checksum',
          width: 2,
          height: 2,
          format: 'png-image',
        },
      ],
    };
    const file = createTestFile(
      new Uint8Array([1, 2, 3, 4]),
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

    expect(validateArtifactBindingAgainstManifestReference({
      reference: entry.normalizedArtifactLinks[0]!,
      artifactKind: 'normalized-png',
      fileName: 'demo-ready-lips.png',
      fileSize: file.size,
      fileChecksum: binding.fileChecksum,
      width: 2,
      height: 2,
    }).valid).toBe(false);
    expect(binding.status).toBe('mismatch');
  });
});
