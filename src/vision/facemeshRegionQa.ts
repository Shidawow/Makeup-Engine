import type {
  FaceMeshGeometry,
  FaceMeshLandmark,
  NormalizedBoundingBox,
} from './providers';

export type FaceMeshRegionQaStatus =
  | 'region_qa_ready'
  | 'region_qa_ready_with_warnings'
  | 'region_qa_blocked';

export type FaceMeshRegionQaRegion =
  | 'face_outline'
  | 'left_eye'
  | 'right_eye'
  | 'left_brow'
  | 'right_brow'
  | 'lips'
  | 'nose'
  | 'left_cheek'
  | 'right_cheek'
  | 'chin'
  | 'forehead';

export type FaceMeshRegionQaIssueSeverity = 'warning' | 'blocking';

export interface FaceMeshRegionQaCheck {
  id: string;
  label: string;
  passed: boolean;
  severity: FaceMeshRegionQaIssueSeverity;
  details: string;
}

export interface FaceMeshRegionQaIssue {
  id: string;
  severity: FaceMeshRegionQaIssueSeverity;
  message: string;
  recoveryHint: string;
}

export interface FaceMeshRegionQaRegionCoverage {
  region: FaceMeshRegionQaRegion;
  requiredLandmarkIndices: number[];
  presentLandmarkIndices: number[];
  coverage: number;
  ready: boolean;
}

export interface FaceMeshRegionQaReport {
  status: FaceMeshRegionQaStatus;
  provider: 'mediapipe' | 'mock' | 'unknown';
  landmarkCount: number;
  readinessScore: number;
  /** Legacy/internal runtime metadata. Do not display this as MediaPipe model certainty. */
  confidence: number;
  boundingBox?: NormalizedBoundingBox;
  regionCoverage: FaceMeshRegionQaRegionCoverage[];
  checks: FaceMeshRegionQaCheck[];
  issues: FaceMeshRegionQaIssue[];
  recommendations: string[];
  canGenerateAttributeCandidates: boolean;
  canGenerateTemplateDraft: boolean;
}

export interface FaceMeshRegionQaInput {
  faceMesh?: FaceMeshGeometry | null;
  providerId?: string;
}

const REQUIRED_LANDMARK_COUNT = 468;
const WARNING_READINESS_SCORE = 0.7;

const regionLandmarkIndices: Record<FaceMeshRegionQaRegion, number[]> = {
  face_outline: [10, 152, 234, 454],
  left_eye: [33, 133, 145, 159],
  right_eye: [263, 362, 374, 386],
  left_brow: [70, 105, 107],
  right_brow: [334, 336, 300],
  lips: [13, 14, 61, 291],
  nose: [1, 4, 98, 327],
  left_cheek: [50, 117, 187],
  right_cheek: [280, 346, 411],
  chin: [152, 175, 199],
  forehead: [10, 67, 297],
};

const providerFromId = (
  providerId: string | undefined,
): FaceMeshRegionQaReport['provider'] => {
  if (!providerId) {
    return 'unknown';
  }
  if (providerId.toLowerCase().includes('mediapipe')) {
    return 'mediapipe';
  }
  if (providerId.toLowerCase().includes('mock')) {
    return 'mock';
  }
  return 'unknown';
};

const indexSet = (landmarks: readonly FaceMeshLandmark[]) =>
  new Set(landmarks.map((landmark) => landmark.index));

const isPointNormalized = (landmark: FaceMeshLandmark): boolean =>
  landmark.point.space === 'normalized-image' &&
  landmark.point.x >= 0 &&
  landmark.point.x <= 1 &&
  landmark.point.y >= 0 &&
  landmark.point.y <= 1;

const isCroppingRisk = (box: NormalizedBoundingBox | undefined): boolean =>
  Boolean(
    box &&
      (box.x < 0.02 ||
        box.y < 0.02 ||
        box.x + box.width > 0.98 ||
        box.y + box.height > 0.98),
  );

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const roundScore = (value: number): number => Number(value.toFixed(2));

const calculateAverageRegionCoverage = (
  regionCoverage: readonly FaceMeshRegionQaRegionCoverage[],
): number =>
  regionCoverage.length > 0
    ? regionCoverage.reduce((sum, region) => sum + region.coverage, 0) / regionCoverage.length
    : 0;

