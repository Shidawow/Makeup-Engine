import type {
  TemplateAnalysisSeed,
  TemplateAnalysisSeedArtifactLink,
  TemplateAnalysisSeedArtifactPreference,
  TemplateAnalysisSeedIssue,
  TemplateAnalysisSeedReadiness,
  TemplateAnalysisSeedValidationResult,
  SourceImageArtifactBinding,
  SourceImageArtifactBindingMap,
} from '../schema';
import { TEMPLATE_ANALYSIS_SEED_SCHEMA_VERSION } from '../schema';
import type {
  TemplateProductionBatch,
  TemplateProductionBatchIssue,
  TemplateProductionBatchValidationResult,
  TemplateProductionTask,
  TemplateProductionTaskIssue,
  TemplateProductionTaskStatus,
} from '../schema/template-production-batch.schema';
import {
  SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION,
  type SourceImageArtifactLink,
  type SourceImageEntry,
  type SourceImageImportStatus,
  type SourceImageManifest,
} from '../../training/schema';
import { stableHash, stableStringify } from './datasetExport';
import { updateTemplateAnalysisSeedWithBoundArtifact } from './sourceImageArtifactBinding';
import {
  resolveBestBoundArtifactForAnalysis,
} from './sourceImageArtifactBinding';

export interface SourceImageManifestStudioValidation {
  valid: boolean;
  manifest?: SourceImageManifest;
  errors: string[];
  warnings: string[];
}

export interface SourceImageEntryDetail {
  entry: SourceImageEntry;
  artifacts: Record<SourceImageArtifactLink['kind'], SourceImageArtifactLink | undefined>;
  validation: TemplateAnalysisSeedValidationResult;
  bestArtifact?: SourceImageArtifactLink;
}

export interface SourceImagePackageStudioSummary {
  packageId: string;
  imageCount: number;
  readyCount: number;
  blockedCount: number;
  failedCount: number;
  codecSummary: Record<string, number>;
  qualitySummary: {
    averageScore: number;
    ready: number;
    warning: number;
    blocked: number;
  };
  quarantineSummary: Record<string, number>;
}

export interface TemplateAnalysisSeedImageData {
  seedId: string;
  selectedArtifact?: TemplateAnalysisSeedArtifactLink;
  previewUrl?: string;
  canRunBrowserAnalysis: boolean;
  artifactSummary: string;
  issues: TemplateAnalysisSeedIssue[];
}

export interface StudioSourceImagePackageSession {
  schemaVersion: 'studio-source-image-package-session-v0.1';
  sessionId: string;
  sourceImagePackageId?: string;
  manifestReference?: string;
  activeSeedId?: string;
  seeds: TemplateAnalysisSeed[];
  updatedAt: string;
}

export interface BatchSeedCreationSummary {
  totalSourceImages: number;
  readySourceImages: number;
  blockedSourceImages: number;
  failedSourceImages: number;
  createdSeeds: number;
  createdTasks: number;
  needsArtifactBindingTasks: number;
  readyForAnalysisTasks: number;
  skippedSourceImageIds: string[];
  issues: TemplateProductionTaskIssue[];
}

export interface BatchSeedCreationResult {
  seeds: TemplateAnalysisSeed[];
  tasks: TemplateProductionTask[];
  summary: BatchSeedCreationSummary;
}

const sourceImageStatuses: SourceImageImportStatus[] = [
  'imported',
  'normalized',
  'ready_for_template_analysis',
  'blocked_by_codec',
  'blocked_by_quality',
  'failed',
];

const artifactPreferences: TemplateAnalysisSeedArtifactPreference[] = [
  'normalized-png',
  'raw-rgba',
  'json-rgba',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const stripUndefined = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripUndefined);
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, stripUndefined(entryValue)]),
    );
  }

  return value;
};

export const isBrowserReadableArtifactUri = (uri: string): boolean =>
  uri.startsWith('data:') ||
  uri.startsWith('blob:') ||
  uri.startsWith('http://') ||
  uri.startsWith('https://') ||
  (uri.startsWith('/') && !uri.startsWith('//'));

