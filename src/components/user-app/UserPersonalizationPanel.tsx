import type { UserPersonalizationPlaceholder } from '../../user-app';

export interface UserPersonalizationPanelProps {
  personalization: UserPersonalizationPlaceholder;
}

export function UserPersonalizationPanel({
  personalization,
}: UserPersonalizationPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Placeholder profile</p>
          <h2 className="text-base font-semibold text-stone-950">个性化占位</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            这里只展示轻量的本地偏好提示，不保存敏感信息、照片或生物识别数据。
          </p>
        </div>
        <span className="rounded-md bg-stone-100 px-3 py-1 text-xs text-stone-600">
          {personalization.readiness.ready ? 'placeholder ready' : 'placeholder blocked'}
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <dl className="grid gap-3 sm:grid-cols-2">
          {personalization.preferences.map((preference) => (
            <div key={preference.preferenceId} className="rounded-md border border-stone-200 p-3">
              <dt className="text-xs font-semibold uppercase text-stone-500">{preference.label}</dt>
              <dd className="mt-1 text-sm font-medium text-stone-900">{preference.value}</dd>
            </div>
          ))}
        </dl>

        <div className="rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
          <p className="font-medium">个性化边界</p>
          <p>不推断敏感属性，不写入训练集，不导出用户档案，不修改模板本体。</p>
        </div>
      </div>
    </section>
  );
}
