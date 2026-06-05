import { describe, expect, it } from 'vitest';
import { validateUserAppTemplatePackage } from '../src/template-engine/app-contract';
import { userAppTemplatePackageExample } from '../src/templates/examples/user-app-template-package.example';

describe('User app template package example', () => {
  it('contains a complete multi-step app contract fixture without runtime-only resources', () => {
    const template = userAppTemplatePackageExample.templates[0];

    expect(template?.steps.map((step) => step.region)).toEqual([
      'brows',
      'eyeshadow',
      'blush',
      'lips',
    ]);
    expect(template?.regionInstructions).toHaveLength(4);
    expect(userAppTemplatePackageExample.summary.totalSteps).toBe(4);
    expect(validateUserAppTemplatePackage(userAppTemplatePackageExample).valid).toBe(true);
    expect(JSON.stringify(userAppTemplatePackageExample)).not.toContain('blob:');
    expect(JSON.stringify(userAppTemplatePackageExample)).not.toContain('data:image/');
    expect(JSON.stringify(userAppTemplatePackageExample)).not.toContain('C:\\');
  });
});

