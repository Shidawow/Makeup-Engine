import { describe, expect, it } from 'vitest';
import {
  userAppAnonymousTrialDryRunChecklistBlockedExample,
  userAppAnonymousTrialDryRunChecklistIncompleteExample,
  userAppAnonymousTrialDryRunChecklistReadyExample,
  userAppAnonymousTrialDryRunChecklistWarningExample,
} from '../src/templates/examples';

describe('User App anonymous internal trial dry run checklist', () => {
  it('marks the ready checklist complete for all required safety items', () => {
    expect(userAppAnonymousTrialDryRunChecklistReadyExample.status).toBe(
      'dry_run_checklist_ready',
    );
    expect(
      userAppAnonymousTrialDryRunChecklistReadyExample.items
        .filter((item) => item.required)
        .every((item) => item.passed),
    ).toBe(true);
    expect(userAppAnonymousTrialDryRunChecklistReadyExample.writesProjectStateUserRecords).toBe(
      false,
    );
  });

  it('supports warning and incomplete states before dry run execution', () => {
    expect(userAppAnonymousTrialDryRunChecklistWarningExample.status).toBe(
      'dry_run_checklist_ready_with_warnings',
    );
    expect(userAppAnonymousTrialDryRunChecklistIncompleteExample.status).toBe(
      'dry_run_checklist_blocked',
    );
  });

  it('blocks checklists that include forbidden data requests', () => {
    expect(userAppAnonymousTrialDryRunChecklistBlockedExample.status).toBe(
      'dry_run_checklist_blocked',
    );
    expect(
      userAppAnonymousTrialDryRunChecklistBlockedExample.items.some(
        (item) => item.itemId === 'dry-run-check-forbidden-none-requested' && item.blocking,
      ),
    ).toBe(true);
  });
});
