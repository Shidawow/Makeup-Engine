import { describe, expect, it } from 'vitest';
import {
  getRejectReasonDisplayText,
  rejectTemplateProductionTaskWithReason,
  summarizeRejectReasons,
  validateRejectReason,
} from '../src/template-engine/production';
import { createTemplateProductionBatchFromSourceImages } from '../src/template-engine/production';
import { createTemplateProductionTestManifest } from './templateProductionTestUtils';

describe('template production reject reason capture', () => {
  it('rejects missing taxonomy reasons', () => {
    const task = createTemplateProductionBatchFromSourceImages({
      manifest: createTemplateProductionTestManifest(),
    }).tasks[0]!;
    const rejected = rejectTemplateProductionTaskWithReason(task, {});

    expect(validateRejectReason(undefined).valid).toBe(false);
    expect(rejected.currentStatus).toBe(task.currentStatus);
    expect(rejected.issues.map((issue) => issue.code)).toContain('reject-reason-required');
  });

  it('records taxonomy reason, note, timestamp, and event for rejected tasks', () => {
    const task = createTemplateProductionBatchFromSourceImages({
      manifest: createTemplateProductionTestManifest(),
    }).tasks[0]!;
    const rejected = rejectTemplateProductionTaskWithReason(task, {
      reason: 'bad_source_image',
      note: '眼部遮挡',
      rejectedBy: 'operator-a',
      rejectedAt: '2026-05-31T01:00:00.000Z',
    });
    const summary = summarizeRejectReasons([rejected]);

    expect(rejected.currentStatus).toBe('rejected');
    expect(rejected.rejectReason).toBe('bad_source_image');
    expect(rejected.rejectNote).toBe('眼部遮挡');
    expect(rejected.rejectedAt).toBe('2026-05-31T01:00:00.000Z');
    expect(rejected.events.at(-1)?.metadata?.reason).toBe('bad_source_image');
    expect(summary).toEqual([{ reason: 'bad_source_image', label: getRejectReasonDisplayText('bad_source_image'), count: 1 }]);
    expect(getRejectReasonDisplayText('bad_source_image').length).toBeGreaterThan(0);
  });
});
