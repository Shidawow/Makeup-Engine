import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserPhotoIntakePlaceholder } from '../src/components/user-app';
import { createUserPhotoIntakePlaceholder } from '../src/user-app';

describe('UserPhotoIntakePlaceholder UI', () => {
  it('renders disabled upload and camera placeholders without real inputs', () => {
    const html = renderToStaticMarkup(
      <UserPhotoIntakePlaceholder placeholder={createUserPhotoIntakePlaceholder()} />,
    );

    expect(html).toContain('Phase 7C preview');
    expect(html).toContain('placeholder_only');
    expect(html).toContain('disabled');
    expect(html).not.toContain('type="file"');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
  });
});
