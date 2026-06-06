export const USER_APP_TRIAL_FEEDBACK_SCHEMA_VERSION = 'user-app-trial-feedback-v0.1' as const;

export type UserAppTrialFeedbackQuestionId =
  | 'understandable'
  | 'willing_to_follow'
  | 'step_count_fit'
  | 'tools_useful'
  | 'recommendation_helpful'
  | 'privacy_clear'
  | 'most_confusing_step'
  | 'continue_using'
  | 'business_interest'
  | 'free_text';

export type UserAppTrialFeedbackQuestionKind =
  | 'rating_1_5'
  | 'single_choice'
  | 'short_text'
  | 'long_text';

export type UserAppTrialFeedbackStatus = 'ready' | 'warning' | 'blocked';

export interface UserAppTrialFeedbackQuestion {
  questionId: UserAppTrialFeedbackQuestionId;
  order: number;
  prompt: string;
  kind: UserAppTrialFeedbackQuestionKind;
  required: boolean;
  privacySafe: true;
  collectsSensitiveData: false;
}

export interface UserAppTrialFeedbackForm {
  schemaVersion: typeof USER_APP_TRIAL_FEEDBACK_SCHEMA_VERSION;
  formId: string;
  title: string;
  status: UserAppTrialFeedbackStatus;
  questions: UserAppTrialFeedbackQuestion[];
  issues: UserAppTrialFeedbackIssue[];
  localOnly: true;
  deterministic: true;
  productionForm: false;
  submitsToBackend: boolean;
  collectsRealName: boolean;
  collectsContact: boolean;
  collectsPhoto: boolean;
  collectsHealthInfo: boolean;
  collectsSensitiveIdentity: boolean;
  writesTrainingInput: boolean;
  writesProjectStateUserRecords: boolean;
}

export interface UserAppTrialFeedbackAnswer {
  questionId: UserAppTrialFeedbackQuestionId;
  value: string | number | boolean | string[];
  mockOnly?: boolean;
}

