import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');

describe('app technology route decision docs', () => {
  it('compares the required technology routes and recommends PWA first', () => {
    const decision = readText('docs/app-roadmap/app-technology-route-decision.md');

    expect(decision).toContain('Use a React Web / PWA MVP route first');
    expect(decision).toContain('React Web / PWA');
    expect(decision).toContain('React Native');
    expect(decision).toContain('Flutter');
    expect(decision).toContain('iOS Native SwiftUI');
    expect(decision).toContain('Web MVP first, then native decision');
    expect(decision).toContain('Later split repo / package route');

    expect(decision).toContain('Dev Speed');
    expect(decision).toContain('Reuse From Makeup Engine');
    expect(decision).toContain('Mobile UX');
    expect(decision).toContain('Future Camera / AR Expansion');
    expect(decision).toContain('App Store Cost');
    expect(decision).toContain('Backend Dependency');
    expect(decision).toContain('Recommendation');

    expect(decision).toContain('Strongly recommended for MVP first');
    expect(decision).toContain('Defer until after PWA validation');
  });

  it('keeps native, backend, camera, AR, API, commerce, and training scope deferred', () => {
    const decision = readText('docs/app-roadmap/app-technology-route-decision.md');

    [
      'React Native implementation',
      'Flutter implementation',
      'iOS native SwiftUI implementation',
      'Backend, database, accounts, cloud sync, analytics, or payment infrastructure',
      'Real photo upload, camera capture, face analysis, AR overlay',
      'MediaPipe/OpenAI/external API use',
      'App Store, TestFlight, production release, or separate repository bootstrap',
    ].forEach((expected) => {
      expect(decision).toContain(expected);
    });
  });
});
