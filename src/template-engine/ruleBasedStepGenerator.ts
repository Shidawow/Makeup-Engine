import type { MakeupStep } from '../templates/schema';
import type {
  MakeupAttributeCandidate,
  MakeupAttributeCandidateReport,
} from './makeupAttributeCandidates';

export type RuleBasedStepGeneratorStatus =
  | 'steps_ready'
  | 'steps_ready_with_warnings'
  | 'steps_blocked';

export interface RuleBasedGeneratedStep extends MakeupStep {
  confidence: number;
  sourceCandidateIds: string[];
  reviewStatus: 'needs_human_review';
}

export interface RuleBasedStepSequence {
  status: RuleBasedStepGeneratorStatus;
  steps: RuleBasedGeneratedStep[];
  issues: Array<{
    id: string;
    message: string;
    severity: 'warning' | 'blocking';
  }>;
  notes: string[];
}

const candidateByKind = (
  candidates: readonly MakeupAttributeCandidate[],
  kind: MakeupAttributeCandidate['kind'],
) => candidates.find((candidate) => candidate.kind === kind);

export const generateRuleBasedStepSequence = (
  report: MakeupAttributeCandidateReport,
): RuleBasedStepSequence => {
  if (report.status === 'candidates_blocked') {
    return {
      status: 'steps_blocked',
      steps: [],
      issues: report.issues.map((issue) => ({
        id: `candidate_${issue.id}`,
        message: issue.message,
        severity: issue.severity,
      })),
      notes: ['Step generation was blocked because candidate attributes are not ready.'],
    };
  }

  const lipColor = candidateByKind(report.candidates, 'lip_color_family');
  const lipFinish = candidateByKind(report.candidates, 'lip_finish');
  const blushPlacement = candidateByKind(report.candidates, 'blush_placement');
  const eyeDefinition = candidateByKind(report.candidates, 'eye_definition');
  const eyeDepth = candidateByKind(report.candidates, 'eyeshadow_depth');
  const contour = candidateByKind(report.candidates, 'contour_softness');

  const steps: RuleBasedGeneratedStep[] = [
    {
      id: 'draft-step-01-base-prep',
      order: 1,
      region: 'base',
      action: 'prep',
      tool: 'sponge',
      intensity: 'low',
      layerOrder: 'base',
      placement: {
        region: 'base',
        area: '全脸薄层打底',
        coverage: 'full',
      },
      productCategory: 'base prep',
      finish: 'natural',
      visualEffects: ['balance', 'soften'],
      instruction: '先用轻薄底妆统一肤色，保留真实皮肤质感。',
      rationale: '为后续候选妆容属性建立干净底层，不自动判断真实肤质。',
      confidence: 0.72,
      sourceCandidateIds: [],
      reviewStatus: 'needs_human_review',
    },
    {
      id: 'draft-step-02-eyeshadow',
      order: 2,
      region: 'eye',
      action: 'blend',
      tool: 'brush',
      intensity: eyeDepth?.value === 'medium_depth_candidate' ? 'medium' : 'low',
      layerOrder: 'color',
      placement: {
        region: 'eye',
        area: '上眼睑外侧到眼窝',
        coverage: 'medium',
      },
      productCategory: 'eyeshadow',
      colorFamily: eyeDepth?.value ?? 'soft_depth_candidate',
      visualEffects: ['deepen', 'widen'],
      instruction: '按候选眼影深度少量叠加，边缘保持柔和。',
      rationale: '来自像素深浅候选，只能作为模板草稿步骤。',
      confidence: eyeDepth?.confidence ?? 0.62,
      sourceCandidateIds: eyeDepth ? [eyeDepth.id] : [],
      reviewStatus: 'needs_human_review',
    },
    {
      id: 'draft-step-03-eye-definition',
      order: 3,
      region: 'eye',
      action: 'line',
      tool: 'brush',
      intensity: 'low',
      layerOrder: 'definition',
      placement: {
        region: 'eye',
        area: '睫毛根部',
        coverage: 'small',
      },
      productCategory: 'eyeliner',
      visualEffects: ['lift', 'widen'],
      instruction: '沿睫毛根部做细线条候选，眼尾方向需要人工确认。',
      rationale: '眼线方向来自候选识别，不能直接作为最终教学。',
      confidence: eyeDefinition?.confidence ?? 0.6,
      sourceCandidateIds: eyeDefinition ? [eyeDefinition.id] : [],
      reviewStatus: 'needs_human_review',
    },
    {
      id: 'draft-step-04-blush',
      order: 4,
      region: 'blush',
      action: 'tap',
      tool: 'brush',
      intensity: blushPlacement?.value === 'high_lift_candidate' ? 'medium' : 'low',
      layerOrder: 'color',
      placement: {
        region: 'blush',
        area: blushPlacement?.value === 'high_lift_candidate'
          ? '颧骨上方斜向晕染'
          : '面中到颧骨轻扫',
        coverage: 'medium',
      },
      productCategory: 'blush',
      colorFamily: 'soft_rose_or_peach',
      visualEffects: ['lift', 'glow'],
      instruction: '按候选腮红位置少量上色，并让边缘自然扩散。',
      rationale: '腮红位置来自像素中心和 FaceMesh 区域覆盖。',
      confidence: blushPlacement?.confidence ?? 0.64,
      sourceCandidateIds: blushPlacement ? [blushPlacement.id] : [],
      reviewStatus: 'needs_human_review',
    },
    {
      id: 'draft-step-05-lip',
      order: 5,
      region: 'lip',
      action: 'fill',
      tool: 'wand',
      intensity: 'medium',
      layerOrder: 'finish',
      placement: {
        region: 'lip',
        area: '唇中央向外晕开',
        coverage: 'full',
      },
      productCategory: 'lip color',
      finish: lipFinish?.value,
      colorFamily: lipColor?.value,
      visualEffects: ['balance', 'soften'],
      instruction: '使用候选唇色家族从唇中央向外铺开，边界需要人工复核。',
      rationale: '唇色与质地来自像素和语义候选，不是最终识别结论。',
      confidence: Math.min(lipColor?.confidence ?? 0.6, lipFinish?.confidence ?? 0.6),
      sourceCandidateIds: [lipColor?.id, lipFinish?.id].filter(Boolean) as string[],
      reviewStatus: 'needs_human_review',
    },
    {
      id: 'draft-step-06-contour-check',
      order: 6,
      region: 'contour',
      action: 'blend',
      tool: 'brush',
      intensity: 'low',
      layerOrder: 'structure',
      placement: {
        region: 'contour',
        area: '下颌与面部外轮廓少量试探',
        coverage: 'small',
      },
      productCategory: 'contour',
      visualEffects: ['balance'],
      instruction: '仅记录柔和修容候选，实际范围必须由人工审核确认。',
      rationale: '轮廓候选对人脸角度敏感，10A 不自动定稿。',
      confidence: contour?.confidence ?? 0.55,
      sourceCandidateIds: contour ? [contour.id] : [],
      reviewStatus: 'needs_human_review',
    },
  ];

  return {
    status: report.status === 'candidates_ready_with_warnings'
      ? 'steps_ready_with_warnings'
      : 'steps_ready',
    steps,
    issues: report.issues,
    notes: [
      'Steps are ordered from base to eyes, cheek, lip, and contour review.',
      'Every generated step is draft-only and requires human review.',
      'No step is published to UserAppTemplatePackage in Phase 10A.',
    ],
  };
};
