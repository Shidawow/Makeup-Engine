import { Check, Copy, Download, Upload } from 'lucide-react';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { downloadTemplateJson, toTemplateJson } from '../utils/jsonExport';
import { isMakeupTemplate } from '../utils/templateValidation';

export function JsonPreview() {
  const template = useTemplateStore((state) => state.template);
  const importTemplate = useTemplateStore((state) => state.importTemplate);
  const json = useMemo(() => toTemplateJson(template), [template]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [importMessage, setImportMessage] = useState('');

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

    try {
      const parsed = JSON.parse(await file.text()) as unknown;

      if (!isMakeupTemplate(parsed)) {
        setImportMessage('无效的妆容模板 JSON。');
        return;
      }

      importTemplate(parsed);
      setImportMessage(`已导入：${parsed.metadata.name}。`);
    } catch {
      setImportMessage('无法解析所选 JSON。');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="flex h-full min-h-[520px] flex-col text-stone-100">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold">JSON 预览</h2>
          <p className="text-xs text-stone-400">可导出的模板数据</p>
        </div>
        <div className="flex gap-2">
          <button
            className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-stone-100 transition hover:bg-white/15"
            onClick={copyJson}
            title="复制 JSON"
            type="button"
          >
            {copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
          </button>
          <button
            className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-stone-100 transition hover:bg-white/15"
            onClick={() => downloadTemplateJson(template)}
            title="下载 JSON"
            type="button"
          >
            <Download aria-hidden="true" size={16} />
          </button>
          <button
            className="grid h-9 w-9 place-items-center rounded-md bg-teal-500 text-white transition hover:bg-teal-400"
            onClick={() => inputRef.current?.click()}
            title="导入 JSON"
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

      {importMessage ? (
        <p className="border-b border-white/10 px-5 py-2 text-xs text-teal-200">
          {importMessage}
        </p>
      ) : null}

      <pre className="min-h-0 flex-1 overflow-auto p-5 text-[12px] leading-5 text-stone-200">
        <code>{json}</code>
      </pre>
    </div>
  );
}
