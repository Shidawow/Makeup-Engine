import type { ImagePixelData } from './types';

export const extractImagePixelData = (
  image: HTMLImageElement,
): ImagePixelData => {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    throw new Error('Unable to create canvas context for pixel analysis.');
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  return {
    width: imageData.width,
    height: imageData.height,
    data: imageData.data,
  };
};

export const loadImagePixelDataFromUrl = async (
  imageUrl: string,
): Promise<ImagePixelData> => {
  const image = document.createElement('img');
  image.decoding = 'async';
  image.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Failed to load image pixels.'));
    image.src = imageUrl;
  });

  return extractImagePixelData(image);
};

