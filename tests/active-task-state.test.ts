import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

interface ActiveTask {
  schemaVersion: string;
  taskId: string;
  title: string;
  status: string;
  allowedDirectories: string[];
  forbiddenDirectories: string[];
  validationCommands: string[];
  completionDefinition: string[];
}

describe('active task state', () => {
  it('is valid JSON with current task boundaries and validation commands', async () => {
    const raw = await readFile('project-state/active-task.json', 'utf8');
    const task = JSON.parse(raw) as ActiveTask;

    expect(task.schemaVersion).toBe('active-task.v1');
    expect(task.taskId).toBeTruthy();
    expect(task.title).toBeTruthy();
    expect(task.status).toBeTruthy();
    expect(task.allowedDirectories).toEqual(expect.arrayContaining(['docs', 'project-state', 'tests']));
    expect(task.forbiddenDirectories).toEqual(
      expect.arrayContaining(['src/engine', 'src/runtime', 'src/intelligence/runtime']),
    );
    expect(task.validationCommands).toEqual(
      expect.arrayContaining([
        'npm run typecheck',
        'npm run test',
        'npm run build',
      ]),
    );
    expect(task.completionDefinition.join('\n')).toContain('9C did not implement production app');
  });
});
