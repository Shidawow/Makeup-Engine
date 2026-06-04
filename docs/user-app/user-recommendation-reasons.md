# User Recommendation Reasons

Phase 7E exposes user-facing recommendation reasons so the placeholder remains explainable.

## User-Facing Copy

Reasons use ordinary user language, for example:

- "这套妆容步骤较少，适合时间不多时练习。"
- "这套妆容难度较低，步骤更适合新手跟练。"
- "它匹配你选择的风格偏好，所以优先展示。"
- "这套妆容需要较多工具，当前不作为优先推荐。"

The UI must not expose internal score math, technical contract field names, training concepts, or implementation details.

## Warning And Blocked Copy

Warnings remain non-blocking but visible. Blocked templates explain why they cannot be recommended or used for step guidance.
