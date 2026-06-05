import { describe, expect, it } from 'vitest';
import { createDemoSourceImageManifest } from '../src/components/template-studio/source-image-intake-panel';
import {
  addTemplateAnalysisSeedToSession,
  clearSourceImageStudioSession,
  createSourceImageStudioSession,
  listRecentTemplateAnalysisSeeds,
  loadSourceImageStudioSession,
  saveSourceImageStudioSession,
  type SourceImageStudioSessionStorage,
} from '../src/templates/storage';
import { createTemplateAnalysisSeedFromEntry } from '../src/templates/storage';

const createMemoryStorage = (): SourceImageStudioSessionStorage => {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
};

describe('source image studio session', () => {
  it('saves, restores, lists, and clears recent template analysis seeds', () => {
    const manifest = createDemoSourceImageManifest();
    const seed = createTemplateAnalysisSeedFromEntry(manifest, manifest.entries[0]!, {
      manifestReference: 'C:/absolute/source-image-manifest.json',
    });
    const session = addTemplateAnalysisSeedToSession(
      createSourceImageStudioSession({
        manifest,
        manifestReference: 'C:/absolute/source-image-manifest.json',
      }),
      seed,
    );
    const storage = createMemoryStorage();

    saveSourceImageStudioSession(session, { storage });
    const restored = loadSourceImageStudioSession({ storage });

    expect(restored?.manifestReference).toBeUndefined();
    expect(restored?.seeds[0]?.sourceImageManifestReference).toBeUndefined();
    expect(listRecentTemplateAnalysisSeeds(restored!)).toHaveLength(1);

    clearSourceImageStudioSession({ storage });
    expect(loadSourceImageStudioSession({ storage })).toBeNull();
  });
});
