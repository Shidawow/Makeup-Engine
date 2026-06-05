import { describe, expect, it } from 'vitest';
import {
  createUserAppTemplatePackageFromPublishPackage,
  validateNoLocalPaths,
  validateNoObjectUrls,
  validateUserAppTemplatePackage,
} from '../src/template-engine/app-contract';
import type { UserAppTemplatePackage } from '../src/templates/schema';
import { createUserAppContractPublishPackageFixture } from './userAppContractTestUtils';

describe('User app compatibility validator', () => {
  it('accepts clean app packages and rejects runtime-only references', async () => {
    const publishPackage = await createUserAppContractPublishPackageFixture();
    const appPackage = createUserAppTemplatePackageFromPublishPackage({
      packageData: publishPackage,
    });

    expect(validateUserAppTemplatePackage(appPackage).valid).toBe(true);
    expect(validateNoObjectUrls(appPackage)).toHaveLength(0);
    expect(validateNoLocalPaths(appPackage)).toHaveLength(0);

    const unsafePackage: UserAppTemplatePackage = {
      ...appPackage,
      templates: appPackage.templates.map((template, index) =>
        index === 0
          ? {
              ...template,
              safetyNotes: [...template.safetyNotes, 'blob:http://localhost/unsafe'],
            }
          : template,
      ),
    };

    expect(validateUserAppTemplatePackage(unsafePackage).valid).toBe(false);
    expect(validateNoObjectUrls(unsafePackage)[0]).toContain('object URL');
  });

  it('blocks local absolute paths', () => {
    expect(validateNoLocalPaths({ ref: 'C:\\Users\\operator\\image.png' })).toHaveLength(1);
  });
});

