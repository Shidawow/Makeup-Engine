import type { MakeupPixelAnalysis } from '../pixel-analysis';

export type LipStyle = 'soft_gradient' | 'defined_satin' | 'muted_natural';
export type LipFinish = 'velvet' | 'gloss' | 'satin';
export type BlushStyle = 'high_lift' | 'soft_diffused' | 'barely_there';
export type EyeStyle = 'soft_smokey' | 'clean_defined' | 'natural_shadow';

export interface MakeupSemanticAnalysis {
  version: '0.1';
  sourcePixelAnalysis: MakeupPixelAnalysis;
  lipStyle: LipStyle;
  lipFinish: LipFinish;
  blushStyle: BlushStyle;
  eyeStyle: EyeStyle;
  semanticSummary: string[];
  explanations: string[];
}

