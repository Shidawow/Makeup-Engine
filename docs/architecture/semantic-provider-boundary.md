# Semantic Provider Boundary

`SemanticVisionProvider` is an optional enrichment boundary. It is not a new
primary CV pipeline.

## Input Boundary

A provider can receive:

- `MakeupParameterSchema` from local CV
- `TemplateEvidence` summary
- semantic analysis from local rules
- weighted pixel analysis
- optional image crop reference
- optional region thumbnail reference
- optional admin notes

The provider does not receive authority to write masks, rerun segmentation, or
control pixel sampling.

## Output Boundary

A provider can return:

- makeup style name
- style family
- professional makeup description
- step explanations
- suitable face types
- suitable occasions
- caution notes
- QA suggestions
- reviewer hints
- user-facing explanation

These enrich template copy and review context. They do not become mask labels by
themselves.

## OpenAI Placeholder

`OpenAISemanticProvider` is placeholder-only in this phase. It:

- validates config
- returns deterministic mock enrichment
- records `placeholder:no-api-call`
- does not read API keys
- does not call OpenAI
- does not expose secrets in the frontend

## Failure Behavior

Template enrichment is optional. If no provider exists or provider enrichment
fails, the template remains the local rule-based output. The local CV chain is
therefore stable and independent from future semantic providers.
