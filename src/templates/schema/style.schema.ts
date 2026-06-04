export const STYLE_TAXONOMY = [
  'natural',
  'clean-girl',
  'k-beauty',
  'j-beauty',
  'douyin',
  'western',
  'glam',
] as const;

export const STYLE_FINISHES = [
  'natural',
  'glass',
  'matte',
  'soft-matte',
  'dewy',
  'satin',
] as const;

export const STYLE_CONTRAST_LEVELS = ['low', 'medium', 'high'] as const;

export const COLOR_TEMPERATURES = ['warm', 'cool', 'neutral'] as const;

export type StyleTaxonomyFamily = (typeof STYLE_TAXONOMY)[number];

export type StyleFinish = (typeof STYLE_FINISHES)[number];

export type StyleContrastLevel = (typeof STYLE_CONTRAST_LEVELS)[number];

export type ColorTemperature = (typeof COLOR_TEMPERATURES)[number];

export interface StyleColorPalette {
  temperature: ColorTemperature;
  dominantFamilies: string[];
  accentFamilies: string[];
}

export interface StyleTaxonomy {
  family: StyleTaxonomyFamily;
  finish: StyleFinish;
  contrast: StyleContrastLevel;
  palette: StyleColorPalette;
  signatureTraits: string[];
  confidence: number;
  evidence: string[];
}

export type StyleTaxonomyProfile = StyleTaxonomy;
