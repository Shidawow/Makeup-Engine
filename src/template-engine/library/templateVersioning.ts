import { stableHash } from '../../templates/storage/datasetExport';

export type TemplateVersionChangeType = 'patch' | 'minor' | 'major';

export interface TemplateVersionChangeLogEntry {
  version: string;
  changeType: TemplateVersionChangeType | 'initial' | 'status-change';
  createdAt: string;
  reason: string;
  notes: string[];
}

const parseVersion = (version: string): [number, number, number] => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);

  if (!match) {
    throw new Error(`Invalid template version: ${version}`);
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
};

export const createInitialTemplateVersion = (): string => '0.1.0';

export const bumpTemplateVersion = (
  version: string,
  changeType: TemplateVersionChangeType,
): string => {
  const [major, minor, patch] = parseVersion(version);

  if (changeType === 'major') {
    return `${major + 1}.0.0`;
  }

  if (changeType === 'minor') {
    return `${major}.${minor + 1}.0`;
  }

  return `${major}.${minor}.${patch + 1}`;
};

export const compareTemplateVersions = (left: string, right: string): number => {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);

  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }

  return 0;
};

export const createTemplateVersionChangeLog = (input: {
  previousVersion?: string;
  nextVersion: string;
  changeType: TemplateVersionChangeType | 'initial' | 'status-change';
  reason: string;
  notes?: readonly string[];
  createdAt?: string;
}): TemplateVersionChangeLogEntry => ({
  version: input.nextVersion,
  changeType: input.changeType,
  createdAt: input.createdAt ?? new Date().toISOString(),
  reason: input.reason,
  notes: [...(input.notes ?? [])],
});

export const validateTemplateVersion = (version: string): {
  valid: boolean;
  version?: string;
  issues: string[];
} => {
  try {
    parseVersion(version);

    return { valid: true, version, issues: [] };
  } catch (error) {
    return {
      valid: false,
      issues: [error instanceof Error ? error.message : String(error)],
    };
  }
};

export const summarizeTemplateVersionHistory = (
  history: readonly TemplateVersionChangeLogEntry[],
): string =>
  history.length === 0
    ? 'no template version history'
    : `template version history ${stableHash(history.map((entry) => entry.version))}`;
