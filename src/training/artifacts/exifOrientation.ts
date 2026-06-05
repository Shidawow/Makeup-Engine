import type { ImagePixelData } from '../schema';

export type JpegExifOrientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'missing' | 'unsupported';

export interface ExifOrientationSummary {
  orientation: JpegExifOrientation;
  supported: boolean;
  notes: string[];
}

const readUint16 = (bytes: Uint8Array, offset: number, littleEndian: boolean): number =>
  littleEndian
    ? ((bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8))
    : (((bytes[offset] ?? 0) << 8) | (bytes[offset + 1] ?? 0));

const readUint32 = (bytes: Uint8Array, offset: number, littleEndian: boolean): number =>
  littleEndian
    ? (((bytes[offset] ?? 0) |
        ((bytes[offset + 1] ?? 0) << 8) |
        ((bytes[offset + 2] ?? 0) << 16) |
        ((bytes[offset + 3] ?? 0) << 24)) >>> 0)
    : ((((bytes[offset] ?? 0) << 24) |
        ((bytes[offset + 1] ?? 0) << 16) |
        ((bytes[offset + 2] ?? 0) << 8) |
        (bytes[offset + 3] ?? 0)) >>> 0);

export const normalizeExifOrientation = (value: number | null | undefined): JpegExifOrientation =>
  value === undefined || value === null
    ? 'missing'
    : value >= 1 && value <= 8
      ? (value as JpegExifOrientation)
      : 'unsupported';

export const readExifOrientationFromJpegBytes = (bytes: Uint8Array): JpegExifOrientation => {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return 'unsupported';
  let offset = 2;
  while (offset + 4 < bytes.length) {
    if (bytes[offset] !== 0xff) return 'missing';
    const marker = bytes[offset + 1] ?? 0;
    const segmentLength = ((bytes[offset + 2] ?? 0) << 8) | (bytes[offset + 3] ?? 0);
    if (marker === 0xe1 && segmentLength > 8) {
      const segment = bytes.slice(offset + 4, offset + 2 + segmentLength);
      const header = new TextDecoder().decode(segment.slice(0, 6));
      if (header !== 'Exif\0\0') return 'missing';
      const tiff = segment.slice(6);
      const endian = new TextDecoder().decode(tiff.slice(0, 2));
      const littleEndian = endian === 'II';
      if (!littleEndian && endian !== 'MM') return 'unsupported';
      const ifdOffset = readUint32(tiff, 4, littleEndian);
      const entryCount = readUint16(tiff, ifdOffset, littleEndian);
      for (let index = 0; index < entryCount; index += 1) {
        const entryOffset = ifdOffset + 2 + index * 12;
        const tag = readUint16(tiff, entryOffset, littleEndian);
        if (tag === 0x0112) return normalizeExifOrientation(readUint16(tiff, entryOffset + 8, littleEndian));
      }
      return 'missing';
    }
    if (segmentLength < 2) return 'missing';
    offset += 2 + segmentLength;
  }
  return 'missing';
};

const getPixel = (data: ImagePixelData, x: number, y: number) => data.pixels[y * data.width + x] ?? { r: 0, g: 0, b: 0, a: 1 };

export const applyOrientationToImagePixelData = (
  data: ImagePixelData,
  orientation: JpegExifOrientation,
): ImagePixelData => {
  if (orientation === 1 || orientation === 'missing') return data;
  if (orientation === 'unsupported' || [2, 4, 5, 7].includes(orientation)) return data;
  const rotate180 = orientation === 3;
  const rotate90 = orientation === 6;
  const rotate270 = orientation === 8;
  const width = rotate90 || rotate270 ? data.height : data.width;
  const height = rotate90 || rotate270 ? data.width : data.height;
  const pixels: ImagePixelData['pixels'] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const source =
        rotate180 ? getPixel(data, data.width - 1 - x, data.height - 1 - y) :
        rotate90 ? getPixel(data, y, data.height - 1 - x) :
        getPixel(data, data.width - 1 - y, x);
      pixels.push(source);
    }
  }
  return { ...data, width, height, pixels };
};

export const summarizeExifOrientation = (orientation: JpegExifOrientation): ExifOrientationSummary => ({
  orientation,
  supported: orientation === 'missing' || orientation === 1 || orientation === 3 || orientation === 6 || orientation === 8,
  notes:
    orientation === 'missing'
      ? ['no exif orientation found']
      : orientation === 'unsupported'
        ? ['exif orientation is unsupported']
        : [`exif orientation ${orientation}`],
});
