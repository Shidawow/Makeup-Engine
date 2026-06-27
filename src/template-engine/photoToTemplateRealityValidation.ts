import type {
  PhotoToTemplateRealityCheckReport,
  PhotoToTemplateRealityFieldEvidence,
  PhotoToTemplateRealitySourceType,
} from './photoToTemplateRealityCheck';

export type PhotoToTemplateRealityValidationStatus =
  | 'reality_check_ready'
  | 'reality_check_ready_with_warnings'
  | 'reality_check_blocked';

export type PhotoToTemplateRealityValidationSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type PhotoToTemplateRealityValidationCheckId =
  | 'real_photo_fields_identified'
  | 'rule_derived_fields_identified'
  | 'demo_fixture_fields_identified'
  | 'placeholder_fields_identified'
  | 'human_required_fields_identified'
  | 'unsupported_fields_identified'
  | 'source_label_integrity'
  | 'no_fully_automatic_claim'
  | 'no_model_confidence_mislabel'
  | 'readiness_score_explained'
  | 'no_registry_write'
  | 'no_publish'
  | 'no_production_writer'
  | 'no_user_app_shell_replacement'
  | 'json_round_trip_safe';

export interface PhotoToTemplateRealityValidationCheck {
  id: PhotoToTemplateRealityValidationCheckId;
  label: string;
  passed: boolean;
  severity: PhotoToTemplateRealityValidationSeverity;
  message: string;
}

