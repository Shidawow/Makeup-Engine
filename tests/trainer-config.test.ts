import { describe, expect, it } from 'vitest';
import {
  createDefaultTrainerConfig,
  exportTrainerConfigJson,
  migrateTrainerConfig,
  summarizeTrainerConfig,
  validateTrainerConfig,
} from '../src/training';

describe('trainer config versioning', () => {
  it('creates, validates, migrates, summarizes, and exports v0.1 config', () => {
    const config = createDefaultTrainerConfig();

    expect(config.schemaVersion).toBe('trainer-config-v0.1');
    expect(validateTrainerConfig(config)).toEqual([]);
    expect(migrateTrainerConfig(config).schemaVersion).toBe('trainer-config-v0.1');
    expect(summarizeTrainerConfig(config)).toContain('runtime:dry-run');
    expect(exportTrainerConfigJson(config)).toContain('trainer-config-v0.1');
  });
});
