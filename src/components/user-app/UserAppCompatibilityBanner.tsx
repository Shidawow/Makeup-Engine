import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { UserAppCompatibilityViewModel } from '../../user-app';

export interface UserAppCompatibilityBannerProps {
  compatibility: UserAppCompatibilityViewModel;
}

const statusText: Record<string, string> = {
  ready: '可以开始指导',
  warning: '可以预览，有提醒',
  blocked: '暂时不能指导',
  empty: '未加载模板包',
};

const friendlyCopy = (message: string): string =>
  [
    ['UserAppTemplatePackage', '本地妆容包'],
    ['contract-driven prototype', '本地预览'],
    ['contract', '内容'],
    ['object URL', '临时图片链接'],
    ['large image bytes', '大图内容'],
    ['image bytes', '图片内容'],
    ['React state', '界面状态'],
  ].reduce((copy, [from, to]) => copy.split(from).join(to), message);

export function UserAppCompatibilityBanner({
  compatibility,
}: UserAppCompatibilityBannerProps) {
  const blocked = compatibility.status === 'blocked' || compatibility.status === 'empty';
  const Icon = blocked
    ? ShieldAlert
    : compatibility.status === 'warning'
      ? AlertTriangle
      : CheckCircle2;

  return (
    <section
      className={`rounded-lg border p-3 ${
        blocked
          ? 'border-rose-200 bg-rose-50 text-rose-950'
          : compatibility.status === 'warning'
            ? 'border-amber-200 bg-amber-50 text-amber-950'
            : 'border-teal-200 bg-teal-50 text-teal-950'
      }`}
    >
      <div className="flex items-start gap-2">
        <Icon aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">指导可用性检查</h3>
            <span className="rounded bg-white/70 px-2 py-0.5 text-xs font-medium">
              {statusText[compatibility.status]}
            </span>
            {compatibility.target ? (
              <span className="rounded bg-white/70 px-2 py-0.5 text-xs">
                移动 Web
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-5">
            {friendlyCopy(compatibility.localOnlyDisclaimer)}
          </p>
          <p className="mt-1 text-xs font-medium leading-5">
            {friendlyCopy(compatibility.nextAction)}
          </p>
        </div>
      </div>

      {compatibility.blockingIssues.length > 0 ? (
        <ul className="mt-3 grid gap-2 text-xs leading-5">
          {compatibility.blockingIssues.map((issue) => (
            <li className="rounded bg-white/60 p-2" key={issue}>
              阻断：{friendlyCopy(issue)}
            </li>
          ))}
        </ul>
      ) : null}

      {compatibility.warnings.length > 0 ? (
        <ul className="mt-3 grid gap-2 text-xs leading-5">
          {compatibility.warnings.map((warning) => (
            <li className="rounded bg-white/60 p-2" key={warning}>
              提醒：{friendlyCopy(warning)}
            </li>
          ))}
        </ul>
      ) : null}

      {compatibility.runtimeReferenceIssues.length === 0 ? (
        <p className="mt-3 text-xs leading-5">
          未发现临时图片链接、本机路径、大图内容或界面状态。
        </p>
      ) : (
        <ul className="mt-3 grid gap-2 text-xs leading-5">
          {compatibility.runtimeReferenceIssues.map((issue) => (
            <li className="rounded bg-white/60 p-2" key={issue}>
              运行时引用：{issue}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
