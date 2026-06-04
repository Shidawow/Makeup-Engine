import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import {
  createUserAppReadinessReport,
  evaluateMobileQaReadiness,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('User App readiness flow', () => {
  it('derives readiness without mutating UserAppTemplatePackage', () => {
    const before = JSON.stringify(userAppMvpShellExamplePackage);
    const report = createUserAppReadinessReport({
      packageData: userAppMvpShellExamplePackage,
      mobileQaResult: evaluateMobileQaReadiness({
        hasPackage: true,
        templateCount: userAppMvpShellExamplePackage.templates.length,
        canEnterStepGuide: true,
      }),
    });
    const after = JSON.stringify(userAppMvpShellExamplePackage);

    expect(after).toBe(before);
    expect(report.localOnly).toBe(true);
    expect(report.usesBackend).toBe(false);
    expect(report.usesTraining).toBe(false);
  });

  it('keeps existing shell template flow visible while adding readiness QA entries', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} />,
    );

    expect(html).toContain('Soft Rose Daily Look');
    expect(html).toContain('Warm Bronze Evening Look');
    expect(html).toContain('0%');
    expect(html).toContain('App 就绪度');
  });
});
