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
  createUserAppReadinessReport,
  createUserAppSessionStorageAdapter,
  createUserAppShellModel,
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
import { UserAppCompatibilityBanner } from './UserAppCompatibilityBanner';
import { UserAppHome } from './UserAppHome';
import { UserAppInteractionChecklist } from './UserAppInteractionChecklist';
import { UserAppMobileQaPanel } from './UserAppMobileQaPanel';
import { UserAppProgressPanel } from './UserAppProgressPanel';
import { UserAppReadinessPanel } from './UserAppReadinessPanel';
import { UserAppSessionPanel } from './UserAppSessionPanel';
import { UserAppSessionRecoveryNotice } from './UserAppSessionRecoveryNotice';
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

const sectionTabs: Array<{ tabId: UserAppShellSection; label: string }> = [
  { tabId: 'guidance', label: '模板指导' },
  { tabId: 'discovery', label: '发现妆容' },
  { tabId: 'preparation', label: '我的准备' },
  { tabId: 'photo', label: '照片与个性化' },
  { tabId: 'preferences', label: '我的偏好' },
  { tabId: 'session', label: '本地状态' },
  { tabId: 'readiness', label: 'App 就绪度' },
  { tabId: 'mobileQa', label: '移动端 QA' },
  { tabId: 'interaction', label: '交互检查' },
  { tabId: 'privacy', label: '隐私说明' },
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
            Phase 7H browser and mobile QA shell
          </p>
          <h1 className="text-xl font-semibold text-stone-950">用户 App MVP Shell</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600">
            这是本地 contract-driven prototype，只消费 UserAppTemplatePackage；不是正式生产 App，
            也不是 iOS 原生 App、后端、相机、AR 或训练流程。
          </p>
        </div>
        <div className="w-fit rounded-md bg-white px-3 py-2 text-xs text-stone-600">
          {effectivePackage ? effectivePackage.packageName : '未加载 package'}
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(280px,360px)_1fr]">
        <div className="grid content-start gap-4">
          <UserAppCompatibilityBanner compatibility={viewModel.compatibility} />
          <UserAppHome
            onBrowseTemplates={() =>
              setState((current) => ({
                ...current,
                navigation: navigateToTemplateList(current.navigation),
              }))
            }
            summary={viewModel.packageSummary}
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
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs text-stone-700"
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
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs text-stone-700"
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
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs text-stone-700"
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
              没有可用模板详情。请先加载有效的 UserAppTemplatePackage。
            </div>
          )}

          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
            <div className="flex flex-wrap gap-2">
              {sectionTabs.map(({ tabId, label }) => (
                <button
                  key={tabId}
                  className={`rounded-md border px-3 py-2 text-sm ${
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
