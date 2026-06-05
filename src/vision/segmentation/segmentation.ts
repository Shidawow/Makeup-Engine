import type { MakeupPhotoInput } from '../image-input';
import type { MakeupRegion } from '../../templates/schema';

export interface SegmentedMakeupRegion {
  region: MakeupRegion;
  confidence: number;
  maskDescription: string;
}

export const segmentCosmeticRegions = async (
  image: MakeupPhotoInput,
): Promise<SegmentedMakeupRegion[]> => {
  void image;
  return [
    { region: 'base', confidence: 0.95, maskDescription: 'full face base mask' },
    { region: 'brow', confidence: 0.89, maskDescription: 'brow band mask' },
    { region: 'eye', confidence: 0.93, maskDescription: 'eye socket mask' },
    { region: 'contour', confidence: 0.86, maskDescription: 'cheek and jaw mask' },
    { region: 'blush', confidence: 0.84, maskDescription: 'cheek color mask' },
    { region: 'lip', confidence: 0.92, maskDescription: 'lip contour mask' },
  ];
};
