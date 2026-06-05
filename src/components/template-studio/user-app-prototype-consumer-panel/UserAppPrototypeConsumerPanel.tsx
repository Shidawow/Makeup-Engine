import { CheckCircle2, ClipboardCheck, ListChecks, Smartphone } from 'lucide-react';
import type { UserAppTemplatePackage } from '../../../templates/schema';
import { userAppTemplatePackageExample } from '../../../templates/examples/user-app-template-package.example';
import {
  loadUserAppTemplatePackageForPrototype,
  summarizePrototypeConsumer,
} from '../../../template-engine';

export interface UserAppPrototypeConsumerPanelProps {
  packageData?: UserAppTemplatePackage | null;
  selectedTemplateId?: string;
  onSelectedTemplateChange?: (templateId: string) => void;
  showExampleWhenEmpty?: boolean;
}

const statusLabel: Record<string, string> = {
  ready: '可预览',
  warning: '有警告',
  blocked: '已阻塞',
};

export function UserAppPrototypeConsumerPanel({
  packageData,
  selectedTemplateId,
  onSelectedTemplateChange,
  showExampleWhenEmpty = true,
}: UserAppPrototypeConsumerPanelProps) {
  const usingExample = !packageData && showExampleWhenEmpty;
  const effectivePackage =
    packageData ?? (showExampleWhenEmpty ? userAppTemplatePackageExample : null);

  if (!effectivePackage) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">User App Prototype Consumer</h2>
            <p className="text-xs text-stone-500">
              暂无 UserAppTemplatePackage。此面板只做只读 contract QA，不是正式用户 App。
            </p>
          </div>
          <Smartphone aria-hidden="true" className="text-teal-700" size={18} />
        </div>
        <div className="mt-4 rounded-md border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-600">
          <p className="font-semibold text-stone-800">空状态：无 package</p>
          <p className="mt-1">
            请先从 TemplatePublishPackage 生成 UserAppTemplatePackage，再进行 prototype consumer QA。
          </p>
        </div>
      </section>
    );
  }

  const viewModel = loadUserAppTemplatePackageForPrototype({
    packageData: effectivePackage,
    selectedTemplateId,
  });
  const selectedTemplate = viewModel.selectedTemplate;

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">User App Prototype Consumer</h2>
          <p className="text-xs text-stone-500">
            只读验证 UserAppTemplatePackage 的未来用户侧消费形态；不是正式用户 App。
          </p>
        </div>
        <Smartphone aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      <div className="mt-4 grid gap-2 rounded-md bg-stone-50 p-3 text-xs text-stone-700">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-stone-900">{viewModel.packageName}</span>
          <span className="rounded bg-white px-2 py-1 font-medium text-stone-600">
            {usingExample ? '示例 package smoke preview' : viewModel.compatibilityTarget}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <p>templates {viewModel.templateCount}</p>
          <p>steps {viewModel.totalSteps}</p>
          <p>regions {viewModel.totalRegionInstructions}</p>
          <p>avg {viewModel.averageDurationMinutes} min</p>
        </div>
        {viewModel.selection.fallbackApplied ? (
          <p className="text-amber-800">{viewModel.selection.fallbackReason}</p>
        ) : null}
        <p className="text-amber-800">
          本面板只读取 contract view model，不上传服务器，不保存 object URL / 本地绝对路径 / 大图 bytes。
        </p>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 p-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
          <ClipboardCheck aria-hidden="true" className="text-teal-700" size={16} />
          Contract validation
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <p className="rounded bg-teal-50 p-2">
            status {statusLabel[viewModel.validationPanel.status]}
          </p>
          <p className="rounded bg-stone-50 p-2">
            warnings {viewModel.validationPanel.warningCount}
          </p>
          <p className="rounded bg-stone-50 p-2">
            blocking {viewModel.validationPanel.blockingIssueCount}
          </p>
        </div>
        <p className="mt-2 text-xs text-stone-600">
          {viewModel.validationPanel.localOnlyDisclaimer}
        </p>

        {viewModel.validationPanel.blockingIssues.length > 0 ? (
          <ul className="mt-2 grid gap-1 text-xs text-rose-800">
            {viewModel.validationPanel.blockingIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-800">
            <CheckCircle2 aria-hidden="true" size={14} />
            Contract 可被 prototype consumer 读取。
          </p>
        )}

        {viewModel.validationPanel.warnings.length > 0 ? (
          <ul className="mt-2 grid gap-1 text-xs text-amber-800">
            {viewModel.validationPanel.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3 grid gap-2 text-xs text-stone-700">
          {viewModel.validationPanel.readinessChecks.map((check) => (
            <div className="rounded bg-stone-50 p-2" key={check.checkId}>
              <span className="font-semibold">{check.label}</span>
              <span className="ml-2 text-stone-500">{statusLabel[check.status]}</span>
              <span className="mt-1 block">{check.message}</span>
            </div>
          ))}
        </div>

        {viewModel.validationPanel.issues.length > 0 ? (
          <div className="mt-3 grid gap-2 text-xs">
            <p className="font-semibold text-stone-800">Validation issue detail</p>
            {viewModel.validationPanel.issues.map((issue) => (
              <div
                className={`rounded border p-2 ${
                  issue.severity === 'blocking'
                    ? 'border-rose-200 bg-rose-50 text-rose-900'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
                key={issue.issueId}
              >
                <span className="font-semibold">
                  {issue.severity} / {issue.source}
                </span>
                <span className="mt-1 block">{issue.message}</span>
                <span className="mt-1 block text-stone-600">{issue.nextAction}</span>
              </div>
            ))}
          </div>
        ) : null}

        {viewModel.validationPanel.emptyStates.length > 0 ? (
          <div className="mt-3 grid gap-2 text-xs text-stone-700">
            <p className="font-semibold text-stone-800">Empty state diagnostics</p>
            {viewModel.validationPanel.emptyStates.map((emptyState) => (
              <div className="rounded bg-stone-50 p-2" key={emptyState.stateId}>
                <span className="font-semibold">{emptyState.label}</span>
                <span className="mt-1 block">{emptyState.message}</span>
                <span className="mt-1 block text-stone-500">{emptyState.nextAction}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ListChecks aria-hidden="true" className="text-teal-700" size={16} />
          Template list
        </div>
        {viewModel.templates.map((template) => (
          <button
            className={`rounded-md border p-3 text-left text-sm ${
              selectedTemplate?.appTemplateId === template.appTemplateId
                ? 'border-teal-500 bg-teal-50'
                : 'border-stone-200 bg-white'
            }`}
            key={template.appTemplateId}
            onClick={() => onSelectedTemplateChange?.(template.appTemplateId)}
            type="button"
          >
            <span className="block font-semibold">{template.title}</span>
            <span className="mt-1 block text-xs text-stone-500">
              {template.difficulty} / {template.estimatedDurationMinutes} min /{' '}
              {template.stepCount} steps / {statusLabel[template.status]}
            </span>
            <span className="mt-1 block text-xs text-stone-600">
              tags: {template.styleTags.join(', ') || 'none'}
            </span>
          </button>
        ))}
        {viewModel.templates.length === 0 ? (
          <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600">
            <p className="font-semibold text-stone-800">空状态：package 无 templates</p>
            <p className="mt-1">当前 package 无可预览模板，prototype readiness 会保持 blocked。</p>
          </div>
        ) : null}
      </div>

      {selectedTemplate ? (
        <div className="mt-4 grid gap-3 rounded-md border border-stone-200 bg-stone-50 p-3">
          <div>
            <h3 className="text-sm font-semibold">{selectedTemplate.title}</h3>
            <p className="mt-1 text-xs text-stone-600">{selectedTemplate.subtitle}</p>
            <p className="mt-1 text-xs text-stone-600">
              occasions: {selectedTemplate.suitableOccasions.join(', ') || 'general'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-700">Step-by-step guidance</p>
            <ol className="mt-2 grid gap-2 text-xs text-stone-700">
              {selectedTemplate.steps.map((step) => (
                <li className="rounded bg-white p-2" key={step.stepId}>
                  <span className="font-semibold">
                    {step.order}. {step.title}
                  </span>
                  <span className="mt-1 block">{step.instructionText}</span>
                  <span className="mt-1 block text-stone-500">
                    {step.region} / {step.technique} / {step.estimatedSeconds}s
                  </span>
                </li>
              ))}
            </ol>
            {selectedTemplate.steps.length === 0 ? (
              <div className="mt-2 rounded bg-white p-2 text-xs text-stone-600">
                空状态：template 无 steps。需要重新生成 app-facing makeup steps。
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-700">Region instructions</p>
            <ul className="mt-2 grid gap-2 text-xs text-stone-700">
              {selectedTemplate.regionInstructions.map((instruction) => (
                <li className="rounded bg-white p-2" key={instruction.regionId}>
                  <span className="font-semibold">{instruction.displayName}</span>
                  <span className="mt-1 block">{instruction.userGuidanceText}</span>
                  <span className="mt-1 block text-stone-500">
                    intensity {instruction.intensityLabel}; blend {instruction.blendDirection}
                  </span>
                </li>
              ))}
            </ul>
            {selectedTemplate.regionInstructions.length === 0 ? (
              <div className="mt-2 rounded bg-white p-2 text-xs text-stone-600">
                空状态：template 无 region instructions。需要补充区域指导。
              </div>
            ) : null}
          </div>

          <div className="grid gap-2 text-xs text-stone-700">
            <p className="font-semibold text-stone-800">Tools / products</p>
            <p>
              required tools:{' '}
              {selectedTemplate.toolProductSummary.requiredTools
                .map((tool) => tool.displayName)
                .join(', ') || 'none'}
            </p>
            <p>
              products:{' '}
              {selectedTemplate.toolProductSummary.productSuggestions
                .map((product) => product.displayName)
                .join(', ') || 'none'}
            </p>
            {selectedTemplate.emptyStates.some(
              (emptyState) =>
                emptyState.stateId === 'template-no-tools' ||
                emptyState.stateId === 'template-no-product-suggestions',
            ) ? (
              <div className="rounded bg-white p-2 text-stone-600">
                空状态：tools / product suggestions 不完整，需在 App MVP 前补齐或保留 warning。
              </div>
            ) : null}
            <p>
              lineage: {selectedTemplate.lineageSummary.sourceLibraryEntryId} /{' '}
              {selectedTemplate.lineageSummary.sourceTemplateVersion}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600">
          <p className="font-semibold text-stone-800">空状态：未选择 template</p>
          <p className="mt-1">没有可用 template detail。请检查 package 是否包含 templates。</p>
        </div>
      )}

      <pre className="mt-4 max-h-32 overflow-auto rounded-md bg-stone-950 p-3 text-xs text-stone-100">
        {summarizePrototypeConsumer(effectivePackage)}
      </pre>
    </section>
  );
}
