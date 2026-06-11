import {
  createUserAppProductDecisionGate,
  type UserAppProductDecisionGate,
} from '../../user-app/userAppProductDecisionGate';
import {
  userAppInternalTrialLearningSummaryContentIssueExample,
  userAppInternalTrialLearningSummaryInsufficientSignalsExample,
  userAppInternalTrialLearningSummaryPrivacyBlockerExample,
  userAppInternalTrialLearningSummaryShellIssueExample,
  userAppInternalTrialLearningSummaryStrongValueExample,
  userAppInternalTrialLearningSummaryTrialOpsIssueExample,
} from './user-app-internal-trial-learning-summary.example';

export const userAppProductDecisionGateMvpValidationExample: UserAppProductDecisionGate =
  createUserAppProductDecisionGate({
    gateId: 'product-decision-mvp-validation',
    learningSummary: userAppInternalTrialLearningSummaryStrongValueExample,
    strongValueSignal: true,
  });

export const userAppProductDecisionGateContentIssueExample: UserAppProductDecisionGate =
  createUserAppProductDecisionGate({
    gateId: 'product-decision-content-issue',
    learningSummary: userAppInternalTrialLearningSummaryContentIssueExample,
  });

export const userAppProductDecisionGateShellIssueExample: UserAppProductDecisionGate =
  createUserAppProductDecisionGate({
    gateId: 'product-decision-shell-issue',
    learningSummary: userAppInternalTrialLearningSummaryShellIssueExample,
  });

export const userAppProductDecisionGateTrialOpsIssueExample: UserAppProductDecisionGate =
  createUserAppProductDecisionGate({
    gateId: 'product-decision-trial-ops-issue',
    learningSummary: userAppInternalTrialLearningSummaryTrialOpsIssueExample,
    minimumSignals: 2,
  });

export const userAppProductDecisionGatePrivacyBlockerExample: UserAppProductDecisionGate =
  createUserAppProductDecisionGate({
    gateId: 'product-decision-privacy-blocker',
    learningSummary: userAppInternalTrialLearningSummaryPrivacyBlockerExample,
  });

export const userAppProductDecisionGateInsufficientSignalsExample: UserAppProductDecisionGate =
  createUserAppProductDecisionGate({
    gateId: 'product-decision-insufficient-signals',
    learningSummary: userAppInternalTrialLearningSummaryInsufficientSignalsExample,
    minimumSignals: 20,
  });

export const userAppProductDecisionGateProductionDiscoveryExample: UserAppProductDecisionGate =
  createUserAppProductDecisionGate({
    gateId: 'product-decision-production-discovery',
    learningSummary: userAppInternalTrialLearningSummaryStrongValueExample,
    productionDiscoveryRequested: true,
  });
