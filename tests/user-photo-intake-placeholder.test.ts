import { describe, expect, it } from 'vitest';
import {
  createUserPhotoIntakePlaceholder,
  summarizeUserPhotoIntakeState,
  validateUserPhotoIntakeBoundary,
} from '../src/user-app';
import {
  defaultUserPhotoIntakePlaceholderExample,
  disabledCameraPhotoIntakePlaceholderExample,
  futureManualUploadPhotoIntakePlaceholderExample,
} from '../src/templates/examples/user-app-photo-intake-placeholder.example';

describe('user photo intake placeholder', () => {
  it('creates a disabled placeholder without real photo data', () => {
    const placeholder = createUserPhotoIntakePlaceholder();
    const serialized = JSON.stringify(placeholder);

    expect(placeholder.phaseBoundary).toBe('phase-7c-placeholder-only');
    expect(placeholder.privacyNotice.collectsPhoto).toBe(false);
    expect(placeholder.privacyNotice.uploadsPhoto).toBe(false);
    expect(placeholder.privacyNotice.analyzesPhoto).toBe(false);
    expect(serialized).not.toContain('blob:');
    expect(serialized).not.toContain('data:image/');
    expect(serialized).not.toContain('imageBytes');
    expect(serialized).not.toContain('C:\\');
    expect(summarizeUserPhotoIntakeState(placeholder)).toContain('"trainingInput":false');
  });

  it('keeps example placeholders deterministic and future-only', () => {
    expect(defaultUserPhotoIntakePlaceholderExample.status).toBe('placeholder_only');
    expect(disabledCameraPhotoIntakePlaceholderExample.disabledCapabilities).toContain(
      'camera_capture_future',
    );
    expect(futureManualUploadPhotoIntakePlaceholderExample.capabilities).toContain(
      'manual_upload_future',
    );
  });

  it('blocks SourceImagePackage direct intake', () => {
    const readiness = validateUserPhotoIntakeBoundary({
      sourceImagePackageId: 'source-image-package-admin-v0',
    });

    expect(readiness.ready).toBe(false);
    expect(readiness.blockingIssues.map((issue) => issue.code)).toContain(
      'source-image-package-not-user-photo-intake',
    );
  });
});
