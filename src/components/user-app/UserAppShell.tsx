import { useMemo, useState } from 'react';
import type { UserAppTemplatePackage } from '../../templates/schema';
import { userAppMvpShellExamplePackage } from '../../templates/examples/user-app-mvp-shell.example';
import {
  clearTemplateProgressFromSession,
  clearUserAppSession,
  completeCurrentUserAppStep,
  createDefaultUserLocalPreferences,
  createDefaultUserPersonalizationPlaceholder,
  createInitialTemplateDiscoveryState,
  createInitialUserAppSession,
  createInitialUserAppState,
  createInitialUserOnboardingState,
  createSessionFromAppState,
  createUserAppMvpPolishReport,
  createUserAppMvpReleaseReadinessReport,
  createUserAppInternalTrialOpsPack,
  createUserAppPwaReadinessReport,
  createUserAppReadinessReport,
  createUserAppSessionStorageAdapter,
  createUserAppShellModel,
  createUserAppTrialGoNoGoDecision,
  createUserAppTrialFeedbackForm,
  createUserAppTrialDecisionFramework,
  createUserAppTrialIterationBacklog,
  createUserAppTrialIterationPlan,
  createUserAppEvidenceSufficiencyGate,
  createUserAppEvidenceCollectionChecklist,
  createUserAppEvidenceCollectionProtocol,
  createUserAppEvidenceCollectionQualityGate,
  createUserAppAnonymousTrialDryRunChecklist,
  createUserAppAnonymousTrialDryRunPack,
  createUserAppAnonymousTrialDryRunReview,
  createUserAppAnonymousTrialLaunchPack,
  createUserAppAnonymousTrialLaunchReadiness,
  createUserAppAnonymousTrialPostLaunchHandoff,
  createUserAppInternalTrialEvidencePack,
  createUserAppInternalTrialLearningSummary,
  createUserAppNextPhaseRecommendation,
  createUserAppProductDecisionGate,
  createUserAppTrialEvidenceSummary,
  createUserAppTrialObservationGuide,
  createUserAppTrialOutcomeReview,
  createUserAppTrialPack,
  createUserAppTrialReadinessReport,
  createUserAppTrialResultReview,
  createUserAppTemplateContentQaReport,
  createUserAppTrialContentReadinessReport,
  createUserAppTrialTemplateSelectionReport,
  createUserPhotoIntakePlaceholder,
  evaluateMobileQaReadiness,
  loadUserAppSession,
  navigateBack,
  navigateToCompatibility,
  navigateToTemplateList,
  navigateToTools,
  recoverUserAppSession,
  resetUserAppTemplateProgress,
  resetUserLocalPreferences,
  saveUserAppSession,
  selectUserAppTemplate,
  skipCurrentUserAppStep,
  startUserAppStepGuide,
  type UserAppSessionRecoveryReport,
  type UserAppSessionState,
  type UserAppShellSection,
  type UserAppShellState,
  type UserOnboardingState,
} from '../../user-app';
import { userAppTemplateContentQaExamplePackage } from '../../templates/examples/user-app-template-content-qa.example';
import { userAppTrialFeedbackMockSummary } from '../../templates/examples/user-app-trial-feedback.example';
import { userAppTrialObservationMockSummary } from '../../templates/examples/user-app-trial-observation.example';
import { UserAppAnonymousTrialDryRunChecklistPanel } from './UserAppAnonymousTrialDryRunChecklistPanel';
import { UserAppAnonymousTrialDryRunPackPanel } from './UserAppAnonymousTrialDryRunPackPanel';
import { UserAppAnonymousTrialDryRunReviewPanel } from './UserAppAnonymousTrialDryRunReviewPanel';
import { UserAppAnonymousTrialLaunchPackPanel } from './UserAppAnonymousTrialLaunchPackPanel';
import { UserAppAnonymousTrialLaunchReadinessPanel } from './UserAppAnonymousTrialLaunchReadinessPanel';
import { UserAppAnonymousTrialPostLaunchHandoffPanel } from './UserAppAnonymousTrialPostLaunchHandoffPanel';
import { UserAppCompatibilityBanner } from './UserAppCompatibilityBanner';
import { UserAppEvidenceCollectionChecklistPanel } from './UserAppEvidenceCollectionChecklistPanel';
import { UserAppEvidenceCollectionProtocolPanel } from './UserAppEvidenceCollectionProtocolPanel';
import { UserAppEvidenceCollectionQualityGatePanel } from './UserAppEvidenceCollectionQualityGatePanel';
import { UserAppEvidenceSufficiencyGatePanel } from './UserAppEvidenceSufficiencyGatePanel';
import { UserAppInternalTrialEvidencePackPanel } from './UserAppInternalTrialEvidencePackPanel';
import { UserAppInternalTrialOpsPanel } from './UserAppInternalTrialOpsPanel';
import { UserAppInternalTrialLearningSummaryPanel } from './UserAppInternalTrialLearningSummaryPanel';
import { UserAppInteractionChecklist } from './UserAppInteractionChecklist';
import { UserAppMobileHome } from './UserAppMobileHome';
import { UserAppMobileQaPanel } from './UserAppMobileQaPanel';
import { UserAppMvpPolishChecklist } from './UserAppMvpPolishChecklist';
import { UserAppMvpReleaseReadinessPanel } from './UserAppMvpReleaseReadinessPanel';
import { UserAppProgressPanel } from './UserAppProgressPanel';
import { UserAppPwaInstallPanel } from './UserAppPwaInstallPanel';
import { UserAppNextPhaseRecommendationPanel } from './UserAppNextPhaseRecommendationPanel';
import { UserAppProductDecisionGatePanel } from './UserAppProductDecisionGatePanel';
import { UserAppReadinessPanel } from './UserAppReadinessPanel';
import { UserAppSessionPanel } from './UserAppSessionPanel';
import { UserAppSessionRecoveryNotice } from './UserAppSessionRecoveryNotice';
import { UserAppTrialFeedbackPanel } from './UserAppTrialFeedbackPanel';
import { UserAppTrialEvidenceSummaryPanel } from './UserAppTrialEvidenceSummaryPanel';
import { UserAppTrialGoNoGoPanel } from './UserAppTrialGoNoGoPanel';
import { UserAppTrialDecisionFrameworkPanel } from './UserAppTrialDecisionFrameworkPanel';
import { UserAppTrialIterationBacklogPanel } from './UserAppTrialIterationBacklogPanel';
import { UserAppTrialIterationPlanPanel } from './UserAppTrialIterationPlanPanel';
import { UserAppTrialIterationPriorityPanel } from './UserAppTrialIterationPriorityPanel';
import { UserAppTrialIssueSummaryPanel } from './UserAppTrialIssueSummaryPanel';
import { UserAppTrialObservationPanel } from './UserAppTrialObservationPanel';
import { UserAppTrialOutcomePanel } from './UserAppTrialOutcomePanel';
import { UserAppTrialPackPanel } from './UserAppTrialPackPanel';
import { UserAppTrialReadinessPanel } from './UserAppTrialReadinessPanel';
import { UserAppTrialResultReviewPanel } from './UserAppTrialResultReviewPanel';
import { UserAppTemplateContentQaPanel } from './UserAppTemplateContentQaPanel';
import { UserAppTrialTemplateReadinessPanel } from './UserAppTrialTemplateReadinessPanel';
import { UserMakeupStepGuide } from './UserMakeupStepGuide';
import { UserOnboardingFlow } from './UserOnboardingFlow';
import { UserPersonalizationPanel } from './UserPersonalizationPanel';
import { UserPhotoIntakePlaceholder } from './UserPhotoIntakePlaceholder';
import { UserPrivacyNotice } from './UserPrivacyNotice';
import { UserPreferenceSetupPanel } from './UserPreferenceSetupPanel';
import { UserPreferenceSummary } from './UserPreferenceSummary';
import { UserRegionInstructionView } from './UserRegionInstructionView';
import { UserTemplateDetail } from './UserTemplateDetail';
import { UserTemplateDiscoveryPanel } from './UserTemplateDiscoveryPanel';
import { UserTemplateList } from './UserTemplateList';
import { UserToolProductPanel } from './UserToolProductPanel';

