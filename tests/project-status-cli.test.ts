import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

describe('project status CLI', () => {
  it('prints machine-readable JSON', () => {
    const result = spawnSync(process.execPath, ['scripts/project-status.mjs', '--json'], {
      cwd: '.',
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout) as {
      currentPhase: string;
      lastCompletedPhase: string;
      lastCompletedBusinessPhase: string;
      nextRecommendedPhase: string;
      knownLimitations: string[];
    };

    expect(parsed.currentPhase).toBe('Internal Trial Learning Summary & Product Decision Gate');
    expect(parsed.lastCompletedPhase).toBe('9D');
    expect(parsed.lastCompletedBusinessPhase).toBe('9D');
    expect(parsed.nextRecommendedPhase).toBe('9E');
    expect(parsed.knownLimitations).toContain('JPEG pixel decoding is intentionally unsupported');
  });

  it('runs through npm script in human-readable mode', () => {
    const result = spawnSync(npmCommand, ['run', 'project:status'], {
      cwd: '.',
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Makeup Engine');
    expect(result.stdout).toContain('9C');
    expect(result.stdout).toContain('9D');
  });

  it('runs through npm script with forwarded JSON flag', () => {
    const result = spawnSync(npmCommand, ['run', 'project:status', '--', '--json'], {
      cwd: '.',
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout.slice(result.stdout.indexOf('{'))) as {
      nextAction: string;
    };
    expect(parsed.nextAction).toContain('Phase 9E');
  });
});
