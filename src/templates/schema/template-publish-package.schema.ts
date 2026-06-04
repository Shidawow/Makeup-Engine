import type { MakeupTemplate } from './template.schema';
import type {
  TemplateLibraryEntry,
  TemplateLibraryEntryQuality,
  TemplateLibraryEntryStatus,
  TemplateLibraryEvidenceSummary,
  TemplateLibraryEntryLineage,
} from './template-library.schema';

export const TEMPLATE_PUBLISH_PACKAGE_SCHEMA_VERSION =
  'template-publish-package-v0.1' as const;

export type TemplatePublishPackageEntryStatus =
  | 'included'
  | 'excluded'
  | 'blocked'
  | 'packaged'
  | 'local_published';

export interface TemplatePublishPackageAsset {
  assetId: string;
  assetKind: 'template-json' | 'evidence-summary' | 'lineage-reference' | 'mask-reference';
  artifactReference: string;
  checksum?: string;
  notes: string[];
}

export interface TemplatePublishPackageReadiness {
  ready: boolean;
  totalEntries: number;
  includedEntries: number;
  blockedEntries: number;
  warnings: string[];
  blockingIssues: string[];
}

export interface TemplatePublishPackageCompatibility {
  target: 'local-user-app-contract' | 'template-service-contract';
  schemaVersion: string;
  compatible: boolean;
  notes: string[];
}

export interface TemplatePublishPackageValidationResult {
  valid: boolean;
  readiness: TemplatePublishPackageReadiness;
  issues: string[];
}

export interface TemplatePublishPackageExportOptions {
  packageName?: string;
  packageVersion?: string;
  includeStatuses?: TemplateLibraryEntryStatus[];
  createdAt?: string;
  notes?: string[];
}

export interface TemplatePublishPackageEntry {
  libraryEntryId: string;
  templateId: string;
  templateVersion: string;
  templateData: MakeupTemplate;
  evidenceSummary: TemplateLibraryEvidenceSummary;
  regionInstructions: TemplateLibraryEntry['regionCoverage'];
  makeupSteps: MakeupTemplate['steps'];
  styleTags: string[];
  qualitySummary: TemplateLibraryEntryQuality;
  lineage: TemplateLibraryEntryLineage;
  packageStatus: TemplatePublishPackageEntryStatus;
}

export interface TemplatePublishPackageManifest {
  schemaVersion: 'template-publish-package-manifest-v0.1';
  manifestId: string;
  packageId: string;
  packageName: string;
  packageVersion: string;
  createdAt: string;
  entryCount: number;
  sourceLibraryId: string;
  sourceBatchIds: string[];
  localOnly: true;
  onlinePublished: false;
  checksums: Record<string, string>;
  notes: string[];
}

export interface TemplatePublishPackage {
  schemaVersion: typeof TEMPLATE_PUBLISH_PACKAGE_SCHEMA_VERSION;
  packageId: string;
  packageName: string;
  packageVersion: string;
  createdAt: string;
  entries: TemplatePublishPackageEntry[];
  manifest: TemplatePublishPackageManifest;
  compatibility: TemplatePublishPackageCompatibility;
  validation: TemplatePublishPackageValidationResult;
  sourceLibraryId: string;
  sourceBatchIds: string[];
  checksums: Record<string, string>;
  exportNotes: string[];
}
