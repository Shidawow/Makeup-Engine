# 架构总览

## 业务目标

本仓库现在的核心任务是生产可复用的 `MakeupTemplate`。
系统接收管理员上传的妆容照片，拆解妆容结构，提取可复用的美妆知识，并生成结构化模板，供后续 AI 化妆教练应用使用。

## 主流程

```text
image-input
→ face-analysis
→ makeup-region-detection
→ style-inference
→ technique-extraction
→ template-build
→ template-validation
```

## 当前推荐目录

```text
src/
  vision/
  beauty-knowledge/
  template-engine/
  templates/
  coach-runtime/
```

## 模块职责

### `src/vision`

- 图片输入契约
- 人脸分析
- 妆容区域检测
- 本地 fixture 分析辅助

### `src/beauty-knowledge`

- 美妆规则
- 风格推理
- 可复用知识抽取

### `src/template-engine`

- 模板生产契约
- 技法抽取
- 模板组装
- 模板校验
- 生产流水线

### `src/templates`

- `MakeupTemplate` 主 schema
- 风格 schema
- 技法 schema
- 脸部适配 schema

### `src/coach-runtime`

- 下游教练应用的轻量适配层
- 不是当前业务终点
- 仅作为迁移桥接

## 旧模块处理建议

### 暂时保留

- `src/components`
- `src/store`
- `src/examples/demoPipeline.ts`
- `src/intelligence`
- `src/engine`
- `src/compiler`
- `src/runtime`
- `src/schema`

这些模块先保留，用来维持当前页面、测试和演示流程可运行。

### 建议逐步废弃

- `src/engine/orchestrator`
- `src/engine/executor`
- `src/engine/stages`
- `src/engine/contracts`
- `src/intelligence/runtime`
- `src/intelligence/analysis`
- `src/intelligence/knowledge`
- `src/intelligence/scoring`
- `src/intelligence/styles`

这些命名过于泛化，不符合“妆容模板生产系统”的业务语言，后续应由新目录替代。

## 迁移计划

1. 将模板生产主逻辑固定在 `src/template-engine`。
2. 新增薄适配层，保持旧入口可运行。
3. 将 UI 逐步切换为消费模板生产结果，而不是直接依赖泛化引擎。
4. 在所有新文档中优先使用业务术语。
5. 待消费者迁移完成后，再清理旧的泛化模块。

## Schema First 原则

- `MakeupTemplate` 是第一主对象。
- `MakeupStyleSchema`、`MakeupTechnique`、`FaceSuitabilitySchema` 是核心共享契约。
- 所有模板必须在边界上校验。
- UI 只能消费生产结果，不能自己推业务规则。

## 设计原则

- 保留可运行代码。
- 使用业务语义，而不是框架语义。
- 保持确定性和可测试性。
- 不引入多余的基础设施抽象。