const issue = (
  code: string,
  message: string,
  source: TemplateAnalysisSeedIssue['source'] = 'source-image-entry',
  severity: TemplateAnalysisSeedIssue['severity'] = 'error',
): TemplateAnalysisSeedIssue => ({ code, message, severity, source });

const artifactToSeedLink = (
  artifact: SourceImageArtifactLink | undefined,
): TemplateAnalysisSeedArtifactLink | undefined =>
  artifact
    ? {
        kind: artifact.kind,
        uri: artifact.uri,
        checksum: artifact.checksum,
        width: artifact.width,
        height: artifact.height,
        format: artifact.format,
        browserReadable: isBrowserReadableArtifactUri(artifact.uri),
        notes: isBrowserReadableArtifactUri(artifact.uri)
          ? ['可由浏览器直接预览']
          : ['CLI 生成的相对路径需要通过文件选择或开发服务器暴露后才能在浏览器中读取'],
      }
    : undefined;

const readinessFromIssues = (
  entry: SourceImageEntry,
  issues: readonly TemplateAnalysisSeedIssue[],
): TemplateAnalysisSeedReadiness => {
  if (entry.importStatus === 'failed') {
    return 'failed';
  }

  if (issues.some((nextIssue) => nextIssue.code.includes('codec'))) {
    return 'blocked_by_codec';
  }

  if (issues.some((nextIssue) => nextIssue.code.includes('quality'))) {
    return 'blocked_by_source_image_quality';
  }

  if (issues.some((nextIssue) => nextIssue.code.includes('artifact'))) {
    return 'blocked_by_missing_artifact';
  }

  return 'ready_for_vision_analysis';
};

export const readSourceImageManifest = (content: string): SourceImageManifest =>
  parseSourceImageManifestJson(content);

export const parseSourceImageManifestJson = (content: string): SourceImageManifest => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(
      `Source image manifest JSON 解析失败：${
        error instanceof Error ? error.message : 'unknown parse error'
      }`,
    );
  }

  const validation = validateSourceImageManifestForStudio(parsed);

  if (!validation.valid || !validation.manifest) {
    throw new Error(`Source image manifest 不可用于工作台：${validation.errors.join('; ')}`);
  }

  return validation.manifest;
};

export const validateSourceImageManifestForStudio = (
  value: unknown,
): SourceImageManifestStudioValidation => {
  if (!isRecord(value)) {
    return {
      valid: false,
      errors: ['manifest must be a JSON object'],
      warnings: [],
    };
  }

  const errors = [
    value.schemaVersion === SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION
      ? ''
      : `unsupported schemaVersion:${String(value.schemaVersion)}`,
    typeof value.packageId === 'string' && value.packageId.length > 0
      ? ''
      : 'packageId is required',
    Array.isArray(value.entries) ? '' : 'entries must be an array',
  ].filter(Boolean);

  const manifest =
    errors.length === 0 ? (value as unknown as SourceImageManifest) : undefined;
  const entryWarnings =
    manifest?.entries.flatMap((entry) => [
      entry.normalizedArtifactLinks.length > 0
        ? ''
        : `entry ${entry.sourceImageId} has no artifact links`,
      entry.decodedWidth > 0 && entry.decodedHeight > 0
        ? ''
        : `entry ${entry.sourceImageId} has invalid dimensions`,
    ]).filter(Boolean) ?? [];

  return {
    valid: errors.length === 0,
    manifest,
    errors,
    warnings: entryWarnings,
  };
};

export const listReadySourceImages = (manifest: SourceImageManifest): SourceImageEntry[] =>
  manifest.entries
    .filter((entry) => entry.importStatus === 'ready_for_template_analysis')
    .sort((left, right) => left.sourceImageId.localeCompare(right.sourceImageId));

