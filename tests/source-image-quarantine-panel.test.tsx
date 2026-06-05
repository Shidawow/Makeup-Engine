import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import { SourceImageQuarantinePanel } from '../src/components/template-studio/source-image-quarantine-panel';

describe('SourceImageQuarantinePanel', () => {
  it('groups blocked source images by quarantine reason', () => {
    const html = renderToStaticMarkup(
      <SourceImageQuarantinePanel manifest={createDemoSourceImageManifest()} />,
    );

    expect(html).toContain('demo-blocked.jpg');
    expect(html).toContain('demo-blocked.jpg');
    expect(html).toContain('codec-blocked');
    expect(html).toContain('source-image-not-decoded');
  });
});
