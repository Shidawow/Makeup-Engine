import { describe, expect, it } from 'vitest';
import {
  guardedSimulatorReviewChecklistActualRegistryWriteBlockedExample,
  guardedSimulatorReviewChecklistBlockedExample,
  guardedSimulatorReviewChecklistReadyExample,
  guardedSimulatorReviewChecklistWarningExample,
} from '../src/templates/examples';

describe('Guarded simulator review checklist', () => {
  it('confirms all simulator review requirements without triggering writes', () => {
    const checklist = guardedSimulatorReviewChecklistReadyExample;

    expect(checklist.status).toBe('simulator_review_checklist_ready');
    expect(checklist.reviewGateOnly).toBe(true);
    expect(checklist.doesNotTriggerWrite).toBe(true);
    expect(checklist.noActualRegistryWrite).toBe(true);
    expect(checklist.noRegistryMutation).toBe(true);
    expect(checklist.notPublished).toBe(true);
    expect(checklist.noUserAppShellPackageReplacement).toBe(true);
    expect(checklist.notProductionWriter).toBe(true);
    expect(checklist.futureActualWriteRequiresSeparateApproval).toBe(true);
    expect(checklist.requirements.every((requirement) => requirement.satisfied)).toBe(
      true,
    );
    expect(JSON.parse(JSON.stringify(checklist))).toEqual(checklist);
  });

  it('preserves ready-with-warnings without allowing real execution', () => {
    const checklist = guardedSimulatorReviewChecklistWarningExample;

    expect(checklist.status).toBe('simulator_review_checklist_ready_with_warnings');
    expect(checklist.doesNotTriggerWrite).toBe(true);
    expect(checklist.noActualRegistryWrite).toBe(true);
  });

  it('blocks missing simulation validation and actual write markers', () => {
    expect(guardedSimulatorReviewChecklistBlockedExample.status).toBe(
      'simulator_review_checklist_blocked',
    );
    expect(
      guardedSimulatorReviewChecklistBlockedExample.requirements.some(
        (requirement) => requirement.required && !requirement.satisfied,
      ),
    ).toBe(true);
    expect(guardedSimulatorReviewChecklistActualRegistryWriteBlockedExample.status).toBe(
      'simulator_review_checklist_blocked',
    );
  });
});
