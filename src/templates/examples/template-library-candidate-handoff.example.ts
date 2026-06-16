import { createTemplateLibraryCandidateHandoff } from '../../template-engine';
import {
  templateLibraryCandidatePackageMissingHumanReviewExample,
  templateLibraryCandidatePackageQaBlockedExample,
  templateLibraryCandidatePackageReadyExample,
  templateLibraryCandidatePackageRawImageBlockedExample,
  templateLibraryCandidatePackageWarningExample,
} from './template-library-candidate-package.example';
import {
  templateLibraryCandidateValidationMissingHumanReviewExample,
  templateLibraryCandidateValidationQaBlockedExample,
  templateLibraryCandidateValidationRawImageBlockedExample,
  templateLibraryCandidateValidationReadyExample,
  templateLibraryCandidateValidationWarningExample,
} from './template-library-candidate-validation.example';

export const templateLibraryCandidateHandoffReadyExample =
  createTemplateLibraryCandidateHandoff({
    candidatePackage: templateLibraryCandidatePackageReadyExample,
    validation: templateLibraryCandidateValidationReadyExample,
  });

export const templateLibraryCandidateHandoffCopyPolishExample =
  createTemplateLibraryCandidateHandoff({
    candidatePackage: templateLibraryCandidatePackageWarningExample,
    validation: templateLibraryCandidateValidationWarningExample,
  });

export const templateLibraryCandidateHandoffRegionFixExample =
  createTemplateLibraryCandidateHandoff({
    candidatePackage: templateLibraryCandidatePackageQaBlockedExample,
    validation: templateLibraryCandidateValidationQaBlockedExample,
  });

export const templateLibraryCandidateHandoffPrivacyReviewExample =
  createTemplateLibraryCandidateHandoff({
    candidatePackage: templateLibraryCandidatePackageRawImageBlockedExample,
    validation: templateLibraryCandidateValidationRawImageBlockedExample,
  });

export const templateLibraryCandidateHandoffBlockedExample =
  createTemplateLibraryCandidateHandoff({
    candidatePackage: templateLibraryCandidatePackageMissingHumanReviewExample,
    validation: templateLibraryCandidateValidationMissingHumanReviewExample,
  });
