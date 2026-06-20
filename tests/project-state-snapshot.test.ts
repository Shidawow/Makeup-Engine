import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

interface ProjectStateSnapshot {
  projectName: string;
  projectRole: string;
  lastCompletedPhase: string;
  lastCompletedBusinessPhase: string;
  currentPhaseId: string;
  currentPhase: string;
  nextRecommendedPhase: string;
  nextRecommendedPhaseName: string;
  nextAction: string;
  mainDataFlow: string[];
  mainModules: string[];
  legacyFrozenModules: string[];
  lastValidation: {
    typecheck: string;
    test: string;
    build: string;
    testFiles: number | string;
    tests: number | string;
  };
  knownLimitations: string[];
}

describe('project state snapshot', () => {
  it('is valid JSON with required recovery fields', async () => {
    const raw = await readFile('project-state/project-state.snapshot.json', 'utf8');
    const snapshot = JSON.parse(raw) as ProjectStateSnapshot;

    expect(snapshot.projectName).toBe('Makeup Engine');
    expect(snapshot.projectRole).toContain('Makeup template production system');
    expect(snapshot.lastCompletedPhase).toBe('10N');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10N');
    expect(snapshot.currentPhaseId).toBe('10N');
    expect(snapshot.currentPhase).toBeTruthy();
    expect(snapshot.nextRecommendedPhase).toBe('10O');
    expect(snapshot.nextRecommendedPhaseName).toContain('Real Registry Write Implementation Draft');
    expect(snapshot.nextAction).toContain('Phase 10O');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'SourceImagePackage',
        'SourceImageEntry',
        'SourceImageArtifactBinding',
        'BrowserArtifactResource',
        'TemplateAnalysisSeed',
        'TemplateProductionBatch',
        'TemplateProductionTask',
        'ProductionQaReport',
        'TemplateLibraryEntry',
        'TemplatePublishPackage',
        'UserAppTemplatePackage',
        'UserAppPrototypeConsumer',
        'UserAppPrototypeConsumerQa',
        'UserAppShell',
        'UserPhotoIntakePlaceholder',
        'UserPersonalizationPlaceholder',
        'UserPhotoPrivacyBoundary',
        'UserAppLocalOnboarding',
        'UserLocalPreferences',
        'PreferenceGuidanceHints',
        'UserAppTemplateDiscovery',
        'UserTemplateRecommendationPlaceholder',
        'UserAppProductRouteDecision',
        'UserAppTechnologyRouteDecision',
        'UserAppMvpPlan',
        'UserAppPwaReadiness',
        'UserAppMvpPolishReadiness',
        'UserAppMobileHome',
        'UserAppTrialPack',
        'UserAppTrialFeedbackForm',
        'UserAppTrialFeedbackSummary',
        'UserAppTrialReadiness',
        'UserAppTrialAdminPanels',
        'UserAppTemplateContentQa',
        'UserAppTrialTemplateSelection',
        'UserAppTrialContentReadiness',
        'UserAppTemplateContentQaAdminPanels',
        'UserAppMvpReleaseReadiness',
        'UserAppTrialGoNoGo',
        'UserAppMvpReleaseReadinessAdminPanels',
        'UserAppInternalTrialLaunchChecklist',
        'UserAppInternalTrialOpsPack',
        'UserAppTrialObservationGuide',
        'UserAppTrialOutcomeReview',
        'UserAppInternalTrialOpsAdminPanels',
        'UserAppTrialResultReview',
        'UserAppTrialIssueTaxonomy',
        'UserAppTrialIssueSummary',
        'UserAppTrialDecisionFramework',
        'UserAppTrialResultReviewAdminPanels',
        'UserAppEvidenceCollectionProtocol',
        'UserAppEvidenceCollectionChecklist',
        'UserAppEvidenceCollectionQualityGate',
        'UserAppAnonymousTrialDryRunPack',
        'UserAppAnonymousTrialDryRunChecklist',
        'UserAppAnonymousTrialDryRunReview',
        'UserAppV1NonGoals',
        'UserAppConsumptionManifest',
        'VisionAnalysis',
        'FaceMeshRegionQaReport',
        'MakeupAttributeCandidateReport',
        'RuleBasedStepSequence',
        'MakeupTemplateDraftReport',
        'TemplateDraftQaResult',
        'TemplateDraftHumanReview',
        'TemplateDraftReviewWorkflow',
        'TemplateDraftCandidateHandoff',
        'TemplateStudioWorkflowState',
        'TemplateLibraryCandidatePackage',
        'TemplateLibraryCandidateValidationResult',
        'TemplateLibraryCandidateHandoff',
        'TemplateLibraryCandidatePackagingPanel',
        'CandidateToAppPackageContractPreparation',
        'CandidateToAppPackageValidationResult',
        'CandidateToAppPackageHandoff',
        'CandidateToAppPackageContractPanel',
        'UserAppPackageDraftPreview',
        'UserAppPackageDraftPreviewValidationResult',
        'UserAppPackageDraftPreviewHandoff',
        'UserAppPackageDraftPreviewPanel',
        'OfficialUserAppPackageDraftGateResult',
        'OfficialUserAppPackageDraftGateHandoff',
        'OfficialUserAppPackageDraftGatePanel',
        'OfficialUserAppTemplatePackageDraft',
        'OfficialUserAppTemplatePackageDraftBuilderResult',
        'OfficialUserAppTemplatePackageDraftValidationResult',
        'OfficialUserAppTemplatePackageDraftHandoff',
        'OfficialUserAppTemplatePackageDraftBuilderPanel',
        'UserAppTemplatePackageDraftPublishGateResult',
        'UserAppTemplatePackageDraftPublishGateHandoff',
        'UserAppTemplatePackageDraftPublishGatePanel',
        'UserAppTemplatePackageRegistryPreparation',
        'UserAppTemplatePackageRegistryPreparationValidationResult',
        'UserAppTemplatePackageRegistryPreparationHandoff',
        'UserAppTemplatePackageRegistryPreparationPanel',
        'UserAppTemplatePackageRegistryWriteGateResult',
        'UserAppTemplatePackageRegistryWriteGateHandoff',
        'UserAppTemplatePackageRegistryWriteGatePanel',
        'ControlledRegistryWriterDraft',
        'ControlledRegistryWriterValidationResult',
        'ControlledRegistryWriterHandoff',
        'ControlledRegistryWriterDraftPanel',
        'ExplicitRegistryWriteAuthorizationChecklist',
        'ExplicitRegistryWriteAuthorizationGateResult',
        'ExplicitRegistryWriteAuthorizationHandoff',
        'ExplicitRegistryWriteAuthorizationGatePanel',
        'ControlledRegistryWriteExecutionDesign',
        'ControlledRegistryWriteExecutionValidationResult',
        'ControlledRegistryWriteExecutionHandoff',
        'ControlledRegistryWriteExecutionDesignPanel',
        'RealRegistryWriteImplementationGateResult',
        'RealRegistryWriteImplementationChecklist',
        'RealRegistryWriteImplementationHandoff',
        'RealRegistryWriteImplementationGatePanel',
        'FaceMeshMakeupIntelligenceAdminPanel',
        'MaterializedTrainingDataset',
      ]),
    );
    expect(snapshot.mainModules).toContain('src/vision');
    expect(snapshot.knownLimitations).toContain('SourceImagePackage is not a training dataset');
    expect(snapshot.knownLimitations).toContain('SourceImagePackage cannot directly become a TemplateLibraryEntry');
    expect(snapshot.knownLimitations).toContain('SourceImagePackage cannot directly become a UserAppTemplatePackage');
    expect(snapshot.knownLimitations).toContain('Browser UI cannot auto-read CLI package-relative artifact paths');
    expect(snapshot.knownLimitations).toContain('Production batch storage strips BrowserArtifactResource runtime URLs');
    expect(snapshot.knownLimitations).toContain('Template Publish Package is local export metadata, not backend publication');
    expect(snapshot.knownLimitations).toContain('UserAppTemplatePackage is a local consumption contract, not a real user app or online release');
    expect(snapshot.knownLimitations).toContain('UserAppPrototypeConsumer is read-only admin validation, not the real user app');
    expect(snapshot.knownLimitations).toContain('UserAppShell is a local contract-driven MVP shell, not the production user app');
    expect(snapshot.knownLimitations).toContain('Phase 7C photo intake is placeholder-only and does not collect, upload, analyze, preview, store, export, or train on real user photos');
    expect(snapshot.knownLimitations).toContain('Phase 7D onboarding and preferences are local-only and non-sensitive; they are not account onboarding, backend sync, cloud sync, database persistence, analytics, production profile storage, or training input');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 8B PWA/mobile polish');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 8C trial pack');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 8D template content QA');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 8E MVP release readiness');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 9A internal trial operations');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 9B internal trial result review');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 9F internal trial evidence collection preparation');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 9G anonymous internal trial dry run');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10A FaceMesh-driven makeup intelligence');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10B template draft QA');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10C template library candidate packages');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10D candidate-to-app contract preparation');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10E User App Package Draft Preview');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10F Official User App Package Draft Gate');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10G');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10H');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10I');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10J');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10K');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10L');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10M');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10N');
    expect(snapshot.knownLimitations.join('\n')).toContain('real names');
    expect(snapshot.knownLimitations.join('\n')).toContain('service worker');
    expect(snapshot.knownLimitations).toContain('raw RGBA is currently summary-only in Studio');
    expect(snapshot.lastValidation.typecheck).toBeTruthy();
    expect(snapshot.lastValidation.test).toBeTruthy();
    expect(snapshot.lastValidation.build).toBeTruthy();
    expect(snapshot.lastValidation.testFiles).toBeTruthy();
    expect(snapshot.lastValidation.tests).toBeTruthy();
  });

  it('records legacy frozen modules', async () => {
    const raw = await readFile('project-state/project-state.snapshot.json', 'utf8');
    const snapshot = JSON.parse(raw) as ProjectStateSnapshot;

    expect(snapshot.legacyFrozenModules).toEqual(
      expect.arrayContaining(['src/engine', 'src/runtime', 'src/intelligence/runtime']),
    );
  });
});
