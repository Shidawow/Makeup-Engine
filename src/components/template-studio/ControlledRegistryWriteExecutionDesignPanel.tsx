import type {
  ControlledRegistryWriteExecutionDesign,
  ControlledRegistryWriteExecutionHandoff,
  ControlledRegistryWriteExecutionValidationResult,
} from '../../template-engine';

export interface ControlledRegistryWriteExecutionDesignPanelProps {
  design: ControlledRegistryWriteExecutionDesign;
  validation: ControlledRegistryWriteExecutionValidationResult;
  handoff: ControlledRegistryWriteExecutionHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-cyan-200 bg-cyan-50 text-cyan-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

export function ControlledRegistryWriteExecutionDesignPanel({
  design,
  validation,
  handoff,
}: ControlledRegistryWriteExecutionDesignPanelProps) {
  const failedChecks = validation.checks.filter((check) => !check.passed);

  return (
    <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-cyan-950">
            受控 Registry 写入执行设计
          </h2>
          <p className="mt-1 text-xs leading-5 text-cyan-900">
            10M 是 design / dry-run only，不是实际写入；不会发布，不会替换当前用户 App 包。未来真实执行仍需老板单独授权。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-cyan-900">
          Phase 10M execution design only
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Execution Design</h3>
              <p className="mt-1 text-xs text-stone-500">
                只设计未来执行路径
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                design.executionDesignStatus,
              )}`}
            >
              {design.executionDesignStatus}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Execution mode：{design.executionMode}</p>
            <p>dry-run only：{design.dryRunOnly ? '是' : '否'}</p>
            <p>actual write blocked：{design.actualWriteBlocked ? '是' : '否'}</p>
            <p>不是实际写入，不会写入 registry。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Safety Validation</h3>
              <p className="mt-1 text-xs text-stone-500">
                校验 no-write / no-publish / no-replacement
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                validation.status,
              )}`}
            >
              {validation.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Preflight checks：{design.preflightChecks.length}</p>
            <p>Failed checks：{failedChecks.length}</p>
            <p>Audit plan：{design.auditPlan ? '已设计' : '缺失'}</p>
            <p>Rollback design：{design.rollbackExecutionDesign ? '已设计' : '缺失'}</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Execution Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">
                交给未来真实写入实现闸门
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                handoff.status,
              )}`}
            >
              {handoff.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>Next action：{handoff.nextAction}</p>
            <p>
              Future implementation gate：
              {handoff.readyForRealWriteImplementationGate ? '可进入未来闸门' : '不可进入'}
            </p>
            <p>不会发布，也不会替换当前用户 App 包。</p>
            <p>未来真实执行仍需老板单独授权。</p>
          </div>
        </div>
      </div>

      {design.blockedReasons.length > 0 ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-white p-3 text-xs text-rose-800">
          <p className="font-semibold">Blocked reasons</p>
          <ul className="mt-2 grid gap-1">
            {design.blockedReasons.slice(0, 6).map((reason) => (
              <li key={reason.id}>{reason.message}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-cyan-200 bg-white p-3 text-xs text-cyan-900">
          可进入未来真实写入实现闸门；这仍然不是实际 registry 写入授权。
        </div>
      )}

      <details className="mt-3 rounded-md border border-cyan-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 preflight / execution steps / audit / rollback
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-4">
          <div>
            <h3 className="font-semibold text-stone-900">Preflight checks</h3>
            <ul className="mt-2 grid gap-1">
              {design.preflightChecks.slice(0, 12).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Execution steps</h3>
            <ol className="mt-2 grid gap-1">
              {design.plannedExecutionSteps.map((step) => (
                <li key={step.stepId}>
                  {step.order}. {step.label}: {step.status}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Audit plan</h3>
            {design.auditPlan ? (
              <ul className="mt-2 grid gap-1">
                {design.auditPlan.items.map((item) => (
                  <li key={item.id}>{item.label}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-rose-700">缺少 audit plan</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Rollback design</h3>
            {design.rollbackExecutionDesign ? (
              <ul className="mt-2 grid gap-1">
                {design.rollbackExecutionDesign.steps.slice(0, 4).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-rose-700">缺少 rollback design</p>
            )}
          </div>
        </div>
      </details>
    </section>
  );
}
