import { describe, expect, it } from 'vitest';
import { generateRuleBasedStepSequence } from '../src/template-engine';
import {
  makeupAttributeCandidatesReadyExample,
  ruleBasedStepSequenceReadyExample,
} from '../src/templates/examples';

describe('rule-based step generator', () => {
  it('generates ordered draft steps that all require human review', () => {
    expect(ruleBasedStepSequenceReadyExample.status).toBe('steps_ready');
    expect(ruleBasedStepSequenceReadyExample.steps.map((step) => step.order)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(ruleBasedStepSequenceReadyExample.steps.every(
      (step) => step.reviewStatus === 'needs_human_review',
    )).toBe(true);
    expect(ruleBasedStepSequenceReadyExample.steps.map((step) => step.region)).toEqual(
      ['base', 'eye', 'eye', 'blush', 'lip', 'contour'],
    );
  });

  it('blocks steps when attribute candidates are blocked', () => {
    const sequence = generateRuleBasedStepSequence({
      status: 'candidates_blocked',
      candidates: [],
      issues: [
        {
          id: 'blocked_fixture',
          message: 'candidate blocked',
          severity: 'blocking',
        },
      ],
      notes: [],
    });

    expect(sequence.status).toBe('steps_blocked');
    expect(sequence.steps).toHaveLength(0);
    expect(sequence.issues[0].severity).toBe('blocking');
  });

  it('keeps candidate source ids attached to generated steps', () => {
    const sequence = generateRuleBasedStepSequence(makeupAttributeCandidatesReadyExample);
    const lipStep = sequence.steps.find((step) => step.region === 'lip');

    expect(lipStep?.sourceCandidateIds.length).toBeGreaterThan(0);
    expect(lipStep?.instruction).toContain('候选');
  });
});
