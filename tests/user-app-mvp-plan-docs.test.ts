import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');

describe('user app MVP planning docs', () => {
  it('documents MVP included flows and excluded V1 scope', () => {
    const plan = readText('docs/app-roadmap/user-app-mvp-plan.md');
    const nonGoals = readText('docs/product/user-app-v1-non-goals.md');

    [
      'Template discovery',
      'Template detail',
      'Step-by-step makeup guidance',
      'Region instructions',
      'Tools and products',
      'Local onboarding',
      'Local preferences',
      'Local session progress',
      'Privacy notice',
      'Photo, camera, and AR placeholders',
    ].forEach((expected) => {
      expect(plan).toContain(expected);
    });

    [
      'No login',
      'No backend',
      'No database',
      'No real photo capture',
      'No camera permission request',
      'No AR overlay',
      'No OpenAI API',
      'No ecommerce',
      'No community',
      'No paid features',
      'No model training pipeline expansion',
    ].forEach((expected) => {
      expect(nonGoals).toContain(expected);
    });
  });

  it('documents Makeup Engine versus future User App ownership', () => {
    const boundary = readText('docs/app-roadmap/makeup-engine-vs-user-app-boundary.md');

    expect(boundary).toContain('Makeup Engine remains the system of record for template production');
    expect(boundary).toContain('UserAppShell is a local prototype mounted inside Makeup Engine');
    expect(boundary).toContain('UserAppTemplatePackage is the stable handoff contract');
    expect(boundary).toContain('SourceImagePackage cannot directly enter the User App');
    expect(boundary).toContain('The future User App must consume this package read-only');
  });

  it('documents the Phase 8 roadmap through release readiness gating', () => {
    const roadmap = readText('docs/app-roadmap/phase-8-roadmap.md');

    expect(roadmap).toContain('8A | Product Route Decision / App MVP Planning');
    expect(roadmap).toContain('8B | PWA / Mobile Web MVP Polish');
    expect(roadmap).toContain('8C | User App MVP Trial Pack');
    expect(roadmap).toContain('8D | Template Content QA for Real User Trial');
    expect(roadmap).toContain('8E | MVP Release Readiness Gate');
    expect(roadmap).toContain('React Web / PWA MVP first');
  });
});
