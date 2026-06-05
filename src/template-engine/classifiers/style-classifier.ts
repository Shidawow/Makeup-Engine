import type { MakeupRegion } from '../../templates/schema';

export interface TemplateStyleClassification {
  family: string;
  finish: string;
  confidence: number;
}

export const classifyTemplateStyle = (
  regionCount: number,
  detectedRegions: MakeupRegion[],
): TemplateStyleClassification => {
  const eyeLed = detectedRegions.includes('eye');
  const contourLed = detectedRegions.includes('contour');

  return {
    family: contourLed ? 'western' : eyeLed && regionCount > 4 ? 'k-beauty' : 'natural',
    finish: contourLed ? 'soft-matte' : eyeLed ? 'dewy' : 'natural',
    confidence: Math.min(0.95, 0.7 + regionCount * 0.03),
  };
};
