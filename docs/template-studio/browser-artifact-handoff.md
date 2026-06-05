# Browser Artifact Handoff

Browsers cannot read arbitrary local paths from a CLI-generated package. A manifest reference such as `normalized-png/image-a.png` is a package reference, not an image URL.

Phase 6H-4 uses `SourceImageArtifactBinding` to bridge the boundary safely:

- The operator chooses a local file through an `<input type="file">`.
- Studio reads only that selected `File`.
- Studio creates a temporary `BrowserArtifactResource`.
- A normalized PNG binding can create a temporary `blob:` object URL.
- The object URL can feed preview and Vision Analysis.

## Object URL Lifecycle

Object URLs are session resources. They can be revoked and they do not remain valid after page refresh. Studio stores binding metadata only; the operator must re-select local files after refresh.

## JSON RGBA Boundary

JSON RGBA artifacts can be parsed and validated. They only become preview or Vision Analysis inputs if Studio can generate a browser image data URL. Otherwise they remain summary-only and must not be presented as runnable image resources.

## Raw RGBA Boundary

Raw RGBA support is intentionally boundary-first. Current Studio handling reports the artifact and marks it unsupported for direct browser preview or Vision Analysis. This avoids fake support and keeps the browser security boundary explicit.

