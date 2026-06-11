# Makeup Engine 图文版详细设计书

> 版本：DOC-ILLUSTRATED  
> 基于仓库 source of truth：Phase 9C 已完成，下一建议阶段为 Phase 9D。  
> 本文档是设计与恢复说明，不是 production app 发布说明。

## 1. 项目概述

Makeup Engine 是妆容模板生产系统。它负责把本地管理员提供的素材、视觉分析、人工修正、证据、审核、模板库、发布包和 `UserAppTemplatePackage` 消费契约组织起来，为未来独立的用户侧妆容指导 App 提供可审核的模板输入。

当前的 User App Shell 是本地 contract-driven prototype。它消费 `UserAppTemplatePackage`，用于验证妆容发现、模板详情、分步跟练、本地偏好、本地进度、隐私说明、PWA/Mobile Web MVP、内部试用准备和管理员 QA 面板。

当前路线是 React Web / PWA MVP first。当前不做 iOS 原生、React Native、Flutter、后端、数据库、账号、相机、AR、OpenAI API、外部 AI/CV API、训练、App Store/TestFlight 或正式生产发布。换句话说，本阶段明确不做 OpenAI API，也不把任何 internal trial 当成 production release。

```mermaid
flowchart LR
  ME["Makeup Engine\n模板生产系统"] --> Contract["UserAppTemplatePackage\n本地消费契约"]
  Contract --> Shell["User App Shell\n本地 PWA/Mobile Web prototype"]
  Contract -.未来显式 gate 后.-> FutureApp["Future Production App\n独立用户侧产品"]
  ME -.不直接.-> FutureApp
  Shell -.不是.-> FutureApp
```

![Vision Analysis Home](../assets/screenshots/vision-analysis-home.png)

## 2. 总体目标

总体目标是建立可解释、可审核、可交接的妆容模板生产链路，并用 `UserAppTemplatePackage` 作为未来用户侧 App 的稳定消费契约。当前系统已经支持本地 PWA/Mobile Web MVP Shell、内部小范围试用准备、内容 QA、发布就绪 gate、内部试用运营、试用结果复盘和试用迭代规划。

```mermaid
timeline
  title 总目标路线图
  Phase 6 : Source image import : Vision analysis : Template library/package
  Phase 7 : UserAppTemplatePackage consumer : User App MVP Shell : Mobile/browser QA
  Phase 8 : React Web / PWA route : Trial pack : Content QA : Release readiness
  Phase 9A : Internal trial operations
  Phase 9B : Trial result review framework
  Phase 9C : Internal trial iteration plan
  Phase 9D : Learning summary and product decision gate
```

## 3. 系统总体架构

Makeup Engine 由本地确定性模块组成。Source image 进入后必须经过 artifact binding、vision analysis、mask editing、human correction、evidence、review、library、publish package 和 app contract 层级，不能直接进入用户 App 或训练数据。

```mermaid
flowchart TB
  subgraph Source["Source / Vision"]
    Import["Source Image Import"]
    Binding["Artifact Binding"]
    Vision["Vision subsystem\nFaceMesh / regions / sampling"]
    Mask["Editable masks\nCorrection persistence"]
  end

  subgraph Template["Template Production"]
    Batch["Template Production Batch"]
    Evidence["Evidence Panel"]
    Review["Review Queue / QA"]
    Library["Template Library"]
    Publish["Template Publish Package"]
  end

  subgraph Contract["App Contract"]
    AppContract["UserAppTemplatePackage"]
    Prototype["Prototype Contract Consumer"]
  end

  subgraph Shell["User App Shell Prototype"]
    Mobile["PWA / Mobile Web Shell"]
    Trial["Trial Pack / Feedback / Content QA"]
    Gate["Release Readiness / Go-No-Go"]
    Ops["Internal Trial Ops / Result Review / Iteration Plan"]
  end

  subgraph Recovery["Recovery / Governance"]
    Docs["docs/status / docs/prompts / docs/phases"]
    State["project-state/*.json"]
    Tests["tests / validation commands"]
  end

  Import --> Binding --> Vision --> Mask --> Batch --> Evidence --> Review --> Library --> Publish --> AppContract --> Prototype --> Mobile --> Trial --> Gate --> Ops
  Docs <--> State
  Tests --> Docs
  Tests --> State
```

```mermaid
flowchart LR
  Vision["src/vision"] --> Templates["src/templates"]
  Templates --> Engine["src/template-engine"]
  Engine --> Contract["src/template-engine/app-contract"]
  Contract --> UserApp["src/user-app"]
  UserApp --> UserUI["src/components/user-app"]
  Templates --> Studio["src/components/template-studio"]
  Studio --> Contract
  Docs["docs + project-state"] -.恢复与交接.-> UserApp
```