export const listSourceImageEntriesByStatus = (
  manifest: SourceImageManifest,
): Record<SourceImageImportStatus, SourceImageEntry[]> =>
  sourceImageStatuses.reduce<Record<SourceImageImportStatus, SourceImageEntry[]>>(
    (acc, status) => ({
      ...acc,
      [status]: manifest.entries
        .filter((entry) => entry.importStatus === status)
        .sort((left, right) => left.sourceImageId.localeCompare(right.sourceImageId)),
    }),
    {
      imported: [],
      normalized: [],
      ready_for_template_analysis: [],
      blocked_by_codec: [],
      blocked_by_quality: [],
      failed: [],
    },
  );

export const resolveSourceImageArtifacts = (
  entry: SourceImageEntry,
): Record<SourceImageArtifactLink['kind'], SourceImageArtifactLink | undefined> =>
  entry.normalizedArtifactLinks.reduce<
    Record<SourceImageArtifactLink['kind'], SourceImageArtifactLink | undefined>
  >(
    (acc, link) => ({ ...acc, [link.kind]: link }),
    {
      original: undefined,
      'normalized-png': undefined,
      'raw-rgba': undefined,
      'json-rgba': undefined,
      report: undefined,
    },
  );

export const resolveBestImageArtifactForAnalysis = (
  entry: SourceImageEntry,
  preferences: readonly TemplateAnalysisSeedArtifactPreference[] = artifactPreferences,
): SourceImageArtifactLink | undefined => {
  const artifacts = resolveSourceImageArtifacts(entry);
  return preferences.map((preference) => artifacts[preference]).find(Boolean);
};

export const validateSourceImageReadyForTemplateAnalysis = (
  entry: SourceImageEntry,
): string[] => validateTemplateAnalysisSeedReadiness(entry).issues.map((nextIssue) => nextIssue.code);

export const validateTemplateAnalysisSeedReadiness = (
  entry: SourceImageEntry,
  artifactBinding?: SourceImageArtifactBinding,
): TemplateAnalysisSeedValidationResult => {
  const artifacts = resolveSourceImageArtifacts(entry);
  const hasBrowserReadableManifestArtifact =
    Boolean(artifacts['normalized-png']?.uri) &&
    isBrowserReadableArtifactUri(artifacts['normalized-png']?.uri ?? '');
  const hasBoundBrowserArtifact =
    artifactBinding?.status === 'validated' &&
    Boolean(artifactBinding.browserResource?.browserReadable);
  const issues: TemplateAnalysisSeedIssue[] = [
    ...(entry.importStatus !== 'ready_for_template_analysis'
      ? [
          issue(
            'source-image-not-ready',
            `源图状态为 ${entry.importStatus}，不能直接进入视觉分析`,
          ),
        ]
      : []),
    ...(entry.codecReport.decoded
      ? []
      : [issue('source-image-codec-blocked', '源图 codec 尚未解码或被阻断')]),
    ...(entry.qualityReport.readiness === 'blocked'
      ? [issue('source-image-quality-blocked', '源图质量门禁阻断了分析入口')]
      : []),
    ...(hasBrowserReadableManifestArtifact || hasBoundBrowserArtifact
      ? []
      : [
          issue(
            'source-image-missing-browser-readable-artifact',
            '缺少 normalized PNG、raw RGBA 或 JSON RGBA artifact',
            'artifact-resolution',
          ),
        ]),
  ];
  const readiness = readinessFromIssues(entry, issues);

  return {
    valid: readiness === 'ready_for_vision_analysis',
    readiness,
    issues,
  };
};

export const getSourceImageEntryDetail = (
  manifest: SourceImageManifest,
  sourceImageId: string,
): SourceImageEntryDetail | null => {
  const entry = manifest.entries.find((candidate) => candidate.sourceImageId === sourceImageId);

  if (!entry) {
    return null;
  }

  return {
    entry,
    artifacts: resolveSourceImageArtifacts(entry),
    validation: validateTemplateAnalysisSeedReadiness(entry),
    bestArtifact: resolveBestImageArtifactForAnalysis(entry),
  };
};

