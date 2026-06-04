import { useMemo, useState } from 'react';
import type { UserAppTemplatePackage } from '../../templates/schema';
import type { UserLocalPreferences, UserTemplateRecommendation } from '../../user-app';
import {
  createInitialTemplateDiscoveryState,
  createTemplateDiscoveryResult,
  createTemplateRecommendations,
  filterTemplatesForDiscovery,
  sortTemplatesForDiscovery,
  summarizeTemplateDiscoveryResults,
  summarizeTemplateRecommendations,
  type UserTemplateDiscoveryState,
} from '../../user-app';
import { UserRecommendationReasonPanel } from './UserRecommendationReasonPanel';
import { UserRecommendedTemplateList } from './UserRecommendedTemplateList';
import { UserTemplateFiltersPanel } from './UserTemplateFiltersPanel';

export interface UserTemplateDiscoveryPanelProps {
  packageData?: UserAppTemplatePackage | null;
  preferences: UserLocalPreferences;
  selectedTemplateId?: string;
  onSelectTemplate?: (templateId: string) => void;
  discoveryState?: UserTemplateDiscoveryState;
  onDiscoveryStateChange?: (state: UserTemplateDiscoveryState) => void;
}

const uniqueStrings = (items: readonly string[]): string[] => Array.from(new Set(items)).sort();

export function UserTemplateDiscoveryPanel({
  packageData,
  preferences,
  selectedTemplateId,
  onSelectTemplate,
  discoveryState: controlledDiscoveryState,
  onDiscoveryStateChange,
}: UserTemplateDiscoveryPanelProps) {
  const [internalState, setInternalState] = useState<UserTemplateDiscoveryState>(() =>
    createInitialTemplateDiscoveryState({
      preferredStyleTags: preferences.preferredStyleTags,
    }),
  );
  const state = controlledDiscoveryState ?? internalState;
  const setState = (nextState: UserTemplateDiscoveryState) => {
    if (!controlledDiscoveryState) {
      setInternalState(nextState);
    }
    onDiscoveryStateChange?.(nextState);
  };
  const discoveryState = useMemo(
    () => ({
      ...state,
      preferredStyleTags: preferences.preferredStyleTags,
    }),
    [preferences.preferredStyleTags, state],
  );
  const allResults = useMemo(
    () =>
      packageData?.templates.map((template) =>
        createTemplateDiscoveryResult({
          template,
          preferredStyleTags: preferences.preferredStyleTags,
        }),
      ) ?? [],
    [packageData, preferences.preferredStyleTags],
  );
  const filteredResults = useMemo(
    () =>
      sortTemplatesForDiscovery(
        filterTemplatesForDiscovery({
          packageData,
          state: discoveryState,
        }),
        discoveryState.sortMode,
      ),
    [discoveryState, packageData],
  );
  const recommendations = useMemo(
    () =>
      createTemplateRecommendations({
        packageData,
        preferences,
        discoveryResults: allResults,
        maxRecommendations: 4,
        localOnly: true,
        ruleBased: true,
        usesAiApi: false,
        writesTrainingInput: false,
        modifiesTemplatePackage: false,
        writesProjectState: false,
      }),
    [allResults, packageData, preferences],
  );
  const selectedRecommendation =
    recommendations.find((recommendation) => recommendation.appTemplateId === selectedTemplateId) ??
    recommendations[0] ??
    null;
  const discoverySummary = summarizeTemplateDiscoveryResults({
    packageData,
    results: filteredResults,
    state: discoveryState,
  });
  const recommendationSummary = summarizeTemplateRecommendations({
    recommendations,
    allResults,
  });
  const styleTags = uniqueStrings(allResults.flatMap((result) => result.styleTags));
  const occasions = uniqueStrings(allResults.flatMap((result) => result.suitableOccasions));
  const blockedResults = allResults.filter((result) => result.status === 'blocked');

  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase text-teal-700">Phase 7E discovery</p>
        <h2 className="text-lg font-semibold text-stone-950">发现妆容 / 推荐给我</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          这里使用本地规则和非敏感偏好做模板发现占位，不调用 AI API，不上传数据，不创建用户画像，也不修改模板包。
        </p>
        <div className="mt-3 grid gap-2 text-sm text-stone-700 sm:grid-cols-3">
          <div className="rounded-md bg-stone-50 px-3 py-2">
            可见模板：{discoverySummary.visibleTemplates}/{discoverySummary.totalTemplates}
          </div>
          <div className="rounded-md bg-stone-50 px-3 py-2">
            推荐候选：{recommendationSummary.recommendedTemplates}
          </div>
          <div className="rounded-md bg-stone-50 px-3 py-2">
            不可用模板：{discoverySummary.blockedTemplates}
          </div>
        </div>
      </div>

      <UserTemplateFiltersPanel
        availableOccasions={occasions}
        availableStyleTags={styleTags}
        onStateChange={setState}
        state={discoveryState}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)]">
        <div className="grid gap-4">
          <section className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-teal-700">
                  Recommended
                </p>
                <h3 className="text-base font-semibold text-stone-950">推荐给我</h3>
              </div>
              <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-600">
                local-only / rule-based
              </span>
            </div>
            <div className="mt-3">
              <UserRecommendedTemplateList
                onSelectTemplate={onSelectTemplate}
                recommendations={recommendations}
                selectedTemplateId={selectedTemplateId}
              />
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-teal-700">All templates</p>
            <h3 className="text-base font-semibold text-stone-950">全部模板</h3>
            {filteredResults.length > 0 ? (
              <div className="mt-3 grid gap-3">
                {filteredResults.map((result) => (
                  <article
                    className="rounded-md border border-stone-200 bg-stone-50 p-3"
                    key={result.appTemplateId}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-stone-950">{result.title}</h4>
                        <p className="mt-1 text-sm text-stone-600">{result.subtitle}</p>
                      </div>
                      <span className="rounded-md bg-white px-2 py-1 text-xs text-stone-600">
                        {result.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-stone-600">
                      {result.difficulty} / {result.estimatedDurationMinutes} 分钟 /{' '}
                      {result.stepCount} 步
                    </p>
                    <button
                      className="mt-3 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700"
                      disabled={result.status === 'blocked'}
                      onClick={() => onSelectTemplate?.(result.appTemplateId)}
                      type="button"
                    >
                      {result.status === 'blocked' ? '暂不可用' : '查看详情'}
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-600">
                当前筛选下没有模板。可以重置筛选或查看不可用模板原因。
              </div>
            )}
          </section>
        </div>

        <div className="grid content-start gap-4">
          <UserRecommendationReasonPanel recommendation={selectedRecommendation} />
          {blockedResults.length > 0 ? (
            <section className="rounded-lg border border-rose-200 bg-rose-50 p-4">
              <p className="text-xs font-semibold uppercase text-rose-700">Blocked</p>
              <h3 className="text-base font-semibold text-stone-950">不可用模板</h3>
              <div className="mt-3 grid gap-3">
                {blockedResults.map((result) => (
                  <div className="rounded-md bg-white p-3 text-sm" key={result.appTemplateId}>
                    <p className="font-semibold text-stone-900">{result.title}</p>
                    <p className="mt-1 text-rose-800">
                      {result.blockingMessages[0] ?? '缺少必要信息，暂时不能推荐。'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}
