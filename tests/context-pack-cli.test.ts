import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

describe('context pack CLI', () => {
  it('prints human-readable context', () => {
    const result = spawnSync(process.execPath, ['scripts/context-pack.mjs'], {
      cwd: '.',
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Makeup Engine');
    expect(result.stdout).toContain('7A');
    expect(result.stdout).toContain('Provider handoff');
  });

  it('prints machine-readable JSON', () => {
    const result = spawnSync(process.execPath, ['scripts/context-pack.mjs', '--json'], {
      cwd: '.',
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout) as {
      project: { name: string };
      currentPhase: { id: string; nextRecommendedPhase: string };
      nextAction: string;
      requiredReadFiles: string[];
      guardrails: string[];
      providerHandoff: { schemaVersion: string };
      activeTask: { taskId: string };
      lastValidation: { typecheck: string };
    };

    expect(parsed.project.name).toBe('Makeup Engine');
    expect(parsed.currentPhase.id).toBe('9B');
    expect(parsed.currentPhase.nextRecommendedPhase).toBe('9C');
    expect(parsed.nextAction).toContain('Phase 9C');
    expect(parsed.requiredReadFiles).toContain('docs/prompts/MASTER_CODEX_CONTEXT.md');
    expect(parsed.guardrails.join('\n')).toContain('SourceImagePackage is not a training dataset');
    expect(parsed.guardrails.join('\n')).toContain('manifest relative paths');
    expect(parsed.providerHandoff.schemaVersion).toBe('provider-handoff.v1');
    expect(parsed.activeTask.taskId).toBe('9B');
    expect(parsed.lastValidation.typecheck).toBeTruthy();
  });

  it('runs through npm script', () => {
    const result = spawnSync(npmCommand, ['run', 'project:context'], {
      cwd: '.',
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Makeup Engine');
    expect(result.stdout).toContain('native-gpt-codex-daily');
  });
});
