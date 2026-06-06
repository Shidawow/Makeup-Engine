export const USER_APP_TRIAL_OBSERVATION_SCHEMA_VERSION =
  'user-app-trial-observation-v0.1' as const;

export type UserAppTrialObservationStatus = 'ready' | 'blocked';

export type UserAppTrialObservationSignalId =
  | 'home_understood'
  | 'recommendation_found'
  | 'guidance_started'
  | 'steps_understood'
  | 'tools_understood'
  | 'stuck_step_identified'
  | 'privacy_understood'
  | 'willing_to_continue'
  | 'template_value_seen';

export interface UserAppTrialObservationSignal {
  signalId: UserAppTrialObservationSignalId;
  label: string;
  observerPrompt: string;
  goodSignal: string;
  riskSignal: string;
  order: number;
}

export interface UserAppTrialObservationNote {
  noteId: string;
  signalId: UserAppTrialObservationSignalId;
  note: string;
  mockOnly: true;
  containsPersonalData: false;
}

export interface UserAppTrialObservationIssue {
  issueId: string;
  area: 'signals' | 'privacy' | 'boundary';
  severity: 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppTrialObservationGuide {
  schemaVersion: typeof USER_APP_TRIAL_OBSERVATION_SCHEMA_VERSION;
  guideId: string;
  title: string;
  status: UserAppTrialObservationStatus;
  signals: UserAppTrialObservationSignal[];
  observerInstructions: string[];
  issues: UserAppTrialObservationIssue[];
  localOnly: true;
  documentedTemplateOnly: true;
  backendRecordSystem: false;
  collectsRealName: boolean;
  collectsContact: boolean;
  asksForPhotos: boolean;
  collectsHealthInfo: boolean;
  collectsSensitiveIdentity: boolean;
  collectsBiometrics: boolean;
  writesTrainingInput: boolean;
  writesProjectStateUserRecords: boolean;
}

export interface UserAppTrialObservationSummary {
  schemaVersion: typeof USER_APP_TRIAL_OBSERVATION_SCHEMA_VERSION;
  guideId: string;
  notes: UserAppTrialObservationNote[];
  positiveSignals: string[];
  issueThemes: string[];
  localOnly: true;
  mockOnly: true;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppTrialObservationGuideInput {
  guideId?: string;
  title?: string;
  signals?: UserAppTrialObservationSignal[];
  observerInstructions?: string[];
  collectsRealName?: boolean;
  collectsContact?: boolean;
  asksForPhotos?: boolean;
  collectsHealthInfo?: boolean;
  collectsSensitiveIdentity?: boolean;
  collectsBiometrics?: boolean;
  writesTrainingInput?: boolean;
  writesProjectStateUserRecords?: boolean;
}

const requiredSignalIds: UserAppTrialObservationSignalId[] = [
  'home_understood',
  'recommendation_found',
  'guidance_started',
  'steps_understood',
  'tools_understood',
  'stuck_step_identified',
  'privacy_understood',
  'willing_to_continue',
  'template_value_seen',
];

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 71);

const issue = (
  input: Omit<UserAppTrialObservationIssue, 'issueId'>,
): UserAppTrialObservationIssue => ({
  ...input,
  issueId: `trial-observation-${input.area}-${Math.abs(hashText(input.message))}`,
});

export const createDefaultUserAppTrialObservationSignals =
  (): UserAppTrialObservationSignal[] => [
    {
      signalId: 'home_understood',
      label: '理解首页',
      observerPrompt: '观察参与者是否能说出首页能做什么。',
      goodSignal: '能指出推荐妆容、开始跟练或隐私说明入口。',
      riskSignal: '不知道下一步在哪里。',
      order: 1,
    },
    {
      signalId: 'recommendation_found',
      label: '找到推荐模板',
      observerPrompt: '观察参与者是否能找到推荐或可开始模板。',
      goodSignal: '能选择一个模板并理解推荐理由。',
      riskSignal: '只看到管理/QA 信息，忽略用户路径。',
      order: 2,
    },
    {
      signalId: 'guidance_started',
      label: '开始跟练',
      observerPrompt: '观察参与者是否能进入分步指导。',
      goodSignal: '能点击开始并看到第一步。',
      riskSignal: '卡在详情页或兼容性提示。',
      order: 3,
    },
    {
      signalId: 'steps_understood',
      label: '理解步骤',
      observerPrompt: '观察参与者是否知道每一步做什么、做在哪里。',
      goodSignal: '能复述动作、区域和预期效果。',
      riskSignal: '步骤太抽象或术语太多。',
      order: 4,
    },
    {
      signalId: 'tools_understood',
      label: '理解工具',
      observerPrompt: '观察参与者是否知道需要哪些工具或产品。',
      goodSignal: '能判断自己是否具备工具。',
      riskSignal: '工具/产品建议读不懂或不可替代。',
      order: 5,
    },
    {
      signalId: 'stuck_step_identified',
      label: '记录卡点',
      observerPrompt: '只记录卡在哪类步骤，不记录个人身份。',
      goodSignal: '能定位是文案、布局、按钮还是内容问题。',
      riskSignal: '把卡点归因到用户个人信息。',
      order: 6,
    },
    {
      signalId: 'privacy_understood',
      label: '理解隐私说明',
      observerPrompt: '观察参与者是否理解本地-only、不上传、不训练。',
      goodSignal: '能复述不需要照片、相机、上传或账号。',
      riskSignal: '以为需要上传自拍或登录。',
      order: 7,
    },
    {
      signalId: 'willing_to_continue',
      label: '愿意继续试用',
      observerPrompt: '观察参与者是否愿意继续完成更多步骤。',
      goodSignal: '愿意继续或说明适合什么场景。',
      riskSignal: '因为理解成本或信任问题不愿继续。',
      order: 8,
    },
    {
      signalId: 'template_value_seen',
      label: '感到模板有价值',
      observerPrompt: '观察参与者是否觉得模板推荐和内容有帮助。',
      goodSignal: '能说出模板价值或希望新增的场景。',
      riskSignal: '觉得模板内容泛泛或不可信。',
      order: 9,
    },
  ];

export const validateUserAppTrialObservationGuide = (
  guide: UserAppTrialObservationGuide,
): UserAppTrialObservationIssue[] => {
  const signalIds = guide.signals.map((signal) => signal.signalId);
  const missingSignals = requiredSignalIds.filter((signalId) => !signalIds.includes(signalId));
  const issues: UserAppTrialObservationIssue[] = [];

  if (missingSignals.length > 0) {
    issues.push(
      issue({
        area: 'signals',
        severity: 'blocking',
        message: `观察维度不完整：${missingSignals.join(', ')}`,
        recommendation: '补齐首页、推荐、跟练、步骤、工具、卡点、隐私、继续意愿和模板价值观察。',
      }),
    );
  }

  if (
    guide.collectsRealName ||
    guide.collectsContact ||
    guide.asksForPhotos ||
    guide.collectsHealthInfo ||
    guide.collectsSensitiveIdentity ||
    guide.collectsBiometrics ||
    guide.writesTrainingInput ||
    guide.writesProjectStateUserRecords
  ) {
    issues.push(
      issue({
        area: 'privacy',
        severity: 'blocking',
        message: '观察模板要求收集照片、联系方式、健康、敏感身份或真实记录。',
        recommendation: '观察记录只能写匿名体验现象，不保存真实个人数据。',
      }),
    );
  }

  return issues;
};

export const createUserAppTrialObservationGuide = (
  input: CreateUserAppTrialObservationGuideInput = {},
): UserAppTrialObservationGuide => {
  const guideBase = {
    schemaVersion: USER_APP_TRIAL_OBSERVATION_SCHEMA_VERSION,
    guideId: input.guideId ?? 'internal-trial-observation-guide-v0',
    title: input.title ?? '内部试用观察记录模板',
    status: 'blocked' as UserAppTrialObservationStatus,
    signals: input.signals ?? createDefaultUserAppTrialObservationSignals(),
    observerInstructions:
      input.observerInstructions ?? [
        '只记录匿名体验现象，不记录真实身份资料。',
        '观察用户是否理解首页、推荐、跟练步骤、工具、隐私和模板价值。',
        '如果出现敏感信息或需要上传照片的情况，立即暂停记录。',
      ],
    issues: [] as UserAppTrialObservationIssue[],
    localOnly: true,
    documentedTemplateOnly: true,
    backendRecordSystem: false,
    collectsRealName: Boolean(input.collectsRealName),
    collectsContact: Boolean(input.collectsContact),
    asksForPhotos: Boolean(input.asksForPhotos),
    collectsHealthInfo: Boolean(input.collectsHealthInfo),
    collectsSensitiveIdentity: Boolean(input.collectsSensitiveIdentity),
    collectsBiometrics: Boolean(input.collectsBiometrics),
    writesTrainingInput: Boolean(input.writesTrainingInput),
    writesProjectStateUserRecords: Boolean(input.writesProjectStateUserRecords),
  } satisfies UserAppTrialObservationGuide;

  const issues = validateUserAppTrialObservationGuide(guideBase);
  return {
    ...guideBase,
    status: issues.length > 0 ? 'blocked' : 'ready',
    issues,
  };
};

export const createUserAppTrialObservationSummary = (
  guide: UserAppTrialObservationGuide,
  notes: UserAppTrialObservationNote[] = [],
): UserAppTrialObservationSummary => ({
  schemaVersion: USER_APP_TRIAL_OBSERVATION_SCHEMA_VERSION,
  guideId: guide.guideId,
  notes,
  positiveSignals: notes.filter((note) => note.note.includes('顺利')).map((note) => note.note),
  issueThemes: notes.filter((note) => note.note.includes('卡')).map((note) => note.note),
  localOnly: true,
  mockOnly: true,
  writesTrainingInput: false,
  writesProjectStateUserRecords: false,
});
