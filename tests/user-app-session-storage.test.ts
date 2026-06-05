import { describe, expect, it } from 'vitest';
import {
  createInitialUserAppSession,
  createUserAppSessionStorageAdapter,
  exportUserAppSessionSnapshot,
  importUserAppSessionSnapshot,
  loadUserAppSession,
  saveUserAppSession,
  clearUserAppSession,
  validateSessionStoragePayload,
} from '../src/user-app';
import {
  partiallyCompletedTemplateSessionExample,
  unsafeObjectUrlSessionExample,
} from '../src/templates/examples';

describe('user app session storage', () => {
  it('saves, loads, exports, imports, and clears a sanitized local session', () => {
    const adapter = createUserAppSessionStorageAdapter();
    const saveResult = saveUserAppSession(adapter, partiallyCompletedTemplateSessionExample);

    expect(saveResult.ok).toBe(true);
    expect(saveResult.serialized).not.toContain('blob:');
    expect(saveResult.serialized).not.toContain('data:image/');

    const loaded = loadUserAppSession(adapter);
    expect(loaded.ok).toBe(true);
    expect(loaded.session?.selectedTemplateId).toBe(
      partiallyCompletedTemplateSessionExample.selectedTemplateId,
    );

    const exported = exportUserAppSessionSnapshot(partiallyCompletedTemplateSessionExample);
    expect(exported.ok).toBe(true);
    const imported = importUserAppSessionSnapshot(exported.serialized ?? '');
    expect(imported.ok).toBe(true);

    const cleared = clearUserAppSession(adapter);
    expect(cleared.ok).toBe(true);
    expect(loadUserAppSession(adapter).session?.status).toBe('empty');
  });

  it('rejects unsafe storage payloads before writing', () => {
    const adapter = createUserAppSessionStorageAdapter();
    const result = saveUserAppSession(
      adapter,
      unsafeObjectUrlSessionExample as ReturnType<typeof createInitialUserAppSession>,
    );

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.message.includes('object URLs'))).toBe(true);
    expect(adapter.area.getItem(adapter.key)).toBeNull();
  });

  it('validates imported payload boundaries and schema version', () => {
    const unsafePayload = {
      ...partiallyCompletedTemplateSessionExample,
      schemaVersion: 'old-session-version',
      trainingInput: true,
    };
    const issues = validateSessionStoragePayload(unsafePayload);

    expect(issues.some((issue) => issue.code === 'version_mismatch')).toBe(true);
    expect(issues.some((issue) => issue.message.includes('training input'))).toBe(true);
  });
});
