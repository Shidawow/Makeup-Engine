# AI Provider Switching

本文件定义 Makeup Engine 在 ChatGPT、原生 GPT / Codex Desktop、PackyAPI + CLI、不同模型和不同会话之间切换时的工作规则。

## 为什么需要多 provider 切换

Makeup Engine 已经进入复杂阶段，后续任务会同时包含架构判断、小步开发、测试修复、大规模重构、批量文档维护和长时间 agent 任务。不同 provider 的优势不同，必须把项目状态固定在仓库文档和 `project-state` JSON 中，避免上下文只存在于聊天窗口。

项目状态以仓库文档为 source of truth，不是聊天记忆。任何 provider 都不能用旧聊天印象覆盖仓库状态。

## Provider 职责

### ChatGPT

- 负责 CEO / PM / 架构师判断。
- 决定阶段目标、验收标准、风险边界和下一步 Prompt。
- 适合拆阶段、定优先级、审查交付报告、判断是否进入下一阶段。
- 不应直接承担长时间批量文件处理。

### 原生 GPT / Codex Desktop

- 负责日常开发、小步迭代、测试修复、UI 接线和窄范围文档更新。
- 适合一次只改一个清晰模块或一个小功能边界。
- 必须在本地运行 `npm run typecheck`、`npm run test`、`npm run build`。

### PackyAPI + CLI

- 负责大规模重构、批量生成、全局扫描、长时间 agent 任务和高强度文件处理。
- 必须先生成 execution plan。
- 必须限制修改范围，不能同时改多个业务边界。
- 完成后必须输出 changed files、validation、risks、handoff。

## 什么任务适合原生 GPT

- Template Studio 小步 UI 接线。
- 单个测试失败修复。
- 小范围 schema 或文档补丁。
- CLI 输出格式小调整。
- 只涉及一个主线模块的低风险改动。

## 什么任务适合 PackyAPI + CLI

- 大量文档生成或统一格式整理。
- 全仓扫描后生成报告。
- 多文件机械迁移。
- 长时间测试修复批处理。
- 需要稳定处理大量文件上下文的任务。

## 切换前必须保存什么

每次 provider 切换前必须更新：

- `project-state/latest-handoff.json`
- `project-state/provider-handoff.json`
- `project-state/active-task.json`
- `project-state/test-status.json`
- `project-state/command-log.json`

切换前必须记录：

- 当前阶段。
- 当前任务。
- 已完成内容。
- 未完成内容。
- 允许修改范围。
- 禁止修改范围。
- 验证命令和结果。
- 下一个 provider 必须先读的文件。

## 切换后必须先读什么

每次切换后必须先读：

1. `START_HERE.md`
2. `docs/prompts/MASTER_CODEX_CONTEXT.md`
3. `docs/status/NEXT_ACTION.md`
4. `project-state/project-state.snapshot.json`
5. `project-state/provider-handoff.json`

然后运行：

```bash
npm run project:context
npm run project:status
```

不允许跳过测试和文档更新直接继续开发。

## 避免两个 provider 同时修改同一模块

- `project-state/active-task.json` 必须记录 `allowedDirectories` 和 `forbiddenDirectories`。
- 一个任务只能有一个 active provider。
- PackyAPI 执行长任务时，原生 GPT 不应同时修改相同目录。
- 如果必须并行，两个任务必须写入不同目录，且 handoff 必须明确隔离边界。
- 业务边界不能混改，例如不能在同一任务里同时改 Template Studio、training dataset 和 export package。

## 回填执行结果

任务结束后，执行 provider 必须回填：

- 新增文件。
- 修改文件。
- 验证命令。
- 测试结果。
- 风险。
- 当前限制。
- 下一步建议。
- 是否更新文档。
- 是否更新 `project-state`。
- 是否触碰 legacy frozen modules。
- 是否引入依赖。
- 是否调用外部 API。

回填位置：

- `project-state/provider-handoff.json`
- `project-state/latest-handoff.json`
- `project-state/test-status.json`
- `project-state/command-log.json`

## 长任务失败处理

长任务失败时，不要继续扩大改动范围。必须：

- 停止继续改业务文件。
- 记录失败命令、失败原因和已改文件。
- 标明哪些文件可安全继续，哪些文件需要人工检查。
- 更新 `project-state/provider-handoff.json` 的 `taskStatus`。
- 给 ChatGPT 返回失败报告，由 ChatGPT 决定是否拆小任务或换 provider。

## 模型能力差异处理

- 低上下文模型只执行窄范围任务。
- 长上下文模型可以做全局扫描，但仍必须遵守 allowed/forbidden directories。
- 任何模型都不能凭聊天记忆改边界。
- 任何模型都必须以仓库文档和 `project-state` JSON 为准。
- 如果模型无法确认状态，先运行 `npm run project:context`，再读取必读文件。

## 固定边界

- SourceImagePackage 不能直接变 training dataset。
- SourceImagePackage 不能绕过 correction 或 review queue。
- UI state 不能直接训练。
- legacy frozen modules 不能扩张。
- `src/engine`、`src/runtime`、`src/intelligence/runtime` 不能承载新主线功能。
