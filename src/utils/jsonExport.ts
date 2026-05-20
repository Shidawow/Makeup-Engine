import type { MakeupTemplate } from '../types/makeup';

export const toTemplateJson = (template: MakeupTemplate) =>
  JSON.stringify(template, null, 2);

export const downloadTemplateJson = (template: MakeupTemplate) => {
  const fileName = `${template.metadata.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'makeup-template'}.json`;
  const blob = new Blob([toTemplateJson(template)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};
