import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const requiredFiles = [
  'START_HERE.md',
  'docs/prompts/MASTER_CODEX_CONTEXT.md',
  'docs/prompts/PROVIDER_SWITCH_PROMPT.md',
  'docs/status/CURRENT_PROJECT_STATUS.md',
  'docs/status/NEXT_ACTION.md',
  'docs/phases/PHASE_HISTORY.md',
  'docs/architecture/CURRENT_ARCHITECTURE.md',
  'docs/architecture/DATA_FLOW.md',
  'docs/architecture/BOUNDARIES_AND_GUARDRAILS.md',
  'docs/runbooks/PROJECT_RECOVERY_RUNBOOK.md',
];

describe('documentation recovery links', () => {
  it('has required recovery entry files', async () => {
    await Promise.all(
      requiredFiles.map(async (filePath) => {
        const content = await readFile(filePath, 'utf8');
        expect(content.length).toBeGreaterThan(0);
      }),
    );
  });

  it('documents the recovery reading order', async () => {
    const runbook = await readFile('docs/runbooks/PROJECT_RECOVERY_RUNBOOK.md', 'utf8');

    expect(runbook).toContain('START_HERE.md');
    expect(runbook).toContain('docs/status/CURRENT_PROJECT_STATUS.md');
    expect(runbook).toContain('docs/architecture/CURRENT_ARCHITECTURE.md');
    expect(runbook).toContain('project-state/project-state.snapshot.json');
    expect(runbook).toContain('npm run typecheck');
    expect(runbook).toContain('npm run test');
    expect(runbook).toContain('npm run build');
  });

  it('documents the user app recovery and next 7H handoff in core docs', async () => {
    const startHere = await readFile('START_HERE.md', 'utf8');
    const masterContext = await readFile('docs/prompts/MASTER_CODEX_CONTEXT.md', 'utf8');
    const providerPrompt = await readFile('docs/prompts/PROVIDER_SWITCH_PROMPT.md', 'utf8');
    const phaseHistory = await readFile('docs/phases/PHASE_HISTORY.md', 'utf8');
    const currentArchitecture = await readFile('docs/architecture/CURRENT_ARCHITECTURE.md', 'utf8');
    const dataFlow = await readFile('docs/architecture/DATA_FLOW.md', 'utf8');
    const guardrails = await readFile('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md', 'utf8');
    const combined = [
      startHere,
      masterContext,
      providerPrompt,
      phaseHistory,
      currentArchitecture,
      dataFlow,
      guardrails,
    ].join('\n');

    expect(startHere).toContain('Phase 7A');
    expect(startHere).toContain('Phase 7H - Browser / Mobile E2E Interaction QA');
    expect(masterContext).toContain('Phase 7H completed');
    expect(masterContext).toContain('Phase 7H - Browser / Mobile E2E Interaction QA');
    expect(providerPrompt).toContain('lastCompletedPhase: 7H');
    expect(providerPrompt).toContain('nextRecommendedPhase: 8A');
    expect(phaseHistory).toContain('Phase 6H-4');
    expect(phaseHistory).toContain('Phase 6I');
    expect(currentArchitecture).toContain('Source Image Artifact Binding');
    expect(currentArchitecture).toContain('TemplateProductionBatch');
    expect(currentArchitecture).toContain('Template Library');
    expect(currentArchitecture).toContain('User App Template Consumption Contract');
    expect(currentArchitecture).toContain('User App Prototype Contract Consumer');
    expect(currentArchitecture).toContain('User App MVP Shell');
    expect(currentArchitecture).toContain('User App Mobile QA / Readiness Gate');
    expect(dataFlow).toContain('BrowserArtifactResource');
    expect(dataFlow).toContain('TemplateProductionBatch');
    expect(dataFlow).toContain('Production QA Report');
    expect(dataFlow).toContain('Template Publish Package');
    expect(dataFlow).toContain('UserAppTemplatePackage');
    expect(dataFlow).toContain('User App Prototype Contract Consumer');
    expect(dataFlow).toContain('User App Shell');
    expect(dataFlow).toContain('App Readiness Gate');
    expect(guardrails).toContain('Manifest paths are references');
    expect(guardrails).toContain('raw RGBA is currently summary-only');
    expect(combined).toMatch(/`?SourceImagePackage`?\s+cannot directly become a training dataset/);
    expect(combined).toContain('UserAppTemplatePackage');
    expect(combined).toContain('UserAppPrototypeConsumer');
    expect(combined).toContain('UserAppShell');
    expect(combined).toContain('UserAppReadinessReport');
  });

  it('keeps source image package out of direct training language', async () => {
    const docs = await Promise.all(
      [
        'START_HERE.md',
        'docs/status/CURRENT_PROJECT_STATUS.md',
        'docs/status/KNOWN_LIMITATIONS.md',
        'docs/architecture/BOUNDARIES_AND_GUARDRAILS.md',
        'docs/architecture/DATA_FLOW.md',
        'docs/runbooks/TRAINING_DATASET_RUNBOOK.md',
      ].map((filePath) => readFile(filePath, 'utf8')),
    );
    const combinedDocs = docs.join('\n');

    expect(combinedDocs).not.toMatch(/SourceImagePackage\s+is\s+a\s+training\s+dataset/i);
    expect(combinedDocs).not.toMatch(/SourceImagePackage\s+is\s+training-ready/i);
    expect(combinedDocs).toMatch(/SourceImagePackage`?\s+cannot bypass correction/i);
    expect(combinedDocs).toContain('review queue');
  });

  it('keeps artifact index valid and records browser runtime boundaries', async () => {
    const raw = await readFile('project-state/artifact-index.json', 'utf8');
    const artifactIndex = JSON.parse(raw) as {
      sourceImagePackageOutputs: string[];
      sourceImageArtifactBindingOutputs: string[];
      runtimeResources: string[];
    };
    const combined = JSON.stringify(artifactIndex);

    expect(artifactIndex.sourceImagePackageOutputs).toContain(
      'tmp/source-images/admin-batch-v0/source-image-manifest.json',
    );
    expect(combined).toContain('normalized-png');
    expect(combined).toContain('json-rgba');
    expect(combined).toContain('raw-rgba');
    expect(combined).toContain('BrowserArtifactResource');
    expect(combined).toContain('TemplateAnalysisSeed bound artifact reference');
    expect(combined).toContain('TemplateProductionBatch');
    expect(combined).toContain('TemplatePublishPackage');
    expect(combined).toContain('UserAppTemplatePackage');
    expect(combined).toContain('UserAppShell');
    expect(combined).toContain('object URLs must not be written into the long-term artifact index');
  });
});