## 4. 核心数据流

端到端主链路如下。所有箭头都代表本地、显式、可检查的转换，而不是自动发布或自动训练。

```mermaid
flowchart TD
  A["Source image / manual template input"] --> B["Vision analysis"]
  B --> C["Cosmetic regions / segmentation / weighted sampling"]
  C --> D["Makeup parameters / semantics"]
  D --> E["Template builder"]
  E --> F["Template QA / correction / evidence"]
  F --> G["Template Library"]
  G --> H["Template Publish Package"]
  H --> I["UserAppTemplatePackage"]
  I --> J["User App Shell"]
  J --> K["Trial pack / feedback"]
  K --> L["Content QA"]
  L --> M["Release readiness / go-no-go"]
  M --> N["Internal trial ops"]
  N --> O["Trial result review"]
  O --> P["Iteration plan / backlog / priority"]
```

关键边界：

| 边界 | 规则 |
| --- | --- |
| `SourceImagePackage` | 不能直接进入 User App，SourceImagePackage 不是 training dataset，也不能直接成为 training dataset。 |
| `BrowserArtifactResource` | 是临时浏览器资源，不能作为 durable export。 |
| `TemplatePublishPackage` | 本地 export metadata，不是线上发布。 |
| `UserAppTemplatePackage` | 是消费契约，不是 App 本身，不可被 Shell / trial / QA 面板修改。 |
| User App Shell | 不能直接读取 `SourceImagePackage`，不能调用后端、相机、AR、OpenAI 或训练流程。 |

## 5. Vision-first 管线设计

Vision subsystem 覆盖 face detection / landmarks、MediaPipe FaceMesh provider、cosmetic regions、segmentation foundation、weighted pixel sampling、skin baseline、edge analysis、editable mask、correction persistence、dataset export / review queue、PNG image codec 和 artifact manifest。

当前限制也必须保留：未接真实深度学习 segmentation model，JPEG pixel decode intentionally unsupported，`public/mediapipe` 资源需要本地单独准备且不提交。

```mermaid
flowchart TD
  Input["Bound image artifact"] --> Face["Face detection / landmarks"]
  Face --> Regions["Cosmetic region taxonomy"]
  Regions --> Seg["Segmentation foundation"]
  Seg --> Sample["Weighted pixel sampling"]
  Sample --> Skin["Skin baseline / edge analysis"]
  Skin --> Params["Makeup parameters"]
  Params --> Mask["Editable mask workbench"]
  Mask --> Correction["Human correction persistence"]
  Correction --> Review["Dataset review queue"]
```

```text
Mask correction / weighted sampling 示意图

┌──────────────────────── face crop ────────────────────────┐
│                                                            │
│    [region polygon]      sample weight high                │
│       ████████             center pixels                   │
│     ██░░░░░░░░██                                           │
│    ██░ editable ░██       feathered edge = lower weight     │
│     ██░ mask  ░██                                           │
│       ████████                                             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 6. Template Studio 设计

Template Studio 是管理员工作台，覆盖 Source Image Intake、`TemplateAnalysisSeed`、Vision Analysis、Overlay Debug、Editable Mask Workbench、Batch Reanalysis、Evidence Panel、Dataset Panel、Review Queue、Replay Viewer、Template Library、Publish Package、Package Preview 和 User App Prototype Consumer。下面的 Template Studio 工作流展示了从素材导入到 contract 预览的管理员操作链路。

![Template Studio Main](../assets/screenshots/template-studio-main.png)

```mermaid
flowchart LR
  Intake["Source Image Intake"] --> Seed["TemplateAnalysisSeed"]
  Seed --> Vision["Vision Analysis"]
  Vision --> Overlay["Overlay Debug"]
  Vision --> Mask["Editable Mask Workbench"]
  Mask --> Reanalysis["Batch Reanalysis"]
  Reanalysis --> Evidence["Evidence Panel"]
  Evidence --> Dataset["Dataset Panel"]
  Dataset --> Review["Review Queue"]
  Review --> Replay["Replay Viewer"]
  Review --> Library["Template Library"]
  Library --> Package["Publish Package"]
  Package --> Preview["Package Preview"]
  Preview --> Consumer["User App Prototype Consumer"]
