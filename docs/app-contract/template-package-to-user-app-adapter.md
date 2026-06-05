# Template Package To User App Adapter

Phase 6K adds the adapter from `TemplatePublishPackage` to `UserAppTemplatePackage`.

Main implementation:

- `src/template-engine/app-contract/publishPackageToUserApp.ts`
- `src/template-engine/app-contract/makeupStepNormalization.ts`
- `src/template-engine/app-contract/userAppCompatibility.ts`

The adapter:

- reads only validated publish package entries
- converts template steps into app-facing makeup steps
- converts template regions into app region instructions
- derives style tags, difficulty, estimated duration, display hints, tools, and products
- keeps local-only disclaimers
- preserves lineage back to publish package, library entry, production task, and source image id
- filters and validates against runtime-only references

Blocking rules:

- a package with failed readiness does not produce app templates
- an entry without template steps is blocked
- object URLs, local absolute paths, large image bytes, and React state are invalid
- `TemplatePublishPackage` is consumption input only and is not online publication

