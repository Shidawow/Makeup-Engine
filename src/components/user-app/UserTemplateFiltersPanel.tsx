import type {
  UserTemplateDiscoverySortMode,
  UserTemplateDiscoveryState,
} from '../../user-app';
import { createInitialTemplateDiscoveryState } from '../../user-app';

export interface UserTemplateFiltersPanelProps {
  state: UserTemplateDiscoveryState;
  onStateChange?: (state: UserTemplateDiscoveryState) => void;
  availableStyleTags: string[];
  availableOccasions: string[];
}

const sortOptions: Array<{ id: UserTemplateDiscoverySortMode; label: string }> = [
  { id: 'recommended', label: '推荐优先' },
  { id: 'shortest_duration', label: '时间最短' },
  { id: 'easiest', label: '最容易上手' },
  { id: 'most_steps', label: '步骤最多' },
  { id: 'style_match', label: '风格匹配' },
];

export function UserTemplateFiltersPanel({
  state,
  onStateChange,
  availableStyleTags,
  availableOccasions,
}: UserTemplateFiltersPanelProps) {
  const updateSort = (sortMode: UserTemplateDiscoverySortMode) => {
    onStateChange?.({
      ...state,
      sortMode,
    });
  };

  const toggleStyle = (tag: string) => {
    const hasTag = state.filter.styleTags.includes(tag);
    onStateChange?.({
      ...state,
      filter: {
        ...state.filter,
        styleTags: hasTag
          ? state.filter.styleTags.filter((item) => item !== tag)
          : [...state.filter.styleTags, tag],
      },
    });
  };

  const toggleOccasion = (occasion: string) => {
    const hasOccasion = state.filter.suitableOccasions.includes(occasion);
    onStateChange?.({
      ...state,
      filter: {
        ...state.filter,
        suitableOccasions: hasOccasion
          ? state.filter.suitableOccasions.filter((item) => item !== occasion)
          : [...state.filter.suitableOccasions, occasion],
      },
    });
  };

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Filters</p>
          <h3 className="text-base font-semibold text-stone-950">筛选与排序</h3>
        </div>
        <button
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs text-stone-700"
          onClick={() =>
            onStateChange?.(
              createInitialTemplateDiscoveryState({
                preferredStyleTags: state.preferredStyleTags,
              }),
            )
          }
          type="button"
        >
          重置
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <button
            className={`rounded-md border px-3 py-2 text-xs ${
              state.sortMode === option.id
                ? 'border-teal-700 bg-teal-50 text-teal-900'
                : 'border-stone-300 bg-white text-stone-700'
            }`}
            key={option.id}
            onClick={() => updateSort(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold text-stone-600">风格</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableStyleTags.slice(0, 8).map((tag) => (
              <button
                className={`rounded-md border px-2 py-1 text-xs ${
                  state.filter.styleTags.includes(tag)
                    ? 'border-teal-700 bg-teal-50 text-teal-900'
                    : 'border-stone-300 bg-white text-stone-700'
                }`}
                key={tag}
                onClick={() => toggleStyle(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-stone-600">场景</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableOccasions.slice(0, 8).map((occasion) => (
              <button
                className={`rounded-md border px-2 py-1 text-xs ${
                  state.filter.suitableOccasions.includes(occasion)
                    ? 'border-teal-700 bg-teal-50 text-teal-900'
                    : 'border-stone-300 bg-white text-stone-700'
                }`}
                key={occasion}
                onClick={() => toggleOccasion(occasion)}
                type="button"
              >
                {occasion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
