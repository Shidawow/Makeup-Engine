import type { UserPhotoIntakePlaceholder } from '../../user-app';

export interface UserPhotoIntakePlaceholderProps {
  placeholder: UserPhotoIntakePlaceholder;
}

export function UserPhotoIntakePlaceholder({
  placeholder,
}: UserPhotoIntakePlaceholderProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Phase 7C preview</p>
          <h2 className="text-base font-semibold text-stone-950">照片输入占位</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            当前版本暂不启用自拍、相机或真实上传，但会先明确未来能力的产品和工程边界。
          </p>
        </div>
        <span className="rounded-md bg-stone-100 px-3 py-1 text-xs text-stone-600">
          {placeholder.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          本阶段不会采集、保存、上传或分析你的照片。模板步骤指导仍然可以直接使用。
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            className="rounded-md border border-stone-300 bg-stone-100 px-3 py-3 text-sm text-stone-500"
            disabled
            type="button"
          >
            上传自拍（未来版本）
          </button>
          <button
            className="rounded-md border border-stone-300 bg-stone-100 px-3 py-3 text-sm text-stone-500"
            disabled
            type="button"
          >
            开启相机（未来版本）
          </button>
        </div>

        <div className="grid gap-2 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700">
          <p className="font-medium text-stone-950">当前照片能力状态</p>
          <p>状态：{placeholder.status}</p>
          <p>可见能力：{placeholder.capabilities.join('、')}</p>
          <p>下一步：{placeholder.nextAction}</p>
        </div>

        <ul className="grid gap-2 text-sm leading-6 text-stone-700">
          {placeholder.privacyNotice.statements.map((statement) => (
            <li key={statement} className="rounded-md border border-stone-200 bg-white px-3 py-2">
              {statement}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
