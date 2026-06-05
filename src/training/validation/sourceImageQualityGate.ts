import type { ImagePixelData, SourceImageQualityReport } from '../schema';

export interface SourceImageQualityGateOptions {
  minWidth?: number;
  minHeight?: number;
  minContrast?: number;
  minColorVariance?: number;
  minAlphaCoverage?: number;
  minBrightness?: number;
  maxBrightness?: number;
}

const round = (value: number): number => Number(value.toFixed(4));

const luminance = (pixel: ImagePixelData['pixels'][number]): number =>
  pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722;

export const estimateImageBrightness = (image: ImagePixelData): number =>
  round(image.pixels.reduce((sum, pixel) => sum + luminance(pixel), 0) / Math.max(1, image.pixels.length));

export const estimateImageContrast = (image: ImagePixelData): number => {
  const brightness = estimateImageBrightness(image);
  return round(Math.sqrt(image.pixels.reduce((sum, pixel) => sum + (luminance(pixel) - brightness) ** 2, 0) / Math.max(1, image.pixels.length)));
};

export const estimateImageBlurProxy = (image: ImagePixelData): number => {
  let edge = 0;
  let count = 0;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 1; x < image.width; x += 1) {
      edge += Math.abs(luminance(image.pixels[y * image.width + x] ?? image.pixels[0]) - luminance(image.pixels[y * image.width + x - 1] ?? image.pixels[0]));
      count += 1;
    }
  }
  return round(edge / Math.max(1, count));
};

export const estimateImageColorVariance = (image: ImagePixelData): number => {
  const means = image.pixels.reduce(
    (acc, pixel) => ({ r: acc.r + pixel.r, g: acc.g + pixel.g, b: acc.b + pixel.b }),
    { r: 0, g: 0, b: 0 },
  );
  const count = Math.max(1, image.pixels.length);
  const mean = { r: means.r / count, g: means.g / count, b: means.b / count };
  return round(image.pixels.reduce((sum, pixel) => sum + (pixel.r - mean.r) ** 2 + (pixel.g - mean.g) ** 2 + (pixel.b - mean.b) ** 2, 0) / count);
};

export const validateMinimumImageDimensions = (
  image: ImagePixelData,
  options: SourceImageQualityGateOptions = {},
): string[] => [
  ...(image.width < (options.minWidth ?? 2) ? ['source-image-too-small'] : []),
  ...(image.height < (options.minHeight ?? 2) ? ['source-image-too-small'] : []),
];

export const evaluateSourceImageQuality = (
  image: ImagePixelData,
  options: SourceImageQualityGateOptions = {},
): SourceImageQualityReport => {
  const brightness = estimateImageBrightness(image);
  const contrast = estimateImageContrast(image);
  const colorVariance = estimateImageColorVariance(image);
  const alphaCoverage = round(image.pixels.filter((pixel) => pixel.a > 0.05).length / Math.max(1, image.pixels.length));
  const issueCodes = [
    ...validateMinimumImageDimensions(image, options),
    ...(brightness < (options.minBrightness ?? 0.04) ? ['source-image-too-dark'] : []),
    ...(brightness > (options.maxBrightness ?? 0.96) ? ['source-image-too-bright'] : []),
    ...(contrast < (options.minContrast ?? 0.01) ? ['source-image-low-contrast'] : []),
    ...(colorVariance < (options.minColorVariance ?? 0.0001) ? ['source-image-blank'] : []),
    ...(alphaCoverage < (options.minAlphaCoverage ?? 0.95) ? ['source-image-transparent'] : []),
  ];
  const qualityScore = round(Math.max(0, Math.min(1, (contrast * 4 + colorVariance * 8 + alphaCoverage + (1 - Math.abs(0.5 - brightness))) / 4)));
  return {
    readiness: issueCodes.length > 0 ? 'blocked' : 'ready',
    qualityScore,
    width: image.width,
    height: image.height,
    brightness,
    contrast,
    colorVariance,
    alphaCoverage,
    issueCodes: [...new Set(issueCodes)].sort(),
  };
};

export const summarizeSourceImageQuality = (report: SourceImageQualityReport): string =>
  `source-image-quality:${report.width}x${report.height}:score=${report.qualityScore}:readiness=${report.readiness}:issues=${report.issueCodes.join(',') || 'none'}`;