```

```mermaid
flowchart TB
  Admin["Admin workbench"] --> Intake
  Admin --> Batch["Production Batch QA"]
  Admin --> Library["Template Library Panel"]
  Admin --> Preview["Package / Contract Preview"]
  Admin --> Consumer["Read-only Prototype Consumer"]
  Admin --> Dataset["Dataset / Review / Replay"]
```

## 7. Template / App Contract 设计

核心 contract 包括 `MakeupTemplate`、`TemplateEvidence`、`HumanCorrectionDataset`、`TemplateLibraryEntry`、`TemplatePublishPackage` 和 `UserAppTemplatePackage`。兼容性验证会阻断 object URL、local absolute path、image bytes、large inline bytes 和 React state。JSON round-trip stability 是进入 User App Shell 前的基础要求。

```mermaid
flowchart LR
  Raw["Vision + human correction"] --> Template["MakeupTemplate"]
  Template --> Evidence["TemplateEvidence"]
  Evidence --> Library["TemplateLibraryEntry"]
  Library --> Publish["TemplatePublishPackage"]
  Publish --> AppPkg["UserAppTemplatePackage"]
  AppPkg --> Shell["User App Shell"]
  Raw -.禁止直接.-> AppPkg
  Raw -.禁止直接.-> Shell
```

```mermaid
sequenceDiagram
  participant Library as Template Library
  participant Publish as Publish Package Builder
  participant Adapter as App Contract Adapter
  participant Shell as User App Shell
  Library->>Publish: approved / local_published entries
  Publish->>Adapter: validated local package
  Adapter->>Adapter: normalize steps / regions / tools / products
  Adapter->>Shell: UserAppTemplatePackage
  Shell-->>Adapter: read-only consumption
```

## 8. User App Shell 设计

User App Shell 是 local PWA / Mobile Web MVP Shell。普通用户路径包括 template list / detail、step-by-step guidance、tools / product suggestions、local onboarding、local preferences、local session persistence、discovery / recommendation placeholder、photo / personalization placeholder 和 privacy notice。

管理员路径包括 PWA readiness、mobile web polish、browser/mobile QA、trial pack、content QA、release readiness gate、internal trial ops、trial result review 和 trial iteration plan。

![User App Shell Mobile Home](../assets/screenshots/user-app-shell-mobile-home.png)

```mermaid
flowchart TB
  Home["移动端练习入口"] --> Discover["发现妆容"]
  Home --> Detail["模板详情"]
  Detail --> Guide["分步跟练"]
  Guide --> Tools["工具 / 产品建议"]
  Guide --> Regions["区域说明"]
  Home --> Prep["我的准备"]
  Home --> Prefs["我的偏好"]
  Home --> Session["本地进度"]
  Home --> Privacy["隐私说明"]
```

```mermaid
flowchart LR
  User["普通用户路径"] --> U1["跟练 / 发现 / 偏好 / 本地进度 / 隐私"]
  Admin["管理员检查路径"] --> A1["PWA / MVP polish / QA"]
  Admin --> A2["Trial pack / Content QA / Release readiness"]
  Admin --> A3["Internal trial ops / Result review / Iteration plan"]
  User -.不显示技术入口.-> Admin
```

## 9. 内部试用体系设计

内部试用体系从 Phase 8C 到 Phase 9C 逐步形成闭环：

| Phase | 能力 | 说明 |
| --- | --- | --- |
| 8C | User App MVP Trial Pack | 试用任务、反馈表、trial readiness。 |
| 8D | Template Content QA | 内容可懂性、步骤可操作性、试用模板选择。 |
| 8E | MVP Release Readiness Gate | go / warning / no-go，仅用于内部试用准备。 |
| 9A | Internal Trial Operations | 参与者类型、试用流程、观察模板、结果复盘。 |
| 9B | Trial Result Review Framework | 匿名/mock 信号、问题分类、下一步决策。 |
| 9C | Internal Trial Iteration Plan | backlog、priority、workstream、下一轮行动。 |

```mermaid
flowchart TD
  TrialPack["8C Trial Pack"] --> Feedback["Feedback form preview"]
  Feedback --> ContentQA["8D Content QA"]
  ContentQA --> Gate["8E Release Readiness / Go-No-Go"]
  Gate --> Ops["9A Trial Ops"]
  Ops --> Review["9B Result Review"]
  Review --> Iteration["9C Iteration Plan"]
  Iteration --> Learning["9D Learning Summary / Product Decision Gate"]
  Gate -.no-go.-> Fix["Pause / fix boundary"]
  Review -.critical privacy issue.-> Fix
