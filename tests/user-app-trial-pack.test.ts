import { describe, expect, it } from 'vitest';
import {
  createDefaultUserAppTrialTasks,
  createUserAppTrialPack,
  summarizeUserAppTrialPack,
} from '../src/user-app';
import {
  userAppTrialPackIncompleteExample,
  userAppTrialPackReadyExample,
} from '../src/templates/examples';

describe('User App trial pack model', () => {
  it('creates a complete deterministic local-only trial pack', () => {
    const summary = JSON.parse(summarizeUserAppTrialPack(userAppTrialPackReadyExample)) as {
      status: string;
      taskCount: number;
      localOnly: boolean;
      productionApp: boolean;
      usesBackend: boolean;
      uploadsData: boolean;
      usesCamera: boolean;
      usesAr: boolean;
      writesTrainingInput: boolean;
    };

    expect(userAppTrialPackReadyExample.schemaVersion).toBe('user-app-trial-pack-v0.1');
    expect(summary.status).toBe('ready');
    expect(summary.taskCount).toBe(11);
    expect(summary.localOnly).toBe(true);
    expect(summary.productionApp).toBe(false);
    expect(summary.usesBackend).toBe(false);
    expect(summary.uploadsData).toBe(false);
    expect(summary.usesCamera).toBe(false);
    expect(summary.usesAr).toBe(false);
    expect(summary.writesTrainingInput).toBe(false);
  });

  it('keeps trial tasks in user-flow order', () => {
    const taskIds = createDefaultUserAppTrialTasks().map((task) => task.taskId);

    expect(taskIds).toEqual([
      'open_shell',
      'browse_recommendation',
      'select_template',
      'read_template_detail',
      'start_guidance',
      'complete_three_steps',
      'view_tools_products',
      'view_region_guidance',
      'set_or_skip_preferences',
      'read_privacy_notice',
      'restore_local_progress',
    ]);
  });

  it('blocks incomplete trial packs', () => {
    expect(userAppTrialPackIncompleteExample.status).toBe('blocked');
    expect(userAppTrialPackIncompleteExample.issues.map((issue) => issue.area)).toContain('tasks');

    const unordered = createUserAppTrialPack({
      tasks: createDefaultUserAppTrialTasks().map((task) =>
        task.taskId === 'select_template' ? { ...task, order: 1 } : task,
      ),
    });
    expect(unordered.status).toBe('blocked');
  });
});
