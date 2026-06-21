import type {
  GuardedSimulatorReviewChecklist,
  GuardedSimulatorReviewGateResult,
  GuardedSimulatorReviewHandoff,
} from '../../template-engine';

export interface GuardedSimulatorReviewGatePanelProps {
  gate: GuardedSimulatorReviewGateResult;
  checklist: GuardedSimulatorReviewChecklist;
  handoff: GuardedSimulatorReviewHandoff;
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

export function GuardedSimulatorReviewGatePanel({
  gate,
  checklist,
  handoff,
}: GuardedSimulatorReviewGatePanelProps) {
  const failedChecks = gate.checks.filter((check) => !check.passed);
  const reviewedSections = [
    {
      id: 'simulated_preflight_reviewed',
      label: 'simulated preflight review',
      passed: gate.checks.find((check) => check.id === 'simulated_preflight_reviewed')
        ?.passed,
    },
    {
      id: 'simulated_write_lock_reviewed',
      label: 'simulated write lock review',
      passed: gate.checks.find((check) => check.id === 'simulated_write_lock_reviewed')
        ?.passed,
    },
    {
      id: 'simulated_write_operation_reviewed',
      label: 'simulated write operation review',
      passed: gate.checks.find(
        (check) => check.id === 'simulated_write_operation_reviewed',
      )?.passed,
    },
    {
      id: 'simulated_audit_events_reviewed',
      label: 'simulated audit events review',
      passed: gate.checks.find(
        (check) => check.id === 'simulated_audit_events_reviewed',
      )?.passed,
    },
    {
      id: 'simulated_rollback_reviewed',
      label: 'simulated rollback review',
      passed: gate.checks.find((check) => check.id === 'simulated_rollback_reviewed')
        ?.passed,
    },
    {
      id: 'simulated_failure_handling_reviewed',
      label: 'simulated failure handling review',
      passed: gate.checks.find(
        (check) => check.id === 'simulated_failure_handling_reviewed',
      )?.passed,
    },
  ];

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-emerald-950">
            受保护模拟器复核闸门
          </h2>
          <p className="mt-1 text-xs leading-5 text-emerald-900">
            复核闸门，不是实际写入；不授权真实写入 registry，不 mutation registry，不发布，不替换当前用户 App 包，不创建 production writer。Phase 10T 仍然 dry-run only。
          </p>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-emerald-900">
          Phase 10T review gate only
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Gate Status</h3>
              <p className="mt-1 text-xs text-stone-500">
                只判断是否可进入未来真实写入批准边界
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                gate.status,
              )}`}
            >
              {gate.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>decision：{gate.decision}</p>
            <p>failed checks：{failedChecks.length}</p>
            <p>
              future boundary：
              {gate.readyForFutureRealWriteApprovalBoundary ? '可进入' : '不可进入'}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Review Checklist</h3>
              <p className="mt-1 text-xs text-stone-500">
                复核模拟器完整性和安全边界
              </p>
            </div>
            <span
              className={`rounded-md border px-2 py-1 text-xs ${statusClass(
                checklist.status,
              )}`}
            >
              {checklist.status}
            </span>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-stone-600">
            <p>requirements：{checklist.requirements.length}</p>
            <p>
              blocked：
              {
                checklist.requirements.filter(
                  (requirement) => requirement.required && !requirement.satisfied,
                ).length
              }
            </p>
            <p>checklist 不触发写入，也不 mutation registry。</p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Review Handoff</h3>
              <p className="mt-1 text-xs text-stone-500">
                只交给 Phase 10U 或以后批准边界
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
            <p>next action：{handoff.nextAction}</p>
            <p>未来真实写入仍需老板另行明确授权。</p>
            <p>不会创建 production writer。</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Actual Write</p>
          <p className="mt-1">不授权真实写入 registry。</p>
          <p className="mt-1">review gate only：{gate.reviewGateOnly ? '是' : '否'}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Mutation</p>
          <p className="mt-1">不 mutation registry。</p>
          <p className="mt-1">no registry mutation：{gate.noRegistryMutation ? '是' : '否'}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Publish</p>
          <p className="mt-1">不发布到用户 App。</p>
          <p className="mt-1">not published：{gate.notPublished ? '是' : '否'}</p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Shell Replacement</p>
          <p className="mt-1">不替换当前用户 App 包。</p>
          <p className="mt-1">
            shell replacement blocked：
            {gate.noUserAppShellPackageReplacement ? '是' : '否'}
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-900">No Production Writer</p>
          <p className="mt-1">不创建 production writer。</p>
          <p className="mt-1">
            writer blocked：{gate.doesNotCreateProductionWriter ? '是' : '否'}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {reviewedSections.map((section) => (
          <div
            key={section.id}
            className="rounded-md border border-stone-200 bg-white p-3 text-xs text-stone-600"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-stone-900">{section.label}</p>
              <span
                className={`rounded-md border px-2 py-1 ${statusClass(
                  section.passed ? 'ready' : 'blocked',
                )}`}
              >
                {section.passed ? 'reviewed' : 'blocked'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {gate.blockedReasons.length > 0 ? (
        <div className="mt-3 rounded-md border border-rose-200 bg-white p-3 text-xs text-rose-800">
          <p className="font-semibold">Blocked reasons</p>
          <ul className="mt-2 grid gap-1">
            {gate.blockedReasons.slice(0, 8).map((reason) => (
              <li key={reason.id}>{reason.message}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-emerald-200 bg-white p-3 text-xs text-emerald-900">
          可进入未来真实写入批准边界；这仍然不是实际 registry 写入，不是 registry mutation，不是发布，不是 production writer。
        </div>
      )}

      <details className="mt-3 rounded-md border border-emerald-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看 gate checks / checklist / handoff details
        </summary>
        <div className="mt-3 grid gap-4 text-xs text-stone-600 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-stone-900">Gate checks</h3>
            <ul className="mt-2 grid gap-1">
              {gate.checks.slice(0, 16).map((check) => (
                <li key={check.id}>
                  {check.id}: {check.passed ? 'pass' : 'blocked'}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Checklist items</h3>
            <ul className="mt-2 grid gap-1">
              {checklist.items.map((item) => (
                <li key={item.id}>
                  {item.label}: {item.status}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Handoff notes</h3>
            <ul className="mt-2 grid gap-1">
              {handoff.notes.slice(0, 8).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </section>
  );
}
