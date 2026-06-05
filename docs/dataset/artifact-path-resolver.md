# Artifact Path Resolver

The artifact path resolver defines portable paths for materialized training
datasets. Its rules are:

- use relative paths by default;
- normalize Windows separators to POSIX-style `/` in manifests;
- reject absolute paths unless `allowAbsolutePaths` is explicitly enabled;
- use portable URIs such as `materialized://masks/{artifactId}.json`;
- avoid embedding local machine paths in `manifest.json`.

Main paths:

```text
manifest.json
package.json
audit-report.json
checksums.json
images/{imageReferenceId}.json
masks/{artifactId}.json
diffs/{artifactId}.json
splits/train.jsonl
splits/validation.jsonl
splits/test.jsonl
```

The browser never writes these files. Studio only exports the offline package
JSON files. The CLI resolves paths and writes the local materialized directory.
