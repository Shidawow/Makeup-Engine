import { produceMakeupTemplate } from '../../template-engine';
import type { MakeupPhotoInput } from '../../vision';

export interface AdminUploadTemplateDemoInput {
  photo: MakeupPhotoInput;
  templateName?: string;
  createdBy?: string;
}

export const runAdminUploadTemplateDemo = async (
  input: AdminUploadTemplateDemoInput,
) => {
  return produceMakeupTemplate({
    image: input.photo,
    templateName: input.templateName ?? '日常妆容模板',
    createdBy: input.createdBy ?? 'admin',
  });
};
