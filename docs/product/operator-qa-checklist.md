# Operator QA Checklist

Phase 11D operator QA verifies that the local User App MVP can be demonstrated
without exposing administrator-only registry, simulation, or production wording.

## Checklist

| Check ID | Check | Pass Standard | Failure Handling |
| --- | --- | --- | --- |
| QA-USER-01 | User App path renders | Default app opens on `用户 App 预览` and shows the MVP shell | Re-check `AppShell` default screen and package fixture loading |
| QA-USER-02 | Template selection | Local demo templates are visible and selectable | Re-check `UserAppTemplateSelection` and package fixtures |
| QA-USER-03 | Template detail | Detail page shows step preview, region guidance, tools, time, and start actions | Re-check detail view model and selected template state |
| QA-USER-04 | Preparation | Preparation page shows first practice focus, tools, product placeholders, privacy copy, and start action | Re-check `UserAppPreparation` copy and props |
| QA-USER-05 | Step guide | Step guide shows region, goal, tools, instruction, cautions, correction tips, previous/next/complete actions | Re-check current step selection and step view model |
| QA-USER-06 | Completion | Completion page shows completed count, completed regions, step review, restart, and return-to-selection actions | Re-check progress completion state |
| QA-MOBILE-01 | Mobile layout | Phone-width view keeps buttons and cards readable and touch-sized | Re-check responsive classes and sticky action area |
| QA-TERMS-01 | Forbidden terms | Ordinary path hides registry, write gate, simulator, approval boundary, production writer, Pipeline Trace, debug JSON, published/write/production-ready wording, and raw confidence wording | Move the term to admin-only copy or rewrite user-facing copy |
| QA-PRIVACY-01 | Privacy boundary | User path states local-only, no upload, no training, no real user data storage | Restore privacy copy before demo |
| QA-ADMIN-01 | Admin boundary | Template Studio, Vision Analysis, registry-chain panels, and demo readiness panel require explicit operator/admin navigation | Re-check `showAdminTools`, top nav, and admin tab visibility |
| QA-VISION-01 | Vision Analysis | Vision Analysis uses Readiness Score as detection usability, not model raw confidence | Re-check `VisionAnalysisReadinessSummary` wording |
| QA-MP-01 | MediaPipe assets | `npm run mediapipe:check` passes or missing-assets recovery guidance is clear | Restore ignored local files under `public/mediapipe` if real FaceMesh is needed |
| QA-REG-01 | Registry paused | Phase 10U remains the pause point and Phase 10V is not resumed | Stop and remove any actual write, mutation, publish, shell replacement, or production writer change |
| QA-GIT-01 | Git hygiene | No `public/mediapipe` binaries, `.pages`, docx, dist, tmp, node_modules, or local manual files are staged | Unstage unrelated or local files before commit |
| QA-BUILD-01 | Validation | MediaPipe check, scoped tests, typecheck, build, project status/context, and JSON status/context pass | Fix only 11D-related issues unless a prior-phase known exception is documented |
| QA-12E-01 | End-to-end demo routes | User App MVP, Vision Analysis, and Template Studio Operator Workflow can all be explained as separate demo routes | Follow `docs/product/photo-to-template-e2e-demo-script.md` and fix the blocked route |
| QA-12E-02 | Acceptance Trial panel | Template Studio operator area shows Acceptance Trial checklist, route status, forbidden claim checks, privacy checks, and next action | Re-check `PhotoToTemplateAcceptanceTrialPanel` and source report wiring |
| QA-12E-03 | Forbidden claims | Demo script and panel block fully automatic extraction, AI confirmed, medical, exact shade, registry write, publish, and production writer claims | Rewrite copy and keep the demo draft-preview-only |

## Operator Notes

- This checklist is an operator/admin artifact.
- It is not a backend QA system.
- It does not collect real user records.
- It does not authorize registry writes, publication, or production readiness.
- Phase 12E acceptance trial is also not production readiness; it is an
  operator-readable founder/demo review gate for the local semi-automatic draft
  chain.
