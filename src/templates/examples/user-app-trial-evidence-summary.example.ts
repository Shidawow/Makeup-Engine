import {
  createUserAppTrialEvidenceSummary,
  type UserAppTrialEvidenceSummary,
} from '../../user-app/userAppTrialEvidenceSummary';
import {
  userAppInternalTrialEvidencePackInsufficientExample,
  userAppInternalTrialEvidencePackMvpPlanningExample,
  userAppInternalTrialEvidencePackNoEvidenceExample,
  userAppInternalTrialEvidencePackStrongContentInsufficientValueExample,
  userAppInternalTrialEvidencePackStrongValueWeakShellExample,
} from './user-app-internal-trial-evidence-pack.example';

export const userAppTrialEvidenceSummaryNoEvidenceExample: UserAppTrialEvidenceSummary =
  createUserAppTrialEvidenceSummary({
    summaryId: 'trial-evidence-summary-no-evidence',
    evidencePack: userAppInternalTrialEvidencePackNoEvidenceExample,
  });

export const userAppTrialEvidenceSummaryInsufficientExample: UserAppTrialEvidenceSummary =
  createUserAppTrialEvidenceSummary({
    summaryId: 'trial-evidence-summary-insufficient',
    evidencePack: userAppInternalTrialEvidencePackInsufficientExample,
  });

export const userAppTrialEvidenceSummaryMvpPlanningExample: UserAppTrialEvidenceSummary =
  createUserAppTrialEvidenceSummary({
    summaryId: 'trial-evidence-summary-mvp-planning',
    evidencePack: userAppInternalTrialEvidencePackMvpPlanningExample,
  });

export const userAppTrialEvidenceSummaryStrongValueWeakShellExample: UserAppTrialEvidenceSummary =
  createUserAppTrialEvidenceSummary({
    summaryId: 'trial-evidence-summary-strong-value-weak-shell',
    evidencePack: userAppInternalTrialEvidencePackStrongValueWeakShellExample,
  });

export const userAppTrialEvidenceSummaryStrongContentInsufficientValueExample: UserAppTrialEvidenceSummary =
  createUserAppTrialEvidenceSummary({
    summaryId: 'trial-evidence-summary-content-only',
    evidencePack: userAppInternalTrialEvidencePackStrongContentInsufficientValueExample,
  });