export const summarizeSourceImagePackageForStudio = (
  manifest: SourceImageManifest,
): SourceImagePackageStudioSummary => {
  const blockedEntries = manifest.entries.filter((entry) =>
    ['blocked_by_codec', 'blocked_by_quality'].includes(entry.importStatus),
  );
  const codecSummary = manifest.entries.reduce<Record<string, number>>(
    (acc, entry) => ({
      ...acc,
      [entry.codecReport.originalKind]: (acc[entry.codecReport.originalKind] ?? 0) + 1,
    }),
    {},
  );
  const quarantineSummary = manifest.entries.reduce<Record<string, number>>(
    (acc, entry) => {
      const codes = [
        ...entry.codecReport.issueCodes,
        ...entry.qualityReport.issueCodes,
        ...(entry.importStatus === 'failed' ? ['import-failed'] : []),
      ];

      return codes.reduce<Record<string, number>>(
        (nextAcc, code) => ({ ...nextAcc, [code]: (nextAcc[code] ?? 0) + 1 }),
        acc,
      );
    },
    {},
  );
  const qualityTotal = manifest.entries.reduce(
    (sum, entry) => sum + entry.qualityReport.qualityScore,
    0,
  );

  return {
    packageId: manifest.packageId,
    imageCount: manifest.entries.length,
    readyCount: listReadySourceImages(manifest).length,
    blockedCount: blockedEntries.length,
    failedCount: manifest.entries.filter((entry) => entry.importStatus === 'failed').length,
    codecSummary,
    qualitySummary: {
      averageScore:
        manifest.entries.length > 0
          ? Number((qualityTotal / manifest.entries.length).toFixed(4))
          : 0,
      ready: manifest.entries.filter((entry) => entry.qualityReport.readiness === 'ready').length,
      warning: manifest.entries.filter((entry) => entry.qualityReport.readiness === 'warning').length,
      blocked: manifest.entries.filter((entry) => entry.qualityReport.readiness === 'blocked').length,
    },
    quarantineSummary,
  };
};

export const createTemplateAnalysisSeedFromEntry = (
  manifest: SourceImageManifest,
  entry: SourceImageEntry,
  options: {
    manifestReference?: string;
    selectedArtifactPreference?: TemplateAnalysisSeedArtifactPreference;
    createdAt?: string;
    artifactBinding?: SourceImageArtifactBinding;
  } = {},
): TemplateAnalysisSeed => {
  const artifacts = resolveSourceImageArtifacts(entry);
  const selected =
    options.selectedArtifactPreference ??
    (resolveBestImageArtifactForAnalysis(entry)?.kind as
      | TemplateAnalysisSeedArtifactPreference
      | undefined) ??
    'json-rgba';
  const validation = validateTemplateAnalysisSeedReadiness(entry, options.artifactBinding);
  const manifestReference =
    options.manifestReference ?? `source-image-package://${manifest.packageId}/manifest.json`;
  const seedIdentity = {
    packageId: manifest.packageId,
    sourceImageId: entry.sourceImageId,
    selected,
    checksum: entry.originalFileChecksum,
  };

  const seed: TemplateAnalysisSeed = {
    schemaVersion: TEMPLATE_ANALYSIS_SEED_SCHEMA_VERSION,
    seedId: `template-analysis-seed-${stableHash(seedIdentity)}`,
    source: {
      sourceType: 'source-image-package',
      packageId: manifest.packageId,
      manifestReference,
      entryStatus: entry.importStatus,
      createdBy: 'template-studio-source-image-intake',
    },
    sourceImageId: entry.sourceImageId,
    sourceImagePackageId: manifest.packageId,
    sourceImageManifestReference: manifestReference,
    originalFileName: entry.originalFileName,
    selectedArtifactPreference: selected,
    normalizedPngReference: artifactToSeedLink(artifacts['normalized-png']),
    rawRgbaReference: artifactToSeedLink(artifacts['raw-rgba']),
    jsonRgbaReference: artifactToSeedLink(artifacts['json-rgba']),
    imageWidth: entry.decodedWidth,
    imageHeight: entry.decodedHeight,
    colorSpace: entry.colorSpace,
    qualityReport: entry.qualityReport,
    codecReport: entry.codecReport,
    sourceImageLineage: entry.lineage,
    readiness: validation.readiness,
    issues: validation.issues,
    createdAt: options.createdAt ?? entry.createdAt,
    imageReferenceUri: artifacts.original?.uri ?? entry.lineage.sourceUri,
    jsonRgbaUri: artifacts['json-rgba']?.uri,
    normalizedPngUri: artifacts['normalized-png']?.uri,
    width: entry.decodedWidth,
    height: entry.decodedHeight,
    lineageChecksum: entry.originalFileChecksum,
  };

  return options.artifactBinding
    ? updateTemplateAnalysisSeedWithBoundArtifact(seed, options.artifactBinding)
    : seed;
};

