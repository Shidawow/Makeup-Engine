import { createGuardedSimulatorReviewHandoff } from '../../template-engine';
import {
  guardedSimulatorReviewChecklistBlockedExample,
  guardedSimulatorReviewChecklistReadyExample,
  guardedSimulatorReviewChecklistWarningExample,
} from './guarded-simulator-review-checklist.example';
import {
  guardedSimulatorReviewGateMissingSimulationValidationExample,
  guardedSimulatorReviewGateReadyExample,
  guardedSimulatorReviewGateWarningExample,
} from './guarded-simulator-review-gate.example';

export const guardedSimulatorReviewHandoffReadyExample =
  createGuardedSimulatorReviewHandoff({
    gate: guardedSimulatorReviewGateReadyExample,
    checklist: guardedSimulatorReviewChecklistReadyExample,
  });

export const guardedSimulatorReviewHandoffKeepReviewOnlyExample =
  createGuardedSimulatorReviewHandoff({
    gate: guardedSimulatorReviewGateWarningExample,
    checklist: guardedSimulatorReviewChecklistWarningExample,
    id: 'guarded-simulator-review-handoff-keep-review-only',
  });

export const guardedSimulatorReviewHandoffBlockedExample =
  createGuardedSimulatorReviewHandoff({
    gate: guardedSimulatorReviewGateMissingSimulationValidationExample,
    checklist: guardedSimulatorReviewChecklistBlockedExample,
    id: 'guarded-simulator-review-handoff-blocked',
  });
