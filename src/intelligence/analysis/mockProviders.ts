import type { FaceFeatures } from '../types';

export interface MockPhotoInput {
  fileName: string;
  size: number;
  type: string;
}

export interface MockSkinAnalysis {
  skinType: FaceFeatures['skinType'];
  skinTone: FaceFeatures['skinTone'];
  confidence: number;
}

export interface MockFaceShapeAnalysis {
  faceShape: FaceFeatures['faceShape'];
  eyeType: FaceFeatures['eyeType'];
  lipShape: FaceFeatures['lipShape'];
  confidence: number;
}

const lower = (value: string) => value.toLowerCase();

export const mockSkinAnalysis = async (photo: MockPhotoInput): Promise<MockSkinAnalysis> => {
  const fileName = lower(photo.fileName);

  return {
    skinType: fileName.includes('dry') ? 'dry' : fileName.includes('combo') ? 'combination' : 'oily',
    skinTone: fileName.includes('cool') ? 'cool' : fileName.includes('neutral') ? 'neutral' : 'warm',
    confidence: 0.86,
  };
};

export const mockFaceShapeAnalysis = async (
  photo: MockPhotoInput,
): Promise<MockFaceShapeAnalysis> => {
  const fileName = lower(photo.fileName);

  return {
    faceShape: fileName.includes('oval') ? 'oval' : fileName.includes('square') ? 'square' : fileName.includes('heart') ? 'heart' : 'round',
    eyeType: fileName.includes('mono') ? 'monolid' : fileName.includes('double') ? 'double' : 'hooded',
    lipShape: fileName.includes('thin') ? 'thin' : 'full',
    confidence: 0.82,
  };
};

export const mockFaceFeatures = async (photo: MockPhotoInput): Promise<FaceFeatures> => {
  const [skin, shape] = await Promise.all([
    mockSkinAnalysis(photo),
    mockFaceShapeAnalysis(photo),
  ]);

  return {
    faceShape: shape.faceShape,
    skinType: skin.skinType,
    skinTone: skin.skinTone,
    eyeType: shape.eyeType,
    lipShape: shape.lipShape,
  };
};
