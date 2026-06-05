import { describe, expect, it } from 'vitest';
import { classifyTrainingBridgeIssue } from '../src/training/quarantine';

describe('failed sample quarantine codec and ONNX reasons', () => {
  it('classifies codec, smoke, and ONNX issues', () => {
    expect(classifyTrainingBridgeIssue({ code: 'png-image-decode-failed', message: 'bad', severity: 'error' })).toBe('png-image-decode-failed');
    expect(classifyTrainingBridgeIssue({ code: 'runtime-smoke-failed', message: 'bad', severity: 'error' })).toBe('runtime-smoke-failed');
    expect(classifyTrainingBridgeIssue({ code: 'onnx-prototype-validation-failed', message: 'bad', severity: 'error' })).toBe('onnx-prototype-validation-failed');
  });
});
