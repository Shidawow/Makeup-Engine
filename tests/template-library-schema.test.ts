import { describe, expect, it } from 'vitest';
import { TEMPLATE_LIBRARY_SCHEMA_VERSION } from '../src/templates/schema';
import { createTemplateLibrary } from '../src/template-engine/library';

describe('Template Library schema', () => {
  it('defines a deterministic local-only library shape without training-ready state', () => {
    const library = createTemplateLibrary({
      libraryId: 'library-schema-test',
      name: 'Schema Test Library',
      createdAt: '2026-05-31T00:00:00.000Z',
    });

    expect(TEMPLATE_LIBRARY_SCHEMA_VERSION).toBe('template-library-v0.1');
    expect(library.schemaVersion).toBe(TEMPLATE_LIBRARY_SCHEMA_VERSION);
    expect(library.metadata.localOnly).toBe(true);
    expect(library.metadata.onlinePublished).toBe(false);
    expect(JSON.stringify(library)).not.toContain('training-ready');
  });
});
