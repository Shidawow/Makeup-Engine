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
    expect(snapshot.lastCompletedPhase).toBe('8D');
    expect(snapshot.lastCompletedBusinessPhase).toBe('8D');
    expect(snapshot.currentPhaseId).toBe('8D');
    expect(snapshot.currentPhase).toBeTruthy();
    expect(snapshot.nextRecommendedPhase).toBe('8E');
    expect(snapshot.nextRecommendedPhaseName).toContain('MVP Release Readiness Gate');
    expect(snapshot.nextAction).toContain('Phase 8E');
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
        'UserAppV1NonGoals',
        'UserAppConsumptionManifest',
        'VisionAnalysis',
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
