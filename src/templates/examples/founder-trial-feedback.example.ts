import type { FounderTrialFeedbackEntry } from '../../template-engine';
import { createFounderTrialFeedbackReport } from '../../template-engine';

export const founderTrialFeedbackEntriesReadyExample: FounderTrialFeedbackEntry[] = [
  {
    feedbackId: 'fb-user-app-first-impression',
    category: 'first_impression',
    sentiment: 'positive',
    severity: 'medium',
    source: 'founder_manual_review',
    summary: '普通用户路径已经像一个可演示的轻量 App',
    detail:
      '首页、模板选择、详情和跟练路径能连起来，适合作为 founder demo 的第一条路线。',
    linkedMvpGapId: 'gap-user-app-interaction-polish',
    recommendation: 'keep_current_demo_path',
    internalOnly: true,
    notRealUserResearch: true,
  },
  {
    feedbackId: 'fb-trial-content-quality',
    category: 'trial_content_quality',
    sentiment: 'uncertain',
    severity: 'high',
    source: 'demo_script_trial',
    summary: '三套 trial templates 有演示价值，但教程真实感还需要加强',
    detail:
      '新手通勤淡妆最容易理解，日系和韩系模板需要更多妆感差异、手法细节和完成效果判断。',
    linkedTemplateId: 'mvp-trial-template-beginner-commute',
    linkedMvpGapId: 'gap-trial-content-realism',
    recommendation: 'prioritize_trial_content_revision',
    internalOnly: true,
    notRealUserResearch: true,
  },
  {
    feedbackId: 'fb-step-guidance-readable',
    category: 'step_guidance',
    sentiment: 'neutral',
    severity: 'medium',
    source: 'local_fixture_review',
    summary: '步骤能读懂，但下一步动作和完成判断可以更明确',
    detail:
      '每一步最好补充“做到什么样算完成”和“如果画重了怎么修”的短句，降低新手犹豫。',
    linkedMvpGapId: 'gap-step-guidance-completion-cues',
    recommendation: 'prioritize_user_app_interaction',
    internalOnly: true,
    notRealUserResearch: true,
  },
  {
    feedbackId: 'fb-mobile-usability',
    category: 'mobile_usability',
    sentiment: 'neutral',
    severity: 'medium',
    source: 'acceptance_trial',
    summary: '移动端可演示，但需要减少后台长面板带来的观感压力',
    detail:
      '普通用户路径不能被 Template Studio 信息干扰；管理员面板应该继续折叠和摘要化。',
    linkedMvpGapId: 'gap-mobile-demo-polish',
    recommendation: 'prioritize_user_app_interaction',
    internalOnly: true,
    notRealUserResearch: true,
  },
  {
    feedbackId: 'fb-photo-to-template-trust',
    category: 'photo_to_template_workflow',
    sentiment: 'uncertain',
    severity: 'high',
    source: 'operator_workflow_review',
    summary: '照片到模板后台链路值得继续，但必须保持半自动和人工审核表述',
    detail:
      '可以继续投入 semantic candidate 和 human review editing，但不能宣称自动高质量拆妆。',
    linkedMvpGapId: 'gap-photo-to-template-trust-boundary',
    recommendation: 'prioritize_photo_to_template_semantics',
    internalOnly: true,
    notRealUserResearch: true,
  },
  {
    feedbackId: 'fb-trust-privacy-copy',
    category: 'trust_and_boundaries',
    sentiment: 'negative',
    severity: 'medium',
    source: 'founder_manual_review',
    summary: '最容易让人不信任的是边界说明不够贴近用户语言',
    detail:
      '需要把“不上传、不训练、不保存照片”和“不是自动发布”分别放在用户路径和管理员路径的合适位置。',
    linkedMvpGapId: 'gap-trust-privacy-copy',
    recommendation: 'clarify_trust_and_privacy_copy',
    internalOnly: true,
    notRealUserResearch: true,
  },
  {
    feedbackId: 'fb-production-gap-defer',
    category: 'market_readiness',
    sentiment: 'uncertain',
    severity: 'high',
    source: 'founder_manual_review',
    summary: 'Production readiness 和真实用户增长还不能作为当前必须做',
    detail:
      '当前应该先解决 demo 内容可信度、用户路径跟练感和 photo-to-template 边界，再考虑真实用户验证。',
    linkedMvpGapId: 'gap-production-readiness-deferred',
    recommendation: 'defer_production_readiness',
    internalOnly: true,
    notRealUserResearch: true,
  },
];

export const founderTrialFeedbackReportReadyExample =
  createFounderTrialFeedbackReport({
    entries: founderTrialFeedbackEntriesReadyExample,
  });

export const founderTrialFeedbackReportUnsafeExample =
  createFounderTrialFeedbackReport({
    reportId: 'founder-trial-feedback-13b-unsafe',
    entries: [
      {
        ...founderTrialFeedbackEntriesReadyExample[0],
        feedbackId: 'fb-unsafe-contact-photo',
        summary: '错误示例：包含联系方式和照片路径',
        detail:
          '请联系 demo@example.com，并查看 /Users/star/photo.png 的照片效果。',
      },
    ],
  });
