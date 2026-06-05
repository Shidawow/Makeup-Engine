import type { SourceImageArtifactLink } from '../../training/schema';
import type {
  ArtifactBindingValidationResult,
  BrowserArtifactImageData,
  BrowserArtifactResource,
  SourceImageArtifactBinding,
  SourceImageArtifactBindingIssue,
  SourceImageArtifactBindingMap,
  SourceImageArtifactKind,
  TemplateAnalysisSeed,
} from '../schema';
import { SOURCE_IMAGE_ARTIFACT_BINDING_SCHEMA_VERSION } from '../schema';
import { stableHash, stableStringify } from './datasetExport';

type ObjectUrlApi = Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'>;

interface JsonRgbaArtifact {
  width?: number;
  height?: number;
  colorSpace?: string;
  pixels?: {
    width?: number;
    height?: number;
    channels?: number;
    values?: unknown[];
  } | null;
}

const ABSOLUTE_PATH = /^(?:[A-Za-z]:[\\/]|\\\\|\/)/;

const issue = (
  code: string,
  message: string,
  severity: SourceImageArtifactBindingIssue['severity'] = 'warning',
): SourceImageArtifactBindingIssue => ({ code, message, severity });

const stripUndefined = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripUndefined);
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, stripUndefined(entryValue)]),
    );
  }

  return value;
};

const pathBaseName = (path: string): string =>
  path.replace(/\\/g, '/').split('/').filter(Boolean).slice(-1)[0] ?? path;

const sanitizeReference = (reference: string): string => {
  const normalized = reference.replace(/\\/g, '/').trim();
  return ABSOLUTE_PATH.test(normalized) ? '[absolute-path-omitted]' : normalized;
};

const artifactKindFromReference = (
  reference: SourceImageArtifactLink,
): SourceImageArtifactKind =>
  reference.kind === 'normalized-png' ||
  reference.kind === 'raw-rgba' ||
  reference.kind === 'json-rgba'
    ? reference.kind
    : 'unknown';

const fnv1aBytes = (bytes: Uint8Array): string => {
  let hash = 0x811c9dc5;

  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
};

const checksumFile = async (file: File): Promise<string> =>
  fnv1aBytes(new Uint8Array(await file.arrayBuffer()));

const objectUrlApi = (api?: ObjectUrlApi): ObjectUrlApi => {
  const candidate = api ?? (typeof URL === 'undefined' ? undefined : URL);

  if (!candidate?.createObjectURL || !candidate.revokeObjectURL) {
    throw new Error('Browser object URL API is unavailable.');
  }

  return candidate;
};

const toUint8 = (value: unknown): number | null => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  if (value >= 0 && value <= 1 && !Number.isInteger(value)) {
    return Math.round(value * 255);
  }

  if (Number.isInteger(value) && value >= 0 && value <= 255) {
    return value;
  }

  return null;
};

const readJsonRgbaArtifact = async (
  file: File,
): Promise<{ imageData?: BrowserArtifactImageData; issues: SourceImageArtifactBindingIssue[] }> => {
  let parsed: JsonRgbaArtifact;

  try {
    parsed = JSON.parse(await file.text()) as JsonRgbaArtifact;
  } catch (error) {
    return {
      issues: [
        issue(
          'json-rgba-parse-failed',
          `JSON RGBA 文件解析失败：${error instanceof Error ? error.message : 'unknown error'}`,
          'error',
        ),
      ],
    };
  }

  const width = parsed.pixels?.width ?? parsed.width;
  const height = parsed.pixels?.height ?? parsed.height;
  const channels = parsed.pixels?.channels;
  const values = parsed.pixels?.values;
  const errors = [
    ...(typeof width === 'number' && width > 0 ? [] : ['JSON RGBA width 必须为正数。']),
    ...(typeof height === 'number' && height > 0 ? [] : ['JSON RGBA height 必须为正数。']),
    ...(channels === 4 ? [] : ['JSON RGBA channels 必须为 4。']),
    ...(Array.isArray(values) ? [] : ['JSON RGBA pixels.values 必须存在。']),
  ];

  if (errors.length > 0 || !Array.isArray(values) || !width || !height) {
    return {
      issues: errors.map((message) => issue('json-rgba-invalid', message, 'error')),
    };
  }

  const normalized = values.map(toUint8);

  if (
    normalized.length !== width * height * 4 ||
    normalized.some((value) => value === null)
  ) {
    return {
      issues: [
        issue(
          'json-rgba-invalid-values',
          'JSON RGBA pixels.values 必须与 width * height * 4 对齐，并且每个值都可转换为 uint8。',
          'error',
        ),
      ],
    };
  }

  return {
    imageData: {
      width,
      height,
      channels: 4,
      data: normalized as number[],
    },
    issues: [],
  };
};

