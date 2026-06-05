import { Check, Copy, Download, Save, Upload } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import { useJsonPanel } from '../runtime/useMakeupRuntime';

export function JsonPreview() {
  const {
    json,
    validation,
    savedAt,
    message,
    copied,
    setCopied,
    saveTemplate,
    loadSavedTemplate,
    importTemplateJson,
    downloadTemplate,
  } = useJsonPanel();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const copyJson = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const importJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await importTemplateJson(await file.text());
    event.target.value = '';
  };

  return (
    <div className="flex h-full min-h-[520px] flex-col text-stone-100">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold">JSON 预览</h2>
          <p className="text-xs text-stone-400">
            {validation.valid
              ? '当前模板符合 engine schema'
              : `发现 ${validation.issues.length} 个校验问题`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-stone-100 transition hover:bg-white/15"
            onClick={saveTemplate}
            title="保存模板"
            type="button"
          >
            <Save aria-hidden="true" size={16} />
          </button>
          <button
            className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-stone-100 transition hover:bg-white/15"
            onClick={loadSavedTemplate}
            title="载入本地保存"
            type="button"
          >
            <Upload aria-hidden="true" size={16} />
          </button>
          <button
            className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-stone-100 transition hover:bg-white/15"
            onClick={copyJson}
            title="复制 JSON"
            type="button"
          >
            {copied ? (
              <Check aria-hidden="true" size={16} />
            ) : (
              <Copy aria-hidden="true" size={16} />
            )}
          </button>
          <button
            className="grid h-9 w-9 place-items-center rounded-md bg-teal-500 text-white transition hover:bg-teal-400"
            onClick={downloadTemplate}
            title="导出 JSON"
            type="button"
          >
            <Download aria-hidden="true" size={16} />
          </button>
          <button
            className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-stone-100 transition hover:bg-white/15"
            onClick={() => inputRef.current?.click()}
            title="导入 JSON 文件"
            type="button"
          >
            <Upload aria-hidden="true" size={16} />
          </button>
          <input
            accept="application/json"
            className="hidden"
            onChange={importJson}
            ref={inputRef}
            type="file"
          />
        </div>
      </div>

      {message || savedAt ? (
        <div className="border-b border-white/10 px-5 py-2 text-xs text-teal-200">
          {message ? <p>{message.text}</p> : null}
          {savedAt ? <p>上次保存：{new Date(savedAt).toLocaleString()}</p> : null}
        </div>
      ) : null}

      {!validation.valid ? (
        <div className="max-h-28 overflow-auto border-b border-white/10 px-5 py-2 text-xs text-rose-200">
          {validation.issues.slice(0, 5).map((issue) => (
            <p key={`${issue.path}-${issue.message}`}>
              {issue.path}: {issue.message}
            </p>
          ))}
        </div>
      ) : null}

      <pre className="min-h-0 flex-1 overflow-auto p-5 text-[12px] leading-5 text-stone-200">
        <code>{json}</code>
      </pre>
    </div>
  );
}
