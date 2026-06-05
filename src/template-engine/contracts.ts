import type { TemplateStyleInference } from '../beauty-knowledge';
import type {
  MakeupTemplate,
  MakeupStep,
  TemplateValidationResult,
} from '../templates/schema';
import type {
  DetectedMakeupRegion,
  MakeupPhotoInput,
  TemplateFaceAnalysis,
} from '../vision';

export interface TemplateProductionInput {
  image: MakeupPhotoInput;
  templateName: string;
  createdBy: string;
}

export interface TechniqueExtractionResult {
  steps: MakeupStep[];
  rationale: string[];
}

export interface TemplateProductionContext {
  input: TemplateProductionInput;
  faceAnalysis?: TemplateFaceAnalysis;
  detectedRegions?: DetectedMakeupRegion[];
  styleInference?: TemplateStyleInference;
  techniqueExtraction?: TechniqueExtractionResult;
  template?: MakeupTemplate;
  validation?: TemplateValidationResult;
}

export interface TemplateProductionResult {
  template: MakeupTemplate;
  validation: TemplateValidationResult;
  trace: string[];
}
