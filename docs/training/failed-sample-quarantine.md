# Failed Sample Quarantine

Failed sample quarantine creates a report. It does not delete or mutate source
dataset files.

Reasons include:

- missing image reference
- missing mask artifact
- missing diff artifact
- invalid mask shape
- invalid diff shape
- checksum mismatch
- low quality score
- unsupported region
- split leakage risk
- unsupported artifact format

Training preflight can export quarantine JSON so operators can inspect blocked
or warning samples before a real training runtime consumes the dataset.
