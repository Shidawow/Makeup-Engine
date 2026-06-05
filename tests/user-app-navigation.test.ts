import { describe, expect, it } from 'vitest';
import {
  createInitialUserAppNavigation,
  navigateBack,
  navigateToStepGuide,
  navigateToTemplateDetail,
  navigateToTemplateList,
  navigateToTools,
  summarizeNavigationState,
} from '../src/user-app';

describe('user app navigation model', () => {
  it('moves through local shell screens without a router', () => {
    const initial = createInitialUserAppNavigation();
    const list = navigateToTemplateList(initial);
    const detail = navigateToTemplateDetail(list, 'template-a');
    const stepGuide = navigateToStepGuide(detail, {
      templateId: 'template-a',
      stepId: 'step-1',
      canEnterStepGuide: true,
    });
    const tools = navigateToTools(stepGuide);
    const back = navigateBack(tools);

    expect(initial.currentScreen).toBe('home');
    expect(stepGuide.currentScreen).toBe('step-guide');
    expect(stepGuide.selectedStepId).toBe('step-1');
    expect(tools.currentScreen).toBe('tools');
    expect(back.currentScreen).toBe('step-guide');
    expect(summarizeNavigationState(back)).toContain('"currentScreen":"step-guide"');
  });

  it('redirects blocked step guide attempts to compatibility', () => {
    const detail = navigateToTemplateDetail(
      createInitialUserAppNavigation(),
      'template-a',
    );
    const blocked = navigateToStepGuide(detail, {
      templateId: 'template-a',
      canEnterStepGuide: false,
    });

    expect(blocked.currentScreen).toBe('compatibility');
  });
});
