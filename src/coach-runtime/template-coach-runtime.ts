import type { MakeupTemplate } from '../templates/schema';

export interface TemplateCoachRuntimeSummary {
  templateId: string;
  templateName: string;
  styleFamily: string;
  faceShape: string;
  skinType: string;
  eyeType: string;
  lipShape: string;
  techniqueCount: number;
  regionCount: number;
  goalCount: number;
  status: string;
}

export interface TemplateCoachRuntime {
  summary: TemplateCoachRuntimeSummary;
  template: MakeupTemplate;
}

export const createTemplateCoachRuntime = (
  template: MakeupTemplate,
): TemplateCoachRuntime => ({
  template,
  summary: {
    templateId: template.id,
    templateName: template.name,
    styleFamily: template.style.family,
    faceShape: template.faceSuitability.profile.faceShapes[0] ?? 'round',
    skinType: template.faceSuitability.profile.skinTypes[0] ?? 'combination',
    eyeType: template.faceSuitability.profile.eyeTypes[0] ?? 'hooded',
    lipShape: template.faceSuitability.profile.lipShapes[0] ?? 'full',
    techniqueCount: template.steps.length,
    regionCount: template.regions.filter((region) => region.detected).length,
    goalCount: template.goals.length,
    status: template.metadata.status,
  },
});
