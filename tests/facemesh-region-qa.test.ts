import { describe, expect, it } from 'vitest';
import { evaluateFaceMeshRegionQa } from '../src/vision';
import {
  createFaceMeshQaExampleGeometry,
  faceMeshRegionQaBlockedExample,
  faceMeshRegionQaReadyExample,
} from '../src/templates/examples';

describe('FaceMesh region QA baseline', () => {
  it('marks real FaceMesh-like landmark coverage ready for candidate drafting', () => {
    expect(faceMeshRegionQaReadyExample.status).toBe('region_qa_ready');
    expect(faceMeshRegionQaReadyExample.provider).toBe('mediapipe');
    expect(faceMeshRegionQaReadyExample.landmarkCount).toBeGreaterThanOrEqual(468);
    expect(faceMeshRegionQaReadyExample.readinessScore).toBeGreaterThanOrEqual(0.9);
    expect(faceMeshRegionQaReadyExample.canGenerateAttributeCandidates).toBe(true);
    expect(faceMeshRegionQaReadyExample.canGenerateTemplateDraft).toBe(true);
    expect(faceMeshRegionQaReadyExample.regionCoverage.every((region) => region.ready)).toBe(true);
  });

  it('blocks when landmarks are missing without showing high readiness', () => {
    expect(faceMeshRegionQaBlockedExample.status).toBe('region_qa_blocked');
    expect(faceMeshRegionQaBlockedExample.readinessScore).toBeLessThanOrEqual(0.45);
    expect(faceMeshRegionQaBlockedExample.canGenerateAttributeCandidates).toBe(false);
    expect(faceMeshRegionQaBlockedExample.issues.map((issue) => issue.id)).toContain(
      'landmark_count',
    );
  });

  it('warns when the face box is cropped but still keeps draft generation conservative', () => {
    const report = evaluateFaceMeshRegionQa({
      faceMesh: createFaceMeshQaExampleGeometry({
        boundingBox: {
          x: 0.01,
          y: 0.01,
          width: 0.7,
          height: 0.9,
          space: 'normalized-image',
        },
      }),
      providerId: 'mediapipe-face-mesh',
    });

    expect(report.status).toBe('region_qa_ready_with_warnings');
    expect(report.readinessScore).toBeGreaterThanOrEqual(0.7);
    expect(report.readinessScore).toBeLessThanOrEqual(0.85);
    expect(report.issues.map((issue) => issue.id)).toContain('face_not_cropped');
    expect(report.recommendations.join('\n')).toContain('human reviewer');
  });

  it('keeps runtime confidence as legacy metadata instead of blocking region readiness', () => {
    const report = evaluateFaceMeshRegionQa({
      faceMesh: createFaceMeshQaExampleGeometry({
        confidence: 0.31,
      }),
      providerId: 'mediapipe-face-mesh',
    });

    expect(report.confidence).toBe(0.31);
    expect(report.status).toBe('region_qa_ready');
    expect(report.readinessScore).toBeGreaterThanOrEqual(0.9);
    expect(report.checks.map((check) => check.id)).not.toContain('landmark_confidence');
  });
});
