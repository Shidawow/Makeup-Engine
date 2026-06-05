import type { MakeupTemplate } from '../schema';

const STORAGE_KEY = 'makeup-engine:templates:v0.1';

export interface TemplateStorageSnapshot {
  templates: MakeupTemplate[];
  savedAt: string;
}

const readStorage = (): TemplateStorageSnapshot | null => {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as TemplateStorageSnapshot;
  } catch {
    return null;
  }
};

export const templateStorage = {
  list(): MakeupTemplate[] {
    return readStorage()?.templates ?? [];
  },
  save(template: MakeupTemplate): void {
    const snapshot = readStorage();
    const templates = snapshot?.templates ?? [];
    const existingIndex = templates.findIndex((item) => item.id === template.id);

    if (existingIndex >= 0) {
      templates.splice(existingIndex, 1, template);
    } else {
      templates.push(template);
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ templates, savedAt: new Date().toISOString() }),
    );
  },
  getById(id: string): MakeupTemplate | null {
    return this.list().find((template) => template.id === id) ?? null;
  },
};
