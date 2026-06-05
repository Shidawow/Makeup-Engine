import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  createDemoSourceImageManifest,
  SourceImageIntakePanel,
} from '../src/components/template-studio/source-image-intake-panel';
import {
  createTemplateAnalysisSeedFromEntry,
  loadTemplateAnalysisSeedImageData,
} from '../src/templates/storage';

describe('SourceImageIntakePanel artifact binding flow', () => {
  it('exposes binding before source-image seed analysis', () => {
    const html = renderToStaticMarkup(
      <SourceImageIntakePanel
        initialManifest={createDemoSourceImageManifest()}
        onSeedCreated={() => undefined}
      />,
    );

    expect(html).toContain('Artifact 绑定');
    expect(html).toContain('绑定文件');
    expect(html).toContain('object URL');
  });

  it('does not treat a local manifest artifact path as browser-readable', () => {
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
    const seedImageData = loadTemplateAnalysisSeedImageData(seed);

    expect(seed.readiness).toBe('blocked_by_missing_artifact');
    expect(seedImageData.canRunBrowserAnalysis).toBe(false);
  });
});

