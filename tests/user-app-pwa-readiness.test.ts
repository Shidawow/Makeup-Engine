import { describe, expect, it } from 'vitest';
import {
  createUserAppPwaReadinessReport,
  summarizeUserAppPwaReadiness,
} from '../src/user-app';
import {
  userAppPwaBoundaryBlockedExampleReport,
  userAppPwaMissingManifestExampleReport,
  userAppPwaReadyExampleReport,
} from '../src/templates/examples';

describe('User App PWA readiness model', () => {
  it('creates a deterministic ready report for the lightweight PWA shell metadata', () => {
    const summary = JSON.parse(
      summarizeUserAppPwaReadiness(userAppPwaReadyExampleReport),
    ) as {
      status: string;
      localOnly: boolean;
      productionApp: boolean;
      usesServiceWorker: boolean;
      usesBackend: boolean;
      usesAnalytics: boolean;
      usesTraining: boolean;
    };

    expect(userAppPwaReadyExampleReport.schemaVersion).toBe('user-app-pwa-readiness-v0.1');
    expect(userAppPwaReadyExampleReport.status).toBe('ready');
    expect(userAppPwaReadyExampleReport.checks.map((check) => check.area)).toEqual(
      expect.arrayContaining(['manifest', 'metadata', 'icon', 'runtime_boundary', 'privacy_boundary']),
    );
    expect(summary.localOnly).toBe(true);
    expect(summary.productionApp).toBe(false);
    expect(summary.usesServiceWorker).toBe(false);
    expect(summary.usesBackend).toBe(false);
    expect(summary.usesAnalytics).toBe(false);
    expect(summary.usesTraining).toBe(false);
  });

  it('blocks missing manifest readiness', () => {
    expect(userAppPwaMissingManifestExampleReport.status).toBe('blocked');
    expect(userAppPwaMissingManifestExampleReport.issues.map((issue) => issue.area)).toContain(
      'manifest',
    );
  });

  it('guards against service worker, backend, analytics, push, and install tracking expansion', () => {
    const report = createUserAppPwaReadinessReport({
      boundaryFlags: {
        hasServiceWorker: true,
        hasOfflineCache: true,
        hasPushNotification: true,
        hasBackgroundSync: true,
        hasBackend: true,
        hasAnalytics: true,
        hasInstallTracking: true,
      },
    });

    expect(report.status).toBe('blocked');
    expect(report.issues.map((issue) => issue.message).join('\n')).toContain('service worker');
    expect(report.issues.map((issue) => issue.message).join('\n')).toContain('后端');
    expect(report.issues.map((issue) => issue.message).join('\n')).toContain('analytics');
    expect(userAppPwaBoundaryBlockedExampleReport.usesServiceWorker).toBe(false);
    expect(JSON.stringify(report)).not.toContain('blob:');
    expect(JSON.stringify(report)).not.toContain('data:image/');
  });
});
