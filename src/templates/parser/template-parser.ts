import type { MakeupTemplate } from '../schema';

export const parseMakeupTemplate = (raw: string): MakeupTemplate => {
  const parsed = JSON.parse(raw) as unknown;
  return parsed as MakeupTemplate;
};
