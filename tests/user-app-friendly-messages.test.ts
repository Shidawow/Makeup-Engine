import { describe, expect, it } from 'vitest';
import {
  createUserFriendlyBlockedMessage,
  createUserFriendlyWarningMessage,
  summarizeStepForUser,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('user app friendly guidance messages', () => {
  it('maps internal validation messages to user-facing copy without leaking raw diagnostics only', () => {
    expect(
      createUserFriendlyBlockedMessage(
        'step step-1 missing matching region instruction for lips',
      ),
    ).not.toBe('step step-1 missing matching region instruction for lips');
    expect(createUserFriendlyBlockedMessage('$.templates[0] contains object URL')).toContain(
      'object URL',
    );
    expect(
      createUserFriendlyBlockedMessage('step step-1 is not in deterministic order'),
    ).not.toBe('step step-1 is not in deterministic order');
    expect(createUserFriendlyWarningMessage('template has no required tools')).not.toBe(
      'template has no required tools',
    );
  });

  it('summarizes a makeup step in user language', () => {
    const template = userAppMvpShellExamplePackage.templates[0];
    const step = template.steps[0];
    const region = template.regionInstructions.find(
      (instruction) => instruction.regionType === step.region,
    );

    expect(summarizeStepForUser({ step, matchingRegion: region })).not.toContain(
      'missing matching region instruction',
    );
    expect(summarizeStepForUser({ step }).length).toBeGreaterThan(0);
  });
});
