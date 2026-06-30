import { describe, expect, it } from 'vitest';
import { createInternalFounderDemoRunReport } from '../src/template-engine';
import {
  internalFounderDemoRunBlockedByRegistryExample,
  internalFounderDemoRunReadyExample,
  internalFounderDemoRunSafeEvidenceExample,
  mvpDemoGapResolutionSprint1ReadyExample,
} from '../src/templates/examples';

describe('Internal Founder Demo Run', () => {
  it('builds route A-E for the internal founder demo run', () => {
    const report = internalFounderDemoRunReadyExample;

    expect(report.status).toBe('demo_pass');
    expect(report.routes.map((route) => route.id)).toEqual([
      'route_a_user_app_mvp',
      'route_b_vision_analysis',
      'route_c_template_studio_operator_workflow',
      'route_d_mobile_demo',
      'route_e_boundary_explanation',
    ]);
    expect(report.routes.every((route) => route.passCriteria.length > 0)).toBe(true);
    expect(report.routes.every((route) => route.evidence.length > 0)).toBe(true);
    expect(report.nextRecommendedPhase).toBe('Phase 14B - Internal Trial Prep');
  });

  it('covers user app, vision, operator, mobile, and boundary evidence', () => {
    const text = JSON.stringify(internalFounderDemoRunReadyExample);

    expect(text).toContain('首页、模板列表、详情、准备、分步跟练、完成页');
    expect(text).toContain('三套 trial templates');
    expect(text).toContain('Readiness Score 是规则评分');
    expect(text).toContain('Template Studio');
    expect(text).toContain('390px');
    expect(text).toContain('不写 registry、不 publish、不创建 production writer');
  });

  it('preserves local demo, privacy, and no-registry boundaries', () => {
    const report = createInternalFounderDemoRunReport({
      sourceResolutionReport: mvpDemoGapResolutionSprint1ReadyExample,
    });

    expect(report.registryChainPausedAfter10U).toBe(true);
    expect(report.realWriteAuthorizationPaused).toBe(true);
    expect(report.noRegistryWrite).toBe(true);
    expect(report.noRegistryMutation).toBe(true);
    expect(report.noPublish).toBe(true);
    expect(report.noProductionWriter).toBe(true);
    expect(report.noUserAppShellReplacement).toBe(true);
    expect(report.noBackend).toBe(true);
    expect(report.noAnalytics).toBe(true);
    expect(report.noAiApi).toBe(true);
    expect(report.noTraining).toBe(true);
    expect(report.noRealUserPhotos).toBe(true);
    expect(report.noBase64OrLocalPhotoPath).toBe(true);
    expect(report.noPersonalData).toBe(true);
    expect(report.notProductionReadiness).toBe(true);
    expect(report.notRealUserResearch).toBe(true);
    expect(report.localMvpDemoOnly).toBe(true);
    expect(report.jsonRoundTripStable).toBe(true);
  });

  it('does not include real user evidence or image payloads in the safe fixture', () => {
    expect(internalFounderDemoRunSafeEvidenceExample.localOnly).toBe(true);
    expect(internalFounderDemoRunSafeEvidenceExample.anonymousExampleOnly).toBe(true);
    expect(internalFounderDemoRunSafeEvidenceExample.containsRealName).toBe(false);
    expect(internalFounderDemoRunSafeEvidenceExample.containsContact).toBe(false);
    expect(internalFounderDemoRunSafeEvidenceExample.containsRawPhoto).toBe(false);
    expect(internalFounderDemoRunSafeEvidenceExample.containsBase64).toBe(false);
    expect(internalFounderDemoRunSafeEvidenceExample.containsLocalPhotoPath).toBe(false);
    expect(internalFounderDemoRunSafeEvidenceExample.containsBiometricIdentifier).toBe(false);
    expect(internalFounderDemoRunSafeEvidenceExample.containsAnalyticsId).toBe(false);
  });

  it('blocks the demo run when registry boundaries are violated', () => {
    expect(internalFounderDemoRunBlockedByRegistryExample.status).toBe('demo_blocked');
    expect(internalFounderDemoRunBlockedByRegistryExample.nextRecommendedPhase).toBe(
      'Phase 13E - MVP Demo Gap Resolution Sprint 2',
    );
    expect(
      internalFounderDemoRunBlockedByRegistryExample.issues.some(
        (issue) => issue.routeId === 'route_e_boundary_explanation',
      ),
    ).toBe(true);
  });
});
