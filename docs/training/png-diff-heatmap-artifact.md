# PNG Diff Heatmap Artifact

Phase 6G introduces a PNG diff heatmap boundary.

Current behavior:

- JSON diff and binary diff remain supported paths.
- PNG diff heatmap returns `png-diff-heatmap-unsupported`.
- The boundary reserves the artifact shape for added, removed, and changed alpha intensity heatmaps.

This avoids fake PNG heatmaps while keeping export and manifest contracts ready.
