# Source Image Package

A `SourceImagePackage` records imported admin photos and their normalized artifacts.

Each entry includes:

- source image id
- original filename and checksum
- detected codec
- decoded dimensions
- orientation
- normalized artifact links
- codec report
- quality report
- lineage
- import status

Valid statuses include `imported`, `normalized`, `ready_for_template_analysis`, `blocked_by_codec`, `blocked_by_quality`, and `failed`.

This package is not a training dataset. `build-training-dataset` blocks source-image packages unless masks, human corrections, review decisions, and training-ready split data exist.
