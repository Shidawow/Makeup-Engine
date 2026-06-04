import type {
  UserAvailableTimePreference,
  UserComfortLevel,
  UserGuidanceVerbosity,
  UserLocalPreferences,
  UserMakeupSkillLevel,
  UserOccasionPreference,
} from '../../user-app';

export interface UserPreferenceSetupPanelProps {
  preferences: UserLocalPreferences;
  onPreferencesChange: (preferences: UserLocalPreferences) => void;
}

const updateList = <T extends string>(
  items: readonly T[],
  item: T,
  selected: boolean,
): T[] =>
  selected
    ? Array.from(new Set([...items, item]))
    : items.filter((candidate) => candidate !== item);

export function UserPreferenceSetupPanel({
  preferences,
  onPreferencesChange,
}: UserPreferenceSetupPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">
          Local preferences
        </p>
        <h2 className="text-base font-semibold text-stone-950">我的本地偏好</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">
          这些偏好只影响步骤提示的表达方式，不修改模板包，不上传，不进入训练数据。
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-stone-700">
          熟练度
          <select
            className="rounded-md border border-stone-300 bg-white px-3 py-2"
            onChange={(event) =>
              onPreferencesChange({
                ...preferences,
                skillLevel: event.currentTarget.value as UserMakeupSkillLevel,
              })
            }
            value={preferences.skillLevel}
          >
            <option value="beginner">新手</option>
            <option value="intermediate">有一点经验</option>
            <option value="advanced">熟练</option>
            <option value="unknown">暂不确定</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-stone-700">
          指导详细程度
          <select
            className="rounded-md border border-stone-300 bg-white px-3 py-2"
            onChange={(event) =>
              onPreferencesChange({
                ...preferences,
                guidanceVerbosity: event.currentTarget.value as UserGuidanceVerbosity,
              })
            }
            value={preferences.guidanceVerbosity}
          >
            <option value="concise">简洁</option>
            <option value="balanced">适中</option>
            <option value="detailed">详细</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-stone-700">
          可用时间
          <select
            className="rounded-md border border-stone-300 bg-white px-3 py-2"
            onChange={(event) =>
              onPreferencesChange({
                ...preferences,
                availableTime: event.currentTarget.value as UserAvailableTimePreference,
              })
            }
            value={preferences.availableTime}
          >
            <option value="under_5_minutes">5 分钟以内</option>
            <option value="5_to_10_minutes">5 到 10 分钟</option>
            <option value="10_to_20_minutes">10 到 20 分钟</option>
            <option value="over_20_minutes">20 分钟以上</option>
            <option value="flexible">时间灵活</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-stone-700">
          使用场景
          <select
            className="rounded-md border border-stone-300 bg-white px-3 py-2"
            onChange={(event) =>
              onPreferencesChange({
                ...preferences,
                occasion: event.currentTarget.value as UserOccasionPreference,
              })
            }
            value={preferences.occasion}
          >
            <option value="daily">日常</option>
            <option value="work">通勤</option>
            <option value="date">约会</option>
            <option value="evening">晚间</option>
            <option value="special_event">特别场合</option>
            <option value="practice">练习</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-stone-700">
          舒适程度
          <select
            className="rounded-md border border-stone-300 bg-white px-3 py-2"
            onChange={(event) =>
              onPreferencesChange({
                ...preferences,
                comfortLevel: event.currentTarget.value as UserComfortLevel,
              })
            }
            value={preferences.comfortLevel}
          >
            <option value="cautious">保守一点</option>
            <option value="normal">正常尝试</option>
            <option value="adventurous">愿意尝试更明显效果</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <fieldset className="rounded-md border border-stone-200 p-3">
          <legend className="px-1 text-sm font-medium text-stone-950">可用工具</legend>
          <div className="mt-2 grid gap-2 text-sm text-stone-700">
            {(['fingers', 'sponge', 'brush', 'lash_curler', 'brow_pencil', 'cotton_swab'] as const).map(
              (tool) => (
                <label key={tool} className="flex items-center gap-2">
                  <input
                    checked={preferences.availableTools.includes(tool)}
                    onChange={(event) =>
                      onPreferencesChange({
                        ...preferences,
                        availableTools: updateList(
                          preferences.availableTools,
                          tool,
                          event.currentTarget.checked,
                        ),
                      })
                    }
                    type="checkbox"
                  />
                  {tool}
                </label>
              ),
            )}
          </div>
        </fieldset>

        <fieldset className="rounded-md border border-stone-200 p-3">
          <legend className="px-1 text-sm font-medium text-stone-950">偏好风格</legend>
          <div className="mt-2 grid gap-2 text-sm text-stone-700">
            {(['natural', 'soft', 'polished', 'glowy', 'bold', 'minimal'] as const).map(
              (tag) => (
                <label key={tag} className="flex items-center gap-2">
                  <input
                    checked={preferences.preferredStyleTags.includes(tag)}
                    onChange={(event) =>
                      onPreferencesChange({
                        ...preferences,
                        preferredStyleTags: updateList(
                          preferences.preferredStyleTags,
                          tag,
                          event.currentTarget.checked,
                        ),
                      })
                    }
                    type="checkbox"
                  />
                  {tag}
                </label>
              ),
            )}
          </div>
        </fieldset>
      </div>
    </section>
  );
}
