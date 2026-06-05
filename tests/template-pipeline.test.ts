import { describe, expect, it } from 'vitest';
import { generateMakeupTemplate } from '../src/template-engine';
import type { MakeupPhotoInput } from '../src/vision';

const photo: MakeupPhotoInput = {
  id: 'admin-photo-001',
  fileName: 'round-hooded-daily-warm.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 250000,
  source: 'admin-upload',
  uploadedAt: '2026-05-26T00:00:00.000Z',
  uploadedBy: 'admin',
};

describe('template pipeline', () => {
  it('generates a structured makeup template from a photo', async () => {
    const result = await generateMakeupTemplate({
      image: photo,
      templateName: '日常模板',
      createdBy: 'admin',
    });

    expect(result.template.id).toBe('template-admin-photo-001');
    expect(result.template.name).toBe('日常模板');
    expect(result.template.steps.length).toBeGreaterThan(0);
    expect(result.template.faceStrategy.summary.length).toBeGreaterThan(0);
    expect(result.trace).toEqual([
      'image-input',
      'face-detection',
      'landmarks',
      'segmentation',
      'cosmetic-analysis',
      'decomposition',
      'inference',
      'extraction',
      'template-build',
    ]);
  });
});
