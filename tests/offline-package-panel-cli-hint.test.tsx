import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { OfflinePackagePanel } from '../src/components/template-studio/offline-package-panel';

const noop = () => undefined;

describe('OfflinePackagePanel CLI hint', () => {
  it('shows the materialization CLI handoff in developer mode', () => {
    const html = renderToStaticMarkup(
      <OfflinePackagePanel
        developerMode
        onCopySummary={noop}
        onCreatePackage={noop}
        onExportAuditReportJson={noop}
        onExportManifestJson={noop}
        onExportPackageJson={noop}
        onValidatePackage={noop}
        rawJson=""
        trainingPackage={null}
      />,
    );

    expect(html).toContain('导出 offline package');
    expect(html).toContain('build-training-dataset');
    expect(html).toContain('node scripts/build-training-dataset.mjs');
  });
});
