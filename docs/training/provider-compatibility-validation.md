# Provider Compatibility Validation

Provider compatibility validation checks that a model package can be attached to the intended segmentation provider.

For the lightweight classifier provider, validation checks:

- model kind
- trained regions
- feature names
- pixel input requirement
- output type
- fallback policy

The provider remains opt-in. The validation does not replace local CV, does not call OpenAI, and does not read Template Studio state.
