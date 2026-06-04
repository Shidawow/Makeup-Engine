# User App Readiness Checklist

Use this checklist before treating the local User App MVP Shell as ready for app prototype QA.

## Required Checks

- A valid `UserAppTemplatePackage` is loaded.
- The package has at least one app-facing template.
- Step guidance can start for usable templates.
- Blocked templates show clear reasons and cannot enter step guidance.
- Warning templates keep warning copy visible.
- Onboarding remains optional and local-only.
- Preferences remain non-sensitive and display-only.
- Discovery and recommendation stay deterministic, local-only, and rule-based.
- Session persistence stores only allowed lightweight shell state.
- Session recovery reconciles against the current package without mutating it.
- Privacy copy is visible and states that photos, object URLs, local paths, biometrics, sensitive profile data, and training input are not stored.
- Mobile/narrow layout keeps core actions readable.

## Product QA Flow

1. Load or use a valid example `UserAppTemplatePackage`.
2. Check template list and detail readability.
3. Enter step guidance and verify progress controls.
4. Open discovery and recommendation placeholder.
5. Open preferences and confirm local-only copy.
6. Open local session controls and recovery notice.
7. Open App readiness and mobile QA panels.
8. Resolve blocking issues before prototype sign-off.

## Not Included

This checklist does not create the production app, does not test native iOS behavior, does not use a backend, does not run real camera/photo intake, and does not train a model.
