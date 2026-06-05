import type { HsbColorFeature } from './types';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export const rgbToHsb = ({ r, g, b }: RgbColor): HsbColorFeature => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;

  if (delta !== 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }

  if (hue < 0) {
    hue += 360;
  }

  return {
    hue: Number(hue.toFixed(2)),
    saturation: max === 0 ? 0 : Number((delta / max).toFixed(4)),
    brightness: Number(max.toFixed(4)),
  };
};

export const averageHue = (hues: number[]): number => {
  if (hues.length === 0) {
    return 0;
  }

  const radians = hues.map((hue) => (hue * Math.PI) / 180);
  const sin = radians.reduce((sum, value) => sum + Math.sin(value), 0);
  const cos = radians.reduce((sum, value) => sum + Math.cos(value), 0);
  const hue = (Math.atan2(sin / hues.length, cos / hues.length) * 180) / Math.PI;

  return Number(((hue + 360) % 360).toFixed(2));
};

