export function UserPrivacyNotice() {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">隐私边界</p>
        <h2 className="text-base font-semibold text-stone-950">隐私说明</h2>
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-stone-700">
        <li>当前版本不采集真实用户照片。</li>
        <li>当前版本不上传照片，不做人脸识别，不生成人脸向量或生物识别编号。</li>
        <li>当前版本不会把用户照片、偏好、会话或推荐记录用于训练。</li>
        <li>当前版本不会保存临时图片链接、图片编码、本地路径或照片文件内容。</li>
        <li>照片相关能力只是未来阶段的占位边界；Phase 7H 只做本地浏览器和移动端 QA。</li>
      </ul>
    </section>
  );
}
