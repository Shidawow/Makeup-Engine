import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { OfflinePackagePanel } from '../src/components/template-studio/offline-package-panel';
import { createOfflineTrainingPackage } from '../src/templates/storage/offlineTrainingPackage';
import { offlinePackageFixture } from './offline-package-fixtures';

const noop = () => undefined;

describe('OfflinePackagePanel', () => {
  it('renders package summary, validation, export, audit, CLI, and developer JSON controls', () => {
    const { dataset, manifest, queue } = offlinePackageFixture();
    const trainingPackage = createOfflineTrainingPackage({
      dataset,
      trainingManifest: manifest,
      reviewQueue: queue,
    });
    const html = renderToStaticMarkup(
      <OfflinePackagePanel
        developerMode
        onCopySummary={noop}
        onCreatePackage={noop}
        onExportAuditReportJson={noop}
        onExportManifestJson={noop}
        onExportPackageJson={noop}
        onValidatePackage={noop}
        rawJson="offline-package-json"
        trainingPackage={trainingPackage}
      />,
    );

    expect(html).toContain(trainingPackage.packageId);
    expect(html).toContain('offline-package-json');
    expect(html).toContain('CLI');
    expect(html).toContain('Package');
    expect(html).toContain('JSON');
    expect(html).toContain('JSON');
    expect(html).toContain('JSON');
    expect(html).toContain(trainingPackage.packageId);
  });
});
