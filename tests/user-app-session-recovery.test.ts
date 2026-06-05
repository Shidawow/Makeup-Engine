import { describe, expect, it } from 'vitest';
import {
  recoverUserAppSession,
  reconcileSessionWithTemplatePackage,
} from '../src/user-app';
import {
  invalidSelectedTemplateSessionExample,
  invalidStepProgressSessionExample,
  partiallyCompletedTemplateSessionExample,
  userAppMvpShellExamplePackage,
  userAppTemplateDiscoveryExamplePackage,
  versionMismatchSessionExample,
} from '../src/templates/examples';

describe('user app session recovery', () => {
  it('falls back when selected template no longer exists', () => {
    const report = reconcileSessionWithTemplatePackage({
      session: invalidSelectedTemplateSessionExample,
      packageData: userAppMvpShellExamplePackage,
    });

    expect(report.status).toBe('partially_restored');
    expect(report.restoredSelectedTemplateId).toBe(
      userAppMvpShellExamplePackage.templates[0].appTemplateId,
    );
    expect(report.warnings.some((warning) => warning.code === 'selected_template_fallback')).toBe(
      true,
    );
  });

  it('reconciles stale active, completed, and skipped step ids', () => {
    const report = reconcileSessionWithTemplatePackage({
      session: invalidStepProgressSessionExample,
      packageData: userAppTemplateDiscoveryExamplePackage,
    });

    expect(report.session.templateProgress?.completedStepIds).not.toContain(
      'stale-completed-step',
    );
    expect(report.session.templateProgress?.skippedStepIds).not.toContain(
      'stale-skipped-step',
    );
    expect(report.warnings.map((warning) => warning.code)).toEqual(
      expect.arrayContaining([
        'active_step_fallback',
        'stale_completed_steps_removed',
        'stale_skipped_steps_removed',
      ]),
    );
  });

  it('does not restore step guide when the package is blocked', () => {
    const report = recoverUserAppSession({
      session: partiallyCompletedTemplateSessionExample,
      packageData: userAppTemplateDiscoveryExamplePackage,
    });

    expect(report.status).toBe('blocked');
    expect(report.canRestoreStepGuide).toBe(false);
    expect(report.restoredActiveStepId).toBeUndefined();
    expect(report.warnings.some((warning) => warning.code === 'package_blocked_step_guide_disabled')).toBe(
      true,
    );
  });

  it('resets safely on version mismatch without modifying package data', () => {
    const before = JSON.stringify(userAppMvpShellExamplePackage);
    const report = recoverUserAppSession({
      session: versionMismatchSessionExample as typeof partiallyCompletedTemplateSessionExample,
      packageData: userAppMvpShellExamplePackage,
    });

    expect(report.status).toBe('reset');
    expect(report.canRestoreStepGuide).toBe(false);
    expect(JSON.stringify(userAppMvpShellExamplePackage)).toBe(before);
  });
});
