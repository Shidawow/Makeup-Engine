# PackyAPI CLI Runbook

本 runbook 用于把大规模文件处理或长时间 agent 任务交给 PackyAPI + CLI。

## PackyAPI + CLI 适合什么任务

- 批量重构。
- 全局扫描。
- 大量文档生成。
- 大量测试修复。
- 长时间 agent 任务。
- 需要稳定处理大量文件上下文的机械改动。

## 什么时候不要用 PackyAPI

- 任务边界不清楚。
- 需要实时产品判断。
- 需要用户立刻评审 UI 设计。
- 只需要修改一个小文件。
- 需要新增外部 API、后端或数据库。
- 风险集中在 legacy frozen modules。

## 如何给 PackyAPI 提供上下文

切换前先运行：

```bash
npm run project:context
node scripts/context-pack.mjs --json
```

然后把输出和任务 Prompt 一起交给 PackyAPI。PackyAPI 必须先读：

- `START_HERE.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/workflows/PACKYAPI_CLI_RUNBOOK.md`
- `docs/status/NEXT_ACTION.md`
- `project-state/project-state.snapshot.json`
- `project-state/provider-handoff.json`
- `project-state/active-task.json`

## 如何限制 PackyAPI 修改范围

Prompt 必须明确：

- `allowedDirectories`
- `forbiddenDirectories`
- 允许修改的文件类型。
- 禁止业务边界。
- 禁止 legacy frozen modules。
- 验收命令。

PackyAPI 不得自行扩大修改范围。

## 如何要求 PackyAPI 输出执行报告

执行报告必须包含：

- execution plan。
- changed files。
- validation commands。
- test results。
- skipped checks。
- risks。
- incomplete work。
- handoff for next provider。

## 如何回填给 ChatGPT / 原生 GPT

PackyAPI 结束后必须更新：

- `project-state/provider-handoff.json`
- `project-state/latest-handoff.json`
- `project-state/active-task.json`
- `project-state/test-status.json`
- `project-state/command-log.json`

然后把执行报告贴回 ChatGPT，由 ChatGPT 判断是否进入下一步。

## 长任务失败处理

如果 PackyAPI 长任务失败：

- 停止继续改动。
- 输出失败命令和 stderr 摘要。
- 输出已修改文件列表。
- 标记哪些文件需要人工检查。
- 不要继续尝试大范围自动修复。
- 更新 `project-state/provider-handoff.json` 的 `taskStatus`。

## 避免重复做已完成阶段

PackyAPI 开始前必须核对：

- `project-state/project-state.snapshot.json`
- `docs/status/CURRENT_PHASE.md`
- `docs/phases/PHASE_HISTORY.md`
- `project-state/latest-handoff.json`

如果仓库已经标记一个阶段完成，不要重新实现该阶段。只能做明确的新任务或修复。

## 避免误改 legacy runtime

以下目录是 legacy frozen modules，不能扩张：

- `src/engine`
- `src/runtime`
- `src/intelligence/runtime`

PackyAPI 任务必须把它们列入 forbidden directories，除非 Prompt 明确授权做兼容性修复。

## 任务结束后更新 latest-handoff.json

必须记录：

- from provider。
- to provider。
- current task。
- completed work。
- changed files。
- validation。
- next action。
- risks。
- forbidden actions。

## PackyAPI 任务开头模板

```text
你现在接手 Makeup Engine 项目。

当前阶段：
{currentPhase}

当前目标：
{currentGoal}

必须先读文件：
- START_HERE.md
- docs/prompts/MASTER_CODEX_CONTEXT.md
- docs/workflows/PACKYAPI_CLI_RUNBOOK.md
- docs/status/NEXT_ACTION.md
- project-state/project-state.snapshot.json
- project-state/provider-handoff.json
- project-state/active-task.json

允许修改范围：
{allowedDirectories}

禁止修改范围：
- src/engine
- src/runtime
- src/intelligence/runtime
{extraForbiddenDirectories}

验收命令：
- npm run typecheck
- npm run test
- npm run build
- npm run project:status
- npm run project:context

输出格式：
1. execution plan
2. changed files
3. validation commands and results
4. risks
5. incomplete work
6. handoff for next provider

固定禁止事项：
- 不要做用户侧 App。
- 不要把 SourceImagePackage 直接变 training dataset。
- 不要绕过 correction 或 review queue。
- 不要扩张 legacy frozen modules。
- 不要引入外部 API、SDK、后端或数据库。
```
