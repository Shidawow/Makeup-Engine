# Internal Trial Priority Framework

Phase 9C priority framework scores anonymous/mock backlog items for the next internal iteration. It is deterministic local planning logic, not AI analysis and not production analytics.

## Priority Levels

- `p0_blocker`: must fix before more internal trials.
- `p1_high`: next-iteration high priority.
- `p2_medium`: planned normal priority.
- `p3_low`: low priority or polish.
- `observe_more`: not enough confidence or actionability to fix yet.

## Rules

- Critical privacy or boundary issues always become `p0_blocker`.
- High severity Shell blockers become `p1_high`.
- High severity content blockers become `p1_high`.
- Repeated medium issues can upgrade to high priority.
- Low confidence issues become `observe_more`.
- `not_actionable_yet` issues do not become immediate fixes.

## Pause Conditions

Pause the next trial if any issue indicates collection of real names, contact information, photos, health information, sensitive identity information, biometrics, backend records, analytics records, upload, AI analysis, training, or real user trial records in `project-state`.

## Boundary

The priority framework must not connect to backend analytics, use OpenAI or external APIs, train models, write training inputs, or store real participant records. It only ranks local anonymous/example issue summaries.
