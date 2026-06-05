import { describe, expect, it } from 'vitest';
import { classifyTrainingBridgeIssue } from '../src/training/quarantine';

describe('image-conditioned failed sample quarantine reasons', () => {
  it('classifies pixel and feature issues', () => {
    expect(classifyTrainingBridgeIssue({ severity: 'error', code: 'pixel-missing', message: 'missing pixel' })).toBe('missing-pixel-artifact');
    expect(classifyTrainingBridgeIssue({ severity: 'error', code: 'feature-extraction-failed', message: 'bad feature' })).toBe('feature-extraction-failed');
  });
});
