import { validateTemplateLibraryCandidatePackage } from '../../template-engine';
import {
  templateLibraryCandidatePackageMissingHumanReviewExample,
  templateLibraryCandidatePackageQaBlockedExample,
  templateLibraryCandidatePackageRawImageBlockedExample,
  templateLibraryCandidatePackageReadyExample,
  templateLibraryCandidatePackageUserAppMutationBlockedExample,
  templateLibraryCandidatePackageWarningExample,
} from './template-library-candidate-package.example';

export const templateLibraryCandidateValidationReadyExample =
  validateTemplateLibraryCandidatePackage(templateLibraryCandidatePackageReadyExample);

export const templateLibraryCandidateValidationWarningExample =
  validateTemplateLibraryCandidatePackage(templateLibraryCandidatePackageWarningExample);

export const templateLibraryCandidateValidationMissingHumanReviewExample =
  validateTemplateLibraryCandidatePackage(
    templateLibraryCandidatePackageMissingHumanReviewExample,
  );

export const templateLibraryCandidateValidationQaBlockedExample =
  validateTemplateLibraryCandidatePackage(templateLibraryCandidatePackageQaBlockedExample);

export const templateLibraryCandidateValidationRawImageBlockedExample =
  validateTemplateLibraryCandidatePackage(
    templateLibraryCandidatePackageRawImageBlockedExample,
  );

export const templateLibraryCandidateValidationUserAppMutationBlockedExample =
  validateTemplateLibraryCandidatePackage(
    templateLibraryCandidatePackageUserAppMutationBlockedExample,
  );