export interface UserAppShellProps {
  packageData?: UserAppTemplatePackage | null;
  showExampleWhenEmpty?: boolean;
}

const userSectionTabs: Array<{ tabId: UserAppShellSection; label: string }> = [
  { tabId: 'guidance', label: '跟练' },
  { tabId: 'discovery', label: '发现妆容' },
  { tabId: 'preparation', label: '我的准备' },
  { tabId: 'preferences', label: '我的偏好' },
  { tabId: 'photo', label: '照片占位' },
  { tabId: 'session', label: '本地进度' },
  { tabId: 'privacy', label: '隐私说明' },
];

const adminSectionTabs: Array<{ tabId: UserAppShellSection; label: string }> = [
  { tabId: 'trialPack', label: 'MVP 试用包' },
  { tabId: 'trialFeedback', label: '反馈表预览' },
  { tabId: 'trialReadiness', label: '试用就绪度' },
  { tabId: 'templateContentQa', label: '模板内容 QA' },
  { tabId: 'trialTemplateSelection', label: '试用模板选择' },
  { tabId: 'trialContentReadiness', label: '试用内容就绪度' },
  { tabId: 'mvpReleaseReadiness', label: 'MVP 发布就绪度' },
  { tabId: 'trialGoNoGo', label: '试用 Go/No-Go' },
  { tabId: 'internalTrialOps', label: '内部试用运营' },
  { tabId: 'trialObservation', label: '观察记录模板' },
  { tabId: 'trialOutcome', label: '试用结果复盘' },
  { tabId: 'trialResultReview', label: '试用结果复盘框架' },
  { tabId: 'trialIssueSummary', label: '问题分类汇总' },
  { tabId: 'trialDecisionFramework', label: '下一步决策框架' },
  { tabId: 'trialIterationPlan', label: '试用迭代计划' },
  { tabId: 'trialIterationBacklog', label: '迭代 backlog' },
  { tabId: 'trialIterationPriority', label: '优先级建议' },
  { tabId: 'trialLearningSummary', label: '试用学习总结' },
  { tabId: 'productDecisionGate', label: '产品决策门' },
  { tabId: 'nextPhaseRecommendation', label: '下一阶段建议' },
  { tabId: 'internalTrialEvidencePack', label: '内部试用证据包' },
  { tabId: 'trialEvidenceSummary', label: '试用证据摘要' },
  { tabId: 'evidenceSufficiencyGate', label: '证据充分性判断' },
  { tabId: 'evidenceCollectionProtocol', label: '证据收集协议' },
  { tabId: 'evidenceCollectionChecklist', label: '证据收集 checklist' },
  { tabId: 'evidenceCollectionQualityGate', label: '证据收集质量门' },
  { tabId: 'anonymousTrialDryRunPack', label: '匿名内部试用 dry run' },
  { tabId: 'anonymousTrialDryRunChecklist', label: 'dry run checklist' },
  { tabId: 'anonymousTrialDryRunReview', label: 'dry run 复盘' },
  { tabId: 'anonymousTrialLaunchPack', label: '匿名内部试用启动包' },
  { tabId: 'anonymousTrialLaunchReadiness', label: '启动就绪度' },
  { tabId: 'anonymousTrialPostLaunchHandoff', label: '试用后 handoff' },
  { tabId: 'pwa', label: 'PWA 检查' },
  { tabId: 'mvpPolish', label: 'MVP 打磨' },
  { tabId: 'readiness', label: 'App 就绪度' },
  { tabId: 'mobileQa', label: '移动端 QA' },
  { tabId: 'interaction', label: '交互检查' },
];

