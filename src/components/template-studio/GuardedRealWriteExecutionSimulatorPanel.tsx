import type {
  GuardedRealWriteExecutionSimulator,
  GuardedRealWriteExecutionSimulatorHandoff,
  GuardedRealWriteExecutionSimulatorValidationResult,
} from '../../template-engine';

export interface GuardedRealWriteExecutionSimulatorPanelProps {
  simulator: GuardedRealWriteExecutionSimulator;
  validation: GuardedRealWriteExecutionSimulatorValidationResult;
  handoff: GuardedRealWriteExecutionSimulatorHandoff;
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

const sectionStatus = (present: boolean): string => (present ? 'ready' : 'blocked');

export function GuardedRealWriteExecutionSimulatorPanel({
  simulator,
  validation,
  handoff,
}: GuardedRealWriteExecutionSimulatorPanelProps) {
  const failedChecks = validation.checks.filter((check) => !check.passed);
  const compactSections = [
    {
      id: 'preflight',
      label: 'Simulated Preflight',
      value: simulator.simulatedPreflight?.summary ?? 'missing simulated preflight',
      status: sectionStatus(Boolean(simulator.simulatedPreflight)),
    },
    {
      id: 'write_lock',
      label: 'Simulated Write Lock',
      value: simulator.simulatedWriteLock?.summary ?? 'missing simulated write lock',
      status: sectionStatus(Boolean(simulator.simulatedWriteLock)),
    },
    {
      id: 'write_operation',
      label: 'Simulated Write Operation',
      value:
        simulator.simulatedWriteOperation?.summary ??
        'missing simulated write operation',
      status: sectionStatus(Boolean(simulator.simulatedWriteOperation)),
    },
    {
      id: 'audit_events',
      label: 'Simulated Audit Events',
      value: `${simulator.simulatedAuditEvents.length} simulated events`,
      status: sectionStatus(simulator.simulatedAuditEvents.length > 0),
    },
    {
      id: 'rollback',
      label: 'Simulated Rollback',
      value: simulator.simulatedRollback?.summary ?? 'missing simulated rollback',
      status: sectionStatus(Boolean(simulator.simulatedRollback)),
    },
    {
      id: 'failure_handling',
      label: 'Simulated Failure Handling',
      value:
        simulator.simulatedFailureHandling?.summary ??
        'missing simulated failure handling',
      status: sectionStatus(Boolean(simulator.simulatedFailureHandling)),
    },
  ];

  return (
    <section className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-indigo-950">
            受保护真实写入执行模拟器
          </h2>
          <p className="mt-1 text-xs leading-5 text-indigo-900">
            模拟器，不是实际写入；不授权真实写入 registry，不授权发布，不授权替换当前用户 App 包，不创建 production writer，不 mutation registry。Phase 10S 仍然 dry-run only。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-indigo-900">
          Phase 10S simulator only
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Simulation</h3>
              <p className="mt-1 text-xs text-stone-500">
                只模拟未来 guarded write flow
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                simulator.simulationStatus,
              )}`}
            >
              {simulator.simulationStatus}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>mode：{simulator.simulationMode}</p>
            <p>dry-run only：{simulator.dryRunOnly ? '是' : '否'}</p>
            <p>
              actual write blocked：
              {simulator.actualWriteBlocked ? '是' : '否'}
            </p>
            <p>
              registry mutation blocked：
              {simulator.registryMutationBlocked ? '是' : '否'}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Simulation Validation</h3>
              <p className="mt-1 text-xs text-stone-500">
                复核 dry-run、模拟锁、审计、回滚和 failure handling
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
            <p>通过也只表示可进入未来模拟器复核闸门。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Simulation Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">
                只交给 Phase 10T 或以后 simulator review gate
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
              Future simulator review gate：
              {handoff.readyForFutureSimulatorReviewGate ? '可进入' : '不可进入'}
            </p>
            <p>未来真实写入仍需老板另行明确授权。</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Actual Write</p>
          <p className="mt-1">
            actual write blocked：
            {simulator.actualWriteBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">不会写入用户 App registry。</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Registry Mutation</p>
          <p className="mt-1">
            registry mutation blocked：
            {simulator.registryMutationBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">模拟结果不 mutation registry。</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Publish</p>
          <p className="mt-1">
            publish blocked：{simulator.publishBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">不会发布到用户 App。</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Shell Replacement</p>
          <p className="mt-1">
            package replacement blocked：
            {simulator.packageReplacementBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">不会替换当前用户 App 包。</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Production Writer</p>
          <p className="mt-1">
            production writer blocked：
            {simulator.productionWriterBlocked ? '是' : '否'}
          </p>
          <p className="mt-1">不会创建 production writer。</p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {compactSections.map((item) => (
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

      {simulator.blockedReasons.length > 0 ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-white p-3 text-xs text-rose-800">
          <p className="font-semibold">Blocked reasons</p>
          <ul className="mt-2 grid gap-1">
            {simulator.blockedReasons.slice(0, 8).map((reason) => (
              <li key={reason.id}>{reason.message}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-emerald-200 bg-white p-3 text-xs text-emerald-900">
          可进入未来模拟器复核闸门；这仍然不是实际 registry 写入，不是发布，不是 production writer。
        </div>
      )}

      <details className="mt-3 rounded-md border border-indigo-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 simulation / validation / handoff details
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Simulation steps</h3>
            <ul className="mt-2 grid gap-1">
              {simulator.simulatedWriteOperation?.steps.map((step) => (
                <li key={step.stepId}>
                  {step.order}. {step.label}: {step.status}
                </li>
              )) ?? <li>missing simulated write operation</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Validation checks</h3>
            <ul className="mt-2 grid gap-1">
              {validation.checks.slice(0, 14).map((check) => (
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
