import { describe, expect, it } from 'vitest';
import { existsSync, statSync } from 'node:fs';

const desktopDocxFiles = [
  '/Users/star/Desktop/Makeup-Engine-图文版详细设计书.docx',
  '/Users/star/Desktop/Makeup-Engine-图文版操作说明书.docx',
];

describe('desktop Word export deliverables', () => {
  it('exports both requested DOCX files to the Mac desktop', () => {
    for (const file of desktopDocxFiles) {
      expect(existsSync(file), `${file} should exist`).toBe(true);
      expect(statSync(file).size, `${file} should be a non-empty DOCX`).toBeGreaterThan(50_000);
    }
  });
});
