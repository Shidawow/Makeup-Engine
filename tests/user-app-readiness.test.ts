import { describe, expect, it } from 'vitest';
import {
  createUserAppReadinessReport,
  summarizeUserAppReadiness,
  validateUserAppReadinessBoundary,
} from '../src/user-app';
import {
  userAppBlockedReadinessExampleReport,
  userAppMvpShellExamplePackage,
  userAppReadinessExampleReport,
} from '../src/templates/examples';

describe('User App readiness gate model', () => {
  it('creates a deterministic local-only readiness report', () => {
    const report = createUserAppReadinessReport({
      packageData: userAppMvpShellExamplePackage,
    });
    const summary = JSON.parse(summarizeUserAppReadiness(report)) as {
      localOnly: boolean;
      productionApp: boolean;
      usesBackend: boolean;
      usesCamera: boolean;
      usesTraining: boolean;
    };

    expect(report.schemaVersion).toBe('user-app-readiness-v0.1');
    expect(report.checks.map((check) => check.area)).toEqual(
      expect.arrayContaining([
        'template_package',
        'step_guidance',
        'onboarding',
        'preferences',
        'discovery',
        'session_persistence',
        'privacy',
        'mobile_interaction',
        'empty_state',
        'blocked_state',
      ]),
    );
    expect(summary.localOnly).toBe(true);
    expect(summary.productionApp).toBe(false);
    expect(summary.usesBackend).toBe(false);
    expect(summary.usesCamera).toBe(false);
    expect(summary.usesTraining).toBe(false);
  });

  it('blocks when no UserAppTemplatePackage is loaded', () => {
    expect(userAppBlockedReadinessExampleReport.status).toBe('blocked');
    expect(userAppBlockedReadinessExampleReport.issues.map((issue) => issue.area)).toContain(
      'template_package',
    );
  });

  it('keeps the example report deterministic and free of runtime references', () => {
    const serialized = JSON.stringify(userAppReadinessExampleReport);

    expect(serialized).toContain('user-app-readiness-v0.1');
    expect(serialized).not.toContain('blob:');
    expect(serialized).not.toContain('data:image/');
    expect(serialized).not.toContain('C:\\');
  });

  it('rejects unsafe readiness boundary input', () => {
    const issues = validateUserAppReadinessBoundary({
      objectUrl: 'blob:http://localhost/photo',
      trainingInput: true,
    });

    expect(issues.map((issue) => issue.area)).toContain('privacy');
    expect(issues.every((issue) => issue.severity === 'blocking')).toBe(true);
  });
});