const calculateReadinessScore = ({
  landmarkCount,
  normalizedCount,
  regionCoverage,
  cropped,
  blockingIssueCount,
  warningIssueCount,
}: {
  landmarkCount: number;
  normalizedCount: number;
  regionCoverage: readonly FaceMeshRegionQaRegionCoverage[];
  cropped: boolean;
  blockingIssueCount: number;
  warningIssueCount: number;
}): number => {
  const landmarkScore = clamp01(landmarkCount / REQUIRED_LANDMARK_COUNT);
  const normalizedScore = landmarkCount > 0 ? normalizedCount / landmarkCount : 0;
  const regionCoverageScore = calculateAverageRegionCoverage(regionCoverage);
  const cropMarginScore = cropped ? 0.75 : 1;
  const baseScore =
    landmarkScore * 0.35 +
    normalizedScore * 0.25 +
    regionCoverageScore * 0.3 +
    cropMarginScore * 0.1;

  if (blockingIssueCount > 0) {
    return roundScore(Math.min(baseScore, 0.45));
  }

  if (warningIssueCount > 0) {
    return roundScore(Math.min(0.85, Math.max(0.7, baseScore)));
  }

  return roundScore(Math.min(1, Math.max(0.9, baseScore)));
};

export const evaluateFaceMeshRegionQa = ({
  faceMesh,
  providerId,
}: FaceMeshRegionQaInput): FaceMeshRegionQaReport => {
  const landmarks = faceMesh?.landmarks ?? [];
  const landmarkCount = landmarks.length;
  const confidence = faceMesh?.confidence ?? 0;
  const landmarkIndices = indexSet(landmarks);
  const normalizedCount = landmarks.filter(isPointNormalized).length;
  const cropped = isCroppingRisk(faceMesh?.boundingBox);

  const regionCoverage = Object.entries(regionLandmarkIndices).map(
    ([region, requiredLandmarkIndices]) => {
      const presentLandmarkIndices = requiredLandmarkIndices.filter((index) =>
        landmarkIndices.has(index),
      );
      const coverage = presentLandmarkIndices.length / requiredLandmarkIndices.length;

      return {
        region: region as FaceMeshRegionQaRegion,
        requiredLandmarkIndices,
        presentLandmarkIndices,
        coverage,
        ready: coverage >= 0.75,
      };
    },
  );

  const checks: FaceMeshRegionQaCheck[] = [
    {
      id: 'landmark_count',
      label: 'FaceMesh landmark count',
      passed: landmarkCount >= REQUIRED_LANDMARK_COUNT,
      severity: 'blocking',
      details: `${landmarkCount} landmarks detected; expected at least ${REQUIRED_LANDMARK_COUNT}.`,
    },
    {
      id: 'normalized_coordinates',
      label: 'Normalized landmark coordinates',
      passed: landmarkCount > 0 && normalizedCount === landmarkCount,
      severity: 'blocking',
      details: `${normalizedCount}/${landmarkCount} landmarks are normalized image coordinates.`,
    },
    {
      id: 'region_coverage',
      label: 'Makeup region coverage',
      passed: regionCoverage.every((region) => region.ready),
      severity: 'blocking',
      details: `${regionCoverage.filter((region) => region.ready).length}/${regionCoverage.length} regions are ready.`,
    },
    {
      id: 'face_not_cropped',
      label: 'Face crop margin',
      passed: !cropped,
      severity: 'warning',
      details: cropped
        ? 'Face bounding box touches the image edge.'
        : 'Face bounding box has enough image margin.',
    },
  ];

  const issues: FaceMeshRegionQaIssue[] = checks
    .filter((check) => !check.passed)
    .map((check) => ({
      id: check.id,
      severity: check.severity,
      message: check.details,
      recoveryHint:
        check.id === 'landmark_count'
          ? 'Use a clearer frontal image and confirm real MediaPipe FaceMesh assets are available locally.'
          : check.id === 'face_not_cropped'
            ? 'Use an image where the full face outline is visible before drafting template steps.'
            : 'Review the FaceMesh output before generating candidate makeup guidance.',
    }));

  const hasBlockingIssue = issues.some((issue) => issue.severity === 'blocking');
  const status: FaceMeshRegionQaStatus = hasBlockingIssue
    ? 'region_qa_blocked'
    : issues.length > 0
      ? 'region_qa_ready_with_warnings'
      : 'region_qa_ready';
  const readinessScore = calculateReadinessScore({
    landmarkCount,
    normalizedCount,
    regionCoverage,
    cropped,
    blockingIssueCount: issues.filter((issue) => issue.severity === 'blocking').length,
    warningIssueCount: issues.filter((issue) => issue.severity === 'warning').length,
  });

  return {
    status,
    provider: providerFromId(providerId),
    landmarkCount,
    readinessScore,
    confidence,
    boundingBox: faceMesh?.boundingBox,
    regionCoverage,
    checks,
    issues,
    recommendations: [
      'Use this report as a region-readiness baseline, not as final makeup interpretation.',
      'Generate only candidate attributes and draft steps until a human reviewer confirms them.',
      hasBlockingIssue
        ? 'Do not generate a template draft until blocking FaceMesh coverage issues are fixed.'
        : 'FaceMesh coverage is sufficient for rule-based candidate drafting.',
    ],
    canGenerateAttributeCandidates: !hasBlockingIssue,
    canGenerateTemplateDraft: !hasBlockingIssue && readinessScore >= WARNING_READINESS_SCORE,
  };
};
