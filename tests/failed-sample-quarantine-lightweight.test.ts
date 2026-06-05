import { describe, expect, it } from 'vitest';
import { classifyTrainingBridgeIssue } from '../src/training/quarantine';

describe('failed sample quarantine lightweight reasons', () => {
  it('classifies classifier and binary artifact issues', () => {
    expect(classifyTrainingBridgeIssue({ severity: 'error', code: 'binary-mask-roundtrip-invalid', message: 'bad' })).toBe('binary-mask-roundtrip-failed');
    expect(classifyTrainingBridgeIssue({ severity: 'error', code: 'pixel-mask-alignment-invalid', message: 'bad' })).toBe('pixel-mask-alignment-failed');
    expect(classifyTrainingBridgeIssue({ severity: 'error', code: 'classifier-positive-empty', message: 'bad' })).toBe('insufficient-classifier-positive-samples');
  });
});
