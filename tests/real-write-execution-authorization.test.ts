import { describe, expect, it } from 'vitest';
import {
  realWriteExecutionAuthorizationActualRegistryWriteExample,
  realWriteExecutionAuthorizationMissingActualWriteBlockedExample,
  realWriteExecutionAuthorizationMissingDryRunOnlyExample,
  realWriteExecutionAuthorizationMissingFinalReviewGateReadyExample,
  realWriteExecutionAuthorizationMissingPackageReplacementBlockedExample,
  realWriteExecutionAuthorizationMissingProductionWriterBlockedExample,
  realWriteExecutionAuthorizationMissingPublishBlockedExample,
  realWriteExecutionAuthorizationOwnerActualRegistryWriteExample,
  realWriteExecutionAuthorizationOwnerProductionWriterCreationExample,
  realWriteExecutionAuthorizationOwnerPublishExample,
  realWriteExecutionAuthorizationOwnerShellReplacementExample,
  realWriteExecutionAuthorizationProductionMarkerExample,
  realWriteExecutionAuthorizationProductionWriterCreationMarkerExample,
  realWriteExecutionAuthorizationReadyExample,
  realWriteExecutionAuthorizationShellReplacementExample,
  realWriteExecutionAuthorizationWarningExample,
} from '../src/templates/examples';

const blockedIds = (authorization: {
  blockedReasons: Array<{ id: string }>;
}): string[] => authorization.blockedReasons.map((reason) => reason.id);

describe('Real write execution authorization', () => {
  it('becomes ready only after final review gate is ready and owner scope is phase-only', () => {
    const authorization = realWriteExecutionAuthorizationReadyExample;

    expect(authorization.status).toBe('real_write_execution_authorization_ready');
    expect(authorization.decision).toBe(
      'eligible_for_future_real_write_execution_plan',
    );
    expect(authorization.ownerAuthorizationScope).toBe(
      'execution_authorization_phase_only',
    );
    expect(authorization.readyForFutureRealWriteExecutionPlan).toBe(true);
    expect(authorization.authorizationModelOnly).toBe(true);
    expect(authorization.notActualWriteAuthorization).toBe(true);
    expect(authorization.dryRunOnly).toBe(true);
    expect(authorization.actualWriteBlocked).toBe(true);
    expect(authorization.publishBlocked).toBe(true);
    expect(authorization.packageReplacementBlocked).toBe(true);
    expect(authorization.productionWriterBlocked).toBe(true);
    expect(authorization.noActualRegistryWrite).toBe(true);
    expect(authorization.notPublished).toBe(true);
    expect(authorization.noUserAppShellPackageReplacement).toBe(true);
    expect(authorization.doesNotCreateProductionWriter).toBe(true);
  });

  it('keeps warning inputs as authorization-model-only', () => {
    const authorization = realWriteExecutionAuthorizationWarningExample;

    expect(authorization.status).toBe(
      'real_write_execution_authorization_ready_with_warnings',
    );
    expect(authorization.decision).toBe('keep_as_authorization_model_only');
    expect(authorization.readyForFutureRealWriteExecutionPlan).toBe(false);
  });

  it('blocks missing final review and safety flags', () => {
    expect(
      blockedIds(realWriteExecutionAuthorizationMissingFinalReviewGateReadyExample),
    ).toContain('source_final_review_gate_ready');
    expect(
      blockedIds(realWriteExecutionAuthorizationMissingDryRunOnlyExample),
    ).toContain('dry_run_only_true');
    expect(
      blockedIds(realWriteExecutionAuthorizationMissingActualWriteBlockedExample),
    ).toContain('actual_write_blocked_true');
    expect(
      blockedIds(realWriteExecutionAuthorizationMissingPublishBlockedExample),
    ).toContain('publish_blocked_true');
    expect(
      blockedIds(
        realWriteExecutionAuthorizationMissingPackageReplacementBlockedExample,
      ),
    ).toContain('package_replacement_blocked_true');
    expect(
      blockedIds(
        realWriteExecutionAuthorizationMissingProductionWriterBlockedExample,
      ),
    ).toContain('production_writer_blocked_true');
  });

  it('blocks owner authorization scopes beyond execution_authorization_phase_only', () => {
    expect(realWriteExecutionAuthorizationOwnerActualRegistryWriteExample.status).toBe(
      'real_write_execution_authorization_blocked',
    );
    expect(
      blockedIds(realWriteExecutionAuthorizationOwnerActualRegistryWriteExample),
    ).toContain('owner_did_not_authorize_actual_registry_write');
    expect(realWriteExecutionAuthorizationOwnerPublishExample.status).toBe(
      'real_write_execution_authorization_blocked',
    );
    expect(blockedIds(realWriteExecutionAuthorizationOwnerPublishExample)).toContain(
      'owner_did_not_authorize_publish',
    );
    expect(realWriteExecutionAuthorizationOwnerShellReplacementExample.status).toBe(
      'real_write_execution_authorization_blocked',
    );
    expect(
      blockedIds(realWriteExecutionAuthorizationOwnerShellReplacementExample),
    ).toContain('owner_did_not_authorize_user_app_shell_replacement');
    expect(
      realWriteExecutionAuthorizationOwnerProductionWriterCreationExample.status,
    ).toBe('real_write_execution_authorization_blocked');
    expect(
      blockedIds(
        realWriteExecutionAuthorizationOwnerProductionWriterCreationExample,
      ),
    ).toContain('owner_did_not_authorize_production_writer_creation');
  });

  it('blocks actual write, production, shell replacement, and production writer markers', () => {
    expect(
      blockedIds(realWriteExecutionAuthorizationActualRegistryWriteExample),
    ).toContain('no_actual_registry_write');
    expect(blockedIds(realWriteExecutionAuthorizationProductionMarkerExample)).toContain(
      'no_production_package_marker',
    );
    expect(
      blockedIds(realWriteExecutionAuthorizationShellReplacementExample),
    ).toContain('no_user_app_shell_package_replacement');
    expect(
      blockedIds(
        realWriteExecutionAuthorizationProductionWriterCreationMarkerExample,
      ),
    ).toContain('no_production_writer_creation');
  });

  it('is JSON round-trip stable and never claims actual write execution', () => {
    const json = JSON.stringify(realWriteExecutionAuthorizationReadyExample);

    expect(JSON.parse(json)).toEqual(realWriteExecutionAuthorizationReadyExample);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('createProductionWriter');
    expect(json).not.toContain('actualWriteAuthorized');
    expect(json).not.toContain('productionWriterReady');
  });
});