const createJsonRgbaPreview = (
  imageData: BrowserArtifactImageData,
): string | undefined => {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return undefined;
  }

  canvas.width = imageData.width;
  canvas.height = imageData.height;
  context.putImageData(
    new ImageData(
      Uint8ClampedArray.from(imageData.data),
      imageData.width,
      imageData.height,
    ),
    0,
    0,
  );
  return canvas.toDataURL('image/png');
};

export const createBrowserObjectUrlForArtifact = (
  file: File,
  api?: ObjectUrlApi,
): string => objectUrlApi(api).createObjectURL(file);

export const revokeBrowserObjectUrl = (
  objectUrl: string | undefined,
  api?: ObjectUrlApi,
): void => {
  if (objectUrl) {
    objectUrlApi(api).revokeObjectURL(objectUrl);
  }
};

export const validateArtifactBindingAgainstManifestReference = (input: {
  reference: SourceImageArtifactLink;
  artifactKind: SourceImageArtifactKind;
  fileName: string;
  fileSize: number;
  fileChecksum: string;
  width?: number;
  height?: number;
  channels?: number;
}): ArtifactBindingValidationResult => {
  const issues: SourceImageArtifactBindingIssue[] = [];
  const expectedKind = artifactKindFromReference(input.reference);

  if (expectedKind !== input.artifactKind) {
    issues.push(
      issue(
        'artifact-kind-mismatch',
        `选择的 artifact kind 为 ${input.artifactKind}，manifest 期望 ${expectedKind}。`,
        'error',
      ),
    );
  }

  if (pathBaseName(input.reference.uri) !== input.fileName) {
    issues.push(
      issue(
        'artifact-file-name-mismatch',
        `文件名 ${input.fileName} 与 manifest reference ${pathBaseName(input.reference.uri)} 不一致。`,
      ),
    );
  }

  if (input.reference.checksum && input.reference.checksum !== input.fileChecksum) {
    issues.push(
      issue(
        'artifact-checksum-mismatch',
        '文件 checksum 与 manifest reference 不一致。',
        'error',
      ),
    );
  }

  if (typeof input.reference.width === 'number' && input.reference.width !== input.width) {
    issues.push(issue('artifact-width-mismatch', '文件 width 与 manifest reference 不一致。', 'error'));
  }

  if (typeof input.reference.height === 'number' && input.reference.height !== input.height) {
    issues.push(issue('artifact-height-mismatch', '文件 height 与 manifest reference 不一致。', 'error'));
  }

  if (input.fileSize <= 0) {
    issues.push(issue('artifact-empty-file', '绑定文件不能为空。', 'error'));
  }

  if (input.reference.kind === 'raw-rgba') {
    issues.push(
      issue(
        'raw-rgba-browser-analysis-unsupported',
        'raw RGBA 当前只建立 summary-only 边界，不能直接进入浏览器图片预览或 Vision Analysis。',
      ),
    );
    return { valid: false, status: 'unsupported', issues };
  }

  const hasError = issues.some((nextIssue) => nextIssue.severity === 'error');
  return {
    valid: !hasError,
    status: hasError ? 'mismatch' : 'validated',
    issues,
  };
};

