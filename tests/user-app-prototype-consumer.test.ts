import { describe, expect, it } from 'vitest';
import {
  createPrototypeTemplateDetailViewModel,
  loadUserAppTemplatePackageForPrototype,
  summarizePrototypeConsumer,
  validatePrototypePackageRoundTrip,
  validatePrototypeConsumerReadiness,
} from '../src/template-engine/app-contract';
import type { UserAppTemplatePackage } from '../src/templates/schema';
import { userAppTemplatePackageExample } from '../src/templates/examples/user-app-template-package.example';
import {
  userAppEmptyTemplatePackageExample,
  userAppMultiTemplatePackageExample,
} from '../src/templates/examples/user-app-template-package-qa-fixtures.example';

describe('user app prototype consumer view models', () => {
  it('loads a read-only prototype view model from a UserAppTemplatePackage', () => {
    const viewModel = loadUserAppTemplatePackageForPrototype({
      packageData: userAppTemplatePackageExample,
    });

    expect(viewModel.packageId).toBe(userAppTemplatePackageExample.packageId);
    expect(viewModel.validationPanel.status).toBe('ready');
    expect(viewModel.templateCount).toBe(1);
    expect(viewModel.totalSteps).toBe(4);
    expect(viewModel.selectedTemplate?.steps.map((step) => step.region)).toEqual([
      'brows',
      'eyeshadow',
      'blush',
      'lips',
    ]);
    expect(viewModel.selectedTemplate?.toolProductSummary.productCount).toBe(2);
    expect(JSON.stringify(viewModel)).not.toContain('blob:');
    expect(JSON.stringify(viewModel)).not.toContain('data:image/');
    expect(JSON.stringify(viewModel)).not.toContain('C:\\');
  });

  it('creates deterministic template detail guidance, regions, tools, and lineage', () => {
    const detail = createPrototypeTemplateDetailViewModel(
      userAppTemplatePackageExample.templates[0],
    );

    expect(detail.title).toBe('Soft Rose Daily Look');
    expect(detail.steps.map((step) => step.order)).toEqual([1, 2, 3, 4]);
    expect(detail.regionInstructions).toHaveLength(4);
    expect(detail.toolProductSummary.requiredToolCount).toBe(2);
    expect(detail.lineageSummary.localOnly).toBe(true);
    expect(detail.lineageSummary.onlinePublished).toBe(false);
  });

  it('loads multi-template packages and falls back from missing selected templates', () => {
    const viewModel = loadUserAppTemplatePackageForPrototype({
      packageData: userAppMultiTemplatePackageExample,
      selectedTemplateId: 'missing-template-id',
    });

    expect(viewModel.templateCount).toBe(2);
    expect(viewModel.templates.map((template) => template.appTemplateId)).toEqual([
      'user-app-template-soft-rose-example',
      'user-app-template-warm-bronze-example',
    ]);
    expect(viewModel.selection.fallbackApplied).toBe(true);
    expect(viewModel.selectedTemplate?.appTemplateId).toBe(
      'user-app-template-soft-rose-example',
    );
    expect(viewModel.validationPanel.status).toBe('warning');
    expect(viewModel.validationPanel.warningCount).toBeGreaterThan(0);
  });

  it('reports empty package and empty template states', () => {
    const emptyPackageViewModel = loadUserAppTemplatePackageForPrototype({
      packageData: userAppEmptyTemplatePackageExample,
    });
    const emptyTemplatePackage: UserAppTemplatePackage = {
      ...userAppTemplatePackageExample,
      packageId: 'user-app-template-package-empty-template-v0',
      templates: [
        {
          ...userAppTemplatePackageExample.templates[0],
          appTemplateId: 'user-app-template-empty-template',
          requiredTools: [],
          optionalTools: [],
          productSuggestions: [],
          steps: [],
          regionInstructions: [],
          compatibility: {
            ...userAppTemplatePackageExample.templates[0].compatibility,
            warnings: [],
          },
        },
      ],
      summary: {
        ...userAppTemplatePackageExample.summary,
        totalSteps: 0,
        totalRegionInstructions: 0,
      },
    };
    const emptyTemplateViewModel = loadUserAppTemplatePackageForPrototype({
      packageData: emptyTemplatePackage,
    });

    expect(emptyPackageViewModel.validationPanel.status).toBe('blocked');
    expect(emptyPackageViewModel.selectedTemplate).toBeNull();
    expect(
      emptyPackageViewModel.validationPanel.emptyStates.some(
        (state) => state.stateId === 'package-no-templates',
      ),
    ).toBe(true);

    expect(emptyTemplateViewModel.selectedTemplate?.emptyStates.map((state) => state.stateId)).toEqual(
      expect.arrayContaining([
        'template-no-steps',
        'template-no-region-instructions',
        'template-no-tools',
        'template-no-product-suggestions',
      ]),
    );
    expect(emptyTemplateViewModel.validationPanel.status).toBe('blocked');
    expect(emptyTemplateViewModel.validationPanel.warnings).toEqual(
      expect.arrayContaining([
        'template has no required tools',
        'template has no product suggestions',
      ]),
    );
  });

  it('validates blocked and warning compatibility cases', () => {
    const firstTemplate = userAppTemplatePackageExample.templates[0];
    const invalidStepOrderPackage: UserAppTemplatePackage = {
      ...userAppTemplatePackageExample,
      packageId: 'user-app-template-package-invalid-order',
      templates: [
        {
          ...firstTemplate,
          steps: [
            { ...firstTemplate.steps[1], order: 2 },
            { ...firstTemplate.steps[0], order: 1 },
            ...firstTemplate.steps.slice(2),
          ],
        },
      ],
    };
    const missingRegionPackage: UserAppTemplatePackage = {
      ...userAppTemplatePackageExample,
      packageId: 'user-app-template-package-missing-region',
      templates: [
        {
          ...firstTemplate,
          regionInstructions: firstTemplate.regionInstructions.filter(
            (instruction) => instruction.regionType !== 'lips',
          ),
        },
      ],
    };
    const unknownTargetPackage: UserAppTemplatePackage = {
      ...userAppTemplatePackageExample,
      packageId: 'user-app-template-package-unknown-target',
      compatibilityTarget: 'unknown',
      compatibility: {
        ...userAppTemplatePackageExample.compatibility,
        target: 'unknown',
      },
    };

    expect(validatePrototypeConsumerReadiness(invalidStepOrderPackage).blockingIssues).toEqual(
      expect.arrayContaining(['step app-step-eyeshadow-example is not in deterministic order']),
    );
    expect(validatePrototypeConsumerReadiness(missingRegionPackage).blockingIssues).toEqual(
      expect.arrayContaining([
        'step app-step-lips-example missing matching region instruction for lips',
      ]),
    );
    expect(validatePrototypeConsumerReadiness(unknownTargetPackage).blockingIssues).toEqual(
      expect.arrayContaining(['compatibility target is unknown']),
    );
  });

  it('blocks prototype readiness when runtime-only references are present', () => {
    const firstTemplate = userAppTemplatePackageExample.templates[0];
    const firstStep = firstTemplate.steps[0];
    const packageWithObjectUrl: UserAppTemplatePackage = {
      ...userAppTemplatePackageExample,
      packageId: 'user-app-template-package-with-runtime-url',
      templates: [
        {
          ...firstTemplate,
          steps: [
            {
              ...firstStep,
              visualReference: {
                referenceId: 'blob:http://127.0.0.1/runtime-only',
                referenceKind: 'artifact-reference',
                description: 'runtime-only browser object URL',
              },
            },
            ...firstTemplate.steps.slice(1),
          ],
        },
      ],
    };

    const readiness = validatePrototypeConsumerReadiness(packageWithObjectUrl);

    expect(readiness.status).toBe('blocked');
    expect(readiness.valid).toBe(false);
    expect(readiness.runtimeReferenceIssues.some((issue) => issue.includes('object URL'))).toBe(
      true,
    );
    expect(summarizePrototypeConsumer(packageWithObjectUrl)).toContain('"status":"blocked"');
  });

  it('round-trips package JSON and preserves prototype readiness', () => {
    const report = validatePrototypePackageRoundTrip(userAppMultiTemplatePackageExample);

    expect(report.packageId).toBe(userAppMultiTemplatePackageExample.packageId);
    expect(report.parsedTemplateCount).toBe(2);
    expect(report.stable).toBe(true);
    expect(report.beforeStatus).toBe('warning');
    expect(report.afterStatus).toBe('warning');
    expect(report.runtimeReferenceIssues).toHaveLength(0);
  });
});
