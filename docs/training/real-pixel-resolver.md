# Real Pixel Resolver

Phase 6D introduces a pixel resolver boundary for materialized JSON image pixel
artifacts. The supported real formats are `json-rgba-grid` and `json-rgb-grid`.
Browser ImageData, PNG, and JPEG are placeholder boundaries only.

Unsupported placeholder formats return explicit validation issues. The resolver
does not decode image files and does not depend on image processing libraries.
