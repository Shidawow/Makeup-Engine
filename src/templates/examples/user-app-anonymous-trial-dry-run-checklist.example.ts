import { createUserAppAnonymousTrialDryRunChecklist } from '../../user-app/userAppAnonymousTrialDryRunChecklist';
import {
  userAppAnonymousTrialDryRunPackForbiddenPhotoExample,
  userAppAnonymousTrialDryRunPackReadyExample,
  userAppAnonymousTrialDryRunPackWarningExample,
} from './user-app-anonymous-trial-dry-run-pack.example';

export const userAppAnonymousTrialDryRunChecklistReadyExample =
  createUserAppAnonymousTrialDryRunChecklist({
    pack: userAppAnonymousTrialDryRunPackReadyExample,
  });

export const userAppAnonymousTrialDryRunChecklistWarningExample =
  createUserAppAnonymousTrialDryRunChecklist({
    pack: userAppAnonymousTrialDryRunPackWarningExample,
    overrides: {
      'dry-run-check-before-scenarios-ready': true,
      'dry-run-check-allowed-aggregate-template': false,
    },
  });

export const userAppAnonymousTrialDryRunChecklistIncompleteExample =
  createUserAppAnonymousTrialDryRunChecklist({
    pack: userAppAnonymousTrialDryRunPackWarningExample,
  });

export const userAppAnonymousTrialDryRunChecklistBlockedExample =
  createUserAppAnonymousTrialDryRunChecklist({
    pack: userAppAnonymousTrialDryRunPackForbiddenPhotoExample,
  });
