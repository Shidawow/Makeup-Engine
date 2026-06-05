import { ImageUp, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { ChangeEvent } from 'react';
import { useDemoStore } from '../../store/demoStore';

const recommendationLabels = {
  foundation: '底妆',
  eyeliner: '眼线',
  contour: '修容',
  blush: '腮红',
  lipstick: '唇妆',
} as const;

const featureLabels: Record<string, string> = {
  faceShape: '脸型',
  skinType: '肤质',
  skinTone: '肤色调',
  eyeType: '眼型',
  lipShape: '唇形',
};

const valueLabels: Record<string, string> = {
  round: '圆脸',
  oval: '鹅蛋脸',
  square: '方脸',
  heart: '心形脸',
  oily: '油性',
  dry: '干性',
  combination: '混合性',
  warm: '暖调',
  cool: '冷调',
  neutral: '中性调',
  monolid: '单眼皮',
  hooded: '肿泡/内双眼',
  double: '双眼皮',
  thin: '薄唇',
  full: '饱满唇',
  matte: '哑光',
  hydrating: '保湿',
  satin: '缎光',
};

const logLevelLabels: Record<string, string> = {
  info: '信息',
  warn: '提醒',
  error: '错误',
};

const logMessageLabels: Record<string, string> = {
  'Mock face analysis completed.': '模拟人脸分析已完成。',
  'Makeup engine pipeline executed.': '化妆引擎流水线已执行。',
  'Recommendation scoring completed.': '推荐评分已完成。',
  'Runtime renderer completed local preview frame.': '运行时渲染器已完成本地预览帧。',
};

const formatLogMessage = (message: string) => {
  const loadedPrefix = 'Loaded local photo input: ';

  if (message.startsWith(loadedPrefix)) {
    return `已载入本地照片输入：${message.slice(loadedPrefix.length)}`;
  }

  return logMessageLabels[message] ?? message;
};

const formatRecommendationValue = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value ? '建议使用' : '可跳过';
  }

  if (typeof value === 'string') {
    return valueLabels[value] ?? value;
  }

  return '中性';
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const percent = Math.round(value * 100);

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-stone-500">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-teal-600" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function MakeupDemo() {
  const photo = useDemoStore((state) => state.photo);
  const result = useDemoStore((state) => state.result);
  const logs = useDemoStore((state) => state.logs);
  const loading = useDemoStore((state) => state.loading);
  const error = useDemoStore((state) => state.error);
  const setPhoto = useDemoStore((state) => state.setPhoto);
  const analyze = useDemoStore((state) => state.analyze);
  const reset = useDemoStore((state) => state.reset);

  const onPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhoto({
      fileName: file.name,
      size: file.size,
      type: file.type || 'image/unknown',
      previewUrl: URL.createObjectURL(file),
    });
  };

  const recommendation = result?.styleInference.recommendation;

  return (
    <main className="min-h-screen bg-[#f8f7f4] p-4 text-stone-950 sm:p-6">
      <div className="mx-auto grid max-w-6xl gap-4">
        <header className="border-b border-stone-200 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
            AI 化妆引擎 MVP
          </p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
            本地妆容推荐演示
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            上传一张本地图片作为输入，运行本地模拟人脸分析，并通过引擎流水线输出结构化妆容建议。
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">照片输入</h2>
                  <p className="text-xs text-stone-500">仅在本地运行的模拟分析输入。</p>
                </div>
                <ImageUp aria-hidden="true" className="text-teal-700" size={20} />
              </div>

              <label className="mt-4 grid min-h-64 cursor-pointer place-items-center rounded-md border border-dashed border-stone-300 bg-stone-50 p-4 text-center transition hover:border-teal-400 hover:bg-teal-50/40">
                {photo?.previewUrl ? (
                  <img
                    alt="已上传图片预览"
                    className="max-h-56 rounded-md object-contain"
                    src={photo.previewUrl}
                  />
                ) : (
                  <div className="grid gap-2">
                    <ImageUp aria-hidden="true" className="mx-auto text-stone-400" size={28} />
                    <p className="text-sm font-medium text-stone-700">上传图片占位</p>
                    <p className="text-xs text-stone-500">
                      文件名可包含 dry、cool、oval、mono、thin 等词，用来触发不同的模拟分析结果。
                    </p>
                  </div>
                )}
                <input accept="image/*" className="hidden" onChange={onPhotoChange} type="file" />
              </label>

              {photo ? (
                <div className="mt-3 rounded-md bg-stone-50 p-3 text-xs leading-5 text-stone-600">
                  <p>{photo.fileName}</p>
                  <p>{photo.type} · {photo.size} 字节</p>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                  onClick={analyze}
                  type="button"
                >
                  {loading ? (
                    <Loader2 aria-hidden="true" className="animate-spin" size={16} />
                  ) : (
                    <Sparkles aria-hidden="true" size={16} />
                  )}
                  分析妆容
                </button>
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  onClick={reset}
                  type="button"
                >
                  <RotateCcw aria-hidden="true" size={16} />
                  重置
                </button>
              </div>

              {error ? (
                <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
              <h2 className="text-base font-semibold">流水线日志</h2>
              <div className="mt-3 max-h-64 overflow-auto rounded-md bg-stone-950 p-3 text-xs leading-5 text-stone-100">
                {logs.length > 0 ? (
                  logs.map((entry) => (
                    <p key={entry.id}>
                      <span className="text-teal-300">[{logLevelLabels[entry.level] ?? entry.level}]</span>{' '}
                      {formatLogMessage(entry.message)}
                    </p>
                  ))
                ) : (
                  <p className="text-stone-400">暂无流水线日志。</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
              <h2 className="text-base font-semibold">分析结果</h2>
              {result ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Object.entries(result.faceAnalysis.features).map(([key, value]) => (
                    <div className="rounded-md bg-stone-50 p-3" key={key}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                        {featureLabels[key] ?? key}
                      </p>
                      <p className="mt-1 text-sm font-medium text-stone-900">
                        {valueLabels[String(value)] ?? String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-stone-500">运行分析后可查看人脸特征。</p>
              )}
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
              <h2 className="text-base font-semibold">推荐卡片</h2>
              {recommendation ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Object.entries(recommendationLabels).map(([key, label]) => {
                    const value = recommendation[key as keyof typeof recommendationLabels];

                    return (
                      <div className="rounded-md border border-stone-200 bg-stone-50 p-3" key={key}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                          {label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-stone-900">
                          {formatRecommendationValue(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-stone-500">妆容建议会显示在这里。</p>
              )}
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
              <h2 className="text-base font-semibold">评分可视化</h2>
              {result ? (
                <div className="mt-4 grid gap-4">
                  <ScoreBar label="推荐置信度" value={result.recommendationScore.confidence} />
                  <ScoreBar label="美妆评分" value={result.beautyScore.score} />
                  <ScoreBar label="肤质平衡" value={result.beautyScore.dimensions.skinBalance} />
                  <ScoreBar label="眼部清晰度" value={result.beautyScore.dimensions.eyeDefinition} />
                </div>
              ) : (
                <p className="mt-3 text-sm text-stone-500">分析完成后会显示评分。</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