export const createSourceImageArtifactBinding = async (input: {
  sourceImageId: string;
  sourceImagePackageId: string;
  manifestArtifactReference: SourceImageArtifactLink;
  file: File;
  createdAt?: string;
  objectUrlApi?: ObjectUrlApi;
}): Promise<SourceImageArtifactBinding> => {
  const artifactKind = artifactKindFromReference(input.manifestArtifactReference);
  const fileChecksum = await checksumFile(input.file);
  const reference = input.manifestArtifactReference;
  let browserResource: BrowserArtifactResource;
  let width = reference.width;
  let height = reference.height;
  let channels: number | undefined;
  let preValidationIssues: SourceImageArtifactBindingIssue[] = [];

  if (artifactKind === 'normalized-png') {
    const objectUrl = createBrowserObjectUrlForArtifact(input.file, input.objectUrlApi);
    browserResource = {
      resourceId: `browser-artifact-${stableHash({
        sourceImageId: input.sourceImageId,
        uri: reference.uri,
        checksum: fileChecksum,
      })}`,
      artifactKind,
      browserResourceKind: 'object-url',
      browserReadable: true,
      summaryOnly: false,
      objectUrl,
      previewUrl: objectUrl,
    };
  } else if (artifactKind === 'json-rgba') {
    const parsed = await readJsonRgbaArtifact(input.file);
    preValidationIssues = parsed.issues;
    width = parsed.imageData?.width;
    height = parsed.imageData?.height;
    channels = parsed.imageData?.channels;
    const previewUrl = parsed.imageData
      ? createJsonRgbaPreview(parsed.imageData)
      : undefined;
    browserResource = {
      resourceId: `browser-artifact-${stableHash({
        sourceImageId: input.sourceImageId,
        uri: reference.uri,
        checksum: fileChecksum,
      })}`,
      artifactKind,
      browserResourceKind: previewUrl ? 'generated-preview-data-url' : 'image-data',
      browserReadable: Boolean(previewUrl),
      summaryOnly: !previewUrl,
      previewUrl,
      imageDataReference: `binding://${input.sourceImageId}/${fileChecksum}`,
      imageData: parsed.imageData,
    };
  } else {
    browserResource = {
      resourceId: `browser-artifact-${stableHash({
        sourceImageId: input.sourceImageId,
        uri: reference.uri,
        checksum: fileChecksum,
      })}`,
      artifactKind,
      browserResourceKind: 'summary-only',
      browserReadable: false,
      summaryOnly: true,
    };
  }

  const validation = validateArtifactBindingAgainstManifestReference({
    reference,
    artifactKind,
    fileName: input.file.name,
    fileSize: input.file.size,
    fileChecksum,
    width,
    height,
    channels,
  });
  const issues = [...preValidationIssues, ...validation.issues];
  const hasError = issues.some((nextIssue) => nextIssue.severity === 'error');
  const status = hasError ? 'mismatch' : validation.status;

  if (hasError && browserResource.objectUrl) {
    revokeBrowserObjectUrl(browserResource.objectUrl, input.objectUrlApi);
    browserResource = {
      ...browserResource,
      browserReadable: false,
      summaryOnly: true,
      objectUrl: undefined,
      previewUrl: undefined,
    };
  }

  return {
    schemaVersion: SOURCE_IMAGE_ARTIFACT_BINDING_SCHEMA_VERSION,
    bindingId: `source-image-artifact-binding-${stableHash({
      packageId: input.sourceImagePackageId,
      sourceImageId: input.sourceImageId,
      uri: reference.uri,
      checksum: fileChecksum,
    })}`,
    sourceImageId: input.sourceImageId,
    sourceImagePackageId: input.sourceImagePackageId,
    manifestArtifactReference: sanitizeReference(reference.uri),
    artifactKind,
    originalReferencePath: sanitizeReference(reference.uri),
    browserResourceKind: browserResource.browserResourceKind,
    browserResource,
    objectUrl: browserResource.objectUrl,
    fileName: input.file.name,
    fileSize: input.file.size,
    fileChecksum,
    width,
    height,
    colorSpace: 'srgb',
    channels,
    status,
    issues,
    createdAt: input.createdAt ?? '2026-05-31T00:00:00.000Z',
  };
};

