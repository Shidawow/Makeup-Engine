import type { MakeupTemplate } from './legacyTypes';

export const toTemplateJson = (template: MakeupTemplate) => JSON.stringify(template, null, 2);

export const createTemplateFileName = (template: MakeupTemplate) =>
  `${template.metadata.name
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/^-|-$/g, '') || 'makeup-template'}.json`;
