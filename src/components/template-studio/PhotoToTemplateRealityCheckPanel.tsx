import type {
  PhotoToTemplateRealityCheckReport,
  PhotoToTemplateRealityHandoff,
  PhotoToTemplateRealitySourceType,
  PhotoToTemplateRealityValidationResult,
} from '../../template-engine';

export interface PhotoToTemplateRealityCheckPanelProps {
  report: PhotoToTemplateRealityCheckReport;
  validation: PhotoToTemplateRealityValidationResult;
  handoff: PhotoToTemplateRealityHandoff;
}

const sourceLabel: Record<PhotoToTemplateRealitySourceType, string> = {
  real_from_photo: '真实照片 / runtime',
  facemesh_derived: 'FaceMesh 派生',
  region_qa_derived: 'Region QA 派生',
  pixel_rule_derived: '像素规则推导',
  region_pixel_derived: '区域像素推导',
  color_rule_derived: '颜色规则推导',
  brightness_rule_derived: '亮度规则推导',
  saturation_rule_derived: '饱和度规则推导',
  semantic_rule_derived: '语义规则推导',
  template_rule_derived: '模板规则推导',
  demo_fixture: 'Demo fixture',
  placeholder: 'Placeholder',
  human_required: '必须人工审核',
  unsupported: '当前不支持',
};

const statusClass = (status: string): string => {
  if (status.includes('blocked') || status.includes('unsupported')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning') || status.includes('limitations') || status.includes('demo')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  return 'border-teal-200 bg-teal-50 text-teal-900';
};

const FieldGroup = ({
  report,
  source,
}: {
  report: PhotoToTemplateRealityCheckReport;
  source: PhotoToTemplateRealitySourceType;
}) => {
  const fields = report.fieldEvidence.filter((item) =>
    item.sourceTypes.includes(source),
  );

  return (
    <div className="rounded-md border border-stone-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{sourceLabel[source]}</h3>
        <span className="rounded-md bg-stone-100 px-2 py-1 text-xs text-stone-700">
          {fields.length}
        </span>
      </div>
      <ul className="mt-2 grid gap-1 text-xs text-stone-600">
        {fields.slice(0, 8).map((field) => (
          <li key={`${source}-${field.field}`}>
            {field.label}
            {field.valuePreview ? `：${field.valuePreview}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export function PhotoToTemplateRealityCheckPanel({
  report,
  validation,
  handoff,
}: PhotoToTemplateRealityCheckPanelProps) {
  const failedChecks = validation.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-cyan-950">
            Photo-to-Template Reality Check
          </h2>
          <p className="mt-1 text-xs leading-5 text-cyan-900">
            12A 用来审计“照片到模板草稿”的真实能力：当前支持半自动模板草稿，但不支持全自动高质量拆妆；所有妆容语义和教学内容都需要人工审核。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-cyan-900">
          Phase 12A operator-only
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <h3 className="text-sm font-semibold">当前能力结论</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>能力状态：{report.capabilityStatus}</p>
            <p>决策：{report.decision}</p>
            <p>支持：半自动模板草稿 + 人工审核</p>
            <p>不支持：全自动高质量拆妆</p>
            <p>Readiness Score：规则型检测可用性评分，不是模型原始置信度</p>
            <p>Registry chain：Phase 10U 后继续暂停</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold">Reality validation</h3>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(validation.status)}`}>
              {validation.status}
            </span>
          </div>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>JSON round-trip：{validation.jsonRoundTripStable ? '稳定' : '不稳定'}</p>
            <p>Human review：必须</p>
            <p>Fully automatic claim：禁止</p>
            <p>Registry / publish / writer：全部阻断</p>
          </div>
          {failedChecks.length > 0 ? (
            <details className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs">
              <summary className="cursor-pointer font-semibold text-amber-900">
                查看未通过 checks
              </summary>
              <ul className="mt-2 grid gap-1 text-amber-900">
                {failedChecks.map((check) => (
                  <li key={check.id}>{check.label}: {check.message}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold">Next handoff</h3>
            <span className={`rounded-md border px-2 py-1 text-xs ${statusClass(handoff.status)}`}>
              {handoff.status}
            </span>
          </div>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Next action：{handoff.nextAction}</p>
            <p>Next phase：{handoff.nextRecommendedPhase}</p>
            <p>结论：不得宣称当前已具备完整自动拆妆能力。</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-cyan-950">字段来源矩阵</h3>
        <p className="text-xs text-cyan-900">
          real / FaceMesh / Region QA / rule / fixture / placeholder / human-required / unsupported
        </p>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <FieldGroup report={report} source="real_from_photo" />
        <FieldGroup report={report} source="facemesh_derived" />
        <FieldGroup report={report} source="region_qa_derived" />
        <FieldGroup report={report} source="pixel_rule_derived" />
        <FieldGroup report={report} source="region_pixel_derived" />
        <FieldGroup report={report} source="color_rule_derived" />
        <FieldGroup report={report} source="brightness_rule_derived" />
        <FieldGroup report={report} source="saturation_rule_derived" />
        <FieldGroup report={report} source="semantic_rule_derived" />
        <FieldGroup report={report} source="template_rule_derived" />
        <FieldGroup report={report} source="demo_fixture" />
        <FieldGroup report={report} source="placeholder" />
        <FieldGroup report={report} source="human_required" />
        <FieldGroup report={report} source="unsupported" />
      </div>

      <details className="mt-3 rounded-md border border-cyan-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看风险、差距和建议
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">风险</h3>
            <ul className="mt-2 grid gap-1">
              {report.risks.map((risk) => (
                <li key={risk.id}>{risk.severity}: {risk.message}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">能力缺口</h3>
            <ul className="mt-2 grid gap-1">
              {report.gaps.map((gap) => (
                <li key={gap.id}>{gap.area}: {gap.message}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">建议</h3>
            <ul className="mt-2 grid gap-1">
              {report.recommendations.map((recommendation) => (
                <li key={recommendation.id}>{recommendation.nextAction}: {recommendation.message}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </section>
  );
}