```

```mermaid
stateDiagram-v2
  [*] --> ReadyCheck
  ReadyCheck --> Go: ready
  ReadyCheck --> Warning: ready_with_warnings
  ReadyCheck --> NoGo: blocked
  Go --> InternalTrial
  Warning --> InternalTrial: only if warning accepted
  NoGo --> Pause
  InternalTrial --> ResultReview
  ResultReview --> Iterate
  ResultReview --> Pause: privacy / scope blocker
```

## 10. 隐私与安全边界

系统必须持续明确：

- 不采集真实用户照片。
- 不上传照片。
- 不保存 image bytes、base64、object URL、local path。
- 不保存 `faceEmbedding` 或 `biometricId`。
- 不收集健康信息、敏感身份信息、精确身份信息。
- 不写真实用户记录到 `project-state`。
- 不写 trial feedback 到 training dataset。
- 不调用 OpenAI API 或 external API。
- 不做 backend、database、analytics。

```mermaid
flowchart LR
  User["User App Shell local UI"] --> Local["Local-only shell state"]
  Local --> Sanitize["Privacy sanitization"]
  Sanitize --> View["Guidance / progress display"]
  User -.禁止.-> Backend["Backend / DB / analytics"]
  User -.禁止.-> Camera["Camera / AR"]
  User -.禁止.-> Training["Training dataset"]
  User -.禁止.-> API["OpenAI / external APIs"]
```

```mermaid
flowchart TD
  Forbidden["禁止数据流"] --> F1["真实照片 / image bytes / base64"]
  Forbidden --> F2["object URL / local absolute path"]
  Forbidden --> F3["姓名 / 联系方式 / 健康 / 敏感身份"]
  Forbidden --> F4["faceEmbedding / biometricId"]
  F1 -.不得进入.-> ProjectState["project-state"]
  F2 -.不得进入.-> Contract["UserAppTemplatePackage"]
  F3 -.不得进入.-> Trial["trial feedback / ops"]
  F4 -.不得进入.-> Training["training dataset"]
```

## 11. 当前不做事项

当前不做 production app、iOS native、React Native、Flutter、App Store/TestFlight、backend、database、accounts、cloud sync、camera、AR、OpenAI API、external CV API、training model、ecommerce、payment 或 community。

## 12. 当前已知限制

| 限制 | 说明 |
| --- | --- |
| No production user app | User App Shell 仍是本地 prototype。 |
| No real camera / AR | 照片与个性化只是占位，不请求权限。 |
| No backend / sync | 无账号、云同步、数据库、analytics。 |
| `public/mediapipe` not committed | MediaPipe 本地资源需要单独准备。 |
| JPEG decode unsupported | 当前像素 decode 重点是 PNG / RGBA。 |
| No real deep segmentation model | 视觉管线仍以本地规则和可编辑 mask 为核心。 |
| Readiness gate | 不是 production approval。 |
| Browser/mobile QA | 不是 real device lab QA。 |
| Internal trial ops | 不是 public launch。 |

## 13. 测试与质量保障

质量保障由类型检查、单元测试、scoped tests、full tests、build、project status/context、context pack、browser QA、documentation recovery tests 和 project-state recovery tests 组成。

```mermaid
flowchart LR
  Change["Code/docs change"] --> Typecheck["npm run typecheck"]
  Typecheck --> Tests["npm run test / scoped tests"]
  Tests --> Build["npm run build"]
  Build --> Status["npm run project:status"]
  Status --> Context["npm run project:context"]
  Context --> Json["project-status/context-pack --json"]
  Json --> Git["commit + push"]
```

## 14. 项目状态恢复机制

恢复入口由 `START_HERE.md`、`docs/status/*`、`docs/prompts/*`、`project-state/*.json`、provider handoff、active task、skills docs、compact handoff 和 GitHub branch/commit workflow 共同组成。

```mermaid
flowchart TD
  NewAgent["New agent / provider switch"] --> Start["START_HERE.md"]
  Start --> Status["docs/status"]
  Status --> Prompts["docs/prompts"]
  Prompts --> State["project-state snapshot / handoff / active-task"]
  State --> Guardrails["guardrails / known limitations"]
  Guardrails --> Commands["project:status / project:context / tests"]
  Commands --> Branch["phase branch / commit / push"]
```

## 15. 后续路线

Phase 9C 已完成 Internal Trial Iteration Plan。下一建议阶段是 Phase 9D Internal Trial Learning Summary & Product Decision Gate。后续仍不默认进入 production app。真实用户试用或生产化之前，还需要运营、合规、隐私、数据边界、发布方式、仓库边界和是否需要 native/backend/camera/AR 的显式 gate。
