import { describe, expect, it } from 'vitest';
import {
  applyPlaceholderPersonalizationToGuidance,
  createDefaultUserPersonalizationPlaceholder,
  createPersonalizedGuidancePreview,
  mapPersonalizationToGuidanceHints,
  summarizeGuidanceWithoutUserPhoto,
  summarizeUserPersonalization,
  validateUserPersonalizationBoundary,
} from '../src/user-app';
import { createUserAppTemplateDetailViewModel } from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';
import {
  advancedPersonalizationPlaceholderExample,
  beginnerPersonalizationPlaceholderExample,
} from '../src/templates/examples/user-app-photo-intake-placeholder.example';

describe('user personalization placeholder', () => {
  it('creates non-sensitive local placeholder preferences', () => {
    const placeholder = createDefaultUserPersonalizationPlaceholder();

    expect(placeholder.boundary.placeholderOnly).toBe(true);
    expect(placeholder.boundary.storesSensitiveProfile).toBe(false);
    expect(placeholder.boundary.storesFaceEmbedding).toBe(false);
    expect(placeholder.boundary.storesUserPhoto).toBe(false);
    expect(placeholder.boundary.writesTrainingData).toBe(false);
    expect(placeholder.preferences.every((preference) => !preference.durable)).toBe(true);
    expect(summarizeUserPersonalization(placeholder)).toContain('"storesUserPhoto":false');
  });

  it('maps placeholder preferences to display hints only', () => {
    const template = createUserAppTemplateDetailViewModel({
      template: userAppMvpShellExamplePackage.templates[0],
    });
    const before = JSON.stringify(template);
    const hints = mapPersonalizationToGuidanceHints(beginnerPersonalizationPlaceholderExample);
    const preview = createPersonalizedGuidancePreview({
      template,
      personalization: advancedPersonalizationPlaceholderExample,
    });

    expect(hints.modifiesTemplate).toBe(false);
    expect(hints.writesUserProfile).toBe(false);
    expect(applyPlaceholderPersonalizationToGuidance({
      template,
      personalization: beginnerPersonalizationPlaceholderExample,
    }).photoStatusHint).toContain('No user photo');
    expect(JSON.stringify(template)).toBe(before);
    expect(preview).toContain('"modifiesTemplate":false');
    expect(summarizeGuidanceWithoutUserPhoto()).toContain('No user photo');
  });

  it('blocks durable or sensitive personalization placeholders', () => {
    const placeholder = createDefaultUserPersonalizationPlaceholder();
    const readiness = validateUserPersonalizationBoundary({
      preferences: [{ ...placeholder.preferences[0], durable: true }],
      boundary: { ...placeholder.boundary, writesTrainingData: true },
    });

    expect(readiness.ready).toBe(false);
    expect(readiness.blockingIssues.length).toBeGreaterThan(0);
  });
});
