import { inferTemplateStyle } from '../beauty-knowledge';
import { analyzeFaceForTemplate, detectMakeupRegions } from '../vision';
import type { TemplateProductionInput, TemplateProductionResult } from './contracts';
import { buildMakeupTemplate } from './template-builder';
import { extractTemplateTechniques } from './technique-extraction';
import { validateProducedTemplate } from './template-validation';

export const produceMakeupTemplate = async (
  input: TemplateProductionInput,
): Promise<TemplateProductionResult> => {
  const trace: string[] = ['image-input'];
  const faceAnalysis = await analyzeFaceForTemplate(input.image);
  trace.push('face-analysis');

  const detectedRegions = await detectMakeupRegions(input.image);
  trace.push('makeup-region-detection');

  const styleInference = inferTemplateStyle(faceAnalysis, detectedRegions);
  trace.push('style-inference');

  const techniqueExtraction = extractTemplateTechniques(
    detectedRegions,
    styleInference,
  );
  trace.push('technique-extraction');

  const template = buildMakeupTemplate(
    input,
    faceAnalysis,
    detectedRegions,
    styleInference,
    techniqueExtraction,
  );
  trace.push('template-build');

  const validation = validateProducedTemplate(template);
  trace.push('template-validation');

  return {
    template,
    validation,
    trace,
  };
};
