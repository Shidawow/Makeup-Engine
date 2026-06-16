import { createCandidateToAppPackageHandoff } from '../../template-engine';
import {
  candidateToAppPackageContractMissingHumanReviewExample,
  candidateToAppPackageContractMissingRegionGuidanceExample,
  candidateToAppPackageContractRawImageBlockedExample,
  candidateToAppPackageContractReadyExample,
  candidateToAppPackageContractWarningExample,
} from './candidate-to-app-package-contract.example';
import {
  candidateToAppPackageValidationMissingHumanReviewExample,
  candidateToAppPackageValidationMissingRegionGuidanceExample,
  candidateToAppPackageValidationRawImageBlockedExample,
  candidateToAppPackageValidationReadyExample,
  candidateToAppPackageValidationWarningExample,
} from './candidate-to-app-package-validation.example';

export const candidateToAppPackageHandoffReadyExample =
  createCandidateToAppPackageHandoff({
    preparation: candidateToAppPackageContractReadyExample,
    validation: candidateToAppPackageValidationReadyExample,
  });

export const candidateToAppPackageHandoffCopyPolishExample =
  createCandidateToAppPackageHandoff({
    preparation: candidateToAppPackageContractWarningExample,
    validation: candidateToAppPackageValidationWarningExample,
  });

export const candidateToAppPackageHandoffPrivacyReviewExample =
  createCandidateToAppPackageHandoff({
    preparation: candidateToAppPackageContractRawImageBlockedExample,
    validation: candidateToAppPackageValidationRawImageBlockedExample,
  });

export const candidateToAppPackageHandoffRegionRevisionExample =
  createCandidateToAppPackageHandoff({
    preparation: candidateToAppPackageContractMissingRegionGuidanceExample,
    validation: candidateToAppPackageValidationMissingRegionGuidanceExample,
  });

export const candidateToAppPackageHandoffBlockedExample =
  createCandidateToAppPackageHandoff({
    preparation: candidateToAppPackageContractMissingHumanReviewExample,
    validation: candidateToAppPackageValidationMissingHumanReviewExample,
  });
