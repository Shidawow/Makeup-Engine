import { describe, expect, it } from 'vitest';
import {
  TEMPLATE_PRODUCTION_BATCH_SCHEMA_VERSION,
  type TemplateProductionTaskStatus,
} from '../src/templates/schema/template-production-batch.schema';

describe('template production batch schema', () => {
  it('defines Phase 6I local production statuses without training-ready', () => {
    const statuses: TemplateProductionTaskStatus[] = [
      'draft',
      'blocked_by_source_image',
      'needs_artifact_binding',
      'ready_for_analysis',
      'analyzing',
      'analysis_failed',
      'analysis_complete',
      'needs_mask_review',
      'needs_human_correction',
      'correction_complete',
      'evidence_ready',
      'ready_for_template_review',
      'approved',
      'rejected',
      'published',
    ];

    expect(TEMPLATE_PRODUCTION_BATCH_SCHEMA_VERSION).toBe('template-production-batch-v0.1');
    expect(statuses).toContain('needs_artifact_binding');
    expect(statuses).toContain('ready_for_analysis');
    expect(statuses).toContain('published');
    expect(statuses.join(',')).not.toContain('training-ready');
  });
});
