import { describe, expect, it } from 'vitest';
import { classifyTrainingBridgeIssue } from '../src/training/quarantine/failedSampleQuarantine';

describe('failed sample quarantine PNG image reasons', () => {
  it('maps PNG image codec issues to explicit quarantine reasons', () => {
    expect(classifyTrainingBridgeIssue({ code: 'png-image-sidecar-missing', message: 'missing', severity: 'error' })).toBe('png-image-sidecar-missing');
    expect(classifyTrainingBridgeIssue({ code: 'png-image-checksum-mismatch', message: 'bad', severity: 'error' })).toBe('png-image-checksum-mismatch');
    expect(classifyTrainingBridgeIssue({ code: 'image-mask-codec-mismatch', message: 'bad', severity: 'error' })).toBe('image-mask-codec-mismatch');
  });
});
