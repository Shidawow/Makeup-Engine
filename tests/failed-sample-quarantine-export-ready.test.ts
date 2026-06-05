import { describe, expect, it } from 'vitest';
import { classifyTrainingBridgeIssue } from '../src/training/quarantine';

describe('failed sample quarantine export-ready reasons', () => {
  it('classifies Phase 6F export and artifact issues', () => {
    expect(classifyTrainingBridgeIssue({ code: 'provider-compatibility-failed', message: 'bad', severity: 'error' })).toBe('provider-compatibility-failed');
    expect(classifyTrainingBridgeIssue({ code: 'export-package-validation-failed', message: 'bad', severity: 'error' })).toBe('export-package-validation-failed');
    expect(classifyTrainingBridgeIssue({ code: 'raw-rgba-roundtrip-failed', message: 'bad', severity: 'error' })).toBe('raw-rgba-roundtrip-failed');
  });
});
