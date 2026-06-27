import type {
  MakeupSemanticCandidate,
  MakeupSemanticCandidateKey,
  MakeupSemanticExtractionReport,
  MakeupSemanticSourceType,
} from '../../vision';

export interface MakeupSemanticExtractionPanelProps {
  report: MakeupSemanticExtractionReport;
}

const sourceLabel: Record<MakeupSemanticSourceType, string> = {
  region_pixel_derived: '区域像素推导',
  facemesh_region_derived: 'FaceMesh 区域推导',
  color_rule_derived: '颜色规则推导',
  brightness_rule_derived: '亮度规则推导',
  saturation_rule_derived: '饱和度规则推导',
  semantic_rule_derived: '语义规则组合',
  insufficient_evidence: '证据不足',
  human_review_required: '必须人工审核',
};

const fieldLabel: Record<MakeupSemanticCandidateKey, string> = {
  lipColorCandidate: '唇色候选',
  lipFinishCandidate: '唇妆质地候选',
  blushPlacementCandidate: '腮红位置候选',
  blushIntensityCandidate: '腮红强度候选',
  eyeMakeupIntensityCandidate: '眼妆强度候选',
  eyeshadowToneCandidate: '眼影色调候选',
  browDefinitionCandidate: '眉毛清晰度候选',
  highlightSignalCandidate: '高光信号候选',
  contourSignalCandidate: '修容信号候选',
  overallStyleCandidate: '整体风格候选',
};

const statusClass = (status: string): string => {
  if (status.includes('blocked') || status.includes('insufficient')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning') || status.includes('low')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  return 'border-teal-200 bg-teal-50 text-teal-900';
};

const CandidateCard = ({ candidate }: { candidate: MakeupSemanticCandidate }) => {
  const evidence = candidate.evidence[0];

  return (
    <div className="rounded-md border border-stone-200 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{fieldLabel[candidate.field]}</h3>
          <p className="mt-1 text-xs text-stone-500">
            {sourceLabel[candidate.sourceType]} / {candidate.confidenceBand}
          </p>
        </div>
        <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(candidate.confidenceBand)}`}>
          {candidate.value}
        </span>
      </div>
      <div className="mt-2 grid gap-1 text-xs text-stone-600">
        <p>样本：{evidence?.sampleCount ?? 0}</p>
        {evidence?.averageHue === undefined ? null : <p>Hue：{evidence.averageHue}</p>}
        {evidence?.averageSaturation === undefined ? null : (
          <p>Saturation：{evidence.averageSaturation}</p>
        )}
        {evidence?.averageBrightness === undefined ? null : (
          <p>Brightness：{evidence.averageBrightness}</p>
        )}
        {evidence?.contrastVsSkinBaseline === undefined ? null : (
          <p>Skin baseline contrast：{evidence.contrastVsSkinBaseline}</p>
        )}
      </div>
      <details className="mt-2 rounded-md border border-stone-200 bg-stone-50 p-2 text-xs">
        <summary className="cursor-pointer font-semibold text-stone-800">
          查看证据和限制
        </summary>
        <div className="mt-2 grid gap-2 text-stone-600">
          <ul className="grid gap-1">
            {candidate.evidence.flatMap((item) => item.notes).map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <ul className="grid gap-1 text-amber-900">
            {candidate.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
};

export function MakeupSemanticExtractionPanel({
  report,
}: MakeupSemanticExtractionPanelProps) {
  const candidates = Object.values(report.candidates);

  return (
    <section className="rounded-lg border border-teal-200 bg-teal-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-teal-950">
            Makeup Semantic Extraction Baseline
          </h2>
          <p className="mt-1 text-xs leading-5 text-teal-900">
            12B 只输出本地、确定性、可解释的妆容语义候选；不是定稿结论，不是自动确认结果，不识别品牌色号，也不做医学或肤质判断。
          </p>
        </div>
        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <h3 className="text-sm font-semibold">边界</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>所有输出：候选。</p>
            <p>人工审核：必须。</p>
            <p>定稿结论 / AI 确认 / 产品色号：禁止。</p>
            <p>Phase 10U 后 registry chain 继续暂停。</p>
          </div>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <h3 className="text-sm font-semibold">来源统计</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            {Object.entries(report.sourceSummary).map(([source, count]) => (
              <p key={source}>
                {sourceLabel[source as MakeupSemanticSourceType]}：{count}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <h3 className="text-sm font-semibold">建议</h3>
          <ul className="mt-2 grid gap-1 text-xs text-stone-600">
            {report.recommendations.map((recommendation) => (
              <li key={recommendation.id}>
                {recommendation.nextAction}：{recommendation.message}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {report.issues.length > 0 ? (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <p className="font-semibold">证据提示</p>
          <ul className="mt-2 grid gap-1">
            {report.issues.map((issue) => (
              <li key={issue.id}>
                {issue.severity}：{issue.message} {issue.recommendation}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {candidates.map((candidate) => (
          <CandidateCard candidate={candidate} key={candidate.id} />
        ))}
      </div>
    </section>
  );
}
