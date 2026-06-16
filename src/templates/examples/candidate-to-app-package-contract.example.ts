import { createCandidateToAppPackageContractPreparation } from '../../template-engine';
import {
  templateLibraryCandidatePackageMissingHumanReviewExample,
  templateLibraryCandidatePackageRawImageBlockedExample,
  templateLibraryCandidatePackageReadyExample,
  templateLibraryCandidatePackageUserAppMutationBlockedExample,
  templateLibraryCandidatePackageWarningExample,
} from './template-library-candidate-package.example';
import {
  templateLibraryCandidateValidationMissingHumanReviewExample,
  templateLibraryCandidateValidationRawImageBlockedExample,
  templateLibraryCandidateValidationReadyExample,
  templateLibraryCandidateValidationUserAppMutationBlockedExample,
  templateLibraryCandidateValidationWarningExample,
} from './template-library-candidate-validation.example';

export const candidateToAppPackageContractReadyExample =
  createCandidateToAppPackageContractPreparation({
    candidatePackage: templateLibraryCandidatePackageReadyExample,
    candidateValidation: templateLibraryCandidateValidationReadyExample,
  });

export const candidateToAppPackageContractWarningExample =
  createCandidateToAppPackageContractPreparation({
    candidatePackage: templateLibraryCandidatePackageWarningExample,
    candidateValidation: templateLibraryCandidateValidationWarningExample,
  });

export const candidateToAppPackageContractMissingHumanReviewExample =
  createCandidateToAppPackageContractPreparation({
    candidatePackage: templateLibraryCandidatePackageMissingHumanReviewExample,
    candidateValidation: templateLibraryCandidateValidationMissingHumanReviewExample,
  });

export const candidateToAppPackageContractRawImageBlockedExample =
  createCandidateToAppPackageContractPreparation({
    candidatePackage: templateLibraryCandidatePackageRawImageBlockedExample,
    candidateValidation: templateLibraryCandidateValidationRawImageBlockedExample,
  });

export const candidateToAppPackageContractUserAppMutationBlockedExample =
  createCandidateToAppPackageContractPreparation({
    candidatePackage: templateLibraryCandidatePackageUserAppMutationBlockedExample,
    candidateValidation: templateLibraryCandidateValidationUserAppMutationBlockedExample,
  });

export const candidateToAppPackageContractMissingRegionGuidanceExample =
  createCandidateToAppPackageContractPreparation({
    candidatePackage: {
      ...templateLibraryCandidatePackageReadyExample,
      regionGuidance: [],
    },
    candidateValidation: templateLibraryCandidateValidationReadyExample,
  });
