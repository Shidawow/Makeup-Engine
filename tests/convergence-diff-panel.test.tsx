import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ConvergenceDiffPanel } from '../src/components/template-studio/ConvergenceDiffPanel';
import { diffTemplatesForConvergence } from '../src/template-engine';
import type { MakeupTemplate } from '../src/templates/schema';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  type CosmeticSegmentationMask,
} from '../src/vision';

const mask: CosmeticSegmentationMask = {
  id: 'diff-mask',
  target: 'blush',
  polygon: {
    space: 'normalized-image',
    points: [
      { x: 0.3, y: 0.3 },
      { x: 0.7, y: 0.3 },
      { x: 0.7, y: 0.6 },
      { x: 0.3, y: 0.6 },
    ],
  },
  bounds: {
    x: 0.3,
    y: 0.3,
    width: 0.4,
    height: 0.3,
    space: 'normalized-image',
  },
  grid: {
    width: 3,
    height: 3,
    alpha: [0, 0.1, 0, 0.1, 0.4, 0.1, 0, 0.1, 0],
  },
  confidence: 0.82,
  debug: [],
};

const template = (id: string, human: boolean): MakeupTemplate => ({
  id,
  name: id,
  goals: ['pixel_makeup_understanding'],
  faceStrategy: {
    id: `${id}-strategy`,
    summary: human ? 'Human verified.' : 'AI only.',
    goals: ['preserve_detected_style'],
    suitableFaceTypes: ['unknown'],
    reasoning: human ? ['semantic:human'] : ['semantic:ai'],
  },
  style: {
    family: 'natural',
    finish: 'satin',
    contrast: 'low',
    palette: {
      temperature: 'neutral',
      dominantFamilies: ['rose'],
      accentFamilies: ['soft'],
    },
    signatureTraits: human ? ['semantic:verified'] : ['semantic:ai'],
    confidence: human ? 0.9 : 0.7,
    evidence: ['fixture'],
  },
  faceSuitability: {
    profile: {
      faceShapes: ['round'],
      skinTypes: ['combination'],
      skinTones: ['neutral'],
      eyeTypes: ['double'],
      lipShapes: ['full'],
    },
    confidence: 0.6,
    rationale: ['fixture'],
  },
  regions: [
    {
      region: 'blush',
      detected: true,
      confidence: human ? 0.91 : 0.73,
      cues: ['fixture'],
    },
  ],
  eyeDesign: { summary: 'eye', effects: ['lift'], emphasis: 'eye' },
  lipDesign: { summary: 'lip', effects: ['soften'], emphasis: 'lip' },
  contourDesign: { summary: 'contour', effects: ['deepen'], emphasis: 'face' },
  steps: [
    {
      id: `${id}-step`,
      order: 1,
      region: human ? 'blush' : 'eye',
      action: human ? 'blend' : 'apply',
      tool: 'brush',
      intensity: 'medium',
      layerOrder: 'color',
      placement: { region: 'blush', area: 'cheek', coverage: 'medium' },
      productCategory: 'blush',
      finish: 'satin',
      colorFamily: 'rose',
      visualEffects: ['soften'],
      instruction: 'fixture',
      rationale: 'fixture',
    },
  ],
  metadata: {
    version: '0.1',
    status: 'draft',
    createdAt: '2026-05-28T00:00:00.000Z',
    createdBy: 'tester',
    source: {
      imageId: 'img',
      fileName: 'img.jpg',
      sourceType: 'fixture',
    },
    styleTags: human ? ['verified'] : ['ai-only'],
    correctionConfidence: human ? 0.88 : undefined,
    visionMetrics: {
      opacityConfidence: human ? 0.42 : 0.21,
      edgeSoftness: human ? 0.66 : 0.31,
    },
  },
  notes: human ? ['semantic:verified'] : ['semantic:ai'],
});

describe('ConvergenceDiffPanel', () => {
  it('shows mask, opacity, edge softness, semantic, confidence, and generated step diffs', () => {
    const editableMask = applyMaskBrushEdit(createEditableCosmeticMask(mask), {
      id: 'diff-edit',
      target: 'blush',
      tool: 'brush-add',
      point: { x: 0.5, y: 0.5, space: 'normalized-image' },
      radius: 0.3,
      strength: 0.8,
      createdAt: '2026-05-28T00:00:00.000Z',
    });
    const diff = diffTemplatesForConvergence({
      aiOnlyTemplate: template('ai-template', false),
      humanVerifiedTemplate: template('human-template', true),
      editableMasks: [editableMask],
    });
    const html = renderToStaticMarkup(<ConvergenceDiffPanel diff={diff} />);

    expect(diff.changedCount).toBeGreaterThanOrEqual(6);
    expect(html).toContain('blush');
    expect(html).toContain('0.42');
    expect(html).toContain('0.66');
    expect(html).toContain('verified');
    expect(html).toContain('0.88');
    expect(html).toContain('blend');
  });
});
