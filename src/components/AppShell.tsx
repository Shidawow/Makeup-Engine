import { useState } from 'react';
import { TemplateStudio } from './template-studio/TemplateStudio';
import { VisionAnalysisDemo } from './demo/vision-analysis-demo';
import { UserAppShell } from './user-app';
import { userAppMvpShellExamplePackage } from '../templates/examples';

export function AppShell() {
  const [screen, setScreen] = useState<'studio' | 'user-app' | 'vision'>('user-app');

  const navItems: Array<{ label: string; screen: 'studio' | 'user-app' | 'vision' }> = [
    { label: '用户 App 预览', screen: 'user-app' },
    { label: '视觉分析', screen: 'vision' },
    { label: '模板工作台', screen: 'studio' },
  ];

  return (
    <div>
      <nav className="border-b border-stone-200 bg-white px-4 py-2">
        <div className="mx-auto flex max-w-[1680px] flex-wrap gap-2">
          {navItems.map((item) => (
            <button
              className={`min-h-11 rounded-md px-3 py-2 text-sm font-medium ${
                screen === item.screen
                  ? 'bg-stone-950 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
              key={item.screen}
              onClick={() => setScreen(item.screen)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      {screen === 'user-app' ? (
        <main className="mx-auto max-w-[1680px] p-3 sm:p-4">
          <UserAppShell packageData={userAppMvpShellExamplePackage} />
        </main>
      ) : null}
      {screen === 'vision' ? <VisionAnalysisDemo /> : null}
      {screen === 'studio' ? <TemplateStudio /> : null}
    </div>
  );
}
