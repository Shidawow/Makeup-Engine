import { createGuardedSimulatorReviewChecklist } from '../../template-engine';
import {
  guardedSimulatorReviewGateActualRegistryWriteExample,
  guardedSimulatorReviewGateMissingSimulationValidationExample,
  guardedSimulatorReviewGateReadyExample,
  guardedSimulatorReviewGateWarningExample,
} from './guarded-simulator-review-gate.example';

export const guardedSimulatorReviewChecklistReadyExample =
  createGuardedSimulatorReviewChecklist({
    gate: guardedSimulatorReviewGateReadyExample,
  });

export const guardedSimulatorReviewChecklistWarningExample =
  createGuardedSimulatorReviewChecklist({
    gate: guardedSimulatorReviewGateWarningExample,
    checklistId: 'guarded-simulator-review-checklist-warning',
  });

export const guardedSimulatorReviewChecklistBlockedExample =
  createGuardedSimulatorReviewChecklist({
    gate: guardedSimulatorReviewGateMissingSimulationValidationExample,
    checklistId: 'guarded-simulator-review-checklist-blocked',
  });

export const guardedSimulatorReviewChecklistActualRegistryWriteBlockedExample =
  createGuardedSimulatorReviewChecklist({
    gate: guardedSimulatorReviewGateActualRegistryWriteExample,
    checklistId: 'guarded-simulator-review-checklist-actual-registry-write',
  });
