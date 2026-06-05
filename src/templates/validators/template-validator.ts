import type { MakeupTemplate, TemplateValidationResult } from '../schema';

const issue = (path: string, message: string, severity: 'error' | 'warning' = 'error') => ({
  path,
  message,
  severity,
});

export const validateTemplate = (template: MakeupTemplate): TemplateValidationResult => {
  const issues = [];

  if (!template.id.trim()) {
    issues.push(issue('id', '模板 ID 不能为空'));
  }

  if (!template.name.trim()) {
    issues.push(issue('name', '模板名称不能为空'));
  }

  if (template.steps.length === 0) {
    issues.push(issue('steps', '至少需要一个妆容步骤'));
  }

  if (template.regions.length === 0) {
    issues.push(issue('regions', '至少需要一个面部区域'));
  }

  if (template.faceStrategy.goals.length === 0) {
    issues.push(issue('faceStrategy.goals', 'Face Strategy 必须包含目标'));
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};
