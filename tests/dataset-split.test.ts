import { describe, expect, it } from 'vitest';
import {
  assignSampleToSplit,
  autoAssignDatasetSplits,
  summarizeSplits,
  validateSplitLeakage,
} from '../src/templates/storage';

const accepted = { status: 'accepted' as const };

describe('dataset split assignment', () => {
  it('assigns deterministic splits without random state', () => {
    const candidate = {
      sampleId: 'split-sample-a',
      imageId: 'split-image-a',
      templateId: 'split-template-a',
      currentDecision: accepted,
    };

    expect(assignSampleToSplit(candidate)).toBe(assignSampleToSplit(candidate));
  });

  it('keeps linked image/template groups in one split', () => {
    const candidates = [
      {
        sampleId: 'split-sample-a',
        imageId: 'shared-image',
        templateId: 'template-a',
        currentDecision: accepted,
      },
      {
        sampleId: 'split-sample-b',
        imageId: 'shared-image',
        templateId: 'template-b',
        currentDecision: accepted,
      },
      {
        sampleId: 'split-sample-c',
        imageId: 'image-c',
        templateId: 'template-b',
        currentDecision: accepted,
      },
    ];
    const assignments = autoAssignDatasetSplits(candidates);

    expect(assignments['split-sample-a']).toBe(assignments['split-sample-b']);
    expect(assignments['split-sample-b']).toBe(assignments['split-sample-c']);
    expect(summarizeSplits(candidates.map((candidate) => ({
      assignedSplit: assignments[candidate.sampleId],
    }))).unassigned).toBe(0);
  });

  it('detects train/test leakage by image and template', () => {
    const result = validateSplitLeakage([
      {
        sampleId: 'leak-a',
        imageId: 'shared-image',
        templateId: 'shared-template',
        assignedSplit: 'train',
      },
      {
        sampleId: 'leak-b',
        imageId: 'shared-image',
        templateId: 'shared-template',
        assignedSplit: 'test',
      },
    ]);

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.leakageType).sort()).toEqual([
      'image',
      'template',
    ]);
  });
});
