export type BinaryFileKind = 'png' | 'jpeg' | 'json' | 'raw-rgba-binary' | 'unknown';

export interface BinaryFileSource {
  sourceId: string;
  path?: string;
  fileName?: string;
  bytes?: Uint8Array;
}

export interface BinaryFileReadIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

export interface BinaryFileMetadata {
  fileName: string;
  byteLength: number;
  checksum: string;
  detectedKind: BinaryFileKind;
}

export interface BinaryFileReadResult {
  source: BinaryFileSource;
  bytes: Uint8Array;
  metadata: BinaryFileMetadata;
  issues: BinaryFileReadIssue[];
}

export interface BinaryFileReaderCapabilities {
  supportsPathRead: boolean;
  supportsBufferRead: boolean;
  supportedKinds: BinaryFileKind[];
  dependencyFree: boolean;
}

export interface BinaryFileReaderOptions {
  expectedKind?: BinaryFileKind;
  allowUnknown?: boolean;
}

const issue = (code: string, message: string, severity: BinaryFileReadIssue['severity'] = 'error'): BinaryFileReadIssue => ({
  severity,
  code,
  message,
});

const dynamicImport = (specifier: string): Promise<unknown> =>
  (0, eval)(`import(${JSON.stringify(specifier)})`) as Promise<unknown>;

interface NodeFsPromises {
  readFile(path: string): Promise<Uint8Array>;
}

export const createBinaryFileChecksum = (bytes: Uint8Array): string => {
  let hash = 0x811c9dc5;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const detectBinaryFileKind = (bytes: Uint8Array): BinaryFileKind => {
  const png = [137, 80, 78, 71, 13, 10, 26, 10];
  if (png.every((value, index) => bytes[index] === value)) return 'png';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  const prefix = new TextDecoder().decode(bytes.slice(0, Math.min(bytes.length, 32))).trimStart();
  if (prefix.startsWith('{') || prefix.startsWith('[')) {
    if (prefix.includes('MEARGBA') || prefix.includes('"magic"')) return 'raw-rgba-binary';
    return 'json';
  }
  if (prefix.startsWith('MEARGBA')) return 'raw-rgba-binary';
  return 'unknown';
};

export const validateBinaryFileBytes = (
  bytes: Uint8Array,
  options: BinaryFileReaderOptions = {},
): BinaryFileReadIssue[] => [
  ...(bytes.length === 0 ? [issue('binary-file-empty', 'Binary file is empty')] : []),
  ...(!options.allowUnknown && detectBinaryFileKind(bytes) === 'unknown'
    ? [issue('unknown-file-kind', 'Binary file kind is not supported')]
    : []),
  ...(options.expectedKind && detectBinaryFileKind(bytes) !== options.expectedKind
    ? [issue('binary-file-kind-mismatch', `Expected ${options.expectedKind} but detected ${detectBinaryFileKind(bytes)}`)]
    : []),
];

const createResult = (
  source: BinaryFileSource,
  bytes: Uint8Array,
  options: BinaryFileReaderOptions = {},
): BinaryFileReadResult => {
  const detectedKind = detectBinaryFileKind(bytes);
  const fileName = source.fileName ?? source.path?.split(/[\\/]/).pop() ?? source.sourceId;
  return {
    source,
    bytes,
    metadata: {
      fileName,
      byteLength: bytes.length,
      checksum: createBinaryFileChecksum(bytes),
      detectedKind,
    },
    issues: validateBinaryFileBytes(bytes, options),
  };
};

export const readBinaryFileFromBuffer = (
  bytes: Uint8Array,
  source: Omit<BinaryFileSource, 'bytes'> = { sourceId: 'buffer' },
  options: BinaryFileReaderOptions = {},
): BinaryFileReadResult => createResult({ ...source, bytes }, bytes, options);

export const readBinaryFileFromFixture = (
  bytes: readonly number[],
  sourceId = 'fixture',
  options: BinaryFileReaderOptions = {},
): BinaryFileReadResult => readBinaryFileFromBuffer(Uint8Array.from(bytes), { sourceId, fileName: `${sourceId}.bin` }, options);

export const readBinaryFileFromPath = async (
  filePath: string,
  options: BinaryFileReaderOptions = {},
): Promise<BinaryFileReadResult> => {
  try {
    const fs = await dynamicImport('node:fs/promises') as NodeFsPromises;
    const buffer = await fs.readFile(filePath);
    return createResult(
      { sourceId: filePath.split(/[\\/]/).pop() ?? filePath, path: filePath, fileName: filePath.split(/[\\/]/).pop() ?? filePath },
      new Uint8Array(buffer),
      options,
    );
  } catch (readError) {
    return {
      source: { sourceId: filePath, path: filePath, fileName: filePath.split(/[\\/]/).pop() ?? filePath },
      bytes: new Uint8Array(),
      metadata: {
        fileName: filePath.split(/[\\/]/).pop() ?? filePath,
        byteLength: 0,
        checksum: createBinaryFileChecksum(new Uint8Array()),
        detectedKind: 'unknown',
      },
      issues: [issue('binary-read-failed', readError instanceof Error ? readError.message : 'Binary file read failed')],
    };
  }
};

export const summarizeBinaryFileRead = (result: BinaryFileReadResult): string =>
  `binary-file:${result.metadata.fileName}:${result.metadata.detectedKind}:${result.metadata.byteLength}:issues=${result.issues.map((entry) => entry.code).join(',') || 'none'}`;

export const BINARY_FILE_READER_CAPABILITIES: BinaryFileReaderCapabilities = {
  supportsPathRead: true,
  supportsBufferRead: true,
  supportedKinds: ['png', 'jpeg', 'json', 'raw-rgba-binary', 'unknown'],
  dependencyFree: true,
};
