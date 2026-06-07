import {
  createDefaultUserAppTrialResultSignals,
  createUserAppTrialResultReview,
  type UserAppTrialResultReview,
  type UserAppTrialResultSignal,
} from '../../user-app/userAppTrialResultReview';

const withSignals = (
  replacements: Array<Pick<UserAppTrialResultSignal, 'signalId' | 'score' | 'summary'>>,
): UserAppTrialResultSignal[] =>
  createDefaultUserAppTrialResultSignals().map((signal) => {
    const replacement = replacements.find((item) => item.signalId === signal.signalId);
    return replacement ? { ...signal, ...replacement } : signal;
  });

export const userAppTrialResultReviewCleanExample: UserAppTrialResultReview =
  createUserAppTrialResultReview({
    reviewId: 'trial-result-review-clean',
  });

export const userAppTrialResultReviewContentHeavyExample: UserAppTrialResultReview =
  createUserAppTrialResultReview({
    reviewId: 'trial-result-review-content-heavy',
    signals: withSignals([
      {
        signalId: 'step-comprehension',
        score: 2,
        summary: '参与者看不懂步骤 2 的晕染方向。',
      },
      {
        signalId: 'content-quality',
        score: 2,
        summary: '模板区域说明过短，无法判断涂抹范围。',
      },
    ]),
  });

export const userAppTrialResultReviewShellHeavyExample: UserAppTrialResultReview =
  createUserAppTrialResultReview({
    reviewId: 'trial-result-review-shell-heavy',
    signals: withSignals([
      {
        signalId: 'task-completion',
        score: 2,
        summary: '参与者找不到可开始模板入口。',
      },
      {
        signalId: 'shell-usability',
        score: 2,
        summary: '移动端按钮和管理员区域距离太近，容易误点。',
      },
    ]),
  });

export const userAppTrialResultReviewPrivacyBoundaryExample: UserAppTrialResultReview =
  createUserAppTrialResultReview({
    reviewId: 'trial-result-review-privacy-boundary',
    collectsContact: true,
    collectsPhotos: true,
  });

export const userAppTrialResultReviewInsufficientSignalsExample: UserAppTrialResultReview =
  createUserAppTrialResultReview({
    reviewId: 'trial-result-review-insufficient-signals',
    signals: createDefaultUserAppTrialResultSignals().slice(0, 3),
  });

export const userAppTrialResultReviewReadyFor9CExample: UserAppTrialResultReview =
  createUserAppTrialResultReview({
    reviewId: 'trial-result-review-ready-9c',
    readyForPhase9C: true,
  });
