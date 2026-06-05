import { describe, expect, it } from 'vitest';
import {
  createUserAppShellViewModel,
  summarizeUserAppShellViewModel,
} from '../src/user-app';
import type { UserAppTemplatePackage } from '../src/templates/schema';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';
import { userAppEmptyTemplatePackageExample } from '../src/templates/examples/user-app-template-package-qa-fixtures.example';

describe('user app shell view model', () => {
  it('creates app-facing package, list, detail, region, tool, and step view models', () => {
    const viewModel = createUserAppShellViewModel({
      packageData: userAppMvpShellExamplePackage,
    });

    expect(viewModel.hasPackage).toBe(true);
    expect(viewModel.packageSummary.templateCount).toBe(2);
    expect(viewModel.templates).toHaveLength(2);
    expect(viewModel.selectedTemplate?.steps.length).toBeGreaterThanOrEqual(3);
    expect(viewModel.selectedTemplate?.regionInstructions.length).toBeGreaterThanOrEqual(3);
    expect(viewModel.selectedTemplate?.toolsAndProducts.requiredTools.length).toBeGreaterThan(0);
    expect(viewModel.compatibility.status).toBe('warning');
    expect(viewModel.compatibility.canEnterStepGuide).toBe(true);
    expect(summarizeUserAppShellViewModel(viewModel)).toContain('"localOnly":true');
    expect(JSON.stringify(viewModel)).not.toContain('blob:');
    expect(JSON.stringify(viewModel)).not.toContain('data:image/');
    expect(JSON.stringify(viewModel)).not.toContain('C:\\');
  });

  it('reports no package and empty package states', () => {
    const noPackage = createUserAppShellViewModel({ packageData: null });
    const emptyPackage = createUserAppShellViewModel({
      packageData: userAppEmptyTemplatePackageExample,
    });

    expect(noPackage.compatibility.status).toBe('empty');
    expect(noPackage.emptyStates).toContain('no-package');
    expect(emptyPackage.compatibility.status).toBe('blocked');
    expect(emptyPackage.emptyStates).toContain('package-no-templates');
    expect(emptyPackage.compatibility.canEnterStepGuide).toBe(false);
  });

  it('blocks runtime-only references before step guide entry', () => {
    const unsafePackage: UserAppTemplatePackage = {
      ...userAppMvpShellExamplePackage,
      templates: userAppMvpShellExamplePackage.templates.map((template, index) =>
        index === 0
          ? {
              ...template,
              safetyNotes: [
                ...template.safetyNotes,
                'blob:http://127.0.0.1/runtime-only',
                'C:\\Users\\operator\\source.png',
                'data:image/png;base64,unsafe',
              ],
            }
          : template,
      ),
    };

    const viewModel = createUserAppShellViewModel({ packageData: unsafePackage });

    expect(viewModel.compatibility.status).toBe('blocked');
    expect(viewModel.compatibility.canEnterStepGuide).toBe(false);
    expect(
      viewModel.compatibility.runtimeReferenceIssues.some((issue) =>
        issue.includes('object URL'),
      ),
    ).toBe(true);
    expect(
      viewModel.compatibility.runtimeReferenceIssues.some((issue) =>
        issue.includes('local absolute path'),
      ),
    ).toBe(true);
    expect(
      viewModel.compatibility.runtimeReferenceIssues.some((issue) =>
        issue.includes('image bytes'),
      ),
    ).toBe(true);
  });
});
