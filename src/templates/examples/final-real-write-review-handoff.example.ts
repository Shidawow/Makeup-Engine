import { createFinalRealWriteReviewHandoff } from '../../template-engine';
import {
  finalRealWriteReviewChecklistOwnerActualWriteBlockedExample,
  finalRealWriteReviewChecklistReadyExample,
  finalRealWriteReviewChecklistWarningExample,
} from './final-real-write-review-checklist.example';
import {
  finalRealWriteReviewGateActualRegistryWriteExample,
  finalRealWriteReviewGateOwnerActualWriteExample,
  finalRealWriteReviewGateReadyExample,
  finalRealWriteReviewGateWarningExample,
} from './final-real-write-review-gate.example';

export const finalRealWriteReviewHandoffReadyExample =
  createFinalRealWriteReviewHandoff({
    gate: finalRealWriteReviewGateReadyExample,
    checklist: finalRealWriteReviewChecklistReadyExample,
  });

export const finalRealWriteReviewHandoffKeepFinalReviewOnlyExample =
  createFinalRealWriteReviewHandoff({
    gate: finalRealWriteReviewGateWarningExample,
    checklist: finalRealWriteReviewChecklistWarningExample,
  });

export const finalRealWriteReviewHandoffOwnerClarificationExample =
  createFinalRealWriteReviewHandoff({
    gate: finalRealWriteReviewGateOwnerActualWriteExample,
    checklist: finalRealWriteReviewChecklistOwnerActualWriteBlockedExample,
  });

export const finalRealWriteReviewHandoffBlockedExample =
  createFinalRealWriteReviewHandoff({
    gate: finalRealWriteReviewGateActualRegistryWriteExample,
    checklist: finalRealWriteReviewChecklistReadyExample,
  });
