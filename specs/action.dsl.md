# Action DSL

Makeup Engine 的动作 DSL 用于描述每一步如何执行。DSL 保持机器可读字段为英文，方便 JSON 导入导出、校验和后续自动生成步骤。

## Action Object

```json
{
  "type": "blend",
  "direction": "眼尾向上",
  "pressure": "medium",
  "repeat": 3,
  "speed": "slow"
}
```

## Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | enum | yes | 动作类型。 |
| `direction` | string | yes | 动作方向，可使用自然语言。 |
| `pressure` | enum | yes | 力度。 |
| `repeat` | integer | yes | 重复次数，从 1 开始。 |
| `speed` | enum | yes | 执行速度。 |

## Action Types

| Value | 中文显示 | Intent |
| --- | --- | --- |
| `blend` | 晕染 | 柔化边界、过渡颜色或融合产品。 |
| `tap` | 轻拍 | 少量叠加、按压上妆、避免拖拽底层。 |
| `drag` | 推开 | 将产品沿方向拉开或延展。 |
| `smudge` | 柔化 | 模糊线条、边缘或局部色块。 |
| `line` | 描线 | 建立清晰边缘、轮廓或睫毛根部线条。 |
| `fill` | 填色 | 填满区域，提升饱和度或覆盖度。 |

## Pressure

| Value | 中文显示 | Meaning |
| --- | --- | --- |
| `light` | 轻 | 最小压力，适合轻薄叠加和柔化边缘。 |
| `medium` | 中 | 常规压力，适合多数晕染和铺色步骤。 |
| `firm` | 较重 | 更高压力，适合明确线条或局部塑形。 |

## Speed

| Value | 中文显示 | Meaning |
| --- | --- | --- |
| `slow` | 慢速 | 精细控制，适合眼妆、唇线和修容边界。 |
| `steady` | 匀速 | 稳定执行，适合大多数步骤。 |
| `quick` | 快速 | 快速带过，适合轻扫、轻拍或最终融合。 |

## Authoring Rules

- `type`、`pressure`、`speed` 必须使用固定枚举值。
- `direction` 可以使用中文自然语言，例如 `由中心向外`、`边缘向内`、`眼尾向上`。
- `repeat` 应表达实际重复次数，不要写成文本说明。
- 一个 step 只放一个主动作；复杂动作应拆成多个 step。
