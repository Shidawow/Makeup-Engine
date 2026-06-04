import type { UserLocalPreferences, UserOnboardingState } from '../../user-app';
import {
  completeOnboardingStep,
  skipOnboarding,
  skipOnboardingStep,
  summarizeOnboardingState,
} from '../../user-app';

export interface UserOnboardingFlowProps {
  onboarding: UserOnboardingState;
  preferences: UserLocalPreferences;
  onOnboardingChange: (state: UserOnboardingState) => void;
  onPreferencesChange: (preferences: UserLocalPreferences) => void;
}

const stepLabels: Record<UserOnboardingState['currentStep'], string> = {
  welcome: '欢迎',
  skill_level: '化妆熟练度',
  guidance_style: '指导详细程度',
  available_time: '可用时间',
  available_tools: '可用工具',
  preferred_styles: '偏好风格',
  privacy_reminder: '隐私提醒',
  completed: '已完成',
};

export function UserOnboardingFlow({
  onboarding,
  preferences,
  onOnboardingChange,
  onPreferencesChange,
}: UserOnboardingFlowProps) {
  const summary = summarizeOnboardingState(onboarding);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">
            Local onboarding
          </p>
          <h2 className="text-base font-semibold text-stone-950">本地新手引导</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            这些问题只用于本地提示，不登录、不上传、不保存照片、不生成训练数据。
          </p>
        </div>
        <span className="w-fit rounded-md bg-stone-100 px-3 py-1 text-xs text-stone-600">
          {summary.progressPercent}%
        </span>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
        <p className="text-xs font-semibold text-stone-500">当前步骤</p>
        <p className="mt-1 text-sm font-medium text-stone-950">
          {stepLabels[onboarding.currentStep]}
        </p>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          {onboarding.status === 'completed'
            ? '引导已完成，偏好将作为本地指导提示使用。'
            : onboarding.status === 'skipped'
              ? '你已跳过引导，系统会继续使用默认本地偏好。'
              : '可以按步骤设置偏好，也可以随时跳过。'}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 disabled:opacity-40"
          disabled={onboarding.status === 'completed' || onboarding.status === 'skipped'}
          onClick={() => onOnboardingChange(skipOnboardingStep(onboarding))}
          type="button"
        >
          跳过当前步骤
        </button>
        <button
          className="rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
          disabled={onboarding.status === 'completed' || onboarding.status === 'skipped'}
          onClick={() => {
            const nextState = completeOnboardingStep(onboarding);
            onOnboardingChange(nextState);
            onPreferencesChange({
              ...preferences,
              onboardingCompleted: nextState.status === 'completed',
            });
          }}
          type="button"
        >
          完成当前步骤
        </button>
        <button
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700"
          onClick={() => onOnboardingChange(skipOnboarding(onboarding))}
          type="button"
        >
          跳过引导
        </button>
        <button
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700"
          onClick={() =>
            onOnboardingChange({
              status: 'not_started',
              currentStep: 'welcome',
              progress: {
                completedStepIds: [],
                skippedStepIds: [],
                progressPercent: 0,
              },
              localOnly: true,
              containsUserPhoto: false,
              containsSensitiveProfile: false,
              writesTrainingInput: false,
            })
          }
          type="button"
        >
          重新开始
        </button>
      </div>

      <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
        <p className="font-medium">隐私边界</p>
        <p>引导不请求相机权限，不收集真实照片，不保存敏感身份信息，不写入 project-state。</p>
      </div>
    </section>
  );
}
