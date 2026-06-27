import { AlertTriangle, CheckCircle2, MonitorSmartphone, ShieldCheck } from 'lucide-react';

const demoPathChecks = [
  '打开本地页面并默认进入 User App MVP',
  '查看模板选择和本地示例妆容',
  '进入妆容详情并查看步骤预览',
  '进入开始前准备并确认工具 checklist',
  '开始分步骤跟练',
  '使用上一步 / 下一步 / 完成本步骤',
  '完成本次妆容并查看步骤回顾',
  '重新开始或返回模板选择',
];

const operatorQaChecks = [
  '普通用户路径不显示后台写入、发布、模拟器或生产术语',
  '移动端宽度下核心按钮和卡片可见',
  '隐私文案继续说明本地-only、不上传、不训练',
  'Vision Analysis 仍显示检测可用性评分',
  'Template Studio 只在后台路径中使用',
  'MediaPipe 真实资源只作为本地 ignored 运行资源',
];

const knownLimitations = [
  '当前是本地 MVP shell，不是生产 App',
  '无后端、账号、数据库、支付、相机或 AR',
  '无 OpenAI / external AI API，也不训练模型',
  '不上传真实用户图片，不保存真实用户资料',
  '本地示例模板仍是 fixture/demo 内容',
  'Photo-to-template 仍是半自动草稿链路，不是完全自动高质量提取',
  'Readiness Score 是规则评分，不是模型原始置信度',
];

export function UserAppDemoReadinessPanel() {
  return (
    <section className="rounded-lg border border-teal-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-teal-700">Operator QA</p>
          <h2 className="text-lg font-semibold text-stone-950">
            User App Demo Readiness
          </h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            仅用于管理员演示验收：确认当前本地 MVP shell 可以被演示、复盘和测试。
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1 rounded bg-teal-100 px-2 py-1 text-xs font-semibold text-teal-900">
          <CheckCircle2 aria-hidden="true" size={14} />
          本地 demo 可验收
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <div className="flex items-center gap-2">
            <MonitorSmartphone aria-hidden="true" className="text-teal-700" size={18} />
            <h3 className="text-sm font-semibold text-stone-900">推荐演示路径</h3>
          </div>
          <ol className="mt-3 grid gap-2 text-sm leading-6 text-stone-700">
            {demoPathChecks.map((check, index) => (
              <li className="flex gap-2" key={check}>
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-900">
                  {index + 1}
                </span>
                <span>{check}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="text-teal-700" size={18} />
            <h3 className="text-sm font-semibold text-stone-900">Operator QA checklist</h3>
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-stone-700">
            {operatorQaChecks.map((check) => (
              <li className="flex gap-2" key={check}>
                <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-teal-700" size={14} />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle aria-hidden="true" className="text-amber-700" size={18} />
            <h3 className="text-sm font-semibold text-stone-900">当前限制</h3>
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-stone-700">
            {knownLimitations.map((limitation) => (
              <li className="flex gap-2" key={limitation}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 bg-stone-950 p-3 text-sm leading-6 text-white">
        Registry chain paused after Phase 10U. Phase 11D 不执行真实写入、不发布、不替换当前
        User App Shell package，也不创建 production writer。
      </div>
    </section>
  );
}
