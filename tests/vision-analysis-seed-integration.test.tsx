import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { VisionAnalysisDemo } from '../src/components/demo/vision-analysis-demo/VisionAnalysisDemo';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import { createTemplateAnalysisSeedFromEntry } from '../src/templates/storage';

describe('VisionAnalysisDemo source image seed integration', () => {
  it('renders seed source information and seed analysis action', () => {
    const manifest = createDemoSourceImageManifest();
    const seed = createTemplateAnalysisSeedFromEntry(manifest, manifest.entries[0]!);
    const html = renderToStaticMarkup(
      <VisionAnalysisDemo templateAnalysisSeed={seed} />,
    );

    expect(html).toContain('Source Image Seed');
    expect(html).toContain('demo-ready-lips.png');
    expect(html).toContain('Source Image Seed');
    expect(html).toContain('不会绕过人工修正');
  });
});
