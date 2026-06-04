import type { UserAppRegionInstructionViewModel } from '../../user-app';

export interface UserRegionInstructionViewProps {
  regions: UserAppRegionInstructionViewModel[];
}

export function UserRegionInstructionView({ regions }: UserRegionInstructionViewProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">Region guidance</p>
        <h3 className="text-base font-semibold text-stone-950">上妆区域说明</h3>
      </div>

      {regions.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm leading-6 text-stone-600">
          当前模板没有区域说明。用户侧只能显示兼容性提醒，不能假装有相机或 AR 覆盖层。
        </p>
      ) : null}

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {regions.map((region) => (
          <article className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm" key={region.regionId}>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-stone-950">{region.displayName}</h4>
              <span className="rounded bg-white px-2 py-0.5 text-xs text-stone-600">
                {region.regionType}
              </span>
            </div>
            <p className="mt-2 leading-6 text-stone-700">{region.userGuidanceText}</p>
            <dl className="mt-3 grid gap-2 text-xs text-stone-600">
              <div>
                <dt className="font-medium text-stone-800">画在哪里</dt>
                <dd>{region.applicationAreaDescription}</dd>
              </div>
              <div>
                <dt className="font-medium text-stone-800">建议强度</dt>
                <dd>{region.intensityLabel}</dd>
              </div>
              <div>
                <dt className="font-medium text-stone-800">晕染方向</dt>
                <dd>{region.blendDirection}</dd>
              </div>
              <div>
                <dt className="font-medium text-stone-800">边缘和对称</dt>
                <dd>
                  {region.edgeSoftness} / {region.symmetryHint}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
