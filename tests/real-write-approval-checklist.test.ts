import { describe, expect, it } from 'vitest';
import {
  realWriteApprovalChecklistBlockedExample,
  realWriteApprovalChecklistReadyExample,
  realWriteApprovalChecklistWarningExample,
} from '../src/templates/examples';

describe('Real write approval checklist', () => {
  it('preserves approval-boundary-only checks without triggering writes', () => {
    const checklist = realWriteApprovalChecklistReadyExample;

    expect(checklist.status).toBe('real_write_approval_checklist_ready');
    expect(checklist.approvalBoundaryOnly).toBe(true);
    expect(checklist.doesNotTriggerWrite).toBe(true);
    expect(checklist.noActualRegistryWrite).toBe(true);
    expect(checklist.noRegistryMutation).toBe(true);
    expect(checklist.notPublished).toBe(true);
    expect(checklist.noUserAppShellPackageReplacement).toBe(true);
    expect(checklist.doesNotCreateProductionWriter).toBe(true);
    expect(checklist.productionWriteStillDisabled).toBe(true);
    expect(checklist.futureActualWriteRequiresSeparateApproval).toBe(true);
    expect(
      checklist.requirements.map((requirement) => requirement.id),
    ).toEqual(
      expect.arrayContaining([
        'confirm_approval_boundary_only',
        'confirm_owner_has_not_authorized_actual_registry_write',
        'confirm_owner_has_not_authorized_registry_mutation',
        'confirm_owner_has_not_authorized_publish',
        'confirm_owner_has_not_authorized_user_app_shell_package_replacement',
        'confirm_owner_has_not_authorized_production_writer_creation',
        'confirm_simulator_review_gate_ready',
        'confirm_audit_requirements_reviewed',
        'confirm_rollback_approval_requirements_reviewed',
        'confirm_future_actual_write_requires_separate_approval',
        'confirm_production_write_remains_disabled',
      ]),
    );
  });

  it('keeps warning boundaries as checklist warnings', () => {
    expect(realWriteApprovalChecklistWarningExample.status).toBe(
      'real_write_approval_checklist_ready_with_warnings',
    );
  });

  it('blocks when approval scope violates owner authorization boundary', () => {
    expect(realWriteApprovalChecklistBlockedExample.status).toBe(
      'real_write_approval_checklist_blocked',
    );
    expect(
      realWriteApprovalChecklistBlockedExample.requirements.some(
        (requirement) => requirement.required && !requirement.satisfied,
      ),
    ).toBe(true);
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(realWriteApprovalChecklistReadyExample);

    expect(JSON.parse(json)).toEqual(realWriteApprovalChecklistReadyExample);
    expect(realWriteApprovalChecklistReadyExample.jsonRoundTripStable).toBe(true);
  });
});
