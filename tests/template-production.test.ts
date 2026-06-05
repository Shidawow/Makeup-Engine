import { describe, expect, it } from 'vitest';
import { createTemplateCoachRuntime } from '../src/coach-runtime';
import { runAdminUploadTemplateDemo } from '../src/templates/examples';
import type { MakeupPhotoInput } from '../src/vision';

const samplePhoto: MakeupPhotoInput = {
  id: 'photo-001',
  fileName: 'warm-round-hooded-full-daylight.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 128000,
  source: 'admin-upload',
  uploadedAt: '2026-05-26T12:00:00.000Z',
  uploadedBy: 'admin',
};

describe('template production system', () => {
  it('produces reusable MakeupTemplate objects from uploaded photos', async () => {
    const result = await runAdminUploadTemplateDemo({
      photo: samplePhoto,
      templateName: '日常妆容模板',
      createdBy: 'admin',
    });

    expect(result.template.id).toBe('template-photo-001');
    expect(result.template.name).toBe('日常妆容模板');
    expect(result.template.steps.length).toBeGreaterThan(0);
    expect(result.validation.valid).toBe(true);
    expect(result.trace).toEqual([
      'image-input',
      'face-analysis',
      'makeup-region-detection',
      'style-inference',
      'technique-extraction',
      'template-build',
      'template-validation',
    ]);
  });

  it('creates a coach runtime summary from the produced template', async () => {
    const result = await runAdminUploadTemplateDemo({
      photo: samplePhoto,
      templateName: '日常妆容模板',
      createdBy: 'admin',
    });

    const runtime = createTemplateCoachRuntime(result.template);

    expect(runtime.summary.templateName).toBe('日常妆容模板');
    expect(runtime.summary.goalCount).toBeGreaterThan(0);
    expect(runtime.summary.techniqueCount).toBeGreaterThan(0);
    expect(runtime.summary.regionCount).toBeGreaterThan(0);
  });
});
