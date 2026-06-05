# User App Makeup Step Contract

`UserAppMakeupStep` converts internal template steps into app-facing guidance.

Each step includes:

- `stepId`
- `order`
- `title`
- `instructionText`
- `region`
- `technique`
- `targetEffect`
- optional `colorHint`
- `intensity`
- tool ids and product ids
- estimated seconds
- common mistakes and correction tips
- optional visual reference
- evidence references
- warnings

Steps are sorted deterministically using the app order:

```text
skin-prep -> base -> brows -> eyeshadow -> eyeliner -> lashes -> blush -> contour -> highlight -> lips -> setting
```

Missing regions are not invented. If the source template only has lips and blush, the app package only emits lips and blush steps.

Visual references are references only. They cannot be object URLs or embedded image bytes.