export interface UserAppTrialFeedbackSummary {
  schemaVersion: typeof USER_APP_TRIAL_FEEDBACK_SCHEMA_VERSION;
  answerCount: number;
  averageRating: number | null;
  confusingStepMentions: string[];
  wantsToContinueCount: number;
  businessInterestSignals: string[];
  issues: UserAppTrialFeedbackIssue[];
  localOnly: true;
  mockOnly: true;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface UserAppTrialFeedbackIssue {
  issueId: string;
  area: 'form' | 'answer' | 'privacy' | 'boundary';
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

const requiredQuestionIds: UserAppTrialFeedbackQuestionId[] = [
  'understandable',
  'willing_to_follow',
  'step_count_fit',
  'tools_useful',
  'recommendation_helpful',
  'privacy_clear',
  'most_confusing_step',
  'continue_using',
  'business_interest',
  'free_text',
];

const forbiddenKeyPattern =
  /(realName|fullName|name|姓名|contact|email|phone|wechat|微信|照片|photo|image|base64|health|健康|sensitive|identity|身份|faceEmbedding|biometricId|biometric|medical)/i;

const forbiddenStringPattern =
  /(data:image\/|blob:|base64,|@.+\..+|\b\d{3}[- ]?\d{3,4}[- ]?\d{4}\b|健康|过敏史|身份证|护照|真实姓名)/i;

const looksLikeBase64Image = (value: string): boolean =>
  value.length > 80 && /^[A-Za-z0-9+/=]+$/.test(value);

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 31);

const issue = (input: Omit<UserAppTrialFeedbackIssue, 'issueId'>): UserAppTrialFeedbackIssue => ({
  ...input,
  issueId: `trial-feedback-${input.area}-${input.severity}-${Math.abs(hashText(input.message))}`,
});

export const createDefaultUserAppTrialFeedbackQuestions =
  (): UserAppTrialFeedbackQuestion[] => [
    {
      questionId: 'understandable',
      order: 1,
      prompt: '你能看懂这个妆容练习流程吗？',
      kind: 'rating_1_5',
      required: true,
      privacySafe: true,
      collectsSensitiveData: false,
    },
    {
      questionId: 'willing_to_follow',
      order: 2,
      prompt: '你愿意照着步骤做一次吗？',
      kind: 'rating_1_5',
      required: true,
      privacySafe: true,
      collectsSensitiveData: false,
    },
    {
      questionId: 'step_count_fit',
      order: 3,
      prompt: '步骤数量感觉太多、太少，还是刚好？',
      kind: 'single_choice',
      required: true,
      privacySafe: true,
      collectsSensitiveData: false,
    },
    {
      questionId: 'tools_useful',
      order: 4,
      prompt: '工具和产品建议对你有帮助吗？',
      kind: 'rating_1_5',
      required: true,
      privacySafe: true,
      collectsSensitiveData: false,
    },
    {
      questionId: 'recommendation_helpful',
      order: 5,
      prompt: '模板推荐对你选择妆容有帮助吗？',
      kind: 'rating_1_5',
      required: true,
      privacySafe: true,
      collectsSensitiveData: false,
    },
    {
      questionId: 'privacy_clear',
      order: 6,
      prompt: '本地-only、不上传、不训练的隐私说明清楚吗？',
      kind: 'rating_1_5',
      required: true,
      privacySafe: true,
      collectsSensitiveData: false,
    },
    {
      questionId: 'most_confusing_step',
      order: 7,
      prompt: '哪一步最让你困惑？',
      kind: 'short_text',
      required: true,
      privacySafe: true,
      collectsSensitiveData: false,
    },
    {
      questionId: 'continue_using',
      order: 8,
      prompt: '你愿意之后继续使用这样的跟练吗？',
      kind: 'single_choice',
      required: true,
      privacySafe: true,
      collectsSensitiveData: false,
    },
    {
      questionId: 'business_interest',
      order: 9,
      prompt: '你是否愿意付费或推荐给朋友？这是非敏感商业兴趣问题。',
      kind: 'single_choice',
      required: false,
      privacySafe: true,
      collectsSensitiveData: false,
    },
    {
      questionId: 'free_text',
      order: 10,
      prompt: '还有什么想补充的体验反馈？不要填写姓名、联系方式、照片或健康信息。',
      kind: 'long_text',
      required: false,
      privacySafe: true,
      collectsSensitiveData: false,
    },
  ];

const scanUnsafeValue = (value: unknown, path = 'feedback'): UserAppTrialFeedbackIssue[] => {
  if (value === null || value === undefined) return [];
  if (typeof value === 'string') {
    if (forbiddenStringPattern.test(value) || looksLikeBase64Image(value)) {
      return [
        issue({
          area: 'privacy',
          severity: 'blocking',
          message: `反馈内容包含禁止收集的信息：${path}`,
          recommendation: '移除照片/base64、联系方式、健康信息、敏感身份信息或真实姓名。',
        }),
      ];
    }
    return [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => scanUnsafeValue(item, `${path}[${index}]`));
  }
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, item]) => {
      const keyIssue = forbiddenKeyPattern.test(key)
        ? [
            issue({
              area: 'privacy',
              severity: 'blocking' as const,
              message: `反馈字段包含禁止收集的信息：${path}.${key}`,
              recommendation: '反馈 schema 不能包含姓名、联系方式、照片、健康、敏感身份或生物识别字段。',
            }),
          ]
        : [];
      return [...keyIssue, ...scanUnsafeValue(item, `${path}.${key}`)];
    });
  }
  return [];
};

export const validateUserAppTrialFeedbackSafety = (
  value: unknown,
): UserAppTrialFeedbackIssue[] => scanUnsafeValue(value);

