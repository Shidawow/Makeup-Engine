import { describe, expect, it } from 'vitest';
import {
  clearPreferencesFromSession,
  clearTemplateProgressFromSession,
  completeCurrentUserAppStep,
  createInitialUserAppState,
  createInitialUserAppSession,
  createSessionFromAppState,
  resetUserAppSession,
  selectUserAppTemplate,
  startUserAppStepGuide,
  summarizeUserAppSession,
  validateUserAppSession,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

describe('user app session model', () => {
  it('creates and summarizes a local-only versioned session', () => {
    const session = createInitialUserAppSession();
    const summary = summarizeUserAppSession(session);

    expect(summary.schemaVersion).toBe('user-app-session-v0.1');
    expect(summary.scope).toBe('local-persistence');
    expect(session.localOnly).toBe(true);
    expect(session.writesTrainingInput).toBe(false);
    expect(session.modifiesTemplatePackage).toBe(false);
    expect(session.storesRecommendationResults).toBe(false);
    expect(validateUserAppSession(session)).toEqual([]);
  });

  it('creates a session from shell state without mutating the template package', () => {
    const template = userAppMvpShellExamplePackage.templates[0];
    let appState = createInitialUserAppState();
    appState = selectUserAppTemplate(appState, template.appTemplateId);
    appState = startUserAppStepGuide(
      appState,
      userAppMvpShellExamplePackage,
      template.appTemplateId,
    );
    appState = completeCurrentUserAppStep(
      appState,
      template.appTemplateId,
      template.steps[0].stepId,
    );
    const before = JSON.stringify(userAppMvpShellExamplePackage);
    const session = createSessionFromAppState({
      appState,
      lastVisitedSection: 'session',
    });

    expect(session.selectedTemplateId).toBe(template.appTemplateId);
    expect(session.templateProgress?.completedStepIds).toContain(template.steps[0].stepId);
    expect(validateUserAppSession(session, userAppMvpShellExamplePackage)).toEqual([]);
    expect(JSON.stringify(userAppMvpShellExamplePackage)).toBe(before);
  });

  it('clears template progress, preferences, and full session deterministically', () => {
    const session = createInitialUserAppSession({
      selectedTemplateId: 'template-1',
      activeStepId: 'step-1',
      templateProgress: {
        templateId: 'template-1',
        activeStepId: 'step-1',
        orderedStepIds: ['step-1'],
        completedStepIds: ['step-1'],
        skippedStepIds: [],
        progressPercent: 100,
      },
    });

    expect(clearTemplateProgressFromSession(session).templateProgress).toBeUndefined();
    expect(clearPreferencesFromSession(session).localPreferences.preferenceId).toBe(
      'local-preferences-default',
    );
    expect(resetUserAppSession().status).toBe('reset');
  });
});
