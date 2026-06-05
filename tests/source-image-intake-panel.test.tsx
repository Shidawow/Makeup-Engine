import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  createDemoSourceImageManifest,
  SourceImageIntakePanel,
} from '../src/components/template-studio/source-image-intake-panel';

describe('SourceImageIntakePanel', () => {
  it('renders manifest import, ready entries, and quarantine guidance', () => {
    const html = renderToStaticMarkup(
      <SourceImageIntakePanel
        initialManifest={createDemoSourceImageManifest()}
        onSeedCreated={() => undefined}
      />,
    );

    expect(html).toContain('源图导入');
    expect(html).toContain('解析 manifest');
    expect(html).toContain('demo-ready-lips.png');
    expect(html).toContain('创建分析 Seed');
    expect(html).toContain('jpeg-pixel-decode-unsupported');
    expect(html).toContain('jpeg-pixel-decode-unsupported');
  });

  it('shows the CLI import command when no package is loaded', () => {
    const html = renderToStaticMarkup(
      <SourceImageIntakePanel onSeedCreated={() => undefined} />,
    );

    expect(html).toContain('import-source-images');
    expect(html).toContain('materialize-normalized-png');
  });
});
