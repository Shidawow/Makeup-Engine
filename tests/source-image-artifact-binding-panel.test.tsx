import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import { SourceImageArtifactBindingPanel } from '../src/components/template-studio/source-image-artifact-binding-panel';

describe('SourceImageArtifactBindingPanel', () => {
  it('renders manifest references and binding guidance', () => {
    const manifest = createDemoSourceImageManifest();
    const html = renderToStaticMarkup(
      <SourceImageArtifactBindingPanel
        bindings={{}}
        entry={manifest.entries[0]!}
        onBindingsChange={() => undefined}
        sourceImagePackageId={manifest.packageId}
      />,
    );

    expect(html).toContain('Artifact');
    expect(html).toContain('manifest');
    expect(html).toContain('reference');
    expect(html).toContain('training dataset');
  });
});
