import type { MakeupRegion } from '../templates/schema';
import type { MakeupPhotoInput } from './image-input';

export interface DetectedMakeupRegion {
  id: string;
  region: MakeupRegion;
  detected: boolean;
  confidence: number;
  cues: string[];
}

const defaultRegions: MakeupRegion[] = [
  'base',
  'brow',
  'eye',
  'contour',
  'blush',
  'lip',
];

const regionCue: Record<MakeupRegion, string> = {
  base: 'skin finish and coverage are visible',
  brow: 'brow shape and density are visible',
  eye: 'eyeshadow or liner structure is visible',
  contour: 'face dimension or cheek structure is visible',
  blush: 'cheek color placement is visible',
  lip: 'lip color and edge softness are visible',
};

export const detectMakeupRegions = async (
  image: MakeupPhotoInput,
): Promise<DetectedMakeupRegion[]> =>
  defaultRegions.map((region, index) => ({
    id: `${image.id}-${region}`,
    region,
    detected: true,
    confidence: Number((0.72 + index * 0.03).toFixed(2)),
    cues: [regionCue[region]],
  }));
