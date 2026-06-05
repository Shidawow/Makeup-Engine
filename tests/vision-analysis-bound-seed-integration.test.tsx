import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { VisionAnalysisDemo } from '../src/components/demo/vision-analysis-demo/VisionAnalysisDemo';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import type { TemplateAnalysisSeed } from '../src/templates/schema';
import { createTemplateAnalysisSeedFromEntry } from '../src/templates/storage';

describe('VisionAnalysisDemo bound seed integration', () => {
  it('enables source seed analysis only when a browser-readable bound artifact is present', () => {
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
    const baseSeed = createTemplateAnalysisSeedFromEntry(manifest, entry);
    const seed: TemplateAnalysisSeed = {
      ...baseSeed,
      readiness: 'ready_for_vision_analysis',
      artifactBindingId: 'binding-demo-ready-lips',
      browserPreviewUrl: 'blob:demo-ready-lips',
      boundArtifactResource: {
        resourceId: 'resource-demo-ready-lips',
        artifactKind: 'normalized-png',
        browserResourceKind: 'object-url',
        browserReadable: true,
        summaryOnly: false,
        objectUrl: 'blob:demo-ready-lips',
        previewUrl: 'blob:demo-ready-lips',
      },
    };
    const html = renderToStaticMarkup(<VisionAnalysisDemo templateAnalysisSeed={seed} />);

    expect(html).toContain('Source Image Seed');
    expect(html).toContain('ready_for_vision_analysis');
    expect(html).toContain('Source Image Seed');
    expect(html).toContain('type="button"');
  });
});
