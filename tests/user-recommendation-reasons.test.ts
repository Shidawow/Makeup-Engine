import { describe, expect, it } from 'vitest';
import {
  createRecommendationWarningMessage,
  createUserFriendlyRecommendationReason,
  createUserFriendlyRecommendationSummary,
  createWhyNotRecommendedMessage,
  createWhyRecommendedMessage,
} from '../src/user-app';

describe('user recommendation reasons', () => {
  it('creates user-friendly recommendation messages without exposing score details', () => {
    const reasons = [
      createUserFriendlyRecommendationReason('beginner_friendly'),
      createUserFriendlyRecommendationReason('style_match'),
    ];
    const summary = createUserFriendlyRecommendationSummary(reasons);

    expect(summary).toContain('新手');
    expect(summary).toContain('风格偏好');
    expect(summary).not.toContain('score');
    expect(summary).not.toContain('UserAppTemplatePackage');
  });

  it('separates why recommended and why not recommended messages', () => {
    const reasons = [
      createUserFriendlyRecommendationReason('short_duration'),
      createUserFriendlyRecommendationReason('tool_mismatch'),
    ];

    expect(createWhyRecommendedMessage(reasons)).toContain('时间不多');
    expect(createWhyNotRecommendedMessage(reasons)).toContain('工具');
  });

  it('maps contract warnings into user-facing copy', () => {
    expect(createRecommendationWarningMessage('template has no required tools')).toContain(
      '工具',
    );
    expect(
      createRecommendationWarningMessage('step x missing matching region instruction'),
    ).toContain('上妆区域');
    expect(createRecommendationWarningMessage('$.x contains object URL')).toContain(
      '临时资源',
    );
  });
});
