import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('Phase 6I-1 documentation recovery', () => {
  it('keeps 6I-1 QA docs while current recovery state has advanced to 7A', async () => {
    const [
      startHere,
      masterContext,
      providerPrompt,
      phaseHistory,
      qaDoc,
      rejectDoc,
      publishDoc,
      rebindingDoc,
      handoff,
      architecture,
      dataFlow,
      guardrails,
      snapshotRaw,
    ] = await Promise.all([
      readFile('START_HERE.md', 'utf8'),
      readFile('docs/prompts/MASTER_CODEX_CONTEXT.md', 'utf8'),
      readFile('docs/prompts/PROVIDER_SWITCH_PROMPT.md', 'utf8'),
      readFile('docs/phases/PHASE_HISTORY.md', 'utf8'),
      readFile('docs/template-studio/production-batch-qa-review-hardening.md', 'utf8'),
      readFile('docs/template-studio/production-batch-reject-reasons.md', 'utf8'),
      readFile('docs/template-studio/production-batch-publish-confirmation.md', 'utf8'),
      readFile('docs/template-studio/production-batch-rebinding-recovery.md', 'utf8'),
      readFile('docs/template-studio/production-batch-handoff.md', 'utf8'),
      readFile('docs/architecture/CURRENT_ARCHITECTURE.md', 'utf8'),
      readFile('docs/architecture/DATA_FLOW.md', 'utf8'),
      readFile('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md', 'utf8'),
      readFile('project-state/project-state.snapshot.json', 'utf8'),
    ]);
    const snapshot = JSON.parse(snapshotRaw) as {
      lastCompletedPhase: string;
      nextRecommendedPhase: string;
      mainDataFlow: string[];
    };

    expect(startHere).toContain('Phase 6L');
    expect(masterContext).toContain('Phase 8A completed');
    expect(providerPrompt).toContain('lastCompletedPhase: 8A');
    expect(providerPrompt).toContain('nextRecommendedPhase: 8B');
    expect(phaseHistory).toContain('## Phase 6I-1');
    expect(qaDoc).toContain('Production Batch QA / Review Hardening');
    expect(rejectDoc).toContain('Reject must use a fixed');
    expect(publishDoc).toContain('local publish');
    expect(rebindingDoc).toContain('object URLs are temporary');
    expect(handoff).toContain('QA summary');
    expect(architecture).toContain('Production Batch QA / Review Hardening');
    expect(dataFlow).toContain('Production QA Report');
    expect(guardrails).toContain('Publish requires explicit local confirmation and cannot happen for rejected tasks');
    expect(snapshot.lastCompletedPhase).toBe('8A');
    expect(snapshot.nextRecommendedPhase).toBe('8B');
    expect(snapshot.mainDataFlow).toContain('ProductionQaReport');
  });
});
