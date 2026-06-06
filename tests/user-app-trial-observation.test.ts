import { describe, expect, it } from 'vitest';
import { createUserAppTrialObservationGuide } from '../src/user-app';
import {
  userAppTrialObservationBlockedPhotoContactHealthExample,
  userAppTrialObservationReadyExample,
} from '../src/templates/examples';

describe('User App trial observation guide', () => {
  it('creates a ready local observation guide', () => {
    expect(userAppTrialObservationReadyExample.schemaVersion).toBe(
      'user-app-trial-observation-v0.1',
    );
    expect(userAppTrialObservationReadyExample.status).toBe('ready');
    expect(userAppTrialObservationReadyExample.signals.map((signal) => signal.signalId)).toEqual(
      expect.arrayContaining([
        'home_understood',
        'recommendation_found',
        'guidance_started',
        'steps_understood',
        'tools_understood',
        'stuck_step_identified',
        'privacy_understood',
        'willing_to_continue',
        'template_value_seen',
      ]),
    );
    expect(userAppTrialObservationReadyExample.backendRecordSystem).toBe(false);
    expect(userAppTrialObservationReadyExample.writesProjectStateUserRecords).toBe(false);
  });

  it('blocks guides that ask for photos, contact, health, sensitive, or training data', () => {
    expect(userAppTrialObservationBlockedPhotoContactHealthExample.status).toBe('blocked');
    expect(userAppTrialObservationBlockedPhotoContactHealthExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'privacy',
          severity: 'blocking',
        }),
      ]),
    );

    const blocked = createUserAppTrialObservationGuide({
      observerInstructions: ['请提供真实姓名和邮箱。'],
      collectsRealName: true,
      collectsSensitiveIdentity: true,
      writesTrainingInput: true,
      writesProjectStateUserRecords: true,
    });

    expect(blocked.status).toBe('blocked');
  });
});
