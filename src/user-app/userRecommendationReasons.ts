export type UserRecommendationReasonCode =
  | 'beginner_friendly'
  | 'advanced_fit'
  | 'short_duration'
  | 'time_mismatch'
  | 'minimal_tools'
  | 'tool_mismatch'
  | 'style_match'
  | 'occasion_match'
  | 'default_discovery'
  | 'warning_present'
  | 'blocked_template';

export interface UserFriendlyRecommendationReason {
  code: UserRecommendationReasonCode;
  message: string;
  positive: boolean;
}

const reasonMessages: Record<UserRecommendationReasonCode, string> = {
  beginner_friendly: '这套妆容难度较低，步骤更适合新手跟练。',
  advanced_fit: '这套妆容层次更完整，适合熟练用户练习细节。',
  short_duration: '这套妆容用时较短，适合时间不多时练习。',
  time_mismatch: '这套妆容预计用时较长，当前不会优先推荐。',
  minimal_tools: '这套妆容需要的工具较少，更容易直接开始。',
  tool_mismatch: '这套妆容需要较多工具，当前不作为优先推荐。',
  style_match: '它匹配你选择的风格偏好，所以优先展示。',
  occasion_match: '它适合你选择的使用场景。',
  default_discovery: '当前使用默认发现排序，未创建真实用户画像。',
  warning_present: '这套妆容可以预览，但开始前需要留意提示。',
  blocked_template: '这套妆容目前缺少必要信息，暂时不能推荐给用户跟练。',
};

export const createUserFriendlyRecommendationReason = (
  code: UserRecommendationReasonCode,
): UserFriendlyRecommendationReason => ({
  code,
  message: reasonMessages[code],
  positive: !['time_mismatch', 'tool_mismatch', 'warning_present', 'blocked_template'].includes(
    code,
  ),
});

export const createUserFriendlyRecommendationSummary = (
  reasons: readonly UserFriendlyRecommendationReason[],
): string => {
  if (reasons.length === 0) {
    return '当前按模板默认顺序展示，没有使用真实 AI 推荐。';
  }

  return reasons.map((reason) => reason.message).join(' ');
};

export const createWhyRecommendedMessage = (
  reasons: readonly UserFriendlyRecommendationReason[],
): string => {
  const positiveReasons = reasons.filter((reason) => reason.positive);

  if (positiveReasons.length === 0) {
    return '这套妆容按默认发现排序展示，不代表真实 AI 个性化推荐。';
  }

  return createUserFriendlyRecommendationSummary(positiveReasons);
};

export const createWhyNotRecommendedMessage = (
  reasons: readonly UserFriendlyRecommendationReason[],
): string => {
  const negativeReasons = reasons.filter((reason) => !reason.positive);

  if (negativeReasons.length === 0) {
    return '这套妆容没有明显阻断原因，只是当前排序没有优先展示。';
  }

  return createUserFriendlyRecommendationSummary(negativeReasons);
};

export const createRecommendationWarningMessage = (message: string): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes('tool')) {
    return '这套妆容的工具信息需要先确认，跟练前请检查工具清单。';
  }

  if (normalized.includes('product')) {
    return '这套妆容的产品建议还不完整，跟练前请确认可替代产品。';
  }

  if (normalized.includes('object url') || normalized.includes('blob:')) {
    return '模板包含临时资源引用，不能用于用户侧推荐。';
  }

  if (normalized.includes('local absolute path')) {
    return '模板包含本地路径，不能用于用户侧推荐。';
  }

  if (normalized.includes('image bytes') || normalized.includes('data:image')) {
    return '模板包含图片字节或内联图片数据，不能用于用户侧推荐。';
  }

  if (normalized.includes('missing matching region instruction')) {
    return '这套妆容缺少具体上妆区域说明，暂时不能推荐给用户跟练。';
  }

  return message;
};