export function UserAppShell({
  packageData,
  showExampleWhenEmpty = true,
}: UserAppShellProps) {
  const [state, setState] = useState<UserAppShellState>(() => createInitialUserAppState());
  const [boundaryTab, setBoundaryTab] = useState<UserAppShellSection>('guidance');
  const [onboarding, setOnboarding] = useState(() => createInitialUserOnboardingState());
  const [localPreferences, setLocalPreferences] = useState(() =>
    createDefaultUserLocalPreferences(),
  );
  const [discoveryState, setDiscoveryState] = useState(() =>
    createInitialTemplateDiscoveryState(),
  );
  const [storedSession, setStoredSession] = useState<UserAppSessionState>(() =>
    createInitialUserAppSession(),
  );
  const [recoveryReport, setRecoveryReport] =
    useState<UserAppSessionRecoveryReport | null>(null);
  const storageAdapter = useMemo(
    () => createUserAppSessionStorageAdapter({ preferLocalStorage: true }),
    [],
  );
  const effectivePackage =
    packageData ?? (showExampleWhenEmpty ? userAppMvpShellExamplePackage : null);
  const viewModel = useMemo(
    () => createUserAppShellModel({ packageData: effectivePackage, state }),
    [effectivePackage, state],
  );
  const photoIntakePlaceholder = useMemo(() => createUserPhotoIntakePlaceholder(), []);
  const personalizationPlaceholder = useMemo(
    () => createDefaultUserPersonalizationPlaceholder(),
    [],
  );
  const currentSession = useMemo(
    () =>
      createSessionFromAppState({
        appState: state,
        onboarding,
        localPreferences,
        discoveryState,
        lastVisitedSection: boundaryTab,
        sessionId: storedSession.sessionId,
      }),
    [boundaryTab, discoveryState, localPreferences, onboarding, state, storedSession.sessionId],
  );
  const mobileQaResult = useMemo(
    () =>
      evaluateMobileQaReadiness({
        hasPackage: viewModel.hasPackage,
        templateCount: viewModel.packageSummary.templateCount,
        canEnterStepGuide: viewModel.compatibility.canEnterStepGuide,
        hasPrivacyCopy: true,
        hasSessionControls: true,
        hasRecoveryNotice: true,
        hasWarningCopy: true,
        hasBlockedCopy: true,
        hasLargeTapTargets: true,
        hasMobileStackingClasses: true,
        hidesRawJsonByDefault: true,
      }),
    [
      viewModel.compatibility.canEnterStepGuide,
      viewModel.hasPackage,
      viewModel.packageSummary.templateCount,
    ],
  );
  const pwaReadinessReport = useMemo(() => createUserAppPwaReadinessReport(), []);
  const mvpPolishReport = useMemo(
    () =>
      createUserAppMvpPolishReport({
        pwaReport: pwaReadinessReport,
        hasMobileHome: true,
        hasPrimaryTemplateCta: true,
        hasCurrentRecommendation: Boolean(viewModel.selectedTemplate ?? viewModel.templates[0]),
        hasTouchStepActions: true,
        hasPreviousNextCompleteSkipLabels: true,
        hasReadableToolsAndProducts: true,
        hasReadableRegionCopy: true,
        hasPrivacyLocalOnlyCopy: true,
        hasNoUploadCopy: true,
        hasNoTrainingCopy: true,
        hidesInternalTermsFromUserPath: true,
        userPathInternalTerms: [],
        hasAdminQaSeparation: true,
        adminQaLabel: '管理员检查',
        hasPlaceholderDisabledCopy: true,
        hasLocalOnlyBoundary: true,
      }),
    [pwaReadinessReport, viewModel.selectedTemplate, viewModel.templates],
  );
  const trialPack = useMemo(() => createUserAppTrialPack(), []);
  const trialFeedbackForm = useMemo(() => createUserAppTrialFeedbackForm(), []);
  const trialReadinessReport = useMemo(
    () =>
      createUserAppTrialReadinessReport({
        trialPack,
        feedbackForm: trialFeedbackForm,
        pwaReport: pwaReadinessReport,
        mvpPolishReport,
        hasPrivacyLocalOnlyCopy: true,
        hasNoUploadCopy: true,
        hasNoTrainingCopy: true,
        hasNoSensitiveDataCopy: true,
        hasUserPathReady: true,
        hasAdminQaSeparation: true,
      }),
    [mvpPolishReport, pwaReadinessReport, trialFeedbackForm, trialPack],
  );
  const templateContentQaReports = useMemo(
    () =>
      userAppTemplateContentQaExamplePackage.templates.map((template) =>
        createUserAppTemplateContentQaReport({
          packageData: userAppTemplateContentQaExamplePackage,
          template,
        }),
      ),
    [],
  );
  const trialTemplateSelectionReport = useMemo(
    () =>
      createUserAppTrialTemplateSelectionReport({
        packageData: userAppTemplateContentQaExamplePackage,
        contentQaReports: templateContentQaReports,
      }),
    [templateContentQaReports],
  );
  const trialContentReadinessReport = useMemo(
    () =>
      createUserAppTrialContentReadinessReport({
        trialReadinessReport,
        templateSelectionReport: trialTemplateSelectionReport,
        hasPrivacyBoundaryCopy: true,
      }),
    [trialReadinessReport, trialTemplateSelectionReport],
  );
  const mvpReleaseReadinessReport = useMemo(
    () =>
      createUserAppMvpReleaseReadinessReport({
        pwaReport: pwaReadinessReport,
        mvpPolishReport,
        trialReadinessReport,
        feedbackForm: trialFeedbackForm,
        trialContentReadinessReport,
        trialTemplateSelectionReport,
        technologyRouteDecided: true,
        browserMobileQaPassed: true,
        testsPassed: true,
        knownLimitationsAccepted: true,
        productionNonGoalsDocumented: true,
        ordinaryUserPathReady: true,
        ordinaryUserPathHidesAdminTerms: true,
        privacyLocalOnlyCopyReady: true,
        noUploadCopyReady: true,
        noTrainingCopyReady: true,
        noSensitiveDataCopyReady: true,
      }),
    [
      mvpPolishReport,
      pwaReadinessReport,
      trialContentReadinessReport,
      trialFeedbackForm,
      trialReadinessReport,
      trialTemplateSelectionReport,
    ],
  );
  const trialGoNoGoDecision = useMemo(
    () =>
      createUserAppTrialGoNoGoDecision({
        releaseReadinessReport: mvpReleaseReadinessReport,
        trialContentReadinessReport,
        trialTemplateSelectionReport,
        feedbackForm: trialFeedbackForm,
        testsPassed: true,
        knownLimitationsDocumented: true,
      }),
    [
      mvpReleaseReadinessReport,
      trialContentReadinessReport,
      trialFeedbackForm,
      trialTemplateSelectionReport,
    ],
  );
  const internalTrialOpsPack = useMemo(() => createUserAppInternalTrialOpsPack(), []);
  const trialObservationGuide = useMemo(() => createUserAppTrialObservationGuide(), []);
  const trialOutcomeReview = useMemo(
    () =>
      createUserAppTrialOutcomeReview({
        participantSessionsReviewed: 1,
      }),
    [],
  );
  const trialResultReview = useMemo(() => createUserAppTrialResultReview(), []);
  const trialDecisionFramework = useMemo(
    () =>
      createUserAppTrialDecisionFramework({
        review: trialResultReview,
      }),
    [trialResultReview],
  );
  const trialIterationBacklog = useMemo(
    () =>
      createUserAppTrialIterationBacklog({
        issueSummary: trialResultReview.issueSummary,
      }),
    [trialResultReview],
  );
  const trialIterationPlan = useMemo(
    () =>
      createUserAppTrialIterationPlan({
        backlog: trialIterationBacklog,
        decisionFramework: trialDecisionFramework,
        readyForNextInternalTrial: false,
      }),
    [trialDecisionFramework, trialIterationBacklog],
  );
  const trialIterationPriorityRecommendations = useMemo(
    () => trialIterationBacklog.items.map((item) => item.priorityRecommendation),
    [trialIterationBacklog],
  );
  const trialLearningSummary = useMemo(
    () =>
      createUserAppInternalTrialLearningSummary({
        resultReview: trialResultReview,
        iterationPlan: trialIterationPlan,
      }),
    [trialIterationPlan, trialResultReview],
  );
  const productDecisionGate = useMemo(
    () =>
      createUserAppProductDecisionGate({
        learningSummary: trialLearningSummary,
      }),
    [trialLearningSummary],
  );
  const nextPhaseRecommendation = useMemo(
    () =>
      createUserAppNextPhaseRecommendation({
        learningSummary: trialLearningSummary,
        decisionGate: productDecisionGate,
      }),
    [productDecisionGate, trialLearningSummary],
  );
  const internalTrialEvidencePack = useMemo(
    () =>
      createUserAppInternalTrialEvidencePack({
        learningSummary: trialLearningSummary,
        productDecisionGate,
      }),
    [productDecisionGate, trialLearningSummary],
  );
  const trialEvidenceSummary = useMemo(
    () =>
      createUserAppTrialEvidenceSummary({
        evidencePack: internalTrialEvidencePack,
      }),
    [internalTrialEvidencePack],
  );
  const evidenceSufficiencyGate = useMemo(
    () =>
      createUserAppEvidenceSufficiencyGate({
        evidencePack: internalTrialEvidencePack,
        evidenceSummary: trialEvidenceSummary,
      }),
    [internalTrialEvidencePack, trialEvidenceSummary],
  );
  const evidenceCollectionProtocol = useMemo(
    () => createUserAppEvidenceCollectionProtocol(),
    [],
  );
  const evidenceCollectionChecklist = useMemo(
    () =>
      createUserAppEvidenceCollectionChecklist({
        protocol: evidenceCollectionProtocol,
      }),
    [evidenceCollectionProtocol],
  );
  const evidenceCollectionQualityGate = useMemo(
    () =>
      createUserAppEvidenceCollectionQualityGate({
        protocol: evidenceCollectionProtocol,
        checklist: evidenceCollectionChecklist,
      }),
    [evidenceCollectionChecklist, evidenceCollectionProtocol],
  );
  const anonymousTrialDryRunPack = useMemo(
    () => createUserAppAnonymousTrialDryRunPack(),
    [],
  );
  const anonymousTrialDryRunChecklist = useMemo(
    () =>
      createUserAppAnonymousTrialDryRunChecklist({
        pack: anonymousTrialDryRunPack,
      }),
    [anonymousTrialDryRunPack],
  );
  const anonymousTrialDryRunReview = useMemo(
    () =>
      createUserAppAnonymousTrialDryRunReview({
        pack: anonymousTrialDryRunPack,
        checklist: anonymousTrialDryRunChecklist,
        evidenceProtocol: evidenceCollectionProtocol,
        evidenceChecklist: evidenceCollectionChecklist,
        evidenceQualityGate: evidenceCollectionQualityGate,
      }),
    [
      anonymousTrialDryRunChecklist,
      anonymousTrialDryRunPack,
      evidenceCollectionChecklist,
      evidenceCollectionProtocol,
      evidenceCollectionQualityGate,
    ],
  );
  const anonymousTrialLaunchPack = useMemo(
    () => createUserAppAnonymousTrialLaunchPack(),
    [],
  );
  const anonymousTrialLaunchReadiness = useMemo(
    () =>
      createUserAppAnonymousTrialLaunchReadiness({
        pack: anonymousTrialLaunchPack,
      }),
    [anonymousTrialLaunchPack],
  );
  const anonymousTrialPostLaunchHandoff = useMemo(
    () =>
      createUserAppAnonymousTrialPostLaunchHandoff({
        launchReadiness: anonymousTrialLaunchReadiness,
      }),
    [anonymousTrialLaunchReadiness],
  );
  const readinessReport = useMemo(
    () =>
      createUserAppReadinessReport({
        packageData: effectivePackage,
        shellViewModel: viewModel,
        onboarding,
        preferences: localPreferences,
        discoveryState,
        session: currentSession,
        mobileQaResult,
      }),
    [
      currentSession,
      discoveryState,
      effectivePackage,
      localPreferences,
      mobileQaResult,
      onboarding,
      viewModel,
    ],
  );
  const selectedTemplateId = viewModel.selection.selectedTemplateId;
  const selectedProgress = selectedTemplateId
    ? state.progressByTemplateId[selectedTemplateId]
    : undefined;
  const currentTemplate = viewModel.selectedTemplate;

  const updateSelectedStep = (stepId: string) => {
    setState((current) => ({
      ...current,
      navigation: {
        ...current.navigation,
        currentScreen: 'step-guide',
        selectedStepId: stepId,
      },
    }));
  };

  const selectTemplate = (templateId: string) => {
    setState((current) => selectUserAppTemplate(current, templateId));
  };

  const onboardingFromSession = (
    session: UserAppSessionState,
  ): UserOnboardingState => ({
    status: session.onboarding.status,
    currentStep: session.onboarding.currentStep,
    progress: {
      completedStepIds: [...session.onboarding.completedStepIds],
      skippedStepIds: [...session.onboarding.skippedStepIds],
      progressPercent: session.onboarding.progressPercent,
    },
    localOnly: true,
    containsUserPhoto: false,
    containsSensitiveProfile: false,
    writesTrainingInput: false,
  });

  const saveSession = () => {
    const result = saveUserAppSession(storageAdapter, currentSession);
    setStoredSession(result.session ?? currentSession);
    if (!result.ok) {
      setRecoveryReport(
        recoverUserAppSession({
          session: null,
          packageData: effectivePackage,
          issues: result.issues,
        }),
      );
    }
  };

  const loadSession = () => {
    const result = loadUserAppSession(storageAdapter);
    const report = recoverUserAppSession({
      session: result.session,
      packageData: effectivePackage,
      issues: result.issues,
    });

    setStoredSession(report.session);
    setRecoveryReport(report);
    setState((current) => ({
      ...current,
      navigation: {
        ...current.navigation,
        selectedTemplateId: report.session.selectedTemplateId,
        selectedStepId: report.session.activeStepId,
        currentScreen: report.canRestoreStepGuide ? 'step-guide' : 'template-detail',
      },
      progressByTemplateId: report.session.templateProgress
        ? {
            ...current.progressByTemplateId,
            [report.session.templateProgress.templateId]: {
              templateId: report.session.templateProgress.templateId,
              currentStepId: report.session.templateProgress.activeStepId,
              orderedStepIds: [...report.session.templateProgress.orderedStepIds],
              completedStepIds: [...report.session.templateProgress.completedStepIds],
              skippedStepIds: [...report.session.templateProgress.skippedStepIds],
              progressPercent: report.session.templateProgress.progressPercent,
              localOnly: true,
            },
          }
        : current.progressByTemplateId,
    }));
    setOnboarding(onboardingFromSession(report.session));
    setLocalPreferences(report.session.localPreferences);
    setDiscoveryState({
      filter: report.session.discovery.filter,
      sortMode: report.session.discovery.sortMode,
      preferredStyleTags: report.session.discovery.preferredStyleTags,
      localOnly: true,
      modifiesTemplatePackage: false,
      writesTrainingInput: false,
      writesProjectState: false,
    });
    setBoundaryTab(report.session.lastVisitedSection);
  };

  const clearTemplateProgress = () => {
    const nextSession = clearTemplateProgressFromSession(currentSession);
    setStoredSession(nextSession);
    setState((current) => {
      if (!selectedTemplateId) {
        return current;
      }

      const progressByTemplateId = { ...current.progressByTemplateId };
      delete progressByTemplateId[selectedTemplateId];
      return {
        ...current,
        navigation: {
          ...current.navigation,
          selectedStepId: undefined,
        },
        progressByTemplateId,
      };
    });
    saveUserAppSession(storageAdapter, nextSession);
  };

  const clearAllSession = () => {
    clearUserAppSession(storageAdapter);
    setStoredSession(createInitialUserAppSession({ status: 'reset' }));
    setRecoveryReport(null);
    setState(createInitialUserAppState());
    setOnboarding(createInitialUserOnboardingState());
    setLocalPreferences(resetUserLocalPreferences());
    setDiscoveryState(createInitialTemplateDiscoveryState());
    setBoundaryTab('guidance');
  };

  const startGuidance = () => {
    if (!effectivePackage || !selectedTemplateId) {
      setState((current) => ({
        ...current,
        navigation: navigateToCompatibility(current.navigation),
      }));
      return;
    }

    setState((current) =>
      startUserAppStepGuide(current, effectivePackage, selectedTemplateId),
    );
  };

  return (
    <section className="rounded-lg border border-stone-300 bg-stone-100 p-3 sm:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">
            Phase 8B PWA / Mobile Web MVP Polish
          </p>
          <h1 className="text-xl font-semibold text-stone-950">今日妆容练习</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600">
            这是本地移动 Web MVP 壳，用来预览妆容发现和分步跟练。它不是正式生产 App，
            不登录、不上传、不接后端、不启用相机或 AR，也不会用于训练。
          </p>
        </div>
        <div className="w-fit rounded-md bg-white px-3 py-2 text-xs text-stone-600">
          {effectivePackage ? effectivePackage.packageName : '未加载妆容包'}
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(280px,360px)_1fr]">
        <div className="grid content-start gap-4">
          <UserAppCompatibilityBanner compatibility={viewModel.compatibility} />
          <UserAppMobileHome
            onBrowseTemplates={() =>
              setState((current) => ({
                ...current,
                navigation: navigateToTemplateList(current.navigation),
              }))
            }
            onOpenPrivacy={() => setBoundaryTab('privacy')}
            onStartGuidance={startGuidance}
            selectedTemplate={currentTemplate}
            summary={viewModel.packageSummary}
            templates={viewModel.templates}
          />
          <UserTemplateList
            onSelectTemplate={selectTemplate}
            selectedTemplateId={selectedTemplateId}
            templates={viewModel.templates}
          />
        </div>

        <div className="grid content-start gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              className="min-h-11 rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  navigation: navigateBack(current.navigation),
                }))
              }
              type="button"
            >
              返回
            </button>
            <button
              className="min-h-11 rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  navigation: navigateToTools(current.navigation, selectedTemplateId),
                }))
              }
              type="button"
            >
              工具
            </button>
            <button
              className="min-h-11 rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  navigation: navigateToCompatibility(current.navigation),
                }))
              }
              type="button"
            >
              兼容性
            </button>
            <span className="rounded-md bg-white px-3 py-2 text-xs text-stone-500">
              当前页面：{state.navigation.currentScreen}
            </span>
          </div>

          <UserTemplateDetail
            canEnterStepGuide={viewModel.compatibility.canEnterStepGuide}
            onShowTools={() =>
              setState((current) => ({
                ...current,
                navigation: navigateToTools(current.navigation, selectedTemplateId),
              }))
            }
            onStartGuidance={startGuidance}
            template={currentTemplate}
          />

          {currentTemplate ? (
            <>
              <UserAppProgressPanel
                onReset={() =>
                  selectedTemplateId &&
                  setState((current) =>
                    resetUserAppTemplateProgress(current, selectedTemplateId),
                  )
                }
                progress={selectedProgress}
                totalSteps={currentTemplate.steps.length}
              />
              <UserMakeupStepGuide
                canEnterStepGuide={viewModel.compatibility.canEnterStepGuide}
                onCompleteStep={(stepId) =>
                  selectedTemplateId &&
                  setState((current) =>
                    completeCurrentUserAppStep(current, selectedTemplateId, stepId),
                  )
                }
                onNextStep={updateSelectedStep}
                onPreviousStep={updateSelectedStep}
                onSkipStep={(stepId) =>
                  selectedTemplateId &&
                  setState((current) =>
                    skipCurrentUserAppStep(current, selectedTemplateId, stepId),
                  )
                }
                template={currentTemplate}
              />
              <UserRegionInstructionView regions={currentTemplate.regionInstructions} />
              <UserToolProductPanel toolsAndProducts={currentTemplate.toolsAndProducts} />
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-600">
              没有可用模板详情。请先加载有效妆容包。
            </div>
          )}

          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
            <div className="grid gap-3">
              <div>
                <p className="text-xs font-semibold text-stone-500">用户路径</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {userSectionTabs.map(({ tabId, label }) => (
                    <button
                      key={tabId}
                      className={`min-h-11 rounded-md border px-3 py-2 text-sm ${
                        boundaryTab === tabId
                          ? 'border-teal-700 bg-teal-50 text-teal-900'
                          : 'border-stone-300 bg-white text-stone-700'
                      }`}
                      onClick={() => setBoundaryTab(tabId)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs font-semibold text-stone-500">管理员检查</p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  这里保留 MVP 试用管理、模板内容 QA、发布就绪度、内部试用运营、PWA、
                  readiness 和 contract 检查信息；普通用户不应把它们理解为正式功能。
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {adminSectionTabs.map(({ tabId, label }) => (
                <button
                  key={tabId}
                  className={`min-h-11 rounded-md border px-3 py-2 text-sm ${
                    boundaryTab === tabId
                      ? 'border-teal-700 bg-teal-50 text-teal-900'
                      : 'border-stone-300 bg-white text-stone-700'
                  }`}
                  onClick={() => setBoundaryTab(tabId)}
                  type="button"
                >
                  {label}
                </button>
              ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              {boundaryTab === 'guidance' ? (
                <div className="rounded-md border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-700">
                  没有用户照片时，模板指导照常工作。用户仍然可以先按步骤练习，不需要自拍、
                  上传、相机或 AR。
                </div>
              ) : null}

              {boundaryTab === 'discovery' ? (
                <UserTemplateDiscoveryPanel
                  discoveryState={discoveryState}
                  onDiscoveryStateChange={setDiscoveryState}
                  onSelectTemplate={selectTemplate}
                  packageData={effectivePackage}
                  preferences={localPreferences}
                  selectedTemplateId={selectedTemplateId}
                />
              ) : null}

              {boundaryTab === 'preparation' ? (
                <UserOnboardingFlow
                  onboarding={onboarding}
                  onOnboardingChange={setOnboarding}
                  onPreferencesChange={setLocalPreferences}
                  preferences={localPreferences}
                />
              ) : null}

              {boundaryTab === 'photo' ? (
                <>
                  <UserPhotoIntakePlaceholder placeholder={photoIntakePlaceholder} />
                  <UserPersonalizationPanel personalization={personalizationPlaceholder} />
                </>
              ) : null}

              {boundaryTab === 'preferences' ? (
                <>
                  <UserPreferenceSetupPanel
                    onPreferencesChange={setLocalPreferences}
                    preferences={localPreferences}
                  />
                  <UserPreferenceSummary
                    onResetPreferences={() => setLocalPreferences(resetUserLocalPreferences())}
                    preferences={localPreferences}
                  />
                </>
              ) : null}

              {boundaryTab === 'session' ? (
                <>
                  <UserAppSessionRecoveryNotice report={recoveryReport} />
                  <UserAppSessionPanel
                    onClearSession={clearAllSession}
                    onClearTemplateProgress={clearTemplateProgress}
                    onLoadSession={loadSession}
                    onResetPreferences={() => setLocalPreferences(resetUserLocalPreferences())}
                    onSaveSession={saveSession}
                    recoveryReport={recoveryReport}
                    session={currentSession}
                  />
                </>
              ) : null}

              {boundaryTab === 'pwa' ? (
                <UserAppPwaInstallPanel report={pwaReadinessReport} />
              ) : null}

              {boundaryTab === 'trialPack' ? (
                <UserAppTrialPackPanel pack={trialPack} />
              ) : null}

              {boundaryTab === 'trialFeedback' ? (
                <UserAppTrialFeedbackPanel
                  form={trialFeedbackForm}
                  summary={userAppTrialFeedbackMockSummary}
                />
              ) : null}

              {boundaryTab === 'trialReadiness' ? (
                <UserAppTrialReadinessPanel report={trialReadinessReport} />
              ) : null}

              {boundaryTab === 'templateContentQa' ? (
                <UserAppTemplateContentQaPanel reports={templateContentQaReports} />
              ) : null}

              {boundaryTab === 'trialTemplateSelection' ? (
                <UserAppTrialTemplateReadinessPanel
                  readinessReport={trialContentReadinessReport}
                  selectionReport={trialTemplateSelectionReport}
                />
              ) : null}

              {boundaryTab === 'trialContentReadiness' ? (
                <UserAppTrialTemplateReadinessPanel
                  readinessReport={trialContentReadinessReport}
                  selectionReport={trialTemplateSelectionReport}
                />
              ) : null}

              {boundaryTab === 'mvpReleaseReadiness' ? (
                <UserAppMvpReleaseReadinessPanel report={mvpReleaseReadinessReport} />
              ) : null}

              {boundaryTab === 'trialGoNoGo' ? (
                <UserAppTrialGoNoGoPanel decision={trialGoNoGoDecision} />
              ) : null}

              {boundaryTab === 'internalTrialOps' ? (
                <UserAppInternalTrialOpsPanel pack={internalTrialOpsPack} />
              ) : null}

              {boundaryTab === 'trialObservation' ? (
                <UserAppTrialObservationPanel
                  guide={trialObservationGuide}
                  summary={userAppTrialObservationMockSummary}
                />
              ) : null}

              {boundaryTab === 'trialOutcome' ? (
                <UserAppTrialOutcomePanel review={trialOutcomeReview} />
              ) : null}

              {boundaryTab === 'trialResultReview' ? (
                <UserAppTrialResultReviewPanel review={trialResultReview} />
              ) : null}

              {boundaryTab === 'trialIssueSummary' ? (
                <UserAppTrialIssueSummaryPanel summary={trialResultReview.issueSummary} />
              ) : null}

              {boundaryTab === 'trialDecisionFramework' ? (
                <UserAppTrialDecisionFrameworkPanel framework={trialDecisionFramework} />
              ) : null}

              {boundaryTab === 'trialIterationPlan' ? (
                <UserAppTrialIterationPlanPanel plan={trialIterationPlan} />
              ) : null}

              {boundaryTab === 'trialIterationBacklog' ? (
                <UserAppTrialIterationBacklogPanel backlog={trialIterationBacklog} />
              ) : null}

              {boundaryTab === 'trialIterationPriority' ? (
                <UserAppTrialIterationPriorityPanel
                  recommendations={trialIterationPriorityRecommendations}
                />
              ) : null}

              {boundaryTab === 'trialLearningSummary' ? (
                <UserAppInternalTrialLearningSummaryPanel summary={trialLearningSummary} />
              ) : null}

              {boundaryTab === 'productDecisionGate' ? (
                <UserAppProductDecisionGatePanel gate={productDecisionGate} />
              ) : null}

              {boundaryTab === 'nextPhaseRecommendation' ? (
                <UserAppNextPhaseRecommendationPanel recommendation={nextPhaseRecommendation} />
              ) : null}

              {boundaryTab === 'internalTrialEvidencePack' ? (
                <UserAppInternalTrialEvidencePackPanel evidencePack={internalTrialEvidencePack} />
              ) : null}

              {boundaryTab === 'trialEvidenceSummary' ? (
                <UserAppTrialEvidenceSummaryPanel evidenceSummary={trialEvidenceSummary} />
              ) : null}

              {boundaryTab === 'evidenceSufficiencyGate' ? (
                <UserAppEvidenceSufficiencyGatePanel gate={evidenceSufficiencyGate} />
              ) : null}

              {boundaryTab === 'evidenceCollectionProtocol' ? (
                <UserAppEvidenceCollectionProtocolPanel protocol={evidenceCollectionProtocol} />
              ) : null}

              {boundaryTab === 'evidenceCollectionChecklist' ? (
                <UserAppEvidenceCollectionChecklistPanel checklist={evidenceCollectionChecklist} />
              ) : null}

              {boundaryTab === 'evidenceCollectionQualityGate' ? (
                <UserAppEvidenceCollectionQualityGatePanel
                  gate={evidenceCollectionQualityGate}
                />
              ) : null}

              {boundaryTab === 'anonymousTrialDryRunPack' ? (
                <UserAppAnonymousTrialDryRunPackPanel pack={anonymousTrialDryRunPack} />
              ) : null}

              {boundaryTab === 'anonymousTrialDryRunChecklist' ? (
                <UserAppAnonymousTrialDryRunChecklistPanel
                  checklist={anonymousTrialDryRunChecklist}
                />
              ) : null}

              {boundaryTab === 'anonymousTrialDryRunReview' ? (
                <UserAppAnonymousTrialDryRunReviewPanel review={anonymousTrialDryRunReview} />
              ) : null}

              {boundaryTab === 'anonymousTrialLaunchPack' ? (
                <UserAppAnonymousTrialLaunchPackPanel pack={anonymousTrialLaunchPack} />
              ) : null}

              {boundaryTab === 'anonymousTrialLaunchReadiness' ? (
                <UserAppAnonymousTrialLaunchReadinessPanel
                  readiness={anonymousTrialLaunchReadiness}
                />
              ) : null}

              {boundaryTab === 'anonymousTrialPostLaunchHandoff' ? (
                <UserAppAnonymousTrialPostLaunchHandoffPanel
                  handoff={anonymousTrialPostLaunchHandoff}
                />
              ) : null}

              {boundaryTab === 'mvpPolish' ? (
                <UserAppMvpPolishChecklist report={mvpPolishReport} />
              ) : null}

              {boundaryTab === 'readiness' ? (
                <UserAppReadinessPanel report={readinessReport} />
              ) : null}

              {boundaryTab === 'mobileQa' ? (
                <UserAppMobileQaPanel result={mobileQaResult} />
              ) : null}

              {boundaryTab === 'interaction' ? (
                <UserAppInteractionChecklist
                  mobileChecks={mobileQaResult.checks}
                  readinessReport={readinessReport}
                />
              ) : null}

              {boundaryTab === 'privacy' ? <UserPrivacyNotice /> : null}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
