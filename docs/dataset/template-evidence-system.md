# Template Evidence System

TemplateEvidence makes every human-verified MakeupTemplate auditable. It
records where the template came from, which vision signals supported it, what
the human editor changed, and whether the result is ready for dataset export.

## Schema

The contract lives in:

```text
src/templates/schema/evidence.schema.ts
```

`TemplateEvidence` contains:

- `sourceImageEvidence`
- `faceGeometryEvidence`
- `segmentationEvidence`
- `weightedSamplingEvidence`
- `skinBaselineEvidence`
- `edgeAnalysisEvidence`
- `semanticEvidence`
- `humanCorrectionEvidence`
- `convergenceEvidence`
- `qualityEvidence`

Every evidence block includes:

- `source`
- `confidence`
- `version`
- `createdAt`
- `regionIds`
- `debugReferences`
- `notes`

`MakeupTemplate` can now reference the complete evidence object through
`template.evidence`, and metadata carries `evidenceId` plus
`humanVerificationStatus`.

## Verification States

The convergence layer can classify templates as:

- `ai_generated`
- `human_corrected`
- `human_verified`
- `ready_for_dataset`
- `rejected`

These states separate raw AI output from data-quality assets. A template becomes
`ready_for_dataset` only when human correction evidence and confidence are high
enough.

## Convergence Upgrade

`src/template-engine/convergence/templateConvergence.ts` now outputs:

- Converged `MakeupTemplate`
- Formal `TemplateEvidence`
- Human verification status
- Correction confidence
- Human-adjusted regions
- Dataset-ready correction samples

The convergence result keeps the previous metadata fields for compatibility,
but the durable audit contract is now the `TemplateEvidence` object.

## Admin UX

Template Studio includes an Evidence Panel. It displays FaceMesh, segmentation,
weighted sampling, human correction, convergence, and quality evidence so an
administrator can see whether a template is AI-only or AI plus human verified.

## Dataset Relationship

TemplateEvidence explains why a template is trusted. HumanCorrectionDataset
stores the concrete supervision examples that could train future segmentation
models. Together they form the evidence chain:

```text
source image
-> AI analysis
-> human correction
-> local reanalysis
-> converged template
-> evidence
-> dataset sample
```

No backend, database, LLM dependency, or user-side coach runtime is required for
this phase.
