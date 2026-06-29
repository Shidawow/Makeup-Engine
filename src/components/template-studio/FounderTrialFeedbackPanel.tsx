import type { FounderTrialFeedbackReport } from '../../template-engine';

export interface FounderTrialFeedbackPanelProps {
  report: FounderTrialFeedbackReport;
}

const severityClass = (severity: string): string => {
  if (severity === 'blocker' || severity === 'high') {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  if (severity === 'medium') return 'border-amber-200 bg-amber-50 text-amber-900';
  return 'border-teal-100 bg-teal-50 text-teal-900';
};

export function FounderTrialFeedbackPanel({
  report,
}: FounderTrialFeedbackPanelProps) {
  return (
    <section className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-indigo-950">
            Founder Trial Feedback Capture
          </h2>
          <p className="mt-1 text-xs leading-5 text-indigo-900">
            Founder/internal feedback，不是真实用户调研。
          </p>
          <p className="mt-1 text-xs leading-5 text-indigo-900">
            不采集真实用户个人信息；不保存真实照片；不是 analytics；不能写 registry / 不能 publish。
          </p>
        </div>
        <span className="rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-900">
          internal-only
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-md border border-indigo-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Feedback boundary</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Real user research：no</p>
            <p>Personal data：{report.noPersonalData ? 'none' : 'blocked issue'}</p>
            <p>Photo storage：{report.noRealUserPhotos ? 'none' : 'blocked issue'}</p>
            <p>Analytics：{report.noAnalytics ? 'no' : 'check'}</p>
          </div>
        </div>
        <div className="rounded-md border border-indigo-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Blocked outputs</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>registry write：blocked</p>
            <p>publish：blocked</p>
            <p>production writer：blocked</p>
            <p>User App Shell replacement：blocked</p>
          </div>
        </div>
        <div className="rounded-md border border-indigo-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Feedback count</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>Entries：{report.entries.length}</p>
            <p>Recommendations：{report.recommendations.length}</p>
            <p>JSON round-trip：{report.jsonRoundTripStable ? 'stable' : 'check failed'}</p>
          </div>
        </div>
        <div className="rounded-md border border-indigo-200 bg-white p-3">
          <h3 className="text-sm font-semibold">Next phase</h3>
          <p className="mt-2 text-xs leading-5 text-stone-600">
            {report.nextRecommendedPhase}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {report.entries.map((entry) => (
          <article
            className={`rounded-md border p-3 ${severityClass(entry.severity)}`}
            key={entry.feedbackId}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold">{entry.summary}</h3>
                <p className="mt-1 text-xs leading-5">{entry.detail}</p>
              </div>
              <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-semibold">
                {entry.sentiment} / {entry.severity}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <span>category：{entry.category}</span>
              <span>source：{entry.source}</span>
              <span>linked gap：{entry.linkedMvpGapId ?? 'none'}</span>
              <span>recommendation：{entry.recommendation}</span>
            </div>
          </article>
        ))}
      </div>

      {report.privacyIssues.length > 0 ? (
        <div className="mt-4 rounded-md border border-rose-200 bg-white p-3">
          <h3 className="text-sm font-semibold text-rose-800">Privacy issues</h3>
          <ul className="mt-2 grid gap-1 text-xs text-rose-700">
            {report.privacyIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
