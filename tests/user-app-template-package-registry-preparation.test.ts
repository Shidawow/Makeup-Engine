import { describe, expect, it } from 'vitest';
import {
  userAppTemplatePackageRegistryPreparationActualRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryPreparationMedicalClaimBlockedExample,
  userAppTemplatePackageRegistryPreparationMissingDraftOnlyExample,
  userAppTemplatePackageRegistryPreparationMissingPublishBlockedExample,
  userAppTemplatePackageRegistryPreparationMissingPublishGateExample,
  userAppTemplatePackageRegistryPreparationMissingRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryPreparationPersonalDataBlockedExample,
  userAppTemplatePackageRegistryPreparationProductShadeBlockedExample,
  userAppTemplatePackageRegistryPreparationProductionMarkerBlockedExample,
  userAppTemplatePackageRegistryPreparationRawImageBlockedExample,
  userAppTemplatePackageRegistryPreparationReadyExample,
  userAppTemplatePackageRegistryPreparationShellReplacementBlockedExample,
  userAppTemplatePackageRegistryPreparationUnsupportedFinalClaimBlockedExample,
  userAppTemplatePackageRegistryPreparationWarningExample,
} from '../src/templates/examples';

describe('UserAppTemplatePackage registry preparation', () => {
  it('prepares a registry entry preview only after the 10H gate is ready', () => {
    const preparation = userAppTemplatePackageRegistryPreparationReadyExample;

    expect(preparation.preparationStatus).toBe('registry_preparation_ready');
    expect(preparation.trace.source.sourceReadyForRegistryPreparation).toBe(true);
    expect(preparation.registryEntryPreview.packageIdCandidate).toContain(
      'registry-preview-',
    );
    expect(preparation.draftOnly).toBe(true);
    expect(preparation.publishBlocked).toBe(true);
    expect(preparation.registryWriteBlocked).toBe(true);
    expect(preparation.noActualRegistryWrite).toBe(true);
    expect(preparation.notPublished).toBe(true);
    expect(preparation.noUserAppShellPackageReplacement).toBe(true);
    expect(preparation.notProductionPackage).toBe(true);
    expect(preparation.registryPreparationOnly).toBe(true);
  });

  it('keeps warnings visible without turning preparation into registry write', () => {
    expect(userAppTemplatePackageRegistryPreparationWarningExample.preparationStatus).toBe(
      'registry_preparation_ready_with_warnings',
    );
    expect(userAppTemplatePackageRegistryPreparationWarningExample.noActualRegistryWrite).toBe(
      true,
    );
  });

  it('blocks missing source gate readiness, draftOnly, publishBlocked, and registry write blocking', () => {
    expect(
      userAppTemplatePackageRegistryPreparationMissingPublishGateExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'source_publish_gate_not_ready' }),
      ]),
    );
    expect(
      userAppTemplatePackageRegistryPreparationMissingDraftOnlyExample.blockedReasons,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'draft_only_missing' })]));
    expect(
      userAppTemplatePackageRegistryPreparationMissingPublishBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'publish_blocked_missing' })]),
    );
    expect(
      userAppTemplatePackageRegistryPreparationMissingRegistryWriteBlockedExample
        .registryWriteBlocked,
    ).toBe(false);
  });

  it('blocks unsafe payload categories before any future registry write gate', () => {
    expect(userAppTemplatePackageRegistryPreparationRawImageBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'raw_image_reference' })]),
    );
    expect(
      userAppTemplatePackageRegistryPreparationPersonalDataBlockedExample.blockedReasons,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'personal_data' })]));
    expect(
      userAppTemplatePackageRegistryPreparationMedicalClaimBlockedExample.blockedReasons,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'medical_claim' })]));
    expect(
      userAppTemplatePackageRegistryPreparationProductShadeBlockedExample.blockedReasons,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'product_shade_claim' })]));
    expect(
      userAppTemplatePackageRegistryPreparationUnsupportedFinalClaimBlockedExample
        .blockedReasons,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'unsupported_final_claim' })]),
    );
  });

  it('blocks actual registry writes, production markers, and User App Shell package replacement', () => {
    expect(
      userAppTemplatePackageRegistryPreparationActualRegistryWriteBlockedExample
        .blockedReasons,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'registry_write_not_blocked' })]),
    );
    expect(
      userAppTemplatePackageRegistryPreparationProductionMarkerBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'production_package_marker' })]),
    );
    expect(
      userAppTemplatePackageRegistryPreparationShellReplacementBlockedExample.blockedReasons,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'user_app_shell_package_replacement' }),
      ]),
    );
  });

  it('is JSON stable and never carries actual registry or production markers', () => {
    const json = JSON.stringify(userAppTemplatePackageRegistryPreparationReadyExample);

    expect(JSON.parse(json)).toEqual(userAppTemplatePackageRegistryPreparationReadyExample);
    expect(json).not.toContain('actualRegistryWrite');
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionPackageId');
  });
});
