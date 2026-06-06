import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const requiredDocs = [
  'docs/prompts/MASTER_CODEX_CONTEXT.md',
  'docs/prompts/PROVIDER_SWITCH_PROMPT.md',
  'docs/workflows/AI_PROVIDER_SWITCHING.md',
  'docs/workflows/CODEX_EXECUTION_PROFILES.md',
  'docs/workflows/CODEX_HANDOFF_PROTOCOL.md',
  'docs/workflows/PACKYAPI_CLI_RUNBOOK.md',
];

describe('provider switching docs', () => {
  it('has all required provider switching documents', async () => {
    await Promise.all(
      requiredDocs.map(async (filePath) => {
        const content = await readFile(filePath, 'utf8');
        expect(content.length).toBeGreaterThan(0);
      }),
    );
  });

  it('states repository documents are source of truth, not chat memory', async () => {
    const docs = await Promise.all(requiredDocs.map((filePath) => readFile(filePath, 'utf8')));
    const combined = docs.join('\n');

    expect(combined).toContain('source of truth');
    expect(combined).toMatch(/chat memory/i);
  });

  it('states source image and legacy frozen boundaries', async () => {
    const docs = await Promise.all(requiredDocs.map((filePath) => readFile(filePath, 'utf8')));
    const combined = docs.join('\n');

    expect(combined).toContain('SourceImagePackage');
    expect(combined).toContain('training dataset');
    expect(combined).toContain('legacy frozen modules');
    expect(combined).toContain('src/engine');
    expect(combined).toContain('src/runtime');
    expect(combined).toContain('src/intelligence/runtime');
  });

  it('provides phase 8C to 8D switch templates', async () => {
    const prompt = await readFile('docs/prompts/PROVIDER_SWITCH_PROMPT.md', 'utf8');

    expect(prompt).toContain('Switch To Native GPT / Codex Desktop');
    expect(prompt).toContain('Switch To PackyAPI + CLI');
    expect(prompt).toContain('Return From PackyAPI To ChatGPT');
    expect(prompt).toContain('lastCompletedPhase: 8C');
    expect(prompt).toContain('nextRecommendedPhase: 8D');
    expect(prompt).toContain('prototype consumer is read-only validation');
    expect(prompt).toContain('Phase 7A/7B/7C/7D/7E/7F/7G/7H shell');
    expect(prompt).toContain('docs/app-roadmap/app-technology-route-decision.md');
    expect(prompt).toContain('docs/user-app/pwa-mobile-web-mvp-polish.md');
    expect(prompt).toContain('React Web / PWA MVP first');
    expect(prompt).toContain('Phase 8B PWA/mobile polish');
    expect(prompt).toContain('Phase 8C trial pack');
    expect(prompt).toContain('photo intake is placeholder-only');
    expect(prompt).toContain('node scripts/context-pack.mjs --json');
  });

  it('requires compact context and avoids full historical chat', async () => {
    const [prompt, masterContext] = await Promise.all([
      readFile('docs/prompts/PROVIDER_SWITCH_PROMPT.md', 'utf8'),
      readFile('docs/prompts/MASTER_CODEX_CONTEXT.md', 'utf8'),
    ]);

    expect(prompt).toContain('Default to compact context');
    expect(prompt).toContain('Do not copy full historical chat');
    expect(prompt).toContain('npm run project:context');
    expect(prompt).toContain('project-state/latest-handoff.json');
    expect(masterContext).toContain('Default to compact handoff');
    expect(masterContext).toContain('Only output a full long prompt');
    expect(masterContext).toContain('docs/prompts/COMPACT_CODEX_TASK_TEMPLATE.md');
  });
});
