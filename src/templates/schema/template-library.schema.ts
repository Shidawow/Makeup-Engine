import type { MakeupTemplate } from './template.schema';
import type { MakeupRegion, MakeupStep } from './technique.schema';
import type { TemplateProductionPublishConfirmation } from './template-production-qa.schema';

export const TEMPLATE_LIBRARY_SCHEMA_VERSION = 'template-library-v0.1' as const;

export type TemplateLibraryEntryStatus =
  | 'draft'
  | 'imported_from_production'
  | 'needs_library_review'
  | 'ready_for_package'
  | 'packaged'
  | 'local_published'
  | 'archived'
  | 'deprecated'
  | 'rejected';

export type TemplateLibraryIssueSeverity = 'info' | 'warning' | 'blocking';

export interface TemplateLibraryEntryIssue {
  code: string;
  message: string;
  severity: TemplateLibraryIssueSeverity;
  source:
    | 'production-task'
    | 'template-data'
    | 'evidence'
    | 'lineage'
    | 'library-review'
    | 'package'
    | 'storage';
}

export interface TemplateLibraryEntryVersion {
  version: string;
  changeType: 'initial' | 'patch' | 'minor' | 'major' | 'status-change';
  createdAt: string;
  reason: string;
  notes: string[];
}

export interface TemplateLibraryEntrySource {
  sourceType: 'production-task';
  sourceProductionBatchId: string;
  sourceProductionTaskId: string;
  sourceImageId: string;
  sourceImagePackageId?: string;
  templateAnalysisSeedId?: string;
  sourceImageManifestReference?: string;
}

export interface TemplateLibraryEvidenceSummary {
  evidenceId?: string;
  templateId?: string;
  evidenceReady: boolean;
  humanVerificationStatus?: string;
  sourceImageId?: string;
  notes: string[];
  references: string[];
}

export interface TemplateLibraryEntryMetadata {
  displayName: string;
  category?: string;
  styleTags: string[];
  regionCoverage: MakeupRegion[];
  supportedUseCases: string[];
  createdBy: 'template-studio';
  localOnly: true;
  onlinePublished: false;
}

export interface TemplateLibraryEntryQuality {
  qualityScore?: number;
  confidence?: number;
  evidenceReady: boolean;
  blockingIssueCount: number;
  warningIssueCount: number;
  notes: string[];
}

export interface TemplateLibraryEntryLineage {
  source: TemplateLibraryEntrySource;
  sourceImageLineage?: Record<string, string | number | boolean | null>;
  analysisSummary?: {
    templateId?: string;
    previewId?: string;
    traceSummary: string[];
    evidenceReady: boolean;
  };
  reviewSummary: {
    productionStatus: string;
    templateReviewStatus: string;
    publishStatus: string;
    rejectReason?: string;
    rejectNote?: string;
  };
  publishConfirmationSummary?: Pick<
    TemplateProductionPublishConfirmation,
    | 'confirmationId'
    | 'confirmedAt'
    | 'confirmedBy'
    | 'localPublished'
    | 'notOnlineRelease'
    | 'noTrainingDataset'
  >;
}

export interface TemplateLibraryEntry {
  libraryEntryId: string;
  templateId: string;
  templateVersion: string;
  sourceProductionBatchId: string;
  sourceProductionTaskId: string;
  sourceImageId: string;
  makeupTemplate: MakeupTemplate;
  evidenceSummary: TemplateLibraryEvidenceSummary;
  qualitySummary: TemplateLibraryEntryQuality;
  reviewSummary: TemplateLibraryEntryLineage['reviewSummary'];
  publishConfirmationSummary?: TemplateLibraryEntryLineage['publishConfirmationSummary'];
  styleTags: string[];
  regionCoverage: MakeupRegion[];
  supportedUseCases: string[];
  status: TemplateLibraryEntryStatus;
  versionHistory: TemplateLibraryEntryVersion[];
  lineage: TemplateLibraryEntryLineage;
  issues: TemplateLibraryEntryIssue[];
  metadata: TemplateLibraryEntryMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateLibraryManifest {
  schemaVersion: 'template-library-manifest-v0.1';
  manifestId: string;
  libraryId: string;
  generatedAt: string;
  entryCount: number;
  entryStatuses: Record<TemplateLibraryEntryStatus, number>;
  packageReadyEntryIds: string[];
  localOnly: true;
  onlinePublished: false;
  notes: string[];
}

export interface TemplateLibrarySummary {
  totalEntries: number;
  needsReview: number;
  readyForPackage: number;
  packaged: number;
  localPublished: number;
  rejected: number;
  archived: number;
  deprecated: number;
  issueCount: number;
  nextActions: string[];
}

export interface TemplateLibraryValidationResult {
  valid: boolean;
  issues: TemplateLibraryEntryIssue[];
}

export interface TemplateLibrary {
  schemaVersion: typeof TEMPLATE_LIBRARY_SCHEMA_VERSION;
  libraryId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  entries: TemplateLibraryEntry[];
  manifest: TemplateLibraryManifest;
  summary: TemplateLibrarySummary;
  issues: TemplateLibraryEntryIssue[];
  metadata: {
    createdBy: 'template-studio';
    localOnly: true;
    onlinePublished: false;
    notes: string[];
  };
}

export interface TemplateLibraryEntryRegionInstruction {
  region: MakeupRegion;
  steps: MakeupStep[];
  notes: string[];
}
