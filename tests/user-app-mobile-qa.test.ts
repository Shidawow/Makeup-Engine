import { describe, expect, it } from 'vitest';
import {
  createMobileQaChecklist,
  evaluateMobileQaReadiness,
  summarizeMobileQaIssues,
} from '../src/user-app';

describe('User App mobile QA model', () => {
  it('creates deterministic viewport and interaction checks', () => {
    const result = evaluateMobileQaReadiness({
      hasPackage: true,
      templateCount: 2,
      canEnterStepGuide: true,
    });

    expect(result.schemaVersion).toBe('user-app-mobile-qa-v0.1');
    expect(result.status).toBe('passed');
    expect(result.viewportProfiles.map((viewport) => viewport.width)).toEqual([
      375,
      390,
      414,
      768,
    ]);
    expect(result.requiresBrowserAutomation).toBe(false);
    expect(result.usesExternalApi).toBe(false);
  });

  it('reports warning issues without blocking the whole checklist', () => {
    const checks = createMobileQaChecklist({
      hasPackage: true,
      templateCount: 1,
      canEnterStepGuide: true,
      hasLargeTapTargets: false,
      hasRecoveryNotice: false,
    });
    const issues = summarizeMobileQaIssues(checks);

    expect(issues.map((issue) => issue.severity)).toContain('warning');
    expect(issues.some((issue) => issue.severity === 'blocking')).toBe(false);
  });

  it('blocks when privacy copy is missing', () => {
    const result = evaluateMobileQaReadiness({
      hasPackage: true,
      templateCount: 1,
      canEnterStepGuide: true,
      hasPrivacyCopy: false,
    });

    expect(result.status).toBe('blocked');
    expect(result.issues.map((issue) => issue.area)).toContain('privacy');
  });
});
