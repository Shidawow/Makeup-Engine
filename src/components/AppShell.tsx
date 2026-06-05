import { useState } from 'react';
import { TemplateStudio } from './template-studio/TemplateStudio';
import { VisionAnalysisDemo } from './demo/vision-analysis-demo';

export function AppShell() {
  const [screen, setScreen] = useState<'studio' | 'vision'>('vision');

  return (
    <div>
      <nav className="border-b border-stone-200 bg-white px-4 py-2">
        <div className="mx-auto flex max-w-[1680px] flex-wrap gap-2">
          <button
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              screen === 'vision'
                ? 'bg-stone-950 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
            onClick={() => setScreen('vision')}
            type="button"
          >
            视觉分析
          </button>
          <button
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              screen === 'studio'
                ? 'bg-stone-950 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
            onClick={() => setScreen('studio')}
            type="button"
          >
            模板工作台
          </button>
        </div>
      </nav>
      {screen === 'vision' ? <VisionAnalysisDemo /> : <TemplateStudio />}
    </div>
  );
}
