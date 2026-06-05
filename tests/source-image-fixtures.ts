import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { encodeRgbaPngImage } from '../src/training/artifacts';

export const sourceImageFixtureDir = path.resolve('tests/fixtures/source-images');

export const createSourceImageFixtures = async (): Promise<void> => {
  await mkdir(sourceImageFixtureDir, { recursive: true });
  const rgba = [
    190, 90, 120, 255, 210, 130, 150, 255, 90, 70, 110, 255,
    130, 80, 120, 255, 230, 160, 170, 255, 80, 50, 90, 255,
    150, 100, 130, 255, 200, 120, 160, 255, 100, 70, 100, 255,
  ];
  await writeFile(path.join(sourceImageFixtureDir, 'simple-rgba.png'), encodeRgbaPngImage({ width: 3, height: 3, rgba }));
  await writeFile(path.join(sourceImageFixtureDir, 'png-filter-sub.png'), encodeRgbaPngImage({ width: 3, height: 3, rgba, filterType: 1 }));
  await writeFile(path.join(sourceImageFixtureDir, 'png-filter-up.png'), encodeRgbaPngImage({ width: 3, height: 3, rgba, filterType: 2 }));
  await writeFile(path.join(sourceImageFixtureDir, 'png-filter-average.png'), encodeRgbaPngImage({ width: 3, height: 3, rgba, filterType: 3 }));
  await writeFile(path.join(sourceImageFixtureDir, 'png-filter-paeth.png'), encodeRgbaPngImage({ width: 3, height: 3, rgba, filterType: 4 }));
  const fakeJpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 74, 70, 73, 70, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0xff, 0xd9]);
  await writeFile(path.join(sourceImageFixtureDir, 'fake.jpg'), fakeJpeg);
  await writeFile(path.join(sourceImageFixtureDir, 'invalid-image.bin'), Uint8Array.from([1, 2, 3, 4]));
  await writeFile(path.resolve('tests/fixtures/source-image-import-config.json'), JSON.stringify({ codecPreference: ['png', 'jpeg'] }, null, 2));
};
