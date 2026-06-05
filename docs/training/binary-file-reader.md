# Binary File Reader

`src/training/artifacts/binaryFileReader.ts` is the source image byte reader boundary.

It detects:

- `png`
- `jpeg`
- `json`
- `raw-rgba-binary`
- `unknown`

The reader produces deterministic checksums and explicit issues such as `binary-read-failed` and `unknown-file-kind`. It is not a UI reader and it does not touch Template Studio state.
