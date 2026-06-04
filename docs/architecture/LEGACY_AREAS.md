# Legacy Areas

The following directories are retained for compatibility, older engine experiments, or historical runtime boundaries:

- `src/engine`
- `src/runtime`
- `src/intelligence/runtime`

They are not the center for new mainline features.

## Current Rule

New work should prefer the active modules:

- `src/vision`
- `src/templates`
- `src/template-engine`
- `src/training`
- `src/components/template-studio`
- `scripts`

Only touch legacy areas when maintaining compatibility or fixing a narrowly scoped issue that already belongs there.
