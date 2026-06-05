import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import { SourceImagePreview } from '../src/components/template-studio/source-image-preview';
import type { SourceImageArtifactBinding } from '../src/templates/schema';

describe('SourceImagePreview bound artifact', () => {
  it('prefers a bound normalized png object URL over manifest paths', () => {
    const manifest = createDemoSourceImageManifest();
    const binding: SourceImageArtifactBinding = {
      schemaVersion: 'source-image-artifact-binding-v0.1',
      bindingId: 'binding-preview',
      sourceImageId: manifest.entries[0]!.sourceImageId,
      sourceImagePackageId: manifest.packageId,
      manifestArtifactReference: 'normalized-png/demo-ready-lips.png',
      artifactKind: 'normalized-png',
      originalReferencePath: 'normalized-png/demo-ready-lips.png',
      browserResourceKind: 'object-url',
      browserResource: {
        resourceId: 'resource-preview',
        artifactKind: 'normalized-png',
        browserResourceKind: 'object-url',
        browserReadable: true,
        summaryOnly: false,
        objectUrl: 'blob:bound-normalized-png',
        previewUrl: 'blob:bound-normalized-png',
      },
      objectUrl: 'blob:bound-normalized-png',
      fileName: 'demo-ready-lips.png',
      fileSize: 32,
      fileChecksum: 'checksum',
      width: 2,
      height: 2,
      colorSpace: 'srgb',
      channels: 4,
      status: 'validated',
      issues: [],
      createdAt: '2026-05-31T00:00:00.000Z',
    };
    const html = renderToStaticMarkup(
      <SourceImagePreview binding={binding} entry={manifest.entries[0]!} />,
    );

    expect(html).toContain('blob:bound-normalized-png');
    expect(html).toContain('绑定状态：validated');
    expect(html).toContain('object URL');
  });
});

