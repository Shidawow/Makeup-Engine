import type {
  CosmeticSegmentationMask,
  SegmentationMaskGrid,
} from '../masks';

export type MaskArtifactKind =
  | 'original_mask'
  | 'human_edited_mask'
  | 'diff_heatmap';

export interface MaskArtifactReferenceInput {
  sampleId: string;
  maskId: string;
  target: CosmeticSegmentationMask['target'];
  regionId?: CosmeticSegmentationMask['target'];
  grid: SegmentationMaskGrid;
  bounds?: CosmeticSegmentationMask['bounds'] | null;
  artifactKind: MaskArtifactKind;
  source: 'human-correction-sample' | 'mask-diff';
}

export interface MaskArtifactReference {
  artifactId: string;
  sampleId: string;
  maskId: string;
  target: CosmeticSegmentationMask['target'];
  regionId: CosmeticSegmentationMask['target'];
  artifactKind: MaskArtifactKind;
  width: number;
  height: number;
  alphaStats: {
    min: number;
    max: number;
    mean: number;
    activeRatio: number;
  };
  bounds: CosmeticSegmentationMask['bounds'] | null;
  source: 'human-correction-sample' | 'mask-diff';
  checksum: string;
  referenceUri: string;
}

const stableStringify = (value: unknown): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  return `{${Object.keys(value as Record<string, unknown>)
    .sort()
    .map(
      (key) =>
        `${JSON.stringify(key)}:${stableStringify(
          (value as Record<string, unknown>)[key],
        )}`,
    )
    .join(',')}}`;
};

const stableHash = (value: unknown): string => {
  const input = stableStringify(value);
  let hash = 0x811c9dc5;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
};

const round4 = (value: number): number => Number(value.toFixed(4));

const alphaStats = (alpha: readonly number[]) => {
  const total = Math.max(1, alpha.length);
  const min = alpha.length === 0 ? 0 : Math.min(...alpha);
  const max = alpha.length === 0 ? 0 : Math.max(...alpha);
  const mean = alpha.reduce((sum, value) => sum + value, 0) / total;
  const activeRatio =
    alpha.filter((value) => value > 0.025).length / total;

  return {
    min: round4(min),
    max: round4(max),
    mean: round4(mean),
    activeRatio: round4(activeRatio),
  };
};

export const encodeMaskArtifactMetadata = (
  input: MaskArtifactReferenceInput,
): Omit<MaskArtifactReference, 'artifactId' | 'referenceUri'> => {
  const checksum = stableHash({
    sampleId: input.sampleId,
    maskId: input.maskId,
    target: input.target,
    artifactKind: input.artifactKind,
    grid: input.grid,
    bounds: input.bounds ?? null,
  });

  return {
    sampleId: input.sampleId,
    maskId: input.maskId,
    target: input.target,
    regionId: input.regionId ?? input.target,
    artifactKind: input.artifactKind,
    width: input.grid.width,
    height: input.grid.height,
    alphaStats: alphaStats(input.grid.alpha),
    bounds: input.bounds ?? null,
    source: input.source,
    checksum,
  };
};

export const createMaskArtifactReference = (
  input: MaskArtifactReferenceInput,
): MaskArtifactReference => {
  const metadata = encodeMaskArtifactMetadata(input);
  const artifactId = `mask-artifact-${stableHash(metadata)}`;

  return {
    artifactId,
    ...metadata,
    referenceUri: `offline://mask-artifacts/${artifactId}.json`,
  };
};

export const summarizeMaskArtifact = (
  artifact: MaskArtifactReference,
): string =>
  [
    artifact.artifactKind,
    artifact.regionId,
    `${artifact.width}x${artifact.height}`,
    `active:${artifact.alphaStats.activeRatio}`,
    `checksum:${artifact.checksum}`,
  ].join(' / ');

export const validateMaskArtifactShape = (
  artifact: MaskArtifactReference,
): string[] => [
  ...(artifact.width <= 0 ? [`invalid width:${artifact.artifactId}`] : []),
  ...(artifact.height <= 0 ? [`invalid height:${artifact.artifactId}`] : []),
  ...(artifact.alphaStats.min < 0 || artifact.alphaStats.max > 1
    ? [`alpha out of range:${artifact.artifactId}`]
    : []),
  ...(artifact.referenceUri.length === 0
    ? [`missing referenceUri:${artifact.artifactId}`]
    : []),
];

export const compareMaskArtifactReferences = (
  left: MaskArtifactReference,
  right: MaskArtifactReference,
): number =>
  `${left.sampleId}:${left.artifactKind}:${left.artifactId}`.localeCompare(
    `${right.sampleId}:${right.artifactKind}:${right.artifactId}`,
  );
