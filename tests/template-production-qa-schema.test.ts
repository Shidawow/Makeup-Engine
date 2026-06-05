import { describe, expect, it } from 'vitest';
import {
  TEMPLATE_PRODUCTION_QA_SCHEMA_VERSION,
  TEMPLATE_PRODUCTION_REVIEW_REASON_LABELS,
  TEMPLATE_PRODUCTION_REVIEW_REASONS,
} from '../src/templates/schema';

describe('template production QA schema', () => {
  it('defines the deterministic Phase 6I-1 QA and review taxonomies', () => {
    expect(TEMPLATE_PRODUCTION_QA_SCHEMA_VERSION).toBe('template-production-qa-v0.1');
    expect(TEMPLATE_PRODUCTION_REVIEW_REASONS).toContain('artifact_missing');
    expect(TEMPLATE_PRODUCTION_REVIEW_REASONS).toContain('publish_without_approval_blocked');
    expect(TEMPLATE_PRODUCTION_REVIEW_REASONS).toContain('accepted_minor_issue');
    expect(TEMPLATE_PRODUCTION_REVIEW_REASON_LABELS.bad_source_image.length).toBeGreaterThan(0);
    expect(TEMPLATE_PRODUCTION_REVIEW_REASONS.join('\n')).not.toContain('training-ready');
  });
});
