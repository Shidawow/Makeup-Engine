import { describe, expect, it } from 'vitest';
import {
  bumpTemplateVersion,
  compareTemplateVersions,
  createInitialTemplateVersion,
  createTemplateVersionChangeLog,
  summarizeTemplateVersionHistory,
  validateTemplateVersion,
} from '../src/template-engine/library';

describe('Template versioning', () => {
  it('uses deterministic semantic versions starting at 0.1.0', () => {
    expect(createInitialTemplateVersion()).toBe('0.1.0');
    expect(bumpTemplateVersion('0.1.0', 'patch')).toBe('0.1.1');
    expect(bumpTemplateVersion('0.1.1', 'minor')).toBe('0.2.0');
    expect(bumpTemplateVersion('0.2.0', 'major')).toBe('1.0.0');
    expect(compareTemplateVersions('0.2.0', '0.1.9')).toBeGreaterThan(0);
    expect(validateTemplateVersion('1.0.0').valid).toBe(true);
    expect(validateTemplateVersion('1.0').valid).toBe(false);
  });

  it('summarizes version history deterministically', () => {
    const history = [
      createTemplateVersionChangeLog({
        nextVersion: '0.1.0',
        changeType: 'initial',
        reason: 'created',
        createdAt: '2026-05-31T00:00:00.000Z',
      }),
    ];

    expect(summarizeTemplateVersionHistory(history)).toContain('template version history');
  });
});
