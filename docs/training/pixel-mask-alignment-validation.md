# Pixel Mask Alignment Validation

Pixel-mask alignment validation blocks malformed training samples before classifier training.

Checks include:

- pixel width and height match mask width and height
- pixel grid length matches `width * height`
- mask alpha grid length matches `width * height`
- normalized mask bounds remain inside `0..1`
- optional binary mask payload passes round-trip validation

Strict mode treats alignment errors as blocking. Warn mode can report them without stopping a dry-run, but classifier training should only consume aligned accepted + training-ready samples.