export interface PhotoToTemplateRealityValidationIssue {
  id: string;
  checkId: PhotoToTemplateRealityValidationCheckId;
  severity: Exclude<PhotoToTemplateRealityValidationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface PhotoToTemplateRealityValidationResult {
  status: PhotoToTemplateRealityValidationStatus;
  checks: PhotoToTemplateRealityValidationCheck[];
  issues: PhotoToTemplateRealityValidationIssue[];
  jsonRoundTripStable: boolean;
  readyForPhase12B: boolean;
  humanReviewRequired: true;
  noFullyAutomaticExtractionClaim: boolean;
  noRegistryWrite: true;
  noPublish: true;
  noProductionWriter: true;
  noUserAppShellReplacement: true;
}

const sourceTypes = (
  report: PhotoToTemplateRealityCheckReport,
): Set<PhotoToTemplateRealitySourceType> =>
  new Set(report.fieldEvidence.flatMap((field) => field.sourceTypes));

const hasSource = (
  field: PhotoToTemplateRealityFieldEvidence,
  source: PhotoToTemplateRealitySourceType,
): boolean => field.sourceTypes.includes(source);

const unsafeRealFieldNames = new Set([
  'lipColor',
  'lipFinish',
  'blushPlacement',
  'eyeMakeupIntensity',
  'eyeshadowTone',
  'eyelinerShape',
  'browShape',
  'contourPresence',
  'highlightPresence',
  'overallMakeupStyle',
  'templateTitle',
  'templateSummary',
  'suitableScenario',
  'difficulty',
  'estimatedTime',
  'toolList',
  'stepSequence',
  'beginnerTips',
  'commonMistakes',
  'correctionTips',
  'userAppPreview',
]);

const fullyAutomaticClaimPattern =
  /fully automatic extraction|fully automatic high-quality|全自动高质量拆妆|自动高质量拆妆|任意照片自动拆妆/i;
const modelConfidenceMislabelPattern =
  /Readiness Score (is|=) (model|raw model)|模型原始置信度|MediaPipe 模型置信度|raw model confidence/i;
const registryWriteClaimPattern = /已写入 registry|registry write executed|registry mutation|真实写入 registry/i;
const publishClaimPattern = /已发布|发布到用户 App|published to user app|上线/i;
const productionWriterPattern = /production writer created|创建 production writer|生产 writer/i;
const shellReplacementPattern = /替换当前 User App Shell|shell package replacement executed/i;

const createCheck = (
  id: PhotoToTemplateRealityValidationCheckId,
  label: string,
  passed: boolean,
  severity: PhotoToTemplateRealityValidationSeverity,
  message: string,
): PhotoToTemplateRealityValidationCheck => ({ id, label, passed, severity, message });

const issueFor = (
  check: PhotoToTemplateRealityValidationCheck,
  recommendation: string,
): PhotoToTemplateRealityValidationIssue | null => {
  if (check.passed || check.severity === 'info') {
    return null;
  }
  return {
    id: `${check.id}_${check.severity}`,
    checkId: check.id,
    severity: check.severity,
    message: check.message,
    recommendation,
  };
};

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const claimText = (report: PhotoToTemplateRealityCheckReport): string =>
  report.claims.join('\n');

const hasUnsafeSourceLabels = (
  report: PhotoToTemplateRealityCheckReport,
): boolean =>
  report.fieldEvidence.some((item) => {
    if (hasSource(item, 'demo_fixture') && hasSource(item, 'real_from_photo')) {
      return true;
    }
    if (unsafeRealFieldNames.has(item.field) && hasSource(item, 'real_from_photo')) {
      return true;
    }
    return false;
  });

export const validatePhotoToTemplateRealityCheck = (
  report: PhotoToTemplateRealityCheckReport,
): PhotoToTemplateRealityValidationResult => {
  const sources = sourceTypes(report);
  const claims = claimText(report);
  const jsonRoundTripStable = isJsonRoundTripStable(report);
  const readinessScore = report.fieldEvidence.find((item) => item.field === 'readinessScore');

  const checks: PhotoToTemplateRealityValidationCheck[] = [
    createCheck(
      'real_photo_fields_identified',
      'Real photo / FaceMesh fields identified',
      sources.has('real_from_photo') || sources.has('facemesh_derived'),
      'blocking',
      'Reality check must identify which fields come from real photo geometry or FaceMesh.',
    ),
    createCheck(
      'rule_derived_fields_identified',
      'Rule-derived fields identified',
      sources.has('pixel_rule_derived') ||
        sources.has('semantic_rule_derived') ||
        sources.has('template_rule_derived') ||
        sources.has('region_qa_derived'),
      'blocking',
      'Reality check must identify rule-derived fields.',
    ),
    createCheck(
      'demo_fixture_fields_identified',
      'Demo fixture fields identified',
      sources.has('demo_fixture'),
      'warning',
      'Reality check should label demo fixture fields instead of treating them as photo-derived.',
    ),
    createCheck(
      'placeholder_fields_identified',
      'Placeholder fields identified',
      sources.has('placeholder'),
      'warning',
      'Reality check should label placeholder fields.',
    ),
    createCheck(
      'human_required_fields_identified',
      'Human-required fields identified',
      report.humanReviewRequired && sources.has('human_required'),
      'blocking',
      'Reality check must mark human review required fields.',
    ),
    createCheck(
      'unsupported_fields_identified',
      'Unsupported automatic extraction fields identified',
      sources.has('unsupported') && report.supportsFullyAutomaticExtraction === false,
      'warning',
      'Reality check should identify unsupported automatic extraction areas.',
    ),
    createCheck(
      'source_label_integrity',
      'Source label integrity',
      !hasUnsafeSourceLabels(report),
      'blocking',
      'Demo fixture or semantic/template/copy fields must not be marked real_from_photo.',
    ),
    createCheck(
      'no_fully_automatic_claim',
      'No fully automatic extraction claim',
      !fullyAutomaticClaimPattern.test(claims) && report.supportsFullyAutomaticExtraction === false,
      'blocking',
      'Current system must not claim fully automatic high-quality makeup extraction.',
    ),
    createCheck(
      'no_model_confidence_mislabel',
      'No model confidence mislabel',
      !modelConfidenceMislabelPattern.test(claims),
      'blocking',
      'Readiness Score and candidate confidence must not be mislabeled as raw model confidence.',
    ),
    createCheck(
      'readiness_score_explained',
      'Readiness Score explained',
      report.readinessScoreIsRuleBased &&
        Boolean(readinessScore) &&
        !readinessScore?.sourceTypes.includes('real_from_photo') &&
        readinessScore?.evidence.join('\n').toLowerCase().includes('rule-based') === true,
      'blocking',
      'Readiness Score must be explained as rule-based detection usability scoring.',
    ),
    createCheck(
      'no_registry_write',
      'No registry write',
      report.noRegistryWrite && !registryWriteClaimPattern.test(claims),
      'blocking',
      'Reality check must not perform or claim registry writes.',
    ),
    createCheck(
      'no_publish',
      'No publish',
      report.noPublish && !publishClaimPattern.test(claims),
      'blocking',
      'Reality check must not publish or claim publication.',
    ),
    createCheck(
      'no_production_writer',
      'No production writer',
      report.noProductionWriter && !productionWriterPattern.test(claims),
      'blocking',
      'Reality check must not create or claim a production writer.',
    ),
    createCheck(
      'no_user_app_shell_replacement',
      'No User App Shell replacement',
      report.noUserAppShellReplacement && !shellReplacementPattern.test(claims),
      'blocking',
      'Reality check must not replace the current User App Shell package.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Reality check report must survive stable JSON round-trip.',
    ),
  ];

  const issues = checks
    .map((check) =>
      issueFor(
        check,
        check.id === 'source_label_integrity'
          ? 'Revise field source labels before using this report.'
          : check.id === 'no_fully_automatic_claim'
            ? 'Replace automatic extraction claims with semi-automatic draft + human review wording.'
            : check.id === 'human_required_fields_identified'
              ? 'Mark human review required fields explicitly.'
              : 'Revise the reality check evidence before handoff.',
      ),
    )
    .filter((issue): issue is PhotoToTemplateRealityValidationIssue => Boolean(issue));

  const blocked = issues.some((issue) => issue.severity === 'blocking');
  const warning = issues.some((issue) => issue.severity === 'warning');
  const status: PhotoToTemplateRealityValidationStatus = blocked
    ? 'reality_check_blocked'
    : warning
      ? 'reality_check_ready_with_warnings'
      : 'reality_check_ready';

  return {
    status,
    checks,
    issues,
    jsonRoundTripStable,
    readyForPhase12B: status !== 'reality_check_blocked',
    humanReviewRequired: true,
    noFullyAutomaticExtractionClaim: checks.find((check) => check.id === 'no_fully_automatic_claim')?.passed ?? false,
    noRegistryWrite: true,
    noPublish: true,
    noProductionWriter: true,
    noUserAppShellReplacement: true,
  };
};
