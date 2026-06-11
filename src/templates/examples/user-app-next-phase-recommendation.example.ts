import {
  createUserAppNextPhaseRecommendation,
  type UserAppNextPhaseRecommendation,
} from '../../user-app/userAppNextPhaseRecommendation';
import { userAppInternalTrialLearningSummaryStrongValueExample } from './user-app-internal-trial-learning-summary.example';
import {
  userAppProductDecisionGateInsufficientSignalsExample,
  userAppProductDecisionGateMvpValidationExample,
  userAppProductDecisionGatePrivacyBlockerExample,
  userAppProductDecisionGateProductionDiscoveryExample,
} from './user-app-product-decision-gate.example';

export const userAppNextPhaseRecommendationPhase9EExample: UserAppNextPhaseRecommendation =
  createUserAppNextPhaseRecommendation({
    recommendationId: 'next-phase-9e-evidence-pack',
    decisionGate: userAppProductDecisionGateInsufficientSignalsExample,
  });

export const userAppNextPhaseRecommendationPhase10AExample: UserAppNextPhaseRecommendation =
  createUserAppNextPhaseRecommendation({
    recommendationId: 'next-phase-10a-mvp-validation',
    decisionGate: userAppProductDecisionGateMvpValidationExample,
  });

export const userAppNextPhaseRecommendationPhase10BExample: UserAppNextPhaseRecommendation =
  createUserAppNextPhaseRecommendation({
    recommendationId: 'next-phase-10b-production-discovery',
    decisionGate: userAppProductDecisionGateProductionDiscoveryExample,
    productionDiscoveryNeeded: true,
  });

export const userAppNextPhaseRecommendationDocIllustratedExample: UserAppNextPhaseRecommendation =
  createUserAppNextPhaseRecommendation({
    recommendationId: 'next-phase-doc-illustrated',
    learningSummary: userAppInternalTrialLearningSummaryStrongValueExample,
    documentationNeeded: true,
  });

export const userAppNextPhaseRecommendationPhase9DFixExample: UserAppNextPhaseRecommendation =
  createUserAppNextPhaseRecommendation({
    recommendationId: 'next-phase-9d-fix',
    decisionGate: userAppProductDecisionGatePrivacyBlockerExample,
  });
