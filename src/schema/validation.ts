import { MAKEUP_ACTIONS, MAKEUP_REGIONS } from './legacyTypes';
import type { MakeupRegion, MakeupTemplate } from './legacyTypes';

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const addIssue = (issues: ValidationIssue[], path: string, message: string) => {
  issues.push({ path, message });
};

const validateString = (
  value: unknown,
  issues: ValidationIssue[],
  path: string,
  required = true,
) => {
  if (typeof value !== 'string' || (required && value.trim().length === 0)) {
    addIssue(issues, path, '必须是非空字符串。');
  }
};

const validateNumber = (
  value: unknown,
  issues: ValidationIssue[],
  path: string,
  min = 0,
  max = 100,
) => {
  if (typeof value !== 'number' || Number.isNaN(value) || value < min || value > max) {
    addIssue(issues, path, `必须是 ${min} 到 ${max} 之间的数字。`);
  }
};

const validateInteger = (
  value: unknown,
  issues: ValidationIssue[],
  path: string,
  min = 1,
  max = 99,
) => {
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  ) {
    addIssue(issues, path, `必须是 ${min} 到 ${max} 之间的整数。`);
  }
};

const validateRegionValue = (
  value: unknown,
  issues: ValidationIssue[],
  path: string,
): value is MakeupRegion => {
  if (typeof value !== 'string' || !MAKEUP_REGIONS.includes(value as MakeupRegion)) {
    addIssue(issues, path, '必须是有效区域：base、brow、eye、contour、blush、lip。');
    return false;
  }

  return true;
};

const validateRegionParameters = (
  region: MakeupRegion,
  parameters: unknown,
  issues: ValidationIssue[],
  path: string,
) => {
  if (!isRecord(parameters)) {
    addIssue(issues, path, '必须是参数对象。');
    return;
  }

  if (region === 'brow') {
    validateString(parameters.shape, issues, `${path}.shape`);
    validateNumber(parameters.thickness, issues, `${path}.thickness`);
    validateNumber(parameters.arch_height, issues, `${path}.arch_height`);
    validateNumber(parameters.tail_length, issues, `${path}.tail_length`);
    validateNumber(parameters.edge_softness, issues, `${path}.edge_softness`);
  }

  if (region === 'eye') {
    const eyeShadow = parameters.eye_shadow;
    const eyeLiner = parameters.eye_liner;
    const lash = parameters.lash;

    if (!isRecord(eyeShadow)) {
      addIssue(issues, `${path}.eye_shadow`, '必须是眼影参数对象。');
    } else {
      validateString(eyeShadow.placement, issues, `${path}.eye_shadow.placement`);
      validateNumber(eyeShadow.intensity, issues, `${path}.eye_shadow.intensity`);
      validateNumber(
        eyeShadow.edge_softness,
        issues,
        `${path}.eye_shadow.edge_softness`,
      );
      validateString(eyeShadow.finish, issues, `${path}.eye_shadow.finish`);
      validateString(eyeShadow.color_family, issues, `${path}.eye_shadow.color_family`);
    }

    if (!isRecord(eyeLiner)) {
      addIssue(issues, `${path}.eye_liner`, '必须是眼线参数对象。');
    } else {
      validateString(eyeLiner.direction, issues, `${path}.eye_liner.direction`);
      validateNumber(eyeLiner.thickness, issues, `${path}.eye_liner.thickness`);
      validateNumber(eyeLiner.length_ratio, issues, `${path}.eye_liner.length_ratio`);
      validateNumber(eyeLiner.sharpness, issues, `${path}.eye_liner.sharpness`);
    }

    if (!isRecord(lash)) {
      addIssue(issues, `${path}.lash`, '必须是睫毛参数对象。');
    } else {
      validateNumber(lash.curl, issues, `${path}.lash.curl`);
      validateNumber(lash.density, issues, `${path}.lash.density`);
      validateString(lash.length_focus, issues, `${path}.lash.length_focus`);
    }
  }

  if (region === 'blush') {
    validateString(parameters.placement, issues, `${path}.placement`);
    validateNumber(parameters.spread, issues, `${path}.spread`);
    validateNumber(parameters.saturation, issues, `${path}.saturation`);
    validateString(parameters.finish, issues, `${path}.finish`);
  }

  if (region === 'lip') {
    validateString(parameters.shape, issues, `${path}.shape`);
    validateNumber(parameters.overline, issues, `${path}.overline`);
    validateString(parameters.texture, issues, `${path}.texture`);
    validateNumber(parameters.color_depth, issues, `${path}.color_depth`);
  }
};

