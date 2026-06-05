import { describe, expect, it } from 'vitest';
import { classifyTrainingBridgeIssue } from '../src/training/quarantine';

describe('failed sample quarantine baseline reasons', () => {
  it('classifies baseline-specific validation issues', () => {
    expect(
      classifyTrainingBridgeIssue({
        severity: 'error',
        code: 'alpha-grid-invalid',
        message: 'bad alpha grid',
      }),
    ).toBe('invalid-alpha-grid');
    expect(
      classifyTrainingBridgeIssue({
        severity: 'error',
        code: 'baseline-prediction-failed',
        message: 'prediction failed',
      }),
    ).toBe('baseline-prediction-failed');
  });
});
