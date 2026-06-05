# Source Image Package Viewer

The Source Image Package viewer in Template Studio is a read-only inspection surface for Phase 6H-2 import results.

## Visible Summary

The viewer shows:

- package id
- image count
- ready count
- blocked count
- failed count
- codec summary
- quality summary
- quarantine reason summary

## Entry Detail

Each source image entry shows:

- original file name
- import status
- decoded dimensions
- codec kind
- quality score
- artifact links
- codec report
- quality report
- blocking issues

## Artifact Preference

The Studio selection order is:

1. `normalized-png`
2. `raw-rgba`
3. `json-rgba`

When a normalized PNG reference is browser-readable, Studio can show a visual preview. Otherwise it shows artifact metadata and an explicit local-path warning.

## Quarantine View

The quarantine panel groups blocked images by reason code. Typical reasons include codec blocking, unsupported JPEG pixel decode, failed decode, low source image quality, or missing artifacts.

The panel is read-only. Fixes happen in the source image import pipeline, not by editing quarantine state in Studio.
