import { Plus, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { useTemplateStore } from '../store/templateStore';

export function TemplateEditor() {
  const template = useTemplateStore((state) => state.template);
  const updateMetadata = useTemplateStore((state) => state.updateMetadata);
  const addStyleTag = useTemplateStore((state) => state.addStyleTag);
  const removeStyleTag = useTemplateStore((state) => state.removeStyleTag);
  const resetTemplate = useTemplateStore((state) => state.resetTemplate);
  const [tagValue, setTagValue] = useState('');

  const submitTag = () => {
    addStyleTag(tagValue);
    setTagValue('');
  };

  return (
    <div className="flex h-full min-h-[520px] flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-stone-950">模板</h2>
          <p className="text-xs text-stone-500">元数据与风格标签</p>
        </div>
        <button
          className="grid h-9 w-9 place-items-center rounded-md border border-stone-200 text-stone-600 transition hover:border-rose-300 hover:text-rose-700"
          onClick={resetTemplate}
          title="重置模板"
          type="button"
        >
          <RotateCcw aria-hidden="true" size={16} />
        </button>
      </div>

      <div className="grid gap-4 overflow-auto p-5">
        <label className="grid gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
            模板名称
          </span>
          <input
            className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-950"
            onChange={(event) => updateMetadata({ name: event.target.value })}
            value={template.metadata.name}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
              版本
            </span>
            <input
              className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm"
              onChange={(event) => updateMetadata({ version: event.target.value })}
              value={template.metadata.version}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
              作者
            </span>
            <input
              className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm"
              onChange={(event) => updateMetadata({ author: event.target.value })}
              value={template.metadata.author}
            />
          </label>
        </div>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
            描述
          </span>
          <textarea
            className="min-h-24 resize-y rounded-md border border-stone-200 bg-white px-3 py-2 text-sm leading-6"
            onChange={(event) => updateMetadata({ description: event.target.value })}
            value={template.metadata.description}
          />
        </label>

        <div className="grid gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
            风格标签
          </span>
          <div className="flex flex-wrap gap-2">
            {template.styleTags.map((tag) => (
              <span
                className="inline-flex min-h-8 items-center gap-1 rounded-md bg-rose-50 px-2.5 text-sm text-rose-900 ring-1 ring-rose-100"
                key={tag}
              >
                {tag}
                <button
                  className="grid h-5 w-5 place-items-center rounded text-rose-600 hover:bg-rose-100"
                  onClick={() => removeStyleTag(tag)}
                  title={`移除 ${tag}`}
                  type="button"
                >
                  <X aria-hidden="true" size={13} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="h-10 min-w-0 flex-1 rounded-md border border-stone-200 bg-white px-3 text-sm"
              onChange={(event) => setTagValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  submitTag();
                }
              }}
              placeholder="添加标签"
              value={tagValue}
            />
            <button
              className="grid h-10 w-10 place-items-center rounded-md bg-stone-950 text-white transition hover:bg-teal-700"
              onClick={submitTag}
              title="添加风格标签"
              type="button"
            >
              <Plus aria-hidden="true" size={17} />
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-500">
          <p>ID: {template.metadata.id}</p>
          <p>创建时间：{new Date(template.metadata.createdAt).toLocaleString()}</p>
          <p>更新时间：{new Date(template.metadata.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