export const createTemplateAnalysisSeedFromSourceImage = (
  entry: SourceImageEntry,
): TemplateAnalysisSeed =>
  createTemplateAnalysisSeedFromEntry(
    {
      schemaVersion: SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION,
      packageId: 'legacy-source-image-package',
      createdAt: entry.createdAt,
      entries: [entry],
      readiness: entry.qualityReport.readiness,
      issueCodes: [...entry.codecReport.issueCodes, ...entry.qualityReport.issueCodes],
    },
    entry,
    { manifestReference: 'source-image-package://legacy-source-image-package/manifest.json' },
  );

export const loadTemplateAnalysisSeedImageData = (
  seed: TemplateAnalysisSeed,
): TemplateAnalysisSeedImageData => {
  const selected =
    seed.selectedArtifactPreference === 'normalized-png'
      ? seed.normalizedPngReference
      : seed.selectedArtifactPreference === 'raw-rgba'
        ? seed.rawRgbaReference
        : seed.jsonRgbaReference;
  const fallbackPreview = seed.normalizedPngReference?.browserReadable
    ? seed.normalizedPngReference.uri
    : undefined;
  const previewUrl =
    seed.boundArtifactResource?.objectUrl ??
    seed.boundArtifactResource?.previewUrl ??
    seed.browserPreviewUrl ??
    (selected?.kind === 'normalized-png' && selected.browserReadable
      ? selected.uri
      : fallbackPreview);
  const browserBoundaryIssues: TemplateAnalysisSeedIssue[] =
    previewUrl || seed.readiness !== 'ready_for_vision_analysis'
      ? []
      : [
          issue(
            'browser-cannot-read-cli-artifact-path',
            '该 seed 指向 CLI package 内的相对路径，浏览器不能直接读取本地文件；请通过文件选择或开发服务器提供可访问 URL。',
            'browser-boundary',
            'warning',
          ),
        ];

  return {
    seedId: seed.seedId,
    selectedArtifact: selected,
    previewUrl,
    canRunBrowserAnalysis: seed.readiness === 'ready_for_vision_analysis' && Boolean(previewUrl),
    artifactSummary: stableStringify({
      selected: selected?.kind ?? seed.selectedArtifactPreference,
      width: seed.imageWidth,
      height: seed.imageHeight,
      packageId: seed.sourceImagePackageId,
      sourceImageId: seed.sourceImageId,
    }),
    issues: [...seed.issues, ...browserBoundaryIssues],
  };
};

const productionIssue = (
  code: string,
  message: string,
  source: TemplateProductionTaskIssue['source'],
  severity: TemplateProductionTaskIssue['severity'] = 'warning',
): TemplateProductionTaskIssue => ({
  code,
  message,
  severity,
  source,
});

