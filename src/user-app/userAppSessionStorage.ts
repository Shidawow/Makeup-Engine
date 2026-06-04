import {
  createInitialUserAppSession,
  USER_APP_SESSION_VERSION,
  validateUserAppSession,
  type UserAppSessionIssue,
  type UserAppSessionState,
} from './userAppSession';

export const USER_APP_SESSION_STORAGE_KEY = 'makeup-engine:user-app-session:v0.1';

export interface UserAppSessionStorageArea {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export interface UserAppSessionStorageAdapter {
  key: string;
  area: UserAppSessionStorageArea;
  scope: 'memory' | 'localStorage';
}

export interface UserAppSessionStorageResult {
  ok: boolean;
  session?: UserAppSessionState;
  issues: UserAppSessionIssue[];
  serialized?: string;
}

const memoryStore = (): UserAppSessionStorageArea => {
  const entries = new Map<string, string>();

  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value);
    },
    removeItem: (key) => {
      entries.delete(key);
    },
  };
};

const getBrowserLocalStorage = (): UserAppSessionStorageArea | null => {
  if (typeof globalThis !== 'object') {
    return null;
  }

  const candidate = (globalThis as { localStorage?: UserAppSessionStorageArea })
    .localStorage;
  return candidate ?? null;
};

export const createUserAppSessionStorageAdapter = (input?: {
  key?: string;
  storageArea?: UserAppSessionStorageArea;
  preferLocalStorage?: boolean;
}): UserAppSessionStorageAdapter => {
  const browserLocalStorage = input?.preferLocalStorage ? getBrowserLocalStorage() : null;
  const area = input?.storageArea ?? browserLocalStorage ?? memoryStore();

  return {
    key: input?.key ?? USER_APP_SESSION_STORAGE_KEY,
    area,
    scope: input?.storageArea || !browserLocalStorage ? 'memory' : 'localStorage',
  };
};

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const sanitizeUserAppSessionForStorage = (
  session: UserAppSessionState,
): UserAppSessionState =>
  createInitialUserAppSession({
    sessionId: session.sessionId,
    status: session.status,
    scope: 'local-persistence',
    selectedTemplateId: session.selectedTemplateId,
    activeStepId: session.activeStepId,
    templateProgress: session.templateProgress
      ? {
          templateId: session.templateProgress.templateId,
          activeStepId: session.templateProgress.activeStepId,
          orderedStepIds: [...session.templateProgress.orderedStepIds],
          completedStepIds: [...session.templateProgress.completedStepIds],
          skippedStepIds: [...session.templateProgress.skippedStepIds],
          progressPercent: session.templateProgress.progressPercent,
        }
      : undefined,
    onboarding: {
      status: session.onboarding.status,
      currentStep: session.onboarding.currentStep,
      completedStepIds: [...session.onboarding.completedStepIds],
      skippedStepIds: [...session.onboarding.skippedStepIds],
      progressPercent: session.onboarding.progressPercent,
    },
    localPreferences: cloneJson(session.localPreferences),
    discovery: {
      filter: cloneJson(session.discovery.filter),
      sortMode: session.discovery.sortMode,
      preferredStyleTags: [...session.discovery.preferredStyleTags],
    },
    lastVisitedSection: session.lastVisitedSection,
    dismissedLocalWarnings: [...session.dismissedLocalWarnings],
  });

export const validateSessionStoragePayload = (
  payload: unknown,
): UserAppSessionIssue[] => validateUserAppSession(payload);

const parseSession = (serialized: string): UserAppSessionStorageResult => {
  try {
    const parsed = JSON.parse(serialized) as unknown;
    const issues = validateSessionStoragePayload(parsed);

    return {
      ok: issues.length === 0,
      session: issues.length === 0 ? (parsed as UserAppSessionState) : undefined,
      issues,
      serialized,
    };
  } catch {
    return {
      ok: false,
      issues: [
        {
          code: 'version_mismatch',
          message: 'Stored User App session payload is not valid JSON.',
          blocking: true,
        },
      ],
      serialized,
    };
  }
};

export const saveUserAppSession = (
  adapter: UserAppSessionStorageAdapter,
  session: UserAppSessionState,
): UserAppSessionStorageResult => {
  const inputIssues = validateSessionStoragePayload(session);

  if (inputIssues.length > 0) {
    return { ok: false, issues: inputIssues };
  }

  const sanitized = sanitizeUserAppSessionForStorage(session);
  const issues = validateSessionStoragePayload(sanitized);

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const serialized = JSON.stringify(sanitized);
  adapter.area.setItem(adapter.key, serialized);

  return {
    ok: true,
    session: sanitized,
    issues: [],
    serialized,
  };
};

export const loadUserAppSession = (
  adapter: UserAppSessionStorageAdapter,
): UserAppSessionStorageResult => {
  const serialized = adapter.area.getItem(adapter.key);

  if (!serialized) {
    return {
      ok: true,
      session: createInitialUserAppSession(),
      issues: [],
    };
  }

  return parseSession(serialized);
};

export const clearUserAppSession = (
  adapter: UserAppSessionStorageAdapter,
): UserAppSessionStorageResult => {
  adapter.area.removeItem(adapter.key);

  return {
    ok: true,
    session: createInitialUserAppSession({ status: 'reset' }),
    issues: [],
  };
};

export const exportUserAppSessionSnapshot = (
  session: UserAppSessionState,
): UserAppSessionStorageResult => {
  const issues = validateSessionStoragePayload(session);

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const sanitized = sanitizeUserAppSessionForStorage(session);

  return {
    ok: true,
    session: sanitized,
    issues: [],
    serialized: JSON.stringify({
      ...sanitized,
      schemaVersion: USER_APP_SESSION_VERSION,
    }),
  };
};

export const importUserAppSessionSnapshot = (
  serialized: string,
): UserAppSessionStorageResult => parseSession(serialized);
