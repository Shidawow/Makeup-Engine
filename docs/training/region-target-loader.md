# Region Target Loader

The region target loader organizes loaded samples by cosmetic region:

- lips
- blush
- eyeshadow
- eyeliner
- contour
- highlight

It supports:

- grouping samples by region
- filtering by region
- filtering by quality threshold
- computing average sample weights
- summarizing region coverage
- warning when a region has no or very few samples

Region targets are derived only from accepted and training-ready split JSONL
records. The loader does not infer new masks or modify segmentation artifacts.

The batch iterator can use region filters to create focused batches, or balanced
region batches when a future trainer wants per-region training passes.
