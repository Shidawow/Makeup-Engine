import {
  createDefaultUserAppTrialFeedbackQuestions,
  createUserAppTrialFeedbackForm,
  summarizeUserAppTrialFeedback,
  validateUserAppTrialFeedbackSafety,
  type UserAppTrialFeedbackAnswer,
  type UserAppTrialFeedbackForm,
  type UserAppTrialFeedbackIssue,
  type UserAppTrialFeedbackSummary,
} from '../../user-app/userAppTrialFeedback';
import { createUserAppTrialReadinessReport } from '../../user-app/userAppTrialReadiness';
import { createUserAppTrialPack } from '../../user-app/userAppTrialPack';
import { userAppTrialPackIncompleteExample, userAppTrialPackReadyExample } from './user-app-trial-pack.example';

export const userAppTrialFeedbackReadyExample: UserAppTrialFeedbackForm =
  createUserAppTrialFeedbackForm({
    formId: 'user-app-trial-feedback-ready-example',
  });

export const userAppTrialFeedbackBlockedExample: UserAppTrialFeedbackForm =
  createUserAppTrialFeedbackForm({
    formId: 'user-app-trial-feedback-blocked-example',
    questions: createDefaultUserAppTrialFeedbackQuestions().filter(
      (question) => question.questionId !== 'privacy_clear',
    ),
    boundaryOverrides: {
      submitsToBackend: true,
      collectsContact: true,
      collectsPhoto: true,
      writesTrainingInput: true,
    },
  });

export const userAppTrialFeedbackMockAnswers: UserAppTrialFeedbackAnswer[] = [
  { questionId: 'understandable', value: 5, mockOnly: true },
  { questionId: 'willing_to_follow', value: 4, mockOnly: true },
  { questionId: 'step_count_fit', value: '刚好', mockOnly: true },
  { questionId: 'tools_useful', value: 4, mockOnly: true },
  { questionId: 'recommendation_helpful', value: 4, mockOnly: true },
  { questionId: 'privacy_clear', value: 5, mockOnly: true },
  { questionId: 'most_confusing_step', value: '眼影晕染边界', mockOnly: true },
  { questionId: 'continue_using', value: '愿意继续使用', mockOnly: true },
  { questionId: 'business_interest', value: '愿意推荐给朋友', mockOnly: true },
  { questionId: 'free_text', value: '希望步骤里的颜色强度再具体一点。', mockOnly: true },
];

export const userAppTrialFeedbackMockSummary: UserAppTrialFeedbackSummary =
  summarizeUserAppTrialFeedback(userAppTrialFeedbackMockAnswers);

export const userAppTrialFeedbackUnsafeExamplePayload = {
  realName: '示例姓名',
  contact: 'user@example.com',
  photoBase64: 'data:image/png;base64,abc123',
  healthInfo: '过敏史示例',
  answer: '这是一条不应被接受的 unsafe feedback 示例。',
};

export const userAppTrialFeedbackUnsafeExampleIssues: UserAppTrialFeedbackIssue[] =
  validateUserAppTrialFeedbackSafety(userAppTrialFeedbackUnsafeExamplePayload);

export const userAppTrialReadinessReadyExample = createUserAppTrialReadinessReport({
  trialPack: userAppTrialPackReadyExample,
  feedbackForm: userAppTrialFeedbackReadyExample,
});

export const userAppTrialReadinessBlockedExample = createUserAppTrialReadinessReport({
  trialPack: userAppTrialPackIncompleteExample,
  feedbackForm: userAppTrialFeedbackBlockedExample,
});

export const userAppTrialReadinessWarningExample = createUserAppTrialReadinessReport({
  trialPack: createUserAppTrialPack({
    packId: 'user-app-trial-pack-warning-example',
    templateCoverage: [],
  }),
  feedbackForm: userAppTrialFeedbackReadyExample,
  hasNoUploadCopy: true,
  hasNoTrainingCopy: true,
  hasNoSensitiveDataCopy: true,
});
