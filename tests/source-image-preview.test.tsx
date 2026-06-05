import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import { SourceImagePreview } from '../src/components/template-studio/source-image-preview';
import { createTemplateAnalysisSeedFromEntry } from '../src/templates/storage';

describe('SourceImagePreview', () => {
  it('renders a browser-readable normalized PNG preview when available', () => {
    const manifest = createDemoSourceImageManifest();
    const seed = createTemplateAnalysisSeedFromEntry(manifest, manifest.entries[0]!);
    const html = renderToStaticMarkup(<SourceImagePreview seed={seed} />);

    expect(html).toContain('源图预览');
    expect(html).toContain('data:image/png');
    expect(html).toContain('demo-ready-lips.png');
  });

  it('shows a local path boundary warning when preview is not browser-readable', () => {
    const manifest = createDemoSourceImageManifest();
    const html = renderToStaticMarkup(
      <SourceImagePreview entry={manifest.entries[1]!} />,
    );

    expect(html).toContain('不能由浏览器直接预览');
    expect(html).toContain('artifact');
  });
});