export const validateUserAppTrialFeedbackForm = (
  form: UserAppTrialFeedbackForm,
): UserAppTrialFeedbackIssue[] => {
  const questionIds = form.questions.map((question) => question.questionId);
  const missingQuestions = requiredQuestionIds.filter((id) => !questionIds.includes(id));
  const ordered = form.questions.every((question, index, questions) =>
    index === 0 ? question.order === 1 : question.order > questions[index - 1].order,
  );
  const issues: UserAppTrialFeedbackIssue[] = [];

  if (missingQuestions.length > 0) {
    issues.push(
      issue({
        area: 'form',
        severity: 'blocking',
        message: `反馈问题不完整，缺少：${missingQuestions.join(', ')}`,
        recommendation: '补齐理解、跟练意愿、步骤数量、工具建议、推荐、隐私、困惑步骤、继续使用、商业兴趣和自由反馈问题。',
      }),
    );
  }

  if (!ordered) {
    issues.push(
      issue({
        area: 'form',
        severity: 'blocking',
        message: '反馈问题顺序不递增。',
        recommendation: '按用户反馈路径排序问题。',
      }),
    );
  }

  if (
    form.submitsToBackend ||
    form.collectsRealName ||
    form.collectsContact ||
    form.collectsPhoto ||
    form.collectsHealthInfo ||
    form.collectsSensitiveIdentity ||
    form.writesTrainingInput ||
    form.writesProjectStateUserRecords
  ) {
    issues.push(
      issue({
        area: 'boundary',
        severity: 'blocking',
        message: '反馈表越过了本地、无后端、无照片、无敏感信息、无训练边界。',
        recommendation: '反馈表只能作为本地/文档化结构和 mock/example 数据使用。',
      }),
    );
  }

  return issues;
};

const statusFromIssues = (
  issues: readonly UserAppTrialFeedbackIssue[],
): UserAppTrialFeedbackStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'warning';
  return 'ready';
};

export const createUserAppTrialFeedbackForm = (
  input: {
    formId?: string;
    title?: string;
    questions?: UserAppTrialFeedbackQuestion[];
    boundaryOverrides?: Partial<
      Record<
        | 'submitsToBackend'
        | 'collectsRealName'
        | 'collectsContact'
        | 'collectsPhoto'
        | 'collectsHealthInfo'
        | 'collectsSensitiveIdentity'
        | 'writesTrainingInput'
        | 'writesProjectStateUserRecords',
        boolean
      >
    >;
  } = {},
): UserAppTrialFeedbackForm => {
  const draft: UserAppTrialFeedbackForm = {
    schemaVersion: USER_APP_TRIAL_FEEDBACK_SCHEMA_VERSION,
    formId: input.formId ?? 'user-app-trial-feedback-form-v0',
    title: input.title ?? 'MVP 试用反馈表预览',
    status: 'ready',
    questions: input.questions ?? createDefaultUserAppTrialFeedbackQuestions(),
    issues: [],
    localOnly: true,
    deterministic: true,
    productionForm: false,
    submitsToBackend: false,
    collectsRealName: false,
    collectsContact: false,
    collectsPhoto: false,
    collectsHealthInfo: false,
    collectsSensitiveIdentity: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
    ...input.boundaryOverrides,
  };
  const issues = validateUserAppTrialFeedbackForm(draft);

  return {
    ...draft,
    status: statusFromIssues(issues),
    issues,
  };
};

export const summarizeUserAppTrialFeedback = (
  answers: UserAppTrialFeedbackAnswer[],
): UserAppTrialFeedbackSummary => {
  const issues = validateUserAppTrialFeedbackSafety(answers);
  const ratings = answers
    .map((answer) => answer.value)
    .filter((value): value is number => typeof value === 'number');
  const confusingStepMentions = answers
    .filter((answer) => answer.questionId === 'most_confusing_step')
    .map((answer) => String(answer.value))
    .filter(Boolean);
  const wantsToContinueCount = answers.filter(
    (answer) => answer.questionId === 'continue_using' && String(answer.value).includes('愿意'),
  ).length;
  const businessInterestSignals = answers
    .filter((answer) => answer.questionId === 'business_interest')
    .map((answer) => String(answer.value))
    .filter(Boolean);

  return {
    schemaVersion: USER_APP_TRIAL_FEEDBACK_SCHEMA_VERSION,
    answerCount: answers.length,
    averageRating:
      ratings.length > 0
        ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(2))
        : null,
    confusingStepMentions,
    wantsToContinueCount,
    businessInterestSignals,
    issues,
    localOnly: true,
    mockOnly: true,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
