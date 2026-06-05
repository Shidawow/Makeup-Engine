import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TrainingAdapterPanel } from '../src/components/template-studio/training-adapter-panel';

const noop = () => undefined;

describe('TrainingAdapterPanel runtime hint', () => {
  it('shows Phase 6B preflight and run package guidance', () => {
    const html = renderToStaticMarkup(
      <TrainingAdapterPanel
        manifest={null}
        onCopySummary={noop}
        onExportManifest={noop}
        onExportTest={noop}
        onExportTrain={noop}
        onExportValidation={noop}
      />,
    );

    expect(html).toContain('MaterializedTrainingDataset');
    expect(html).toContain('training run package');
    expect(html).toContain('--export-model-manifest');
  });
});
