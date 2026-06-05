import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EvidencePanel } from '../src/components/template-studio/evidence-panel';
import type { TemplateEvidence } from '../src/templates/schema';
import { runQualityGate } from '../src/templates/storage';
import { sampleFixture } from './dataset-review-fixtures';

const baseEvidence = {
  confidence: 0.9,
  version: 'template-evidence-v0.1' as const,
  createdAt: '2026-05-28T00:00:00.000Z',
  regionIds: ['lips'],
  debugReferences: ['fixture'],
  notes: ['fixture'],
};

const evidence: TemplateEvidence = {
  schemaVersion: 'template-evidence-v0.1',
  evidenceId: 'evidence:test',
  templateId: 'template-test',
  createdAt: '2026-05-28T00:00:00.000Z',
  sourceImageEvidence: {
    ...baseEvidence,
    source: 'source-image',
    imageId: 'image-test',
    fileName: 'image.jpg',
    sourceType: 'fixture',
  },
  faceGeometryEvidence: {
    ...baseEvidence,
    source: 'facemesh',
    faceId: 'face-test',
    landmarkCount: 36,
    boundingBox: { x: 0.2, y: 0.1, width: 0.6, height: 0.8 },
  },
  segmentationEvidence: {
    ...baseEvidence,
    source: 'cosmetic-segmentation',
    providerId: 'mock',
    maskCount: 1,
    maskIds: ['mask-test'],
  },
  weightedSamplingEvidence: {
    ...baseEvidence,
    source: 'weighted-sampling',
    sampleGroups: ['lips'],
    heatmapReferences: ['lips:2x2'],
  },
  skinBaselineEvidence: {
    ...baseEvidence,
    source: 'skin-baseline',
    differenceTargets: ['lips'],
  },
  edgeAnalysisEvidence: {
    ...baseEvidence,
    source: 'edge-analysis',
    edgeTargets: ['lips'],
  },
  semanticEvidence: {
    ...baseEvidence,
    source: 'semantic-analysis',
    labels: ['lip_style:defined_satin'],
    explanations: ['fixture'],
  },
  humanCorrectionEvidence: {
    ...baseEvidence,
    source: 'human-correction',
    correctionRecordIds: ['record-test'],
    adjustedRegions: ['lips'],
    editCount: 1,
  },
  convergenceEvidence: {
    ...baseEvidence,
    source: 'template-convergence',
    humanVerificationStatus: 'ready_for_dataset',
    correctionConfidence: 0.9,
    evidenceNotes: ['fixture'],
  },
  qualityEvidence: {
    ...baseEvidence,
    source: 'quality-gate',
    humanVerificationStatus: 'ready_for_dataset',
    readyForDataset: true,
    rejectionReasons: [],
  },
};

describe('EvidencePanel', () => {
  it('renders formal TemplateEvidence groups and verification status', () => {
    const html = renderToStaticMarkup(
      <EvidencePanel
        evidence={evidence}
        qualityGateResult={runQualityGate({
          sample: sampleFixture({ sampleId: 'sample-evidence-panel' }),
          evidence,
        })}
      />,
    );

    expect(html).toContain('Template Evidence');
    expect(html).toContain('FaceMesh evidence');
    expect(html).toContain('Segmentation evidence');
    expect(html).toContain('Weighted sampling evidence');
    expect(html).toContain('Human correction evidence');
    expect(html).toContain('Convergence evidence');
    expect(html).toContain('Quality evidence');
    expect(html).toContain('ready_for_dataset');
    expect(html).toContain('Evidence Quality Gate');
    expect(html).toContain('suggested decision: ready_for_training');
    expect(html).toContain('training ready: yes');
  });
});
