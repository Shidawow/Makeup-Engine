import type {
  EyeType,
  FaceShape,
  LipShape,
  SkinTone,
  SkinType,
} from '../templates/schema';
import type { MakeupPhotoInput } from './image-input';

export interface TemplateFaceFeatures {
  faceShape: FaceShape;
  skinType: SkinType;
  skinTone: SkinTone;
  eyeType: EyeType;
  lipShape: LipShape;
}

export interface TemplateFaceAnalysis {
  imageId: string;
  features: TemplateFaceFeatures;
  confidence: number;
  evidence: string[];
}

const hasToken = (fileName: string, token: string) =>
  fileName.toLowerCase().includes(token);

export const analyzeFaceForTemplate = async (
  image: MakeupPhotoInput,
): Promise<TemplateFaceAnalysis> => {
  const fileName = image.fileName.toLowerCase();

  return {
    imageId: image.id,
    features: {
      faceShape: hasToken(fileName, 'oval')
        ? 'oval'
        : hasToken(fileName, 'square')
          ? 'square'
          : hasToken(fileName, 'heart')
            ? 'heart'
            : 'round',
      skinType: hasToken(fileName, 'dry')
        ? 'dry'
        : hasToken(fileName, 'combo')
          ? 'combination'
          : 'oily',
      skinTone: hasToken(fileName, 'cool')
        ? 'cool'
        : hasToken(fileName, 'neutral')
          ? 'neutral'
          : 'warm',
      eyeType: hasToken(fileName, 'mono')
        ? 'monolid'
        : hasToken(fileName, 'double')
          ? 'double'
          : 'hooded',
      lipShape: hasToken(fileName, 'thin') ? 'thin' : 'full',
    },
    confidence: 0.82,
    evidence: [
      'Local filename-driven fixture analysis used for template production prototype.',
    ],
  };
};
