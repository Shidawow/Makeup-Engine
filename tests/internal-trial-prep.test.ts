import { describe, expect, it } from 'vitest';
import { createInternalTrialPrepReport } from '../src/template-engine';
import {
  internalFounderDemoRunReadyExample,
  internalTrialPrepBlockedByRegistryExample,
  internalTrialPrepReadyExample,
  internalTrialPrepSafeFixtureExample,
} from '../src/templates/examples';

describe('Internal Trial Prep', () => {
  it('builds role-only participant profiles without real personal data', () => {
    const report = internalTrialPrepReadyExample;

    expect(report.status).toBe('trial_prep_ready');
    expect(report.participantProfiles.map((profile) => profile.id)).toEqual([
      'founder',
      'friend_or_family',
      'makeup_beginner',
      'makeup_interested_user',
      'operator_reviewer',
      'product_reviewer',
    ]);
    expect(report.participantProfiles.every((profile) => profile.roleOnly)).toBe(true);
    expect(JSON.stringify(report.participantProfiles)).not.toContain('alice@example.com');
    expect(JSON.stringify(report.participantProfiles)).not.toContain('138');
  });

  it('defines internal trial routes for user app, mobile, content, operator, and boundary checks', () => {
    expect(internalTrialPrepReadyExample.trialRoutes.map((route) => route.id)).toEqual([
      'user_app_mvp_trial',
      'mobile_demo_trial',
      'template_content_review',
      'photo_to_template_operator_demo',
      'boundary_understanding_check',
    ]);
    expect(
      internalTrialPrepReadyExample.trialRoutes.every(
        (route) => route.checklist.length > 0 && route.expectedEvidence.length > 0,
      ),
    ).toBe(true);
  });

  it('preserves local MVP, privacy, and no-registry boundaries', () => {
    const report = createInternalTrialPrepReport({
      sourceFounderDemoRunReport: internalFounderDemoRunReadyExample,
    });

    expect(report.registryChainPausedAfter10U).toBe(true);
    expect(report.realWriteAuthorizationPaused).toBe(true);
    expect(report.localMvpDemoOnly).toBe(true);
    expect(report.internalPrepOnly).toBe(true);
    expect(report.notPublicBeta).toBe(true);
    expect(report.notRealUserResearchSystem).toBe(true);
    expect(report.notProductionReadiness).toBe(true);
    expect(report.noRealNames).toBe(true);
    expect(report.noContactCollection).toBe(true);
    expect(report.noRealPhotos).toBe(true);
    expect(report.noBase64OrLocalPhotoPath).toBe(true);
    expect(report.noAnalytics).toBe(true);
    expect(report.noBackend).toBe(true);
    expect(report.noDatabase).toBe(true);
    expect(report.noRegistryWrite).toBe(true);
    expect(report.noRegistryMutation).toBe(true);
    expect(report.noPublish).toBe(true);
    expect(report.noProductionWriter).toBe(true);
    expect(report.noUserAppShellReplacement).toBe(true);
    expect(report.noFullyAutomaticExtractionClaim).toBe(true);
    expect(report.noAiConfirmedClaim).toBe(true);
    expect(report.jsonRoundTripStable).toBe(true);
  });

  it('keeps the safe fixture free of contacts, photos, biometrics, and analytics ids', () => {
    expect(internalTrialPrepSafeFixtureExample.localOnly).toBe(true);
    expect(internalTrialPrepSafeFixtureExample.roleBasedParticipantProfilesOnly).toBe(true);
    expect(internalTrialPrepSafeFixtureExample.containsRealName).toBe(false);
    expect(internalTrialPrepSafeFixtureExample.containsContact).toBe(false);
    expect(internalTrialPrepSafeFixtureExample.containsRealPhoto).toBe(false);
    expect(internalTrialPrepSafeFixtureExample.containsBase64).toBe(false);
    expect(internalTrialPrepSafeFixtureExample.containsLocalPhotoPath).toBe(false);
    expect(internalTrialPrepSafeFixtureExample.containsBiometricId).toBe(false);
    expect(internalTrialPrepSafeFixtureExample.containsFaceEmbedding).toBe(false);
    expect(internalTrialPrepSafeFixtureExample.containsAnalyticsId).toBe(false);
  });

  it('blocks prep when source founder demo and registry boundaries are blocked', () => {
    expect(internalTrialPrepBlockedByRegistryExample.status).toBe(
      'trial_prep_blocked',
    );
    expect(
      internalTrialPrepBlockedByRegistryExample.risks.some(
        (risk) => risk.riskId === 'source_founder_demo_blocked',
      ),
    ).toBe(true);
  });
});
