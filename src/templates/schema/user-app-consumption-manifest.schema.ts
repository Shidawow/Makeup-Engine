import type {
  UserAppCompatibilityTarget,
  UserAppMakeupDifficulty,
  UserAppTemplateReadiness,
} from './user-app-template-contract.schema';

export const USER_APP_CONSUMPTION_MANIFEST_SCHEMA_VERSION =
  'user-app-consumption-manifest-v0.1' as const;

export interface UserAppConsumptionReadiness {
  ready: boolean;
  target: UserAppCompatibilityTarget;
  templateCount: number;
  warningCount: number;
  blockingIssueCount: number;
  notes: string[];
}

export interface UserAppConsumptionManifestEntry {
  appTemplateId: string;
  sourceLibraryEntryId: string;
  sourceTemplateId: string;
  templateVersion: string;
  title: string;
  styleTags: string[];
  difficulty: UserAppMakeupDifficulty;
  estimatedDurationMinutes: number;
  stepCount: number;
  regionInstructionCount: number;
  checksum: string;
}

export interface UserAppConsumptionManifest {
  schemaVersion: typeof USER_APP_CONSUMPTION_MANIFEST_SCHEMA_VERSION;
  manifestId: string;
  appTemplatePackageId: string;
  appTemplatePackageVersion: string;
  generatedAt: string;
  compatibilityTarget: UserAppCompatibilityTarget;
  entryCount: number;
  entries: UserAppConsumptionManifestEntry[];
  readiness: UserAppConsumptionReadiness;
  sourcePublishPackageId: string;
  localOnly: true;
  onlinePublished: false;
  checksums: Record<string, string>;
  notes: string[];
}

export interface UserAppConsumptionExport {
  schemaVersion: 'user-app-consumption-export-v0.1';
  exportedAt: string;
  packageId: string;
  packageVersion: string;
  compatibilityTarget: UserAppCompatibilityTarget;
  manifest: UserAppConsumptionManifest;
  readiness: UserAppTemplateReadiness;
  checksums: Record<string, string>;
  localOnlyDisclaimer: string;
}
