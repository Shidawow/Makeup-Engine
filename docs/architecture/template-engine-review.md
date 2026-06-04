# Template Engine Review

## Modules Reviewed

- `src/template-engine/classifiers`
- `src/template-engine/decomposer`
- `src/template-engine/extractor`
- `src/template-engine/inference`
- `src/template-engine/regions`
- `src/template-engine/pipeline`
- `src/template-engine/template-builder`

## Can This Evolve Into a Makeup Template Compiler?

Yes. This is the strongest part of the new architecture. It already expresses the right business sequence:

```text
photo
→ decomposition
→ inference
→ extraction
→ template build
```

## Abstraction Leaks

- `template-pipeline` still contains direct knowledge of vision steps rather than depending entirely on a strict pipeline contract.
- `template-builder` currently assembles a template with a few heuristics that are still partially placeholder-like.
- `extractor` and `inference` are good directions, but their contract boundaries are still young.

## Missing Contracts

The template engine still needs stronger contracts for:

- region detection confidence normalization
- step provenance
- style evidence structure
- face strategy versioning
- template asset metadata and lifecycle status

## Extensibility Limits

The current design is extensible enough for a prototype, but not yet for a large product because:

- some fields are still stringly typed,
- many arrays are still unstructured lists of strings,
- `MakeupTemplate` is rich, but validation is still shallow,
- template storage is local-only and non-versioned.

## Assessment

This is the right architectural center for the new product. It needs contract hardening and better storage/versioning, not another generic runtime layer.
