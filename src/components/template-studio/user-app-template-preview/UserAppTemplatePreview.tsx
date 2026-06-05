import { FileJson, MonitorSmartphone, PackageCheck } from 'lucide-react';
import type {
  TemplatePublishPackage,
  UserAppCompatibilityTarget,
  UserAppTemplatePackage,
} from '../../../templates/schema';
import {
  createUserAppConsumptionManifest,
  exportUserAppConsumptionHandoff,
  exportUserAppTemplatePackageJson,
  summarizeUserAppConsumptionExport,
} from '../../../templates/storage';
import {
  createUserAppTemplatePackageFromPublishPackage,
  summarizeUserAppCompatibility,
} from '../../../template-engine';

export interface UserAppTemplatePreviewProps {
  publishPackage?: TemplatePublishPackage | null;
  appPackage?: UserAppTemplatePackage | null;
  selectedTemplateId?: string;
  compatibilityTarget: UserAppCompatibilityTarget;
  onCompatibilityTargetChange?: (target: UserAppCompatibilityTarget) => void;
  onAppPackageChange?: (packageData: UserAppTemplatePackage | null) => void;
}

const compatibilityTargets: UserAppCompatibilityTarget[] = [
  'web-app-v0',
  'ios-app-v0',
  'backend-template-service-v0',
  'unknown',
];

export function UserAppTemplatePreview({
  publishPackage,
  appPackage,
  selectedTemplateId,
  compatibilityTarget,
  onCompatibilityTargetChange,
  onAppPackageChange,
}: UserAppTemplatePreviewProps) {
  const selectedTemplate =
    appPackage?.templates.find((template) => template.appTemplateId === selectedTemplateId) ??
    appPackage?.templates[0] ??
    null;
  const manifest = appPackage
    ? createUserAppConsumptionManifest({
        packageData: appPackage,
        target: compatibilityTarget,
      })
    : null;

  const buildAppPackage = () => {
    if (!publishPackage) {
      onAppPackageChange?.(null);
      return;
    }

    onAppPackageChange?.(
      createUserAppTemplatePackageFromPublishPackage({
        packageData: publishPackage,
        target: compatibilityTarget,
      }),
    );
  };

  const exportPackageJson = () => {
    if (!appPackage || typeof navigator === 'undefined') {
      return;
    }

    void navigator.clipboard?.writeText(exportUserAppTemplatePackageJson(appPackage));
  };

  const exportHandoff = () => {
    if (!appPackage || typeof navigator === 'undefined') {
      return;
    }

    void navigator.clipboard?.writeText(exportUserAppConsumptionHandoff(appPackage));
  };

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">User App Template Preview</h2>
          <p className="text-xs text-stone-500">
            管理员预览用户侧消费 contract；这里不是用户 App，也不是线上发布。
          </p>
        </div>
        <MonitorSmartphone aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5 text-sm">
          <span className="text-xs font-semibold text-stone-500">compatibility target</span>
          <select
            className="h-9 rounded-md border border-stone-200 px-3 text-sm"
            onChange={(event) =>
              onCompatibilityTargetChange?.(event.target.value as UserAppCompatibilityTarget)
            }
            value={compatibilityTarget}
          >
            {compatibilityTargets.map((target) => (
              <option key={target} value={target}>
                {target}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!publishPackage}
            onClick={buildAppPackage}
            type="button"
          >
            <PackageCheck aria-hidden="true" size={15} />
            生成 User App Template Package
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!appPackage}
            onClick={exportPackageJson}
            type="button"
          >
            <FileJson aria-hidden="true" size={15} />
            复制 Package JSON
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!appPackage}
            onClick={exportHandoff}
            type="button"
          >
            <FileJson aria-hidden="true" size={15} />
            复制 consumption handoff
          </button>
        </div>
      </div>

      {appPackage ? (
        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            <p className="rounded-md bg-teal-50 p-2">templates {appPackage.templates.length}</p>
            <p className="rounded-md bg-teal-50 p-2">
              ready {String(appPackage.validation.readiness.ready)}
            </p>
            <p className="rounded-md bg-stone-50 p-2">
              steps {appPackage.summary.totalSteps}
            </p>
            <p className="rounded-md bg-stone-50 p-2">
              target {appPackage.compatibilityTarget}
            </p>
          </div>

          <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-900">
            UserAppTemplatePackage 是本地/export consumption contract，不会上传服务器，不代表线上发布，
            不包含 object URL、本地绝对路径或大图 bytes。
          </p>

          {appPackage.validation.blockingIssues.length > 0 ? (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              {appPackage.validation.blockingIssues.map((issue) => (
                <p key={issue}>{issue}</p>
              ))}
            </div>
          ) : null}

          <div className="grid gap-2">
            {appPackage.templates.map((template) => (
              <article
                className={`rounded-md border p-3 text-sm ${
                  selectedTemplate?.appTemplateId === template.appTemplateId
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-stone-200'
                }`}
                key={template.appTemplateId}
              >
                <p className="font-semibold">{template.title}</p>
                <p className="mt-1 text-xs text-stone-500">
                  {template.difficulty} / {template.estimatedDurationMinutes} min /{' '}
                  {template.makeupCategory}
                </p>
                <p className="mt-1 text-xs text-stone-600">
                  styleTags: {template.styleTags.join(', ') || 'none'}
                </p>
                <p className="mt-1 text-xs text-stone-600">
                  steps {template.steps.length} / regions {template.regionInstructions.length} /
                  lineage {template.lineage.sourceLibraryEntryId}
                </p>
              </article>
            ))}
          </div>

          {selectedTemplate ? (
            <div className="grid gap-3 rounded-md border border-stone-200 bg-stone-50 p-3">
              <div>
                <p className="text-xs font-semibold text-stone-600">App-facing makeup steps</p>
                <ol className="mt-2 grid gap-1 text-xs text-stone-700">
                  {selectedTemplate.steps.map((step) => (
                    <li key={step.stepId}>
                      {step.order}. {step.region} / {step.title} / {step.instructionText}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-600">Region instructions</p>
                <ul className="mt-2 grid gap-1 text-xs text-stone-700">
                  {selectedTemplate.regionInstructions.map((instruction) => (
                    <li key={instruction.regionId}>
                      {instruction.displayName}: {instruction.userGuidanceText}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-600">Tools / products</p>
                <p className="mt-1 text-xs text-stone-700">
                  tools: {selectedTemplate.requiredTools.map((tool) => tool.displayName).join(', ')}
                </p>
                <p className="mt-1 text-xs text-stone-700">
                  products:{' '}
                  {selectedTemplate.productSuggestions
                    .map((product) => product.displayName)
                    .join(', ')}
                </p>
              </div>
            </div>
          ) : null}

          <div className="rounded-md bg-stone-950 p-3 text-xs text-stone-100">
            <span className="inline-flex items-center gap-1 font-semibold">
              <FileJson aria-hidden="true" size={14} />
              Consumption summary
            </span>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">
              {summarizeUserAppConsumptionExport(appPackage)}
            </pre>
            <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap">
              {summarizeUserAppCompatibility(appPackage)}
            </pre>
            {manifest ? (
              <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    manifestId: manifest.manifestId,
                    entryCount: manifest.entryCount,
                    target: manifest.compatibilityTarget,
                  },
                  null,
                  2,
                )}
              </pre>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="mt-3 rounded-md bg-stone-50 p-3 text-sm text-stone-500">
          暂无 User App Template Package。请先构建 Template Publish Package，再生成消费 contract。
        </p>
      )}
    </section>
  );
}

