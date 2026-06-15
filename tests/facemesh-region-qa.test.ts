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
    expect(faceMeshRegionQaReadyExample.canGenerateAttributeCandidates).toBe(true);
    expect(faceMeshRegionQaReadyExample.canGenerateTemplateDraft).toBe(true);
    expect(faceMeshRegionQaReadyExample.regionCoverage.every((region) => region.ready)).toBe(true);
  });

  it('blocks when landmarks are missing or confidence is too low', () => {
    expect(faceMeshRegionQaBlockedExample.status).toBe('region_qa_blocked');
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
    expect(report.issues.map((issue) => issue.id)).toContain('face_not_cropped');
    expect(report.recommendations.join('\n')).toContain('human reviewer');
  });
});
