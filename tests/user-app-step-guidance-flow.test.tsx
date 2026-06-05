import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppShell } from '../src/components/user-app';
import {
  completeCurrentUserAppStep,
  createInitialUserAppState,
  startUserAppStepGuide,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';
import { userAppGuidanceUxExamplePackage } from '../src/templates/examples/user-app-guidance-ux.example';

describe('user app step guidance flow', () => {
  it('starts local step guidance and advances progress for a ready package', () => {
    const template = userAppMvpShellExamplePackage.templates[0];
    const started = startUserAppStepGuide(
      createInitialUserAppState(),
      userAppMvpShellExamplePackage,
      template.appTemplateId,
    );
    const firstStepId = started.progressByTemplateId[template.appTemplateId]?.currentStepId;
    const completed = firstStepId
      ? completeCurrentUserAppStep(started, template.appTemplateId, firstStepId)
      : started;

    expect(started.navigation.currentScreen).toBe('step-guide');
    expect(firstStepId).toBe(template.steps[0].stepId);
    expect(completed.progressByTemplateId[template.appTemplateId]?.completedStepIds).toContain(
      firstStepId,
    );
  });

  it('renders warning state without blocking all shell content', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppGuidanceUxExamplePackage} />,
    );

    expect(html).toContain('UserAppTemplatePackage');
    expect(html).toContain('暂时不能指导');
    expect(html).toContain('妆容模板');
    expect(html.length).toBeGreaterThan(0);
  });
});
