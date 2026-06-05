import { describe, expect, it } from 'vitest';
import {
  createDryRunEvaluationReport,
  exportEvaluationReportJson,
  loadMaterializedDataset,
  summarizeEvaluationReport,
  validateEvaluationReport,
} from '../src/training';
import { fixtureReader } from './training-bridge-fixtures';

describe('evaluation report placeholder', () => {
  it('creates dry-run proxy evaluation without real IoU/Dice', async () => {
    const dataset = await loadMaterializedDataset({ reader: fixtureReader() });
    const report = createDryRunEvaluationReport({
      dataset,
      trainingRunId: 'training-run-test',
      createdAt: '2026-05-30T00:00:00.000Z',
    });

    expect(report.maskMetricSummary[0].note).toContain('dry-run proxy');
    expect(validateEvaluationReport(report)).toEqual([]);
    expect(summarizeEvaluationReport(report)).toContain('samples=3');
    expect(exportEvaluationReportJson(report)).toContain(
      'segmentation-evaluation-report-v0.1',
    );
  });
});
