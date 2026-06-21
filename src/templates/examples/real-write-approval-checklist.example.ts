import { createRealWriteApprovalChecklist } from '../../template-engine';
import {
  realWriteApprovalBoundaryActualWriteScopeExample,
  realWriteApprovalBoundaryReadyExample,
  realWriteApprovalBoundaryWarningExample,
} from './real-write-approval-boundary.example';

export const realWriteApprovalChecklistReadyExample =
  createRealWriteApprovalChecklist({
    boundary: realWriteApprovalBoundaryReadyExample,
  });

export const realWriteApprovalChecklistWarningExample =
  createRealWriteApprovalChecklist({
    boundary: realWriteApprovalBoundaryWarningExample,
    checklistId: 'real-write-approval-checklist-warning',
  });

export const realWriteApprovalChecklistBlockedExample =
  createRealWriteApprovalChecklist({
    boundary: realWriteApprovalBoundaryActualWriteScopeExample,
    checklistId: 'real-write-approval-checklist-blocked',
  });
