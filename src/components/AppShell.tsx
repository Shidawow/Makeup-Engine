import { JsonPreview } from './JsonPreview';
import { RegionEditor } from './RegionEditor';
import { Sidebar } from './Sidebar';
import { StepEditor } from './StepEditor';
import { TemplateEditor } from './TemplateEditor';

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-stone-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-2 border-b border-stone-200 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                Makeup Engine v0.1
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-stone-950 sm:text-3xl">
                结构化妆容模板编辑器
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-stone-600">
              编辑妆容区域、步骤说明与动作 DSL，并实时生成可导出的 JSON。
            </p>
          </div>

          <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(320px,1fr)_minmax(360px,1.1fr)] 2xl:grid-cols-[minmax(340px,0.95fr)_minmax(380px,1fr)_minmax(380px,1fr)]">
            <section className="min-w-0 rounded-lg border border-stone-200 bg-white/85 shadow-soft">
              <TemplateEditor />
            </section>
            <section className="grid min-w-0 gap-4">
              <RegionEditor />
              <StepEditor />
            </section>
            <section className="min-w-0 rounded-lg border border-stone-200 bg-[#20201d] shadow-soft">
              <JsonPreview />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
