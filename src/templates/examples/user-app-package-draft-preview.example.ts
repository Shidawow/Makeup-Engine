import { createUserAppPackageDraftPreview } from '../../template-engine';
import {
  candidateToAppPackageContractMissingHumanReviewExample,
  candidateToAppPackageContractReadyExample,
  candidateToAppPackageContractWarningExample,
} from './candidate-to-app-package-contract.example';
import {
  candidateToAppPackageValidationMissingHumanReviewExample,
  candidateToAppPackageValidationReadyExample,
  candidateToAppPackageValidationWarningExample,
} from './candidate-to-app-package-validation.example';

export const userAppPackageDraftPreviewReadyExample =
  createUserAppPackageDraftPreview({
    preparation: candidateToAppPackageContractReadyExample,
    validation: candidateToAppPackageValidationReadyExample,
  });

export const userAppPackageDraftPreviewWarningExample =
  createUserAppPackageDraftPreview({
    preparation: candidateToAppPackageContractWarningExample,
    validation: candidateToAppPackageValidationWarningExample,
  });

export const userAppPackageDraftPreviewMissingContractReadyExample =
  createUserAppPackageDraftPreview({
    preparation: candidateToAppPackageContractMissingHumanReviewExample,
    validation: candidateToAppPackageValidationMissingHumanReviewExample,
  });

export const userAppPackageDraftPreviewRawImageBlockedExample =
  createUserAppPackageDraftPreview({
    preparation: {
      ...candidateToAppPackageContractReadyExample,
      summaryMapping: {
        ...candidateToAppPackageContractReadyExample.summaryMapping,
        previewValue: 'data:image/png;base64,unsafe-preview-payload',
      },
    },
    validation: candidateToAppPackageValidationReadyExample,
  });

export const userAppPackageDraftPreviewMissingStepGuidanceExample =
  createUserAppPackageDraftPreview({
    preparation: {
      ...candidateToAppPackageContractReadyExample,
      stepSequenceMapping: {
        ...candidateToAppPackageContractReadyExample.stepSequenceMapping,
        previewValue: 'missing',
        status: 'blocked',
      },
    },
    validation: candidateToAppPackageValidationReadyExample,
  });

export const userAppPackageDraftPreviewPersonalDataBlockedExample =
  createUserAppPackageDraftPreview({
    preparation: {
      ...candidateToAppPackageContractReadyExample,
      summaryMapping: {
        ...candidateToAppPackageContractReadyExample.summaryMapping,
        previewValue: '适合真实姓名张三，手机号 13800000000 的妆容预览。',
      },
    },
    validation: candidateToAppPackageValidationReadyExample,
  });

export const userAppPackageDraftPreviewMedicalClaimBlockedExample =
  createUserAppPackageDraftPreview({
    preparation: {
      ...candidateToAppPackageContractReadyExample,
      summaryMapping: {
        ...candidateToAppPackageContractReadyExample.summaryMapping,
        previewValue: '这套妆容可以治疗痤疮并修复皮肤病。',
      },
    },
    validation: candidateToAppPackageValidationReadyExample,
  });

export const userAppPackageDraftPreviewUserAppMutationBlockedExample =
  createUserAppPackageDraftPreview({
    preparation: {
      ...candidateToAppPackageContractReadyExample,
      titleMapping: {
        ...candidateToAppPackageContractReadyExample.titleMapping,
        previewValue: 'generatedUserAppTemplatePackage mutation marker',
      },
    },
    validation: candidateToAppPackageValidationReadyExample,
  });
