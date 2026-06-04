import type { UserAppTemplatePackage } from '../templates/schema';
import { createUserAppShellViewModel } from './userAppViewModel';
import type { UserAppShellState } from './userAppState';

export const createUserAppShellModel = (input: {
  packageData?: UserAppTemplatePackage | null;
  state: UserAppShellState;
}) => {
  const selectedTemplateId = input.state.navigation.selectedTemplateId;
  const progress = selectedTemplateId
    ? input.state.progressByTemplateId[selectedTemplateId]
    : undefined;

  return createUserAppShellViewModel({
    packageData: input.packageData,
    selectedTemplateId,
    currentStepId: input.state.navigation.selectedStepId,
    progress,
  });
};
