import { describe, expect, it } from 'vitest';
import {
  createUserAppMvpPolishReport,
  summarizeUserAppMvpPolish,
} from '../src/user-app';
import {
  userAppMvpPolishMissingManifestExampleReport,
  userAppMvpPolishReadyExampleReport,
  userAppMvpPolishUserCopyWarningExampleReport,
} from '../src/templates/examples';

describe('User App MVP polish readiness model', () => {
  it('creates a ready local-only Phase 8B polish report', () => {
    const summary = JSON.parse(
      summarizeUserAppMvpPolish(userAppMvpPolishReadyExampleReport),
    ) as {
      status: string;
      pwaStatus: string;
      localOnly: boolean;
      productionApp: boolean;
      userFacingApp: boolean;
      usesBackend: boolean;
      usesCamera: boolean;
      usesAr: boolean;
      usesTraining: boolean;
      usesAnalytics: boolean;
    };

    expect(userAppMvpPolishReadyExampleReport.schemaVersion).toBe('user-app-mvp-polish-v0.1');
    expect(userAppMvpPolishReadyExampleReport.checks.map((check) => check.area)).toEqual(
      expect.arrayContaining([
        'mobile_home',
        'step_guide',
        'pwa_manifest',
        'privacy_copy',
        'user_copy',
        'admin_qa_separation',
        'local_only_boundary',
      ]),
    );
    expect(summary.status).toBe('ready');
    expect(summary.pwaStatus).toBe('ready');
    expect(summary.localOnly).toBe(true);
    expect(summary.productionApp).toBe(false);
    expect(summary.userFacingApp).toBe(false);
    expect(summary.usesBackend).toBe(false);
    expect(summary.usesCamera).toBe(false);
    expect(summary.usesAr).toBe(false);
    expect(summary.usesTraining).toBe(false);
    expect(summary.usesAnalytics).toBe(false);
  });

  it('blocks when the PWA manifest readiness is blocked', () => {
    expect(userAppMvpPolishMissingManifestExampleReport.status).toBe('blocked');
    expect(userAppMvpPolishMissingManifestExampleReport.issues.map((issue) => issue.area)).toContain(
      'pwa_manifest',
    );
  });

  it('warns when ordinary user copy exposes internal technical terms', () => {
    expect(userAppMvpPolishUserCopyWarningExampleReport.status).toBe('warning');
    expect(userAppMvpPolishUserCopyWarningExampleReport.issues.map((issue) => issue.area)).toContain(
      'user_copy',
    );

    const report = createUserAppMvpPolishReport({
      hidesInternalTermsFromUserPath: false,
      userPathInternalTerms: ['contract', 'schema', 'readiness gate'],
    });
    expect(report.issues.map((issue) => issue.message).join('\n')).toContain('contract');
  });
});
