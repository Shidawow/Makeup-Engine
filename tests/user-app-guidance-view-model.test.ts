import { describe, expect, it } from 'vitest';
import { createUserAppShellViewModel } from '../src/user-app';
import { userAppGuidanceUxExamplePackage } from '../src/templates/examples/user-app-guidance-ux.example';

describe('user app guidance view model', () => {
  it('creates user-facing guidance fields for the current step', () => {
    const viewModel = createUserAppShellViewModel({
      packageData: userAppGuidanceUxExamplePackage,
      selectedTemplateId: 'user-app-template-soft-rose-example',
    });
    const step = viewModel.selectedTemplate?.currentStep;

    expect(step?.guidance.progressLabel.length).toBeGreaterThan(0);
    expect(step?.guidance.stepCategory.length).toBeGreaterThan(0);
    expect(step?.guidance.userFriendlyInstructionText).not.toContain('instructionText');
    expect(step?.guidance.shortInstructionSummary.length).toBeGreaterThan(0);
    expect(step?.guidance.detailedInstruction).toContain('强度建议');
    expect(step?.guidance.regionGuidanceSummary.length).toBeGreaterThan(0);
    expect(step?.guidance.nextAction).toContain('完成');
    expect(JSON.stringify(viewModel)).not.toContain('blob:');
    expect(JSON.stringify(viewModel)).not.toContain('data:image/');
    expect(JSON.stringify(viewModel)).not.toContain('C:\\');
  });

  it('reports blocked guidance for missing region and instruction', () => {
    const viewModel = createUserAppShellViewModel({
      packageData: userAppGuidanceUxExamplePackage,
      selectedTemplateId: 'user-app-guidance-missing-region',
    });
    const step = viewModel.selectedTemplate?.currentStep;

    expect(viewModel.selectedTemplate?.status).toBe('blocked');
    expect(step?.guidance.blockedReason).toContain('缺少具体操作说明');
    expect(step?.guidance.emptyStates).toEqual(
      expect.arrayContaining(['step-missing-instruction', 'step-missing-region']),
    );
  });
});
