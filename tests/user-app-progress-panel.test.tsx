import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppProgressPanel } from '../src/components/user-app';
import {
  createInitialTemplateProgress,
  markStepComplete,
  markStepSkipped,
  resetTemplateProgress,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('UserAppProgressPanel', () => {
  it('renders complete, skipped, reset-ready local progress state', () => {
    const template = userAppMvpShellExamplePackage.templates[0];
    const initial = createInitialTemplateProgress({ template });
    const completed = markStepComplete(initial, initial.orderedStepIds[0]);
    const skipped = markStepSkipped(completed, completed.orderedStepIds[1]);
    const reset = resetTemplateProgress(skipped);
    const html = renderToStaticMarkup(
      <UserAppProgressPanel
        onReset={() => undefined}
        progress={skipped}
        totalSteps={template.steps.length}
      />,
    );

    expect(skipped.completedStepIds).toHaveLength(1);
    expect(skipped.skippedStepIds).toHaveLength(1);
    expect(reset.completedStepIds).toHaveLength(0);
    expect(reset.skippedStepIds).toHaveLength(0);
    expect(html).toContain('本地跟练进度');
    expect(html).toContain('2');
    expect(html).toContain('1');
    expect(html.length).toBeGreaterThan(0);
  });
});
