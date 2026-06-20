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

  it('provides phase 10R to 10S switch templates with historical 10Q, 10P, 10O, 10N, 10M, 10L, 10K, 10J, 10I, 10H, 10G, 10F, 10E, 10D, 10C, 10A, 9J, and older markers', async () => {
    const prompt = await readFile('docs/prompts/PROVIDER_SWITCH_PROMPT.md', 'utf8');

    expect(prompt).toContain('Switch To Native GPT / Codex Desktop');
    expect(prompt).toContain('Switch To PackyAPI + CLI');
    expect(prompt).toContain('Return From PackyAPI To ChatGPT');
    expect(prompt).toContain('lastCompletedPhase: 10R');
    expect(prompt).toContain('nextRecommendedPhase: 10S');
    expect(prompt).toContain('Guarded Real Write Execution Simulator');
    expect(prompt).toContain('Real Write Execution Plan');
    expect(prompt).toContain('Real Write Execution Authorization');
    expect(prompt).toContain('Final Real Write Review Gate');
    expect(prompt).toContain('Real Registry Write Implementation Draft');
    expect(prompt).toContain('Real Registry Write Implementation Gate');
    expect(prompt).toContain('Controlled Registry Write Execution Design');
    expect(prompt).toContain('Explicit Registry Write Authorization Gate');
    expect(prompt).toContain('Controlled UserAppTemplatePackage Registry Writer Draft');
    expect(prompt).toContain('UserAppTemplatePackage Registry Write Gate');
    expect(prompt).toContain('UserAppTemplatePackage Registry Preparation');
    expect(prompt).toContain('FaceMesh-driven Makeup Intelligence Baseline');
    expect(prompt).toContain('Template Draft Review Workflow');
    expect(prompt).toContain('Template Library Candidate Packaging');
    expect(prompt).toContain('Candidate-to-App Package Contract Preparation');
    expect(prompt).toContain('User App Package Draft Preview');
    expect(prompt).toContain('Official User App Package Draft Gate');
    expect(prompt).toContain('Official UserAppTemplatePackage Draft Builder');
    expect(prompt).toContain('UserAppTemplatePackage Draft Publish Gate');
    expect(prompt).toContain('Phase 10J UserAppTemplatePackage Registry Write Gate');
    expect(prompt).toContain('Phase 10K Controlled UserAppTemplatePackage Registry Writer Draft');
    expect(prompt).toContain('Phase 10L Explicit Registry Write Authorization Gate');
    expect(prompt).toContain('Phase 10M Controlled Registry Write Execution Design');
    expect(prompt).toContain('Phase 10N Real Registry Write Implementation Gate');
    expect(prompt).toContain('Phase 10O Real Registry Write Implementation Draft');
    expect(prompt).toContain('Phase 10P Final Real Write Review Gate');
    expect(prompt).toContain('Phase 10R Handoff Note');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10Q recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10Q');
    expect(prompt).toContain('nextRecommendedPhase: 10R');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10P recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10P');
    expect(prompt).toContain('nextRecommendedPhase: 10Q');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10O recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10O');
    expect(prompt).toContain('nextRecommendedPhase: 10P');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10N recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10N');
    expect(prompt).toContain('nextRecommendedPhase: 10O');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10M recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10M');
    expect(prompt).toContain('nextRecommendedPhase: 10N');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10L recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10L');
    expect(prompt).toContain('nextRecommendedPhase: 10M');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10K recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10K');
    expect(prompt).toContain('nextRecommendedPhase: 10L');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10J recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10J');
    expect(prompt).toContain('nextRecommendedPhase: 10K');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10I recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10I');
    expect(prompt).toContain('nextRecommendedPhase: 10J');
    expect(prompt).toContain('Phase 10I UserAppTemplatePackage Registry Preparation');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10H recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10H');
    expect(prompt).toContain('nextRecommendedPhase: 10I');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10G recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10G');
    expect(prompt).toContain('nextRecommendedPhase: 10H');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10F recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10F');
    expect(prompt).toContain('nextRecommendedPhase: 10G');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10E recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10E');
    expect(prompt).toContain('nextRecommendedPhase: 10F');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10D recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10D');
    expect(prompt).toContain('nextRecommendedPhase: 10E');
    expect(prompt).toContain('Historical handoff marker retained for Phase 10C recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 10C');
    expect(prompt).toContain('nextRecommendedPhase: 10D');
    expect(prompt).toContain('lastCompletedPhase: 9J');
    expect(prompt).toContain('nextRecommendedPhase: 9K');
    expect(prompt).toContain('lastCompletedPhase: 9I');
    expect(prompt).toContain('nextRecommendedPhase: 9J');
    expect(prompt).toContain('lastCompletedPhase: 9H');
    expect(prompt).toContain('nextRecommendedPhase: 9I');
    expect(prompt).toContain('Historical handoff marker retained for Phase 9G recovery tests');
    expect(prompt).toContain('lastCompletedPhase: 9G');
    expect(prompt).toContain('nextRecommendedPhase: 9H');
    expect(prompt).toContain('Anonymous Internal Trial Follow-up Iteration');
    expect(prompt).toContain('Anonymous Internal Trial Evidence Round 2 Pack');
    expect(prompt).toContain('Historical handoff marker retained for Phase 9F recovery tests');
    expect(prompt).toContain('Historical handoff marker retained for Phase 8D recovery tests');
    expect(prompt).toContain('Historical handoff marker retained for Phase 8E recovery tests');
    expect(prompt).toContain('Historical handoff marker retained for Phase 9A recovery tests');
    expect(prompt).toContain('Historical handoff marker retained for Phase 9B recovery tests');
    expect(prompt).toContain('prototype consumer is read-only validation');
    expect(prompt).toContain('Phase 7A/7B/7C/7D/7E/7F/7G/7H shell');
    expect(prompt).toContain('docs/app-roadmap/app-technology-route-decision.md');
    expect(prompt).toContain('docs/user-app/pwa-mobile-web-mvp-polish.md');
    expect(prompt).toContain('React Web / PWA MVP first');
    expect(prompt).toContain('Phase 8B PWA/mobile polish');
    expect(prompt).toContain('Phase 8C trial pack');
    expect(prompt).toContain('Phase 8D template content QA');
    expect(prompt).toContain('MVP release readiness');
    expect(prompt).toContain('trial go/no-go');
    expect(prompt).toContain('Phase 9A internal trial operations');
    expect(prompt).toContain('Phase 9B internal trial result review');
    expect(prompt).toContain('Phase 9C internal trial iteration plan');
    expect(prompt).toContain('Phase 9F evidence collection');
    expect(prompt).toContain('Phase 9G anonymous internal trial dry run');
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
