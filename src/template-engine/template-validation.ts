import type {
  MakeupTemplate,
  TemplateValidationIssue,
  TemplateValidationResult,
} from '../templates/schema';

const issue = (
  path: string,
  message: string,
  severity: TemplateValidationIssue['severity'] = 'error',
): TemplateValidationIssue => ({ path, message, severity });

export const validateProducedTemplate = (
  template: MakeupTemplate,
): TemplateValidationResult => {
  const issues: TemplateValidationIssue[] = [];

  if (!template.id.trim()) {
    issues.push(issue('id', 'Template id is required.'));
  }

  if (!template.name.trim()) {
    issues.push(issue('name', 'Template name is required.'));
  }

  if (template.steps.length === 0) {
    issues.push(issue('steps', 'At least one makeup step is required.'));
  }

  if (template.regions.every((region) => !region.detected)) {
    issues.push(issue('regions', 'At least one makeup region must be detected.'));
  }

  if (template.style.confidence < 0.5) {
    issues.push(
      issue('style.confidence', 'Style inference confidence is low.', 'warning'),
    );
  }

  return {
    valid: issues.every((entry) => entry.severity !== 'error'),
    issues,
  };
};
