import { describe, expect, it } from 'vitest';
import { classifyTrainingBridgeIssue } from '../src/training/quarantine';

describe('failed sample quarantine PNG mask reasons', () => {
  it('classifies PNG mask codec and sidecar issues', () => {
    expect(classifyTrainingBridgeIssue({ severity: 'error', code: 'png-mask-checksum-mismatch', message: 'bad checksum' })).toBe('png-mask-checksum-mismatch');
    expect(classifyTrainingBridgeIssue({ severity: 'error', code: 'png-mask-dimension-mismatch', message: 'bad dimensions' })).toBe('png-mask-dimension-mismatch');
    expect(classifyTrainingBridgeIssue({ severity: 'warning', code: 'codec-sidecar-mismatch', message: 'bad sidecar' })).toBe('codec-sidecar-mismatch');
    expect(classifyTrainingBridgeIssue({ severity: 'error', code: 'png-alpha-mask-roundtrip-failed', message: 'bad roundtrip' })).toBe('png-alpha-mask-roundtrip-failed');
  });
});
