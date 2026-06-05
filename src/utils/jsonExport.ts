import { createTemplateFileName, toTemplateJson } from '../schema/json';
import type { MakeupTemplate } from '../schema/legacyTypes';

export { createTemplateFileName, toTemplateJson };

export const downloadTemplateJson = (template: MakeupTemplate) => {
  const blob = new Blob([toTemplateJson(template)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = createTemplateFileName(template);
  anchor.click();
  URL.revokeObjectURL(url);
};
