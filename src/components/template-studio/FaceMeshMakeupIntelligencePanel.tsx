import type { FaceMeshRegionQaReport } from '../../vision';
import type {
  MakeupAttributeCandidateReport,
  MakeupTemplateDraftReport,
  RuleBasedStepSequence,
} from '../../template-engine';

export interface FaceMeshMakeupIntelligencePanelProps {
  regionQa: FaceMeshRegionQaReport | null;
  attributeCandidates: MakeupAttributeCandidateReport | null;
  stepSequence: RuleBasedStepSequence | null;
  templateDraft: MakeupTemplateDraftReport | null;
}

const statusLabel: Record<string, string> = {
  region_qa_ready: '区域 QA 就绪',
  region_qa_ready_with_warnings: '区域 QA 有警告',
  region_qa_blocked: '区域 QA 阻断',
  candidates_ready: '候选属性就绪',
  candidates_ready_with_warnings: '候选属性有警告',
  candidates_blocked: '候选属性阻断',
  steps_ready: '草稿步骤就绪',
  steps_ready_with_warnings: '草稿步骤有警告',
  steps_blocked: '草稿步骤阻断',
  draft_ready: '模板草稿就绪',
  draft_ready_with_warnings: '模板草稿有警告',
  draft_blocked: '模板草稿阻断',
};

const formatPercent = (value: number): string => `${Math.round(value * 100)}%`;

export function FaceMeshMakeupIntelligencePanel({
  regionQa,
  attributeCandidates,
  stepSequence,
  templateDraft,
}: FaceMeshMakeupIntelligencePanelProps) {
  if (!regionQa || !attributeCandidates || !stepSequence || !templateDraft) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <h2 className="text-base font-semibold">FaceMesh 妆容智能基线</h2>
        <p className="mt-2 text-sm text-stone-500">
          运行真实 FaceMesh 分析后，这里会显示区域 QA、妆容属性候选、规则步骤和模板草稿。所有输出都只是候选 / 草稿，需要人工审核。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-teal-100 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">FaceMesh 妆容智能基线</h2>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            基于真实 FaceMesh landmarks、局部像素和语义规则生成候选 / 草稿；不是 AI 自动最终结果，必须人工审核后才可进入模板库流程。
          </p>
        </div>
        <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">
          Phase 10A draft-only
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-md bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">FaceMesh 区域 QA</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>状态：{statusLabel[regionQa.status]}</p>
            <p>Provider：{regionQa.provider}</p>
            <p>Landmarks：{regionQa.landmarkCount}</p>
            <p>置信度：{formatPercent(regionQa.confidence)}</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {regionQa.regionCoverage.map((region) => (
              <span
                className={`rounded-md px-2 py-1 text-xs ${
                  region.ready
                    ? 'bg-teal-50 text-teal-900'
                    : 'bg-rose-50 text-rose-800'
                }`}
                key={region.region}
              >
                {region.region}: {formatPercent(region.coverage)}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">妆容属性候选</h3>
          <p className="mt-1 text-xs text-stone-500">
            状态：{statusLabel[attributeCandidates.status]} / 全部需要人工审核
          </p>
          <div className="mt-2 grid gap-2 text-xs text-stone-600">
            {attributeCandidates.candidates.slice(0, 6).map((candidate) => (
              <div className="flex items-center justify-between gap-3" key={candidate.id}>
                <span>{candidate.kind}</span>
                <span className="text-right">
                  {candidate.value} / {formatPercent(candidate.confidence)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">规则步骤草稿</h3>
          <p className="mt-1 text-xs text-stone-500">
            状态：{statusLabel[stepSequence.status]} / 发布被阻止
          </p>
          <ol className="mt-2 grid gap-1 text-xs text-stone-600">
            {stepSequence.steps.slice(0, 6).map((step) => (
              <li key={step.id}>
                {step.order}. {step.region} - {step.instruction}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <h3 className="text-sm font-semibold text-amber-950">模板草稿与人工审核</h3>
          <div className="mt-2 grid gap-1 text-xs text-amber-900">
            <p>状态：{statusLabel[templateDraft.status]}</p>
            <p>草稿：{templateDraft.draft?.name ?? '未生成'}</p>
            <p>人工审核：{templateDraft.humanReviewRequired ? '必须' : '否'}</p>
            <p>发布：{templateDraft.publishBlocked ? '已阻止' : '可发布'}</p>
            <p>边界：不接后端、不上传、不训练、不调用 OpenAI 或外部 AI。</p>
          </div>
        </div>
      </div>
    </section>
  );
}
