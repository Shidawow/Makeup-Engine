import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

interface LatestHandoff {
  fromPhase: string;
  toPhase: string;
  filesToReadFirst: string[];
  nextAction: string;
  forbiddenActions: string[];
}

describe('phase handoff requirements', () => {
  it('records latest handoff next action', async () => {
    const raw = await readFile('project-state/latest-handoff.json', 'utf8');
    const handoff = JSON.parse(raw) as LatestHandoff;

    expect(handoff.fromPhase).toBe('9B');
    expect(handoff.toPhase).toBe('9C');
    expect(handoff.nextAction).toContain('Phase 9C');
    expect(handoff.filesToReadFirst).toContain('START_HERE.md');
    expect(handoff.forbiddenActions.join('\n')).toContain('Do not train directly from SourceImagePackage');
  });

  it('documents phase handoff maintenance requirements', async () => {
    const standard = await readFile('docs/standards/PHASE_HANDOFF_REQUIREMENTS.md', 'utf8');

    expect(standard).toContain('project-state/project-state.snapshot.json');
    expect(standard).toContain('project-state/latest-handoff.json');
    expect(standard).toContain('project-state/provider-handoff.json');
    expect(standard).toContain('npm run project:status');
    expect(standard).toContain('npm run project:context');
    expect(standard).toContain('src/engine');
    expect(standard).toContain('src/runtime');
    expect(standard).toContain('src/intelligence/runtime');
  });

  it('records guardrails as machine-readable JSON', async () => {
    const raw = await readFile('project-state/guardrails.json', 'utf8');
    const guardrails = JSON.parse(raw) as { guardrails: Array<{ id: string; rule: string }> };
    const rules = guardrails.guardrails.map((guardrail) => guardrail.rule).join('\n');

    expect(rules).toContain('SourceImagePackage is not a training dataset.');
    expect(rules).toContain('SourceImagePackage cannot bypass correction or review queue.');
    expect(rules).toContain('TemplateProductionBatch is local admin workflow state');
    expect(rules).toContain('Production task publish requires explicit local confirmation');
    expect(rules).toContain('TemplatePublishPackage is local export metadata');
    expect(rules).toContain('UserAppTemplatePackage is a local/export consumption contract');
    expect(rules).toContain('UserAppPrototypeConsumer is read-only admin validation');
    expect(rules).toContain('User App Shell must consume UserAppTemplatePackage only');
    expect(rules).toContain('src/engine, src/runtime, and src/intelligence/runtime are legacy frozen areas for new mainline work and cannot expand.');
  });
});
