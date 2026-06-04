export const FACE_SHAPES = ['round', 'oval', 'square', 'heart'] as const;

export const SKIN_TYPES = ['oily', 'dry', 'combination'] as const;

export const SKIN_TONES = ['warm', 'cool', 'neutral'] as const;

export const EYE_TYPES = ['monolid', 'hooded', 'double'] as const;

export const LIP_SHAPES = ['thin', 'full'] as const;

export type FaceShape = (typeof FACE_SHAPES)[number];

export type SkinType = (typeof SKIN_TYPES)[number];

export type SkinTone = (typeof SKIN_TONES)[number];

export type EyeType = (typeof EYE_TYPES)[number];

export type LipShape = (typeof LIP_SHAPES)[number];

export interface SuitableFaceTypes {
  faceShapes: FaceShape[];
  skinTypes: SkinType[];
  skinTones: SkinTone[];
  eyeTypes: EyeType[];
  lipShapes: LipShape[];
}

export interface FaceSuitabilitySchema {
  profile: SuitableFaceTypes;
  confidence: number;
  rationale: string[];
}
