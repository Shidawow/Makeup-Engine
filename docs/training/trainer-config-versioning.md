# Trainer Config Versioning

Trainer config schema version: `trainer-config-v0.1`.

The config contains:

- enabled region targets
- minimum samples per region
- mask artifact format
- diff artifact format
- split policy
- quality threshold
- batch size
- runtime adapter kind

Current migration behavior is v0.1 to v0.1 no-op. The migration boundary exists
so Phase 6C can evolve config fields without breaking existing training run
packages.

The default config uses JSON artifacts, dry-run runtime, batch size 8, and a
minimum quality score of 0.7.
