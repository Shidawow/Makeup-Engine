import { describe, expect, it } from 'vitest';
import {
  createSessionBoundaryWarnings,
  createSessionPrivacySummary,
  validateNoSessionBase64Image,
  validateNoSessionBiometricIdentifier,
  validateNoSessionLocalPath,
  validateNoSessionObjectUrl,
  validateNoSessionPhotoBytes,
  validateNoSessionReactState,
  validateNoSessionSensitiveProfile,
  validateNoSessionTrainingInput,
} from '../src/user-app';

describe('user app session privacy boundary', () => {
  it('detects image bytes, object URLs, local paths, and base64 images', () => {
    const unsafe = {
      imageBytes: [1, 2, 3],
      photoBytes: 'redacted',
      objectUrl: 'blob:http://local/session-photo',
      localPath: 'C:\\synthetic\\session-photo.png',
      unixPath: '/Users/synthetic/session-photo.png',
      dataImage: 'data:image/png;base64,iVBORw0KGgoAAAA',
      base64ImageLike: 'iVBORw0KGgoAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    };

    expect(validateNoSessionPhotoBytes(unsafe).length).toBeGreaterThanOrEqual(2);
    expect(validateNoSessionObjectUrl(unsafe)).toHaveLength(1);
    expect(validateNoSessionLocalPath(unsafe)).toHaveLength(2);
    expect(validateNoSessionBase64Image(unsafe).length).toBeGreaterThanOrEqual(2);
    expect(createSessionPrivacySummary(unsafe)).toContain('"ready":false');
  });

  it('detects biometrics, training input, sensitive profile, and React state', () => {
    const unsafe = {
      faceEmbedding: [0.1, 0.2],
      biometricId: 'bio-1',
      faceprint: 'blocked',
      trainingInput: true,
      trainingDataset: 'blocked',
      healthInformation: 'blocked',
      sensitiveIdentity: 'blocked',
      email: 'blocked@example.test',
      reactState: { selected: true },
      __reactFiber: 'blocked',
      callback: () => 'not serializable',
    };

    expect(validateNoSessionBiometricIdentifier(unsafe).length).toBeGreaterThanOrEqual(3);
    expect(validateNoSessionTrainingInput(unsafe).length).toBeGreaterThanOrEqual(2);
    expect(validateNoSessionSensitiveProfile(unsafe).length).toBeGreaterThanOrEqual(3);
    expect(validateNoSessionReactState(unsafe).length).toBeGreaterThanOrEqual(2);
    expect(createSessionBoundaryWarnings(unsafe).length).toBeGreaterThanOrEqual(11);
  });
});