export const artifactBindingMapKey = (
  sourceImageId: string,
  manifestArtifactReference: string,
): string => `${sourceImageId}:${manifestArtifactReference}`;

export const resolveBoundArtifactForSourceImage = (
  bindings: SourceImageArtifactBindingMap,
  sourceImageId: string,
): SourceImageArtifactBinding[] =>
  Object.values(bindings)
    .filter((binding) => binding.sourceImageId === sourceImageId)
    .sort((left, right) => left.artifactKind.localeCompare(right.artifactKind));

export const resolveBestBoundArtifactForAnalysis = (
  bindings: SourceImageArtifactBindingMap,
  sourceImageId: string,
): SourceImageArtifactBinding | undefined => {
  const candidates = resolveBoundArtifactForSourceImage(bindings, sourceImageId);
  const usable = (kind: SourceImageArtifactKind) =>
    candidates.find(
      (binding) =>
        binding.artifactKind === kind &&
        binding.status === 'validated' &&
        binding.browserResource?.browserReadable,
    );

  return usable('normalized-png') ?? usable('json-rgba');
};

export const summarizeArtifactBindingsForStudio = (
  bindings: SourceImageArtifactBindingMap,
): {
  total: number;
  validated: number;
  mismatch: number;
  unsupported: number;
  requiresRebindAfterRefresh: number;
} => {
  const values = Object.values(bindings);
  return {
    total: values.length,
    validated: values.filter((binding) => binding.status === 'validated').length,
    mismatch: values.filter((binding) => binding.status === 'mismatch').length,
    unsupported: values.filter((binding) => binding.status === 'unsupported').length,
    requiresRebindAfterRefresh: values.filter((binding) => Boolean(binding.objectUrl)).length,
  };
};

export const updateTemplateAnalysisSeedWithBoundArtifact = (
  seed: TemplateAnalysisSeed,
  binding: SourceImageArtifactBinding,
): TemplateAnalysisSeed => {
  const resource = binding.browserResource;
  const runnable = binding.status === 'validated' && Boolean(resource?.browserReadable);
  const bindingIssues = binding.issues.map((nextIssue) => ({
    ...nextIssue,
    source: 'browser-boundary' as const,
  }));
  const issues = [
    ...seed.issues.filter(
      (nextIssue) => nextIssue.code !== 'source-image-missing-browser-readable-artifact',
    ),
    ...bindingIssues,
  ];

  return {
    ...seed,
    readiness: runnable ? 'ready_for_vision_analysis' : seed.readiness,
    issues,
    boundArtifactResource: resource,
    artifactBindingId: binding.bindingId,
    browserPreviewUrl: resource?.previewUrl ?? resource?.objectUrl,
    imageDataReference: resource?.imageDataReference,
    artifactBindingStatus: binding.status,
    artifactBindingIssues: binding.issues,
  };
};

export const serializeArtifactBindingSession = (
  bindings: SourceImageArtifactBindingMap,
): string =>
  stableStringify(stripUndefined(
    Object.fromEntries(
      Object.entries(bindings).map(([key, binding]) => [
        key,
        {
          ...binding,
          browserResource: undefined,
          objectUrl: undefined,
          status: 'unbound',
          issues: [
            ...binding.issues,
            issue(
              'artifact-rebind-required-after-refresh',
              '页面刷新后必须由 operator 重新选择本地 artifact 文件。',
            ),
          ],
        },
      ]),
    ),
  ));

export const restoreArtifactBindingSession = (
  content: string,
): SourceImageArtifactBindingMap => {
  const parsed = JSON.parse(content) as SourceImageArtifactBindingMap;

  return Object.fromEntries(
    Object.entries(parsed).map(([key, binding]) => [
      key,
      {
        ...binding,
        browserResource: undefined,
        objectUrl: undefined,
        status: 'unbound',
      },
    ]),
  );
};
