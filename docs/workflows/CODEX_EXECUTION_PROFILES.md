# Codex Execution Profiles

本文件定义 Makeup Engine 的 Codex 执行 profile。选择 profile 时以任务性质、改动范围和风险为准。

## native-gpt-codex-daily

### 适用任务

- UI 接线。
- 小步功能。
- 单个测试失败修复。
- 窄范围文档更新。
- CLI 小改动。

### 不适用任务

- 大规模重构。
- 批量生成上百个文件。
- 多业务边界同时修改。
- 长时间无人值守 agent 任务。

### 最大建议改动范围

一次任务尽量只触碰一个模块边界，或者一组同类文档/测试。

### 必须先读文件

- `START_HERE.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/status/NEXT_ACTION.md`
- `project-state/project-state.snapshot.json`
- `project-state/provider-handoff.json`

### 必须输出内容

- 完成内容。
- 新增文件。
- 修改文件。
- 验证结果。
- 当前限制。
- 下一步建议。
- handoff 给下一个 provider。

### 必须运行命令

```bash
npm run typecheck
npm run test
npm run build
```

### 禁止事项

- 不要扩大到无关模块。
- 不要直接训练 SourceImagePackage。
- 不要修改 legacy frozen modules 作为新功能中心。

### 完成后必须更新的状态文件

- `project-state/latest-handoff.json`
- `project-state/provider-handoff.json`
- `project-state/active-task.json`
- `project-state/test-status.json`
- `project-state/command-log.json`

## packyapi-cli-heavy

### 适用任务

- 批量重构。
- 全局扫描。
- 批量文档生成。
- 长时间 agent 任务。
- 高强度文件处理。

### 不适用任务

- 需要即时产品判断的任务。
- 边界不清楚的业务功能。
- 需要频繁人工 UI 评审的任务。

### 最大建议改动范围

必须先生成 execution plan。一次任务可以处理多个文件，但不能同时改多个业务边界。

### 必须先读文件

- `START_HERE.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/workflows/PACKYAPI_CLI_RUNBOOK.md`
- `docs/status/NEXT_ACTION.md`
- `project-state/project-state.snapshot.json`
- `project-state/provider-handoff.json`
- `project-state/active-task.json`

### 必须输出内容

- execution plan。
- changed files。
- validation。
- risks。
- incomplete work。
- handoff。

### 必须运行命令

```bash
npm run project:context
npm run typecheck
npm run test
npm run build
```

### 禁止事项

- 不要同时修改 Template Studio、training 和 export package 业务边界。
- 不要改 legacy frozen modules 承载新主线功能。
- 不要引入 SDK、外部 API、后端或数据库。

### 完成后必须更新的状态文件

- `project-state/provider-handoff.json`
- `project-state/latest-handoff.json`
- `project-state/active-task.json`
- `project-state/test-status.json`
- `project-state/command-log.json`

## chatgpt-planning

### 适用任务

- 阶段规划。
- 验收标准定义。
- Prompt 生成。
- 架构边界判断。
- 风险评审。

### 不适用任务

- 直接大规模编辑文件。
- 长时间测试修复。
- 本地构建验证。

### 最大建议改动范围

不直接改代码，主要输出任务 Prompt 和验收标准。

### 必须先读文件

- `START_HERE.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/status/CURRENT_PROJECT_STATUS.md`
- `docs/status/NEXT_ACTION.md`
- `project-state/project-state.snapshot.json`

### 必须输出内容

- 阶段目标。
- 允许范围。
- 禁止范围。
- 验收命令。
- 完成报告要求。

### 必须运行命令

ChatGPT 本身通常不运行本地命令，但必须要求执行 provider 运行验证命令。

### 禁止事项

- 不要让聊天记忆覆盖仓库文档。
- 不要批准跳过测试。

### 完成后必须更新的状态文件

由执行 provider 更新，ChatGPT 负责审查结果。

## emergency-fix

### 适用任务

- 阻塞构建或测试的紧急修复。
- 明确单点故障。
- 文档或 JSON 损坏导致恢复失败。

### 不适用任务

- 新功能。
- 大范围重构。
- UI 设计优化。

### 最大建议改动范围

只改导致失败的最小文件集合。

### 必须先读文件

- `START_HERE.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `project-state/active-task.json`
- 当前失败日志。

### 必须输出内容

- 根因。
- 最小修复。
- 验证命令。
- 剩余风险。

### 必须运行命令

至少运行失败命令和相关回归命令。若可行，运行：

```bash
npm run typecheck
npm run test
npm run build
```

### 禁止事项

- 不要借 emergency-fix 加新功能。
- 不要重写架构。

### 完成后必须更新的状态文件

- `project-state/test-status.json`
- `project-state/provider-handoff.json`

## docs-only

### 适用任务

- 状态文档。
- runbook。
- prompt 模板。
- phase handoff。
- project-state JSON。

### 不适用任务

- 业务功能。
- vision pipeline。
- training 逻辑。
- Template Studio 功能。

### 最大建议改动范围

只触碰 `docs`、`project-state`、`scripts`、`tests` 和必要的 `package.json` script。

### 必须先读文件

- `START_HERE.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/standards/DOCUMENTATION_MAINTENANCE.md`
- `docs/standards/PHASE_HANDOFF_REQUIREMENTS.md`
- `project-state/project-state.snapshot.json`

### 必须输出内容

- 新增文件。
- 修改文件。
- 文档状态。
- JSON 状态。
- 测试结果。
- 下一步建议。

### 必须运行命令

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
```

### 禁止事项

- 不要做业务功能。
- 不要修改 vision、training 或 Template Studio 业务逻辑。
- 不要触碰 legacy frozen modules。

### 完成后必须更新的状态文件

- `project-state/provider-handoff.json`
- `project-state/active-task.json`
- `project-state/latest-handoff.json`
- `project-state/command-log.json`
- `project-state/test-status.json`
