# Codex Handoff Protocol

本协议适用于每次 Codex、原生 GPT、PackyAPI CLI 或其他执行 provider 接手 Makeup Engine。

## 任务开始前

每次 Codex 任务开始前必须：

1. 读取 `START_HERE.md`。
2. 读取 `docs/prompts/MASTER_CODEX_CONTEXT.md`。
3. 读取 `docs/status/NEXT_ACTION.md`。
4. 读取 `project-state/project-state.snapshot.json`。
5. 读取 `project-state/provider-handoff.json`。
6. 确认当前 active task。
7. 输出简短 execution plan。
8. 再开始修改代码或文档。

建议同时运行：

```bash
npm run project:context
npm run project:status
```

项目状态以仓库文档为 source of truth，不是聊天记忆。

## 任务执行中

- 只在 `project-state/active-task.json` 允许的目录内工作。
- 不要触碰 forbidden directories。
- 如果发现任务需要扩大范围，先停下并更新 handoff，而不是直接扩大。
- 如果任务涉及业务逻辑，必须保持 intelligence layer 和 UI 边界。
- 如果任务涉及 SourceImagePackage，必须保持它不是 training-ready dataset 的边界。

## 任务结束后必须输出

每次 Codex 任务结束后必须输出：

- 完成内容。
- 新增文件。
- 修改文件。
- 验证命令。
- 测试结果。
- 当前限制。
- 下一步建议。
- 是否更新文档。
- 是否更新 `project-state`。
- 是否触碰禁止目录。
- 是否引入依赖。
- 是否调用外部 API。
- 给下一个 provider 的 handoff。

## 任务结束后必须更新

大任务、provider 切换或 phase 结束后必须更新：

- `project-state/provider-handoff.json`
- `project-state/active-task.json`
- `project-state/latest-handoff.json`
- `project-state/command-log.json`
- `project-state/test-status.json`

## 固定验收命令

常规任务至少运行：

```bash
npm run typecheck
npm run test
npm run build
```

文档和 provider 切换任务还必须运行：

```bash
npm run project:status
npm run project:context
node scripts/context-pack.mjs --json
```

## 固定禁止事项

- 不允许跳过测试和文档更新直接继续开发。
- 不允许把 SourceImagePackage 直接变 training dataset。
- 不允许绕过 correction 或 review queue。
- 不允许让 UI state 直接训练。
- 不允许扩张 legacy frozen modules。
- 不允许在 DOC 阶段引入外部 API、SDK、后端或数据库。
