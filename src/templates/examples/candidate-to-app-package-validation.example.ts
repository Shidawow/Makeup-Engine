import { validateCandidateToAppPackageContract } from '../../template-engine';
import {
  candidateToAppPackageContractMissingHumanReviewExample,
  candidateToAppPackageContractMissingRegionGuidanceExample,
  candidateToAppPackageContractRawImageBlockedExample,
  candidateToAppPackageContractReadyExample,
  candidateToAppPackageContractUserAppMutationBlockedExample,
  candidateToAppPackageContractWarningExample,
} from './candidate-to-app-package-contract.example';

export const candidateToAppPackageValidationReadyExample =
  validateCandidateToAppPackageContract(candidateToAppPackageContractReadyExample);

export const candidateToAppPackageValidationWarningExample =
  validateCandidateToAppPackageContract(candidateToAppPackageContractWarningExample);

export const candidateToAppPackageValidationMissingHumanReviewExample =
  validateCandidateToAppPackageContract(
    candidateToAppPackageContractMissingHumanReviewExample,
  );

export const candidateToAppPackageValidationRawImageBlockedExample =
  validateCandidateToAppPackageContract(
    candidateToAppPackageContractRawImageBlockedExample,
  );

export const candidateToAppPackageValidationUserAppMutationBlockedExample =
  validateCandidateToAppPackageContract(
    candidateToAppPackageContractUserAppMutationBlockedExample,
  );

export const candidateToAppPackageValidationMissingRegionGuidanceExample =
  validateCandidateToAppPackageContract(
    candidateToAppPackageContractMissingRegionGuidanceExample,
  );
