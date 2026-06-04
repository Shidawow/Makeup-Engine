import type { UserTemplateRecommendation } from '../../user-app';

export interface UserRecommendedTemplateListProps {
  recommendations: UserTemplateRecommendation[];
  onSelectTemplate?: (templateId: string) => void;
  selectedTemplateId?: string;
}

export function UserRecommendedTemplateList({
  recommendations,
  onSelectTemplate,
  selectedTemplateId,
}: UserRecommendedTemplateListProps) {
  if (recommendations.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-600">
        暂时没有可推荐的妆容。你仍然可以在全部模板里查看可用模板和不可用原因。
      </section>
    );
  }

  return (
    <section className="grid gap-3">
      {recommendations.map((recommendation) => (
        <article
          className={`rounded-lg border bg-white p-4 ${
            selectedTemplateId === recommendation.appTemplateId
              ? 'border-teal-600'
              : 'border-stone-200'
          }`}
          key={recommendation.appTemplateId}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-teal-700">
                推荐 #{recommendation.rank}
              </p>
              <h3 className="text-base font-semibold text-stone-950">
                {recommendation.title}
              </h3>
              <p className="mt-1 text-sm text-stone-600">{recommendation.subtitle}</p>
            </div>
            <span className="rounded-md bg-stone-100 px-2 py-1 text-xs text-stone-600">
              {recommendation.status === 'warning' ? '有提示' : '可跟练'}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            {recommendation.whyRecommended}
          </p>
          {recommendation.warningMessages.length > 0 ? (
            <ul className="mt-3 grid gap-2 text-sm text-amber-900">
              {recommendation.warningMessages.map((warning) => (
                <li className="rounded-md bg-amber-50 px-3 py-2" key={warning}>
                  {warning}
                </li>
              ))}
            </ul>
          ) : null}
          <button
            className="mt-3 rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white"
            onClick={() => onSelectTemplate?.(recommendation.appTemplateId)}
            type="button"
          >
            查看这套妆容
          </button>
        </article>
      ))}
    </section>
  );
}
