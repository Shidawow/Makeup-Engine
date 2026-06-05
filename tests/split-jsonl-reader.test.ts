import { describe, expect, it } from 'vitest';
import {
  parseTrainingSplitLine,
  readTrainSplit,
  readValidationSplit,
  summarizeSplit,
  validateSplitSample,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('split JSONL reader', () => {
  it('reads deterministic training-ready split rows', async () => {
    const train = await readTrainSplit(fixtureReader());
    const validation = await readValidationSplit(fixtureReader());

    expect(train.samples.map((sample) => sample.sampleId)).toEqual([
      'sample-fixture-train',
    ]);
    expect(validation.validationIssues).toEqual([]);
    expect(validateSplitSample(train.samples[0], 'train', 'splits/train.jsonl')).toEqual([]);
    expect(summarizeSplit(train)).toContain('train:1');
  });

  it('reports bad JSONL lines clearly', () => {
    const parsed = parseTrainingSplitLine('{bad', 4, 'splits/train.jsonl');

    expect(parsed.sample).toBeNull();
    expect(parsed.issues[0].code).toBe('split-jsonl-parse-error');
  });
});
