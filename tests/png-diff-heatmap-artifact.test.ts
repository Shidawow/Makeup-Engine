import { describe, expect, it } from 'vitest';
import { convertJsonDiffToPngHeatmap, summarizePngDiffHeatmapArtifact } from '../src/training/artifacts';

describe('PNG diff heatmap boundary', () => {
  it('keeps heatmap PNG unsupported without breaking binary diff path', () => {
    const result = convertJsonDiffToPngHeatmap();
    expect(result.issues[0]?.code).toBe('png-diff-heatmap-unsupported');
    expect(summarizePngDiffHeatmapArtifact(result.artifact)).toContain('unsupported');
  });
});
