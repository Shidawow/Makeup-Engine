import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppSessionRecoveryNotice } from '../src/components/user-app';
import { recoverUserAppSession } from '../src/user-app';
import {
  partiallyCompletedTemplateSessionExample,
  userAppTemplateDiscoveryExamplePackage,
} from '../src/templates/examples';

describe('UserAppSessionRecoveryNotice', () => {
  it('renders blocked recovery warnings for package-blocked restore', () => {
    const report = recoverUserAppSession({
      session: partiallyCompletedTemplateSessionExample,
      packageData: userAppTemplateDiscoveryExamplePackage,
    });
    const html = renderToStaticMarkup(<UserAppSessionRecoveryNotice report={report} />);

    expect(html).toContain('Session recovery');
    expect(html).toContain('Current package has blocking issues');
    expect(html).not.toContain('blob:');
  });
});
