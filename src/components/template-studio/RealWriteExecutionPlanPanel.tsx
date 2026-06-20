import type {
  RealWriteExecutionPlan,
  RealWriteExecutionPlanHandoff,
  RealWriteExecutionPlanValidationResult,
} from '../../template-engine';

export interface RealWriteExecutionPlanPanelProps {
  plan: RealWriteExecutionPlan;
  validation: RealWriteExecutionPlanValidationResult;
  handoff: RealWriteExecutionPlanHandoff;
}

const statusClass = (status: string): string => {
  if (status.includes('blocked')) {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (status.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }
  if (status.includes('ready')) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  }
  return 'border-stone-200 bg-stone-50 text-stone-700';
};

const planItemStatus = (present: boolean): string =>
  present ? 'ready' : 'blocked';

export function RealWriteExecutionPlanPanel({
  plan,
  validation,
  handoff,
}: RealWriteExecutionPlanPanelProps) {
  const failedChecks = validation.checks.filter((check) => !check.passed);
  const compactPlanItems = [
    {
      id: 'execution_sequence',
      label: 'Execution sequence',
      value: `${plan.executionSequencePlan.length} steps`,
      status: planItemStatus(plan.executionSequencePlan.length > 0),
    },
    {
      id: 'preflight',
      label: 'Preflight',
      value: plan.preflightPlan?.summary ?? 'missing preflight plan',
      status: planItemStatus(Boolean(plan.preflightPlan)),
    },
    {
      id: 'write_lock',
      label: 'Write Lock',
      value: plan.writeLockPlan?.summary ?? 'missing write lock plan',
      status: planItemStatus(Boolean(plan.writeLockPlan)),
    },
    {
      id: 'audit',
      label: 'Audit',
      value: plan.auditPlan?.summary ?? 'missing audit plan',
      status: planItemStatus(Boolean(plan.auditPlan)),
    },
    {
      id: 'rollback',
      label: 'Rollback',
      value: plan.rollbackPlan?.summary ?? 'missing rollback plan',
      status: planItemStatus(Boolean(plan.rollbackPlan)),
    },
    {
      id: 'failure_handling',
      label: 'Failure Handling',
      value: plan.failureHandlingPlan?.summary ?? 'missing failure handling plan',
      status: planItemStatus(Boolean(plan.failureHandlingPlan)),
    },
    {
      id: 'dry_run_verification',
      label: 'Dry-run Verification',
      value:
        plan.dryRunVerificationPlan?.summary ??
        'missing dry-run verification plan',
      status: planItemStatus(Boolean(plan.dryRunVerificationPlan)),
    },
  ];

  return (
    <section className="rounded-lg border border-sky-200 bg-sky-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-sky-950">
            真实写入执行计划
          </h2>
          <p className="mt-1 text-xs leading-5 text-sky-900">
            执行计划，不是实际写入；不授权真实写入 registry，不授权发布，不授权替换当前用户 App 包，不创建 production writer。10R 仍然 dry-run only，只能交给未来受保护执行模拟器。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-sky-900">
          Phase 10R execution plan only
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Execution Plan</h3>
              <p className="mt-1 text-xs text-stone-500">
                只判断是否可进入未来 simulator
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                plan.executionPlanStatus,
              )}`}
            >
              {plan.executionPlanStatus}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>dry-run only：{plan.dryRunOnly ? '是' : '否'}</p>
            <p>
              actual write blocked：{plan.actualWriteBlocked ? '是' : '否'}
            </p>
            <p>不是实际写入；不会写入 registry。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Execution Plan Validation</h3>
              <p className="mt-1 text-xs text-stone-500">
                复核计划、锁、审计、回滚、failure handling 和 dry-run verification
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
            <p>Checks：{validation.checks.length}</p>
            <p>Blocked checks：{failedChecks.length}</p>
            <p>不会发布，也不会替换当前用户 App 包。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Execution Plan Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">
                只交给 Phase 10S 或以后 guarded execution simulator
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
              Future simulator：
              {handoff.readyForFutureGuardedExecutionSimulator
                ? '可进入'
                : '不可进入'}
            </p>
            <p>未来真实写入仍需老板另行明确授权。</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Actual Write</p>
          <p className="mt-1">
            actual write blocked：{plan.actualWriteBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">registry 只做计划，不做 mutation。</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Publish / Shell Swap</p>
          <p className="mt-1">
            publish blocked：{plan.publishBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">
            shell replacement blocked：
            {plan.packageReplacementBlocked ? '是' : '否'}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Production Writer</p>
          <p className="mt-1">
            production writer blocked：
            {plan.productionWriterBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">
            create writer：{plan.doesNotCreateProductionWriter ? '阻断' : '缺失'}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">Source Authorization</p>
          <p className="mt-1">{plan.authorizationTrace.ownerAuthorizationText}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {compactPlanItems.map((item) => (
          <div
            key={item.id}
            className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-stone-900">{item.label}</p>
              <span
                className={`rounded-md border px-2 py-1 ${statusClass(item.status)}`}
              >
                {item.status}
              </span>
            </div>
            <p className="mt-2 leading-5">{item.value}</p>
          </div>
        ))}
      </div>

      {plan.blockedReasons.length > 0 ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-white p-3 text-xs text-rose-800">
          <p className="font-semibold">Blocked reasons</p>
          <ul className="mt-2 grid gap-1">
            {plan.blockedReasons.slice(0, 8).map((reason) => (
              <li key={reason.id}>{reason.message}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-emerald-200 bg-white p-3 text-xs text-emerald-900">
          可进入未来受保护执行模拟器；这仍然不是实际 registry 写入，也不是 production writer。
        </div>
      )}

      <details className="mt-3 rounded-md border border-sky-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 execution plan / validation / handoff notes
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Execution steps</h3>
            <ul className="mt-2 grid gap-1">
              {plan.executionSequencePlan.map((step) => (
                <li key={step.stepId}>
                  {step.order}. {step.label}: {step.status}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Validation checks</h3>
            <ul className="mt-2 grid gap-1">
              {validation.checks.slice(0, 12).map((check) => (
                <li key={check.id}>
                  {check.label}: {check.passed ? '通过' : check.severity}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Handoff notes</h3>
            <ul className="mt-2 grid gap-1">
              {handoff.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </section>
  );
}
