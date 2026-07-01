import { describe, expect, it } from 'vitest';
import {
  internalTrialFeedbackPromptsReadyExample,
  internalTrialFeedbackPromptsUnsafeExample,
} from '../src/templates/examples';

const forbiddenPromptTerms = [
  '姓名',
  '电话',
  '邮箱',
  '住址',
  '社交账号',
  '健康',
  '皮肤敏感',
  '上传',
  '真实照片',
  'face embedding',
  'biometric',
];

describe('Internal trial feedback prompts', () => {
  it('keeps the ready prompt pack safe and anonymous', () => {
    expect(internalTrialFeedbackPromptsReadyExample).toHaveLength(8);

    const questions = internalTrialFeedbackPromptsReadyExample.map(
      (prompt) => prompt.question,
    );

    expect(questions).toContain('你是否一眼看懂这个 App 是做什么的？');
    expect(questions).toContain('三套模板哪套最吸引你？');
    expect(questions).toContain('哪一步最像真实化妆指导？');
    expect(questions).toContain('哪一步最不清楚？');
    expect(questions).toContain('你是否相信这些步骤可以跟练？');
    expect(questions).toContain('是否有地方让你误以为系统正在识别你本人？');
    expect(questions).toContain('手机上按钮和文字是否舒服？');
    expect(questions).toContain('你是否愿意继续看更多妆容模板？');

    for (const prompt of internalTrialFeedbackPromptsReadyExample) {
      expect(prompt.safeToRecord).toBe(true);
      for (const term of forbiddenPromptTerms) {
        expect(prompt.question).not.toContain(term);
      }
    }
  });

  it('keeps unsafe examples explicitly unsafe for validation coverage', () => {
    const text = JSON.stringify(internalTrialFeedbackPromptsUnsafeExample);

    expect(text).toContain('姓名');
    expect(text).toContain('邮箱');
    expect(text).toContain('电话');
    expect(text).toContain('真实照片');
    expect(text).toContain('皮肤敏感信息');
    expect(
      internalTrialFeedbackPromptsUnsafeExample.every((prompt) => !prompt.safeToRecord),
    ).toBe(true);
  });
});
