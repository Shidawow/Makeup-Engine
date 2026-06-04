import type { MakeupTemplate } from '../schema';
import { exampleMakeupTemplates } from './template-fixtures';

export const naturalDailyTemplate = exampleMakeupTemplates[0];
export const koreanGlassSkinTemplate = exampleMakeupTemplates[2];
export const westernSoftGlamTemplate = exampleMakeupTemplates[5];

export const coreExampleTemplates: MakeupTemplate[] = [
  naturalDailyTemplate,
  koreanGlassSkinTemplate,
  westernSoftGlamTemplate,
];
