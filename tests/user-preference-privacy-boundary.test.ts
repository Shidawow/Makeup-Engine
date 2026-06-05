import { describe, expect, it } from 'vitest';
import {
  createPreferenceBoundaryWarnings,
  createPreferencePrivacySummary,
  validateNoPreferenceBase64Image,
  validateNoPreferenceBiometricIdentifier,
  validateNoPreferenceLocalPath,
  validateNoPreferenceObjectUrl,
  validateNoPreferencePhotoBytes,
  validateNoSensitivePreferenceFields,
  validateNoTrainingInputFromPreferences,
} from '../src/user-app';

describe('user preference privacy boundary', () => {
  it('detects image bytes, object URLs, local paths, and base64 images', () => {
    const unsafe = {
      imageBytes: [1, 2, 3],
      photoBytes: 'redacted',
      objectUrl: 'blob:http://local/preference-photo',
      localPath: 'C:\\Users\\person\\preference-photo.png',
      unixPath: '/Users/person/preference-photo.png',
      dataImage: 'data:image/png;base64,iVBORw0KGgoAAAA',
      base64ImageLike: 'iVBORw0KGgoAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    };

    expect(validateNoPreferencePhotoBytes(unsafe).length).toBeGreaterThanOrEqual(2);
    expect(validateNoPreferenceObjectUrl(unsafe)).toHaveLength(1);
    expect(validateNoPreferenceLocalPath(unsafe)).toHaveLength(2);
    expect(validateNoPreferenceBase64Image(unsafe).length).toBeGreaterThanOrEqual(2);
    expect(createPreferencePrivacySummary(unsafe)).toContain('"ready":false');
  });

  it('detects biometrics, training input, and sensitive fields', () => {
    const unsafe = {
      faceEmbedding: [0.1, 0.2],
      biometricId: 'bio-1',
      faceprint: 'blocked',
      trainingInput: true,
      trainingDataset: 'blocked',
      healthInformation: 'blocked',
      sensitiveIdentity: 'blocked',
      email: 'blocked@example.test',
    };

    expect(validateNoPreferenceBiometricIdentifier(unsafe).length).toBeGreaterThanOrEqual(3);
    expect(validateNoTrainingInputFromPreferences(unsafe).length).toBeGreaterThanOrEqual(2);
    expect(validateNoSensitivePreferenceFields(unsafe).length).toBeGreaterThanOrEqual(3);
    expect(createPreferenceBoundaryWarnings(unsafe).length).toBeGreaterThanOrEqual(8);
  });
});
