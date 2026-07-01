import type { InternalTrialFeedbackPrompt } from '../../template-engine';

export const internalTrialFeedbackPromptsReadyExample: InternalTrialFeedbackPrompt[] = [
  {
    id: 'understand_app_purpose',
    question: '你是否一眼看懂这个 App 是做什么的？',
    promptType: 'single_choice',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'favorite_template',
    question: '三套模板哪套最吸引你？',
    promptType: 'single_choice',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'most_real_guidance_step',
    question: '哪一步最像真实化妆指导？',
    promptType: 'free_text_short',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'least_clear_step',
    question: '哪一步最不清楚？',
    promptType: 'free_text_short',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'trust_step_practice',
    question: '你是否相信这些步骤可以跟练？',
    promptType: 'rating',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'misunderstood_personal_recognition',
    question: '是否有地方让你误以为系统正在识别你本人？',
    promptType: 'free_text_short',
    safeToRecord: true,
    forbiddenCollection: ['真实照片', '姓名', '联系方式'],
  },
  {
    id: 'mobile_comfort',
    question: '手机上按钮和文字是否舒服？',
    promptType: 'rating',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'willing_more_templates',
    question: '你是否愿意继续看更多妆容模板？',
    promptType: 'single_choice',
    safeToRecord: true,
    forbiddenCollection: [],
  },
];

export const internalTrialFeedbackPromptsUnsafeExample: InternalTrialFeedbackPrompt[] = [
  {
    id: 'unsafe_contact_collection',
    question: '请留下姓名、邮箱和电话，方便后续联系。',
    promptType: 'free_text_short',
    safeToRecord: false,
    forbiddenCollection: ['姓名', '邮箱', '电话'],
  },
  {
    id: 'unsafe_photo_collection',
    question: '请上传你的真实照片或皮肤敏感信息。',
    promptType: 'free_text_short',
    safeToRecord: false,
    forbiddenCollection: ['真实照片', '健康/皮肤敏感信息'],
  },
];
