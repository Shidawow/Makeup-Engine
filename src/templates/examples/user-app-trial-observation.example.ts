import {
  createUserAppTrialObservationGuide,
  createUserAppTrialObservationSummary,
  type UserAppTrialObservationGuide,
  type UserAppTrialObservationSummary,
} from '../../user-app/userAppTrialObservation';

export const userAppTrialObservationReadyExample: UserAppTrialObservationGuide =
  createUserAppTrialObservationGuide();

export const userAppTrialObservationBlockedPhotoContactHealthExample: UserAppTrialObservationGuide =
  createUserAppTrialObservationGuide({
    guideId: 'trial-observation-blocked-sensitive-collection',
    observerInstructions: [
      '请填写参与者联系方式。',
      '请上传照片并记录健康信息。',
    ],
    collectsContact: true,
    asksForPhotos: true,
    collectsHealthInfo: true,
  });

export const userAppTrialObservationMockSummary: UserAppTrialObservationSummary =
  createUserAppTrialObservationSummary(userAppTrialObservationReadyExample, [
    {
      noteId: 'mock-observation-note-home',
      signalId: 'home_understood',
      note: 'mock：参与者顺利理解首页入口。',
      mockOnly: true,
      containsPersonalData: false,
    },
    {
      noteId: 'mock-observation-note-step',
      signalId: 'steps_understood',
      note: 'mock：参与者卡在第 2 步的区域说明。',
      mockOnly: true,
      containsPersonalData: false,
    },
  ]);