export const createSeedTasksWithArtifactBindingState = (input: {
  manifest: SourceImageManifest;
  manifestReference?: string;
  artifactBindings?: SourceImageArtifactBindingMap;
  createdAt?: string;
}): TemplateProductionTask[] => {
  const readyEntries = listReadySourceImages(input.manifest);
  const blockedEntries = input.manifest.entries.filter(
    (entry) => entry.importStatus !== 'ready_for_template_analysis',
  );
  const sourceEntries = [...readyEntries, ...blockedEntries].sort((left, right) =>
    left.sourceImageId.localeCompare(right.sourceImageId),
  );

  return sourceEntries.map((entry) => {
    const binding = resolveBestBoundArtifactForAnalysis(
      input.artifactBindings ?? {},
      entry.sourceImageId,
    );
    const seed = createTemplateAnalysisSeedFromEntry(input.manifest, entry, {
      manifestReference:
        input.manifestReference ??
        `source-image-package://${input.manifest.packageId}/manifest.json`,
      artifactBinding: binding,
      createdAt: input.createdAt ?? entry.createdAt,
    });
    const readiness = validateTemplateAnalysisSeedReadiness(entry, binding).readiness;
    const currentStatus: TemplateProductionTaskStatus =
      entry.importStatus === 'ready_for_template_analysis'
        ? binding?.status === 'validated' && readiness === 'ready_for_vision_analysis'
          ? 'ready_for_analysis'
          : 'needs_artifact_binding'
        : 'blocked_by_source_image';
    const artifactBindingStatus: TemplateProductionTask['artifactBindingStatus'] =
      binding?.status === 'validated'
        ? 'validated'
        : binding?.status === 'unsupported'
          ? 'unsupported'
          : binding
            ? 'bound'
            : 'missing';
    const issues: TemplateProductionTaskIssue[] = [
      ...(entry.importStatus !== 'ready_for_template_analysis'
        ? [
            productionIssue(
              'source-image-blocked',
              'source image is not ready and cannot enter ready_for_analysis',
              'source-image-package',
            ),
          ]
        : []),
      ...(artifactBindingStatus === 'missing'
        ? [
            productionIssue(
              'artifact-binding-missing',
              'Bind normalized PNG or JSON RGBA artifact before analysis',
              'artifact-binding',
            ),
          ]
        : []),
    ];
    const createdAt = input.createdAt ?? entry.createdAt;

    return {
      taskId: `template-production-task-${stableHash({
        packageId: input.manifest.packageId,
        sourceImageId: entry.sourceImageId,
      })}`,
      sourceImageId: entry.sourceImageId,
      originalFileName: entry.originalFileName,
      sourceImageStatus: entry.importStatus,
      sourceImageReadiness: entry.qualityReport.readiness,
      templateAnalysisSeed: seed,
      artifactBindingStatus,
      analysisStatus: 'not_started',
      maskReviewStatus: 'not_requested',
      humanCorrectionStatus: 'not_requested',
      evidenceStatus: 'missing',
      templateReviewStatus: 'not_requested',
      publishStatus: 'not_requested',
      currentStatus,
      issues,
      events: [
        {
          eventId: `task-${entry.sourceImageId}-created`,
          eventType: 'task-created',
          status: currentStatus,
          timestamp: createdAt,
          message: 'production task created',
          metadata: {
            sourceImageStatus: entry.importStatus,
            artifactBindingStatus,
          },
        },
      ],
      createdAt,
      updatedAt: createdAt,
    };
  });
};

