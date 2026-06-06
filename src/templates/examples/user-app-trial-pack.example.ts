import {
  createDefaultUserAppTrialTasks,
  createUserAppTrialPack,
  type UserAppTrialPack,
} from '../../user-app/userAppTrialPack';

export const userAppTrialPackReadyExample: UserAppTrialPack = createUserAppTrialPack({
  packId: 'user-app-trial-pack-ready-example',
  templateCoverage: ['daily', 'work', 'evening', 'beginner', 'warning-state'],
});

export const userAppTrialPackIncompleteExample: UserAppTrialPack = createUserAppTrialPack({
  packId: 'user-app-trial-pack-incomplete-example',
  tasks: createDefaultUserAppTrialTasks().filter(
    (task) => task.taskId !== 'restore_local_progress',
  ),
  templateCoverage: [],
});
