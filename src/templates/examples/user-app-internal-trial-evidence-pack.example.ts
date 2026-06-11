import {
  createUserAppInternalTrialEvidencePack,
  type UserAppInternalTrialEvidenceItem,
  type UserAppInternalTrialEvidencePack,
  type UserAppInternalTrialEvidenceType,
} from '../../user-app/userAppInternalTrialEvidencePack';
import {
  userAppProductDecisionGateInsufficientSignalsExample,
  userAppProductDecisionGateMvpValidationExample,
  userAppProductDecisionGatePrivacyBlockerExample,
  userAppProductDecisionGateShellIssueExample,
} from './user-app-product-decision-gate.example';

const evidenceItem = (
  evidenceId: string,
  type: UserAppInternalTrialEvidenceType,
  summary: string,
  strength: UserAppInternalTrialEvidenceItem['strength'] = 'medium',
): UserAppInternalTrialEvidenceItem => ({
  evidenceId,
  type,
  source: 'mock_example',
  summary,
  strength,
  evidenceCount: strength === 'strong' ? 4 : 1,
  supportsDecision: strength !== 'blocked',
  anonymousOrExampleOnly: true,
  containsRealName: false,
  containsContact: false,
  containsPhoto: false,
  containsHealthInfo: false,
  containsSensitiveIdentity: false,
  containsBiometric: false,
  requestsUpload: false,
  writesTrainingInput: false,
});

export const userAppInternalTrialEvidencePackNoEvidenceExample: UserAppInternalTrialEvidencePack =
  createUserAppInternalTrialEvidencePack({
    packId: 'internal-trial-evidence-pack-no-evidence',
    includeDerivedEvidence: false,
  });

export const userAppInternalTrialEvidencePackInsufficientExample: UserAppInternalTrialEvidencePack =
  createUserAppInternalTrialEvidencePack({
    packId: 'internal-trial-evidence-pack-insufficient',
    productDecisionGate: userAppProductDecisionGateInsufficientSignalsExample,
    includeDerivedEvidence: false,
    additionalEvidence: [
      evidenceItem(
        'evidence-anonymous-observation-one',
        'anonymous_observation',
        '一条匿名观察显示参与者能打开 Shell，但证据太少。',
      ),
    ],
  });

export const userAppInternalTrialEvidencePackNextInternalTrialExample: UserAppInternalTrialEvidencePack =
  createUserAppInternalTrialEvidencePack({
    packId: 'internal-trial-evidence-pack-next-internal-trial',
    productDecisionGate: userAppProductDecisionGateShellIssueExample,
    includeDerivedEvidence: false,
    additionalEvidence: [
      evidenceItem('evidence-observation-ready', 'anonymous_observation', '匿名观察显示能找到推荐模板。', 'strong'),
      evidenceItem('evidence-value-ready', 'template_value_signal', '参与者认为模板选择有价值。', 'strong'),
      evidenceItem('evidence-privacy-ready', 'privacy_trust_signal', '参与者理解本地-only、不上传、不训练。'),
      evidenceItem('evidence-decision-ready', 'product_decision_signal', '9D 建议先补证据再推进。'),
    ],
  });

export const userAppInternalTrialEvidencePackMvpPlanningExample: UserAppInternalTrialEvidencePack =
  createUserAppInternalTrialEvidencePack({
    packId: 'internal-trial-evidence-pack-mvp-planning',
    productDecisionGate: userAppProductDecisionGateMvpValidationExample,
    includeDerivedEvidence: false,
    additionalEvidence: [
      evidenceItem('evidence-observation-mvp', 'anonymous_observation', '多条匿名观察显示参与者能完成主路径。', 'strong'),
      evidenceItem('evidence-task-completion-mvp', 'task_completion_signal', '参与者能完成打开、选择模板、开始跟练。', 'strong'),
      evidenceItem('evidence-step-mvp', 'step_comprehension_signal', '参与者能理解至少 3 个步骤。', 'strong'),
      evidenceItem('evidence-value-mvp', 'template_value_signal', '参与者认为模板和推荐有继续使用价值。', 'strong'),
      evidenceItem('evidence-shell-mvp', 'shell_usability_signal', '移动 Shell 路径可理解。', 'strong'),
      evidenceItem('evidence-privacy-mvp', 'privacy_trust_signal', '本地-only、不上传、不训练文案清楚。', 'strong'),
      evidenceItem('evidence-ops-mvp', 'trial_ops_signal', '试用脚本和观察记录可执行。', 'strong'),
      evidenceItem('evidence-issue-taxonomy-mvp', 'issue_taxonomy_signal', '问题已能归类为内容、Shell、隐私或流程。', 'strong'),
      evidenceItem('evidence-iteration-mvp', 'iteration_priority_signal', '迭代优先级已有明确依据。', 'strong'),
      evidenceItem('evidence-decision-mvp', 'product_decision_signal', '9D 决策门支持进入 MVP validation planning。', 'strong'),
    ],
    minimumEvidenceItems: 8,
  });

export const userAppInternalTrialEvidencePackPrivacyBlockerExample: UserAppInternalTrialEvidencePack =
  createUserAppInternalTrialEvidencePack({
    packId: 'internal-trial-evidence-pack-privacy-blocker',
    productDecisionGate: userAppProductDecisionGatePrivacyBlockerExample,
    includeDerivedEvidence: false,
    additionalEvidence: [
      {
        ...evidenceItem(
          'evidence-privacy-blocker-photo-request',
          'blocked_boundary_signal',
          '不安全示例：要求参与者上传真实照片。',
          'blocked',
        ),
        containsPhoto: true,
        requestsUpload: true,
      },
    ],
  });

export const userAppInternalTrialEvidencePackStrongValueWeakShellExample: UserAppInternalTrialEvidencePack =
  createUserAppInternalTrialEvidencePack({
    packId: 'internal-trial-evidence-pack-strong-value-weak-shell',
    includeDerivedEvidence: false,
    additionalEvidence: [
      evidenceItem('evidence-observation-value-strong', 'anonymous_observation', '参与者愿意继续试用。', 'strong'),
      evidenceItem('evidence-template-value-strong', 'template_value_signal', '模板价值反馈强。', 'strong'),
      evidenceItem('evidence-shell-weak', 'shell_usability_signal', 'Shell 导航仍让参与者迟疑。', 'weak'),
      evidenceItem('evidence-privacy-value', 'privacy_trust_signal', '隐私说明基本清楚。'),
    ],
  });

export const userAppInternalTrialEvidencePackStrongContentInsufficientValueExample: UserAppInternalTrialEvidencePack =
  createUserAppInternalTrialEvidencePack({
    packId: 'internal-trial-evidence-pack-content-only',
    includeDerivedEvidence: false,
    additionalEvidence: [
      evidenceItem('evidence-step-content-strong', 'step_comprehension_signal', '步骤内容清楚。', 'strong'),
      evidenceItem('evidence-issue-content-strong', 'issue_taxonomy_signal', '内容问题分类清楚。', 'strong'),
      evidenceItem('evidence-privacy-content-only', 'privacy_trust_signal', '隐私说明清楚。'),
    ],
  });

export { evidenceItem as createUserAppInternalTrialEvidenceExampleItem };
