import {
  createUserAppEvidenceSufficiencyGate,
  type UserAppEvidenceSufficiencyGate,
} from '../../user-app/userAppEvidenceSufficiencyGate';
import {
  userAppInternalTrialEvidencePackInsufficientExample,
  userAppInternalTrialEvidencePackMvpPlanningExample,
  userAppInternalTrialEvidencePackNextInternalTrialExample,
  userAppInternalTrialEvidencePackNoEvidenceExample,
  userAppInternalTrialEvidencePackPrivacyBlockerExample,
  userAppInternalTrialEvidencePackStrongContentInsufficientValueExample,
  userAppInternalTrialEvidencePackStrongValueWeakShellExample,
} from './user-app-internal-trial-evidence-pack.example';

export const userAppEvidenceSufficiencyGateNoEvidenceExample: UserAppEvidenceSufficiencyGate =
  createUserAppEvidenceSufficiencyGate({
    gateId: 'evidence-sufficiency-no-evidence',
    evidencePack: userAppInternalTrialEvidencePackNoEvidenceExample,
  });

export const userAppEvidenceSufficiencyGateInsufficientExample: UserAppEvidenceSufficiencyGate =
  createUserAppEvidenceSufficiencyGate({
    gateId: 'evidence-sufficiency-insufficient',
    evidencePack: userAppInternalTrialEvidencePackInsufficientExample,
  });

export const userAppEvidenceSufficiencyGateNextInternalTrialExample: UserAppEvidenceSufficiencyGate =
  createUserAppEvidenceSufficiencyGate({
    gateId: 'evidence-sufficiency-next-internal-trial',
    evidencePack: userAppInternalTrialEvidencePackNextInternalTrialExample,
  });

export const userAppEvidenceSufficiencyGateMvpPlanningExample: UserAppEvidenceSufficiencyGate =
  createUserAppEvidenceSufficiencyGate({
    gateId: 'evidence-sufficiency-mvp-planning',
    evidencePack: userAppInternalTrialEvidencePackMvpPlanningExample,
  });

export const userAppEvidenceSufficiencyGatePrivacyBlockerExample: UserAppEvidenceSufficiencyGate =
  createUserAppEvidenceSufficiencyGate({
    gateId: 'evidence-sufficiency-privacy-blocker',
    evidencePack: userAppInternalTrialEvidencePackPrivacyBlockerExample,
  });

export const userAppEvidenceSufficiencyGateStrongValueWeakShellExample: UserAppEvidenceSufficiencyGate =
  createUserAppEvidenceSufficiencyGate({
    gateId: 'evidence-sufficiency-strong-value-weak-shell',
    evidencePack: userAppInternalTrialEvidencePackStrongValueWeakShellExample,
  });

export const userAppEvidenceSufficiencyGateStrongContentInsufficientValueExample: UserAppEvidenceSufficiencyGate =
  createUserAppEvidenceSufficiencyGate({
    gateId: 'evidence-sufficiency-content-only',
    evidencePack: userAppInternalTrialEvidencePackStrongContentInsufficientValueExample,
  });
