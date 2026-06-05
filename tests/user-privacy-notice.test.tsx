import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserPrivacyNotice } from '../src/components/user-app';

describe('UserPrivacyNotice', () => {
  it('renders no-photo privacy commitments', () => {
    const html = renderToStaticMarkup(<UserPrivacyNotice />);

    expect(html).toContain('\u9690\u79c1\u8fb9\u754c');
    expect(html).toContain('\u4eba\u8138\u5411\u91cf');
    expect(html).toContain('\u672c\u5730\u8def\u5f84');
    expect(html).not.toContain('camera permission');
  });
});
