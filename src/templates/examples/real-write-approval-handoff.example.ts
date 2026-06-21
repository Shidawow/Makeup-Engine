import { createRealWriteApprovalHandoff } from '../../template-engine';
import {
  realWriteApprovalBoundaryActualWriteScopeExample,
  realWriteApprovalBoundaryReadyExample,
  realWriteApprovalBoundaryWarningExample,
} from './real-write-approval-boundary.example';
import {
  realWriteApprovalChecklistBlockedExample,
  realWriteApprovalChecklistReadyExample,
  realWriteApprovalChecklistWarningExample,
} from './real-write-approval-checklist.example';

export const realWriteApprovalHandoffReadyExample = createRealWriteApprovalHandoff({
  boundary: realWriteApprovalBoundaryReadyExample,
  checklist: realWriteApprovalChecklistReadyExample,
});

export const realWriteApprovalHandoffKeepBoundaryOnlyExample =
  createRealWriteApprovalHandoff({
    boundary: realWriteApprovalBoundaryWarningExample,
    checklist: realWriteApprovalChecklistWarningExample,
    id: 'real-write-approval-handoff-keep-boundary-only',
  });

export const realWriteApprovalHandoffBlockedExample =
  createRealWriteApprovalHandoff({
    boundary: realWriteApprovalBoundaryActualWriteScopeExample,
    checklist: realWriteApprovalChecklistBlockedExample,
    id: 'real-write-approval-handoff-blocked',
  });
