import { describe, expect, it } from 'vitest';
import {
  createUserPhotoBoundaryWarnings,
  createUserPhotoPrivacySummary,
  validateNoBiometricIdentifier,
  validateNoUserPhotoBytes,
  validateNoUserPhotoLocalPath,
  validateNoUserPhotoObjectUrl,
  validateUserPhotoNotTrainingInput,
} from '../src/user-app';

describe('user photo privacy boundary', () => {
  it('detects object URLs, data images, base64 image-like strings, and local paths', () => {
    const value = {
      objectUrl: 'blob:http://local/user-photo',
      dataImage: 'data:image/png;base64,iVBORw0KGgoAAAA',
      base64ImageLike: 'iVBORw0KGgoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      localPath: 'C:\\Users\\person\\selfie.png',
    };

    expect(validateNoUserPhotoObjectUrl(value)).toHaveLength(1);
    expect(validateNoUserPhotoBytes(value).length).toBeGreaterThanOrEqual(2);
    expect(validateNoUserPhotoLocalPath(value)).toHaveLength(1);
    expect(createUserPhotoBoundaryWarnings(value).length).toBeGreaterThanOrEqual(4);
  });

  it('detects biometric identifiers, photo bytes, persistent references, and training input', () => {
    const value = {
      imageBytes: [1, 2, 3],
      photoBytes: 'redacted',
      faceEmbedding: [0.1, 0.2],
      biometricId: 'bio-1',
      trainingInput: true,
      persistentPhotoReference: 'user-photo-1',
    };

    expect(validateNoUserPhotoBytes(value).length).toBeGreaterThanOrEqual(2);
    expect(validateNoBiometricIdentifier(value).length).toBeGreaterThanOrEqual(2);
    expect(validateUserPhotoNotTrainingInput(value).length).toBeGreaterThanOrEqual(2);
    expect(createUserPhotoPrivacySummary(value)).toContain('"ready":false');
  });
});
