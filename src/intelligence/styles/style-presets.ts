export type MakeupStyleName =
  | 'Japanese'
  | 'Korean'
  | 'Douyin'
  | 'Western'
  | 'CleanGirl';

export interface StylePreset {
  name: MakeupStyleName;
  eyelinerWeight: number;
  blushWeight: number;
  contourWeight: number;
  lipstickWeight: number;
}

export const stylePresets: Record<MakeupStyleName, StylePreset> = {
  Japanese: {
    name: 'Japanese',
    eyelinerWeight: 0.3,
    blushWeight: 0.8,
    contourWeight: 0.2,
    lipstickWeight: 0.5,
  },
  Korean: {
    name: 'Korean',
    eyelinerWeight: 0.4,
    blushWeight: 0.6,
    contourWeight: 0.2,
    lipstickWeight: 0.7,
  },
  Douyin: {
    name: 'Douyin',
    eyelinerWeight: 0.8,
    blushWeight: 0.8,
    contourWeight: 0.5,
    lipstickWeight: 0.8,
  },
  Western: {
    name: 'Western',
    eyelinerWeight: 0.9,
    blushWeight: 0.4,
    contourWeight: 0.9,
    lipstickWeight: 0.9,
  },
  CleanGirl: {
    name: 'CleanGirl',
    eyelinerWeight: 0.2,
    blushWeight: 0.4,
    contourWeight: 0.2,
    lipstickWeight: 0.3,
  },
};

export const getStylePreset = (styleName: MakeupStyleName) => stylePresets[styleName];
