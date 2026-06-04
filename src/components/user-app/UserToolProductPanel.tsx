import type { UserAppToolProductViewModel } from '../../user-app';

export interface UserToolProductPanelProps {
  toolsAndProducts: UserAppToolProductViewModel;
}

export function UserToolProductPanel({ toolsAndProducts }: UserToolProductPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-teal-700">Tools and products</p>
        <h3 className="text-base font-semibold text-stone-950">工具和产品建议</h3>
      </div>

      {toolsAndProducts.warnings.length > 0 ? (
        <ul className="mt-3 grid gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          {toolsAndProducts.warnings.map((warning) => (
            <li key={warning}>提醒：{warning}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold text-stone-900">必备工具</p>
          <ul className="mt-2 grid gap-2 text-sm text-stone-700">
            {toolsAndProducts.requiredTools.map((tool) => (
              <li className="rounded-md border border-stone-200 bg-stone-50 p-3" key={tool.toolId}>
                <span className="font-medium text-stone-950">{tool.displayName}</span>
                <span className="block text-xs text-stone-500">{tool.toolType}</span>
              </li>
            ))}
            {toolsAndProducts.requiredTools.length === 0 ? (
              <li className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-stone-500">
                暂无必备工具，真实跟练前建议补充。
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-stone-900">可选工具</p>
          <ul className="mt-2 grid gap-2 text-sm text-stone-700">
            {toolsAndProducts.optionalTools.map((tool) => (
              <li className="rounded-md border border-stone-200 bg-stone-50 p-3" key={tool.toolId}>
                <span className="font-medium text-stone-950">{tool.displayName}</span>
                <span className="block text-xs text-stone-500">{tool.toolType}</span>
              </li>
            ))}
            {toolsAndProducts.optionalTools.length === 0 ? (
              <li className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-stone-500">
                暂无可选工具。
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-stone-900">产品建议</p>
          <ul className="mt-2 grid gap-2 text-sm text-stone-700">
            {toolsAndProducts.productSuggestions.map((product) => (
              <li className="rounded-md border border-stone-200 bg-stone-50 p-3" key={product.productId}>
                <span className="font-medium text-stone-950">{product.displayName}</span>
                <span className="block text-xs text-stone-500">
                  {product.productCategory}
                  {product.colorHint ? ` / ${product.colorHint}` : ''}
                  {product.finish ? ` / ${product.finish}` : ''}
                </span>
              </li>
            ))}
            {toolsAndProducts.productSuggestions.length === 0 ? (
              <li className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-stone-500">
                暂无产品建议，真实跟练前建议补充。
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-stone-600">
        <p className="font-semibold text-stone-900">每一步会用到什么</p>
        {toolsAndProducts.stepToolProductLinks.map((link) => (
          <div className="rounded-md border border-stone-200 bg-stone-50 p-3" key={link.stepId}>
            <span className="font-semibold text-stone-900">{link.stepTitle}</span>
            <span className="mt-1 block">
              工具：{link.tools.map((tool) => tool.displayName).join('、') || '未列出'}
            </span>
            <span className="mt-1 block">
              产品：{link.products.map((product) => product.displayName).join('、') || '未列出'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
