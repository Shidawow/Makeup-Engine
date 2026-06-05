# User App Region Instruction Contract

`UserAppRegionInstruction` describes how a future app should explain a makeup region to the user.

Each region instruction includes:

- `regionId`
- `regionType`
- `displayName`
- `normalizedRegionReference`
- `applicationAreaDescription`
- `intensityRange`
- `blendDirection`
- `edgeSoftness`
- `symmetryHint`
- `userGuidanceText`

The normalized region reference is a stable string reference, not a local file path and not a browser object URL.

Region instructions are generated from reviewed template steps and evidence references. They do not bypass mask review, human correction, template evidence, or production QA.