export const validateMakeupTemplate = (value: unknown): ValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!isRecord(value)) {
    return {
      valid: false,
      issues: [{ path: '$', message: '模板必须是对象。' }],
    };
  }

  const metadata = value.metadata;
  if (!isRecord(metadata)) {
    addIssue(issues, 'metadata', 'metadata 必须是对象。');
  } else {
    validateString(metadata.id, issues, 'metadata.id');
    validateString(metadata.name, issues, 'metadata.name');
    validateString(metadata.version, issues, 'metadata.version');
    validateString(metadata.author, issues, 'metadata.author', false);
    validateString(metadata.description, issues, 'metadata.description', false);
    validateString(metadata.createdAt, issues, 'metadata.createdAt');
    validateString(metadata.updatedAt, issues, 'metadata.updatedAt');
  }

  if (!Array.isArray(value.styleTags)) {
    addIssue(issues, 'styleTags', 'styleTags 必须是数组。');
  } else {
    value.styleTags.forEach((tag, index) =>
      validateString(tag, issues, `styleTags.${index}`),
    );
  }

  const regions = value.regions;
  if (!isRecord(regions)) {
    addIssue(issues, 'regions', 'regions 必须是对象。');
  } else {
    MAKEUP_REGIONS.forEach((regionName) => {
      const region = regions[regionName];
      const path = `regions.${regionName}`;

      if (!isRecord(region)) {
        addIssue(issues, path, '区域配置必须是对象。');
        return;
      }

      if (region.region !== regionName) {
        addIssue(issues, `${path}.region`, `必须等于 ${regionName}。`);
      }

      if (typeof region.enabled !== 'boolean') {
        addIssue(issues, `${path}.enabled`, '必须是布尔值。');
      }

      validateString(region.goal, issues, `${path}.goal`);
      validateRegionParameters(regionName, region.parameters, issues, `${path}.parameters`);
    });
  }

  if (!Array.isArray(value.steps)) {
    addIssue(issues, 'steps', 'steps 必须是数组。');
  } else {
    value.steps.forEach((step, index) => {
      const path = `steps.${index}`;

      if (!isRecord(step)) {
        addIssue(issues, path, 'step 必须是对象。');
        return;
      }

      validateString(step.step_id, issues, `${path}.step_id`);
      validateRegionValue(step.region, issues, `${path}.region`);
      validateString(step.goal, issues, `${path}.goal`);

      if (!isRecord(step.tool)) {
        addIssue(issues, `${path}.tool`, 'tool 必须是对象。');
      } else {
        validateString(step.tool.type, issues, `${path}.tool.type`);
        validateString(step.tool.subtype, issues, `${path}.tool.subtype`);
      }

      if (!isRecord(step.product)) {
        addIssue(issues, `${path}.product`, 'product 必须是对象。');
      } else {
        validateString(step.product.category, issues, `${path}.product.category`);
        validateString(
          step.product.color_family,
          issues,
          `${path}.product.color_family`,
        );
        validateString(step.product.finish, issues, `${path}.product.finish`);
      }

      if (!isRecord(step.action)) {
        addIssue(issues, `${path}.action`, 'action 必须是对象。');
      } else {
        if (
          typeof step.action.type !== 'string' ||
          !MAKEUP_ACTIONS.includes(step.action.type as (typeof MAKEUP_ACTIONS)[number])
        ) {
          addIssue(issues, `${path}.action.type`, '必须是有效动作类型。');
        }
        validateString(step.action.direction, issues, `${path}.action.direction`);
        if (
          step.action.pressure !== 'light' &&
          step.action.pressure !== 'medium' &&
          step.action.pressure !== 'firm'
        ) {
          addIssue(issues, `${path}.action.pressure`, '必须是 light、medium 或 firm。');
        }
        validateInteger(step.action.repeat, issues, `${path}.action.repeat`);
      }

      if (!isRecord(step.placement)) {
        addIssue(issues, `${path}.placement`, 'placement 必须是对象。');
      } else {
        validateString(step.placement.anchor, issues, `${path}.placement.anchor`);
        validateString(step.placement.shape, issues, `${path}.placement.shape`);
        validateNumber(step.placement.size, issues, `${path}.placement.size`);
      }

      if (!isRecord(step.effect)) {
        addIssue(issues, `${path}.effect`, 'effect 必须是对象。');
      } else {
        validateNumber(step.effect.contrast, issues, `${path}.effect.contrast`);
        validateNumber(step.effect.softness, issues, `${path}.effect.softness`);
        validateNumber(step.effect.depth, issues, `${path}.effect.depth`);
      }
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};

export const isMakeupTemplate = (value: unknown): value is MakeupTemplate =>
  validateMakeupTemplate(value).valid;
