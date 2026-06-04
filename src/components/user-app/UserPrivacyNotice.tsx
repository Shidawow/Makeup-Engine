export function UserPrivacyNotice() {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">Privacy boundary</p>
        <h2 className="text-base font-semibold text-stone-950">隐私说明</h2>
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-stone-700">
        <li>当前版本不采集真实用户照片。</li>
        <li>当前版本不上传照片，不做人脸识别，不生成 face embedding。</li>
        <li>当前版本不把用户照片用于训练，也不写入模板包或 project-state。</li>
        <li>照片相关能力都只是未来阶段的占位边界。</li>
      </ul>
    </section>
  );
}