export const createBatchTemplateAnalysisSeeds = (input: {
  manifest: SourceImageManifest;
  manifestReference?: string;
  artifactBindings?: SourceImageArtifactBindingMap;
  createdAt?: string;
}): BatchSeedCreationResult => {
  const tasks = createSeedTasksWithArtifactBindingState(input);
  const seeds = tasks
    .map((task) => task.templateAnalysisSeed)
    .filter((seed): seed is TemplateAnalysisSeed => Boolean(seed));
  const blockedEntries = input.manifest.entries.filter(
    (entry) => entry.importStatus !== 'ready_for_template_analysis',
  );

  return {
    seeds,
    tasks,
    summary: {
      totalSourceImages: input.manifest.entries.length,
      readySourceImages: listReadySourceImages(input.manifest).length,
      blockedSourceImages: blockedEntries.filter((entry) =>
        ['blocked_by_codec', 'blocked_by_quality'].includes(entry.importStatus),
      ).length,
      failedSourceImages: input.manifest.entries.filter((entry) => entry.importStatus === 'failed').length,
      createdSeeds: seeds.length,
      createdTasks: tasks.length,
      needsArtifactBindingTasks: tasks.filter(
        (task) => task.currentStatus === 'needs_artifact_binding',
      ).length,
      readyForAnalysisTasks: tasks.filter(
        (task) => task.currentStatus === 'ready_for_analysis',
      ).length,
      skippedSourceImageIds: [],
      issues: tasks.flatMap((task) => task.issues),
    },
  };
};

export const createSeedsForReadySourceImages = (input: {
  manifest: SourceImageManifest;
  manifestReference?: string;
  artifactBindings?: SourceImageArtifactBindingMap;
  createdAt?: string;
}): BatchSeedCreationResult => {
  const result = createBatchTemplateAnalysisSeeds(input);
  const tasks = result.tasks.filter(
    (task) => task.sourceImageStatus === 'ready_for_template_analysis',
  );
  const seeds = tasks
    .map((task) => task.templateAnalysisSeed)
    .filter((seed): seed is TemplateAnalysisSeed => Boolean(seed));

  return {
    ...result,
    seeds,
    tasks,
    summary: {
      ...result.summary,
      createdSeeds: seeds.length,
      createdTasks: tasks.length,
    },
  };
};

export const validateBatchSeedReadiness = (
  batch: TemplateProductionBatch,
): TemplateProductionBatchValidationResult => {
  const issues: TemplateProductionBatchIssue[] = batch.tasks.flatMap((task) =>
    task.currentStatus === 'ready_for_analysis' &&
    task.templateAnalysisSeed?.readiness !== 'ready_for_vision_analysis'
      ? [
          {
            code: 'ready-task-with-unready-seed',
            message: `task ${task.taskId} is ready_for_analysis but seed is not ready_for_vision_analysis`,
            severity: 'error' as const,
          },
        ]
      : [],
  );

  return {
    valid: issues.length === 0,
    issues,
  };
};

export const summarizeBatchSeedCreation = (
  result: BatchSeedCreationResult,
): BatchSeedCreationSummary => result.summary;

export const createStudioSourceImagePackageSession = (input: {
  manifest?: SourceImageManifest;
  manifestReference?: string;
  seeds?: readonly TemplateAnalysisSeed[];
  updatedAt?: string;
} = {}): StudioSourceImagePackageSession => ({
  schemaVersion: 'studio-source-image-package-session-v0.1',
  sessionId: `source-image-studio-session-${stableHash({
    packageId: input.manifest?.packageId ?? 'empty',
    manifestReference: input.manifestReference ?? 'none',
  })}`,
  sourceImagePackageId: input.manifest?.packageId,
  manifestReference: input.manifestReference,
  activeSeedId: input.seeds?.[0]?.seedId,
  seeds: [...(input.seeds ?? [])],
  updatedAt: input.updatedAt ?? input.manifest?.createdAt ?? '2026-05-30T00:00:00.000Z',
});

export const persistStudioSourceImagePackageSession = (
  session: StudioSourceImagePackageSession,
): string => stableStringify(stripUndefined(session));

export const restoreStudioSourceImagePackageSession = (
  content: string,
): StudioSourceImagePackageSession => {
  const parsed = JSON.parse(content) as StudioSourceImagePackageSession;

  if (parsed.schemaVersion !== 'studio-source-image-package-session-v0.1') {
    throw new Error('Unsupported source image studio session schemaVersion');
  }

  return parsed;
};
