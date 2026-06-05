import { describe, expect, it } from 'vitest';
import { parseMakeupTemplate } from '../src/templates/parser';
import { templateStorage } from '../src/templates/storage';
import { validateTemplate } from '../src/templates/validators';
import { naturalDailyTemplate } from '../src/templates/examples';

describe('template storage', () => {
  it('parses and validates template json', () => {
    const parsed = parseMakeupTemplate(JSON.stringify(naturalDailyTemplate));

    expect(parsed.id).toBe(naturalDailyTemplate.id);
    expect(validateTemplate(parsed).valid).toBe(true);
  });

  it('saves and reads templates in storage abstraction when window is available', () => {
    if (typeof window === 'undefined') {
      return;
    }

    templateStorage.save(naturalDailyTemplate);
    const loaded = templateStorage.getById(naturalDailyTemplate.id);

    expect(loaded?.name).toBe(naturalDailyTemplate.name);
  });
});
