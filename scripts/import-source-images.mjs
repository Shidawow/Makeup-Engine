#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const usage = `Usage:
  node scripts/import-source-images.mjs --input ./source-images --out ./tmp/source-images/admin-batch-v0 [options]

Options:
  --input <file-or-dir>                   Source PNG/JPEG file or directory
  --out <dir>                             Output source image package directory
  --codec-preference png,jpeg             Preferred source codecs
  --materialize-normalized-png            Write normalized PNG artifacts
  --materialize-raw-rgba                  Write raw RGBA JSON-binary artifacts
  --materialize-json-rgba                 Write JSON RGBA pixel artifacts
  --write-manifest                        Write source-image-manifest.json
  --quality-gate                          Evaluate source image quality
  --strict                                Exit non-zero when blocking issues exist
  --dry-run                               Print plan without writing files
  --json                                  Emit machine-readable JSON
  --help                                  Show this help
`;

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const parseArgs = (argv) => {
  const args = {
    codecPreference: 'png,jpeg',
    materializeNormalizedPng: false,
    materializeRawRgba: false,
    materializeJsonRgba: false,
    writeManifest: false,
    qualityGate: false,
    strict: false,
    dryRun: false,
    json: false,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--input') args.input = argv[++index];
    else if (arg === '--out') args.out = argv[++index];
    else if (arg === '--codec-preference') args.codecPreference = argv[++index];
    else if (arg === '--materialize-normalized-png') args.materializeNormalizedPng = true;
    else if (arg === '--materialize-raw-rgba') args.materializeRawRgba = true;
    else if (arg === '--materialize-json-rgba') args.materializeJsonRgba = true;
    else if (arg === '--write-manifest') args.writeManifest = true;
    else if (arg === '--quality-gate') args.qualityGate = true;
    else if (arg === '--strict') args.strict = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--json') args.json = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
};

const stableStringify = (value, pretty = false) => {
  const normalize = (input) => {
    if (input === null || typeof input !== 'object') return input;
    if (Array.isArray(input)) return input.map(normalize);
    return Object.fromEntries(Object.keys(input).sort().map((key) => [key, normalize(input[key])]));
  };
  return JSON.stringify(normalize(value), null, pretty ? 2 : 0);
};

const checksumBytes = (bytes) => {
  let hash = 0x811c9dc5;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};
const checksumText = (content) => checksumBytes(textEncoder.encode(content));

const detectKind = (bytes) => {
  if (PNG_SIGNATURE.every((value, index) => bytes[index] === value)) return 'png';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  const prefix = textDecoder.decode(bytes.slice(0, 16)).trimStart();
  if (prefix.startsWith('{') || prefix.startsWith('[')) return 'json';
  return 'unknown';
};

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'source-image';

const readUint32 = (bytes, offset) => (((bytes[offset] ?? 0) << 24) | ((bytes[offset + 1] ?? 0) << 16) | ((bytes[offset + 2] ?? 0) << 8) | (bytes[offset + 3] ?? 0)) >>> 0;
const writeUint32 = (value) => new Uint8Array([(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255]);
const concatBytes = (chunks) => {
  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
};
const crc32 = (bytes) => {
  const table = crc32.table ??= (() => {
    const entries = new Uint32Array(256);
    for (let index = 0; index < 256; index += 1) {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      entries[index] = value >>> 0;
    }
    return entries;
  })();
  let crc = 0xffffffff;
  for (const byte of bytes) crc = (crc >>> 8) ^ table[(crc ^ byte) & 255];
  return (crc ^ 0xffffffff) >>> 0;
};
const adler32 = (bytes) => {
  let a = 1;
  let b = 0;
  for (const byte of bytes) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
};
const inflateStored = (stream) => {
  let offset = 2;
  const chunks = [];
  let final = 0;
  while (final === 0) {
    const header = stream[offset];
    if (header === undefined) throw new Error('png-idat-missing-deflate-header');
    final = header & 1;
    if (((header >>> 1) & 3) !== 0) throw new Error('png-deflate-unsupported');
    offset += 1;
    const length = (stream[offset] ?? 0) | ((stream[offset + 1] ?? 0) << 8);
    const inverse = (stream[offset + 2] ?? 0) | ((stream[offset + 3] ?? 0) << 8);
    if (((length ^ 0xffff) & 0xffff) !== inverse) throw new Error('png-deflate-length-mismatch');
    offset += 4;
    chunks.push(stream.slice(offset, offset + length));
    offset += length;
  }
  const raw = concatBytes(chunks);
  if (adler32(raw) !== readUint32(stream, stream.length - 4)) throw new Error('png-adler-mismatch');
  return raw;
};
const paeth = (left, up, upLeft) => {
  const p = left + up - upLeft;
  const pa = Math.abs(p - left);
  const pb = Math.abs(p - up);
  const pc = Math.abs(p - upLeft);
  if (pa <= pb && pa <= pc) return left;
  return pb <= pc ? up : upLeft;
};
const reconstructRow = (filter, current, previous, bpp) => {
  const out = new Uint8Array(current.length);
  for (let index = 0; index < current.length; index += 1) {
    const left = index < bpp ? 0 : out[index - bpp] ?? 0;
    const up = previous?.[index] ?? 0;
    const upLeft = index < bpp ? 0 : previous?.[index - bpp] ?? 0;
    const predictor = filter === 0 ? 0 : filter === 1 ? left : filter === 2 ? up : filter === 3 ? Math.floor((left + up) / 2) : filter === 4 ? paeth(left, up, upLeft) : Number.NaN;
    if (!Number.isFinite(predictor)) throw new Error('png-filter-unsupported');
    out[index] = ((current[index] ?? 0) + predictor) & 255;
  }
  return out;
};
const decodePng = (bytes) => {
  if (!PNG_SIGNATURE.every((value, index) => bytes[index] === value)) throw new Error('png-signature-invalid');
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 8;
  let colorType = 6;
  let interlace = 0;
  const idats = [];
  while (offset < bytes.length) {
    const length = readUint32(bytes, offset); offset += 4;
    const type = textDecoder.decode(bytes.slice(offset, offset + 4)); offset += 4;
    const data = bytes.slice(offset, offset + length); offset += length;
    offset += 4;
    if (type === 'IHDR') {
      width = readUint32(data, 0);
      height = readUint32(data, 4);
      bitDepth = data[8] ?? 0;
      colorType = data[9] ?? 0;
      interlace = data[12] ?? 0;
      if (bitDepth !== 8) throw new Error('png-bit-depth-unsupported');
      if (![0, 2, 6].includes(colorType)) throw new Error('png-color-type-unsupported');
      if (interlace !== 0) throw new Error('png-interlace-unsupported');
    } else if (type === 'IDAT') idats.push(data);
    else if (type === 'IEND') break;
  }
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
  const raw = inflateStored(concatBytes(idats));
  const rowLength = width * channels + 1;
  const rows = [];
  const filters = [];
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * rowLength;
    const filter = raw[rowOffset] ?? 0;
    if (!filters.includes(filter)) filters.push(filter);
    rows.push(reconstructRow(filter, raw.slice(rowOffset + 1, rowOffset + rowLength), rows[y - 1], channels));
  }
  const pixels = [];
  for (let y = 0; y < height; y += 1) {
    const row = rows[y];
    for (let x = 0; x < width; x += 1) {
      const p = x * channels;
      if (colorType === 0) {
        const v = (row[p] ?? 0) / 255;
        pixels.push({ r: v, g: v, b: v, a: 1 });
      } else pixels.push({ r: (row[p] ?? 0) / 255, g: (row[p + 1] ?? 0) / 255, b: (row[p + 2] ?? 0) / 255, a: colorType === 6 ? (row[p + 3] ?? 255) / 255 : 1 });
    }
  }
  return { width, height, colorType, bitDepth, interlace, filters: filters.sort(), pixels };
};
const createPngChunk = (type, data) => {
  const typeBytes = textEncoder.encode(type);
  return concatBytes([writeUint32(data.length), typeBytes, data, writeUint32(crc32(concatBytes([typeBytes, data])))]);
};
const deflateStored = (raw) => {
  const chunks = [new Uint8Array([0x78, 0x01])];
  for (let offset = 0; offset < raw.length; offset += 65535) {
    const length = Math.min(65535, raw.length - offset);
    chunks.push(new Uint8Array([offset + length >= raw.length ? 1 : 0, length & 255, (length >>> 8) & 255, (~length) & 255, ((~length) >>> 8) & 255]));
    chunks.push(raw.slice(offset, offset + length));
  }
  chunks.push(writeUint32(adler32(raw)));
  return concatBytes(chunks);
};
const encodePng = ({ width, height, pixels }) => {
  const scanlines = new Uint8Array((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 4 + 1);
    scanlines[row] = 0;
    for (let x = 0; x < width; x += 1) {
      const pixel = pixels[y * width + x] ?? { r: 0, g: 0, b: 0, a: 1 };
      const target = row + 1 + x * 4;
      scanlines[target] = Math.round(pixel.r * 255);
      scanlines[target + 1] = Math.round(pixel.g * 255);
      scanlines[target + 2] = Math.round(pixel.b * 255);
      scanlines[target + 3] = Math.round(pixel.a * 255);
    }
  }
  const ihdr = new Uint8Array(13);
  ihdr.set(writeUint32(width), 0); ihdr.set(writeUint32(height), 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return concatBytes([new Uint8Array(PNG_SIGNATURE), createPngChunk('IHDR', ihdr), createPngChunk('IDAT', deflateStored(scanlines)), createPngChunk('IEND', new Uint8Array())]);
};
const quality = (image) => {
  const luminance = (p) => p.r * 0.2126 + p.g * 0.7152 + p.b * 0.0722;
  const brightness = image.pixels.reduce((s, p) => s + luminance(p), 0) / Math.max(1, image.pixels.length);
  const contrast = Math.sqrt(image.pixels.reduce((s, p) => s + (luminance(p) - brightness) ** 2, 0) / Math.max(1, image.pixels.length));
  const alphaCoverage = image.pixels.filter((p) => p.a > 0.05).length / Math.max(1, image.pixels.length);
  const issueCodes = [
    ...(image.width < 2 || image.height < 2 ? ['source-image-too-small'] : []),
    ...(brightness < 0.04 ? ['source-image-too-dark'] : []),
    ...(brightness > 0.96 ? ['source-image-too-bright'] : []),
    ...(contrast < 0.01 ? ['source-image-low-contrast'] : []),
    ...(alphaCoverage < 0.95 ? ['source-image-transparent'] : []),
  ];
  return { readiness: issueCodes.length ? 'blocked' : 'ready', qualityScore: Number(Math.max(0, Math.min(1, (contrast * 4 + alphaCoverage + (1 - Math.abs(0.5 - brightness))) / 3)).toFixed(4)), width: image.width, height: image.height, brightness: Number(brightness.toFixed(4)), contrast: Number(contrast.toFixed(4)), colorVariance: Number((contrast ** 2).toFixed(4)), alphaCoverage: Number(alphaCoverage.toFixed(4)), issueCodes };
};

const collectFiles = async (input) => {
  const stat = await import('node:fs/promises').then((fs) => fs.stat(input));
  if (stat.isFile()) return [input];
  const entries = await readdir(input, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => path.join(input, entry.name)).filter((file) => /\.(png|jpg|jpeg|bin)$/i.test(file)).sort();
};

const processFile = async (file, args) => {
  const bytes = new Uint8Array(await readFile(file));
  const kind = detectKind(bytes);
  const originalFileName = path.basename(file);
  const sourceImageId = slug(originalFileName.replace(/\.[^.]+$/, ''));
  const originalFileChecksum = checksumBytes(bytes);
  const plannedFiles = [{ relativePath: `originals/${originalFileName}`, content: bytes }];
  let image = null;
  let issueCodes = [];
  let width = 0;
  let height = 0;
  let orientation = 'missing';
  let pngCodecReadiness = 'not-applicable';
  let jpegBoundaryStatus = 'not-applicable';
  if (kind === 'png') {
    try {
      image = decodePng(bytes);
      width = image.width;
      height = image.height;
      pngCodecReadiness = 'ready';
    } catch (error) {
      issueCodes.push(error instanceof Error ? error.message : 'png-decode-failed');
      pngCodecReadiness = 'blocked';
    }
  } else if (kind === 'jpeg') {
    issueCodes.push('jpeg-decode-unsupported');
    jpegBoundaryStatus = 'metadata-only';
  } else {
    issueCodes.push('unknown-file-kind');
  }
  const qualityReport = image && args.qualityGate ? quality(image) : image ? { readiness: 'ready', qualityScore: 1, width, height, brightness: 0, contrast: 0, colorVariance: 0, alphaCoverage: 1, issueCodes: [] } : { readiness: 'blocked', qualityScore: 0, width, height, brightness: 0, contrast: 0, colorVariance: 0, alphaCoverage: 0, issueCodes: ['source-image-quality-blocked'] };
  const links = [{ kind: 'original', uri: `originals/${originalFileName}`, checksum: originalFileChecksum, format: kind }];
  if (image && args.materializeNormalizedPng) {
    const png = encodePng(image);
    plannedFiles.push({ relativePath: `normalized-png/${sourceImageId}.png`, content: png });
    links.push({ kind: 'normalized-png', uri: `normalized-png/${sourceImageId}.png`, checksum: checksumBytes(png), width, height, format: 'png-image' });
  }
  if (image && args.materializeRawRgba) {
    const raw = stableStringify({ magic: 'MEARGBA', version: 1, width, height, channels: 4, colorSpace: 'srgb', values: image.pixels.flatMap((p) => [Math.round(p.r * 255), Math.round(p.g * 255), Math.round(p.b * 255), Math.round(p.a * 255)]) });
    plannedFiles.push({ relativePath: `raw-rgba/${sourceImageId}.rgba.bin.json`, content: raw });
    links.push({ kind: 'raw-rgba', uri: `raw-rgba/${sourceImageId}.rgba.bin.json`, checksum: checksumText(raw), width, height, format: 'raw-rgba-binary' });
  }
  if (image && args.materializeJsonRgba) {
    const json = stableStringify({ artifactId: `${sourceImageId}-json-rgba`, schemaVersion: 'image-pixel-artifact-v0.1', imageId: sourceImageId, width, height, format: 'json-rgba-grid', colorSpace: 'srgb', pixels: { width, height, channels: 4, values: image.pixels.flatMap((p) => [p.r, p.g, p.b, p.a]) }, checksum: originalFileChecksum, sourceImageReference: `originals/${originalFileName}`, createdAt: '2026-05-30T00:00:00.000Z', metadata: { source: 'source-image-import-cli', notes: ['normalized source image'] } });
    plannedFiles.push({ relativePath: `json-rgba/${sourceImageId}.rgba.json`, content: json });
    links.push({ kind: 'json-rgba', uri: `json-rgba/${sourceImageId}.rgba.json`, checksum: checksumText(json), width, height, format: 'json-rgba-grid' });
  }
  const report = stableStringify({ sourceImageId, originalFileName, issueCodes, qualityReport });
  plannedFiles.push({ relativePath: `reports/${sourceImageId}.json`, content: report });
  links.push({ kind: 'report', uri: `reports/${sourceImageId}.json`, format: 'source-image-report', checksum: checksumText(report) });
  const allIssues = [...new Set([...issueCodes, ...(qualityReport.issueCodes ?? [])])].sort();
  const importStatus = issueCodes.length ? (kind === 'jpeg' ? 'blocked_by_codec' : 'failed') : qualityReport.readiness === 'blocked' ? 'blocked_by_quality' : 'ready_for_template_analysis';
  return {
    entry: { sourceImageId, originalFileName, originalFileChecksum, originalFileKind: kind, decodedWidth: width, decodedHeight: height, colorSpace: image ? 'srgb' : 'unknown', channels: image ? 4 : 0, orientation, normalizedArtifactLinks: links, codecReport: { originalKind: kind, pngCodecReadiness, jpegBoundaryStatus, decoded: Boolean(image), issueCodes }, qualityReport, lineage: { importedBy: 'source-image-import-cli', sourceUri: file.replace(/\\/g, '/'), normalizedFromChecksum: originalFileChecksum }, importStatus, createdAt: '2026-05-30T00:00:00.000Z' },
    plannedFiles,
    allIssues,
  };
};

const run = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { process.stdout.write(usage); return; }
  if (!args.input) throw new Error('Missing required --input');
  if (!args.out) throw new Error('Missing required --out');
  const files = await collectFiles(args.input);
  const processed = await Promise.all(files.map((file) => processFile(file, args)));
  const packageId = `source-image-package-${slug(path.basename(path.resolve(args.out)))}`;
  const entries = processed.map((item) => item.entry).sort((a, b) => a.sourceImageId.localeCompare(b.sourceImageId));
  const issueCodes = [...new Set(entries.flatMap((entry) => [...entry.codecReport.issueCodes, ...entry.qualityReport.issueCodes]))].sort();
  const manifest = { schemaVersion: 'source-image-package-v0.1', packageId, createdAt: '2026-05-30T00:00:00.000Z', entries, readiness: entries.some((entry) => entry.importStatus === 'ready_for_template_analysis') ? (issueCodes.length ? 'warning' : 'ready') : 'blocked', issueCodes };
  const quarantineItems = entries.filter((entry) => entry.importStatus !== 'ready_for_template_analysis').map((entry) => ({ sourceImageId: entry.sourceImageId, fileName: entry.originalFileName, checksum: entry.originalFileChecksum, reasons: [...new Set([...entry.codecReport.issueCodes, ...entry.qualityReport.issueCodes])], severity: entry.importStatus.startsWith('blocked') || entry.importStatus === 'failed' ? 'blocking' : 'warning', notes: ['source image is not ready for template analysis'] }));
  const quarantine = { schemaVersion: 'source-image-quarantine-v0.1', packageId, createdAt: '2026-05-30T00:00:00.000Z', items: quarantineItems, blockingCount: quarantineItems.filter((item) => item.severity === 'blocking').length, warningCount: quarantineItems.filter((item) => item.severity === 'warning').length };
  const report = { schemaVersion: 'source-image-import-report-v0.1', packageId, binaryFileReaderReady: true, pngCodecReadiness: entries.some((entry) => entry.codecReport.pngCodecReadiness === 'ready') ? 'ready' : 'blocked', jpegBoundaryStatus: 'metadata-only', sourceImageImportPlan: { input: args.input, out: args.out, fileCount: files.length }, qualityGatePlan: { enabled: args.qualityGate, readiness: manifest.readiness }, plannedArtifacts: processed.flatMap((item) => item.plannedFiles.map((file) => file.relativePath)).sort(), manifestReadiness: manifest.readiness };
  const outputFiles = [
    ...processed.flatMap((item) => item.plannedFiles),
    ...(args.writeManifest ? [{ relativePath: 'source-image-manifest.json', content: stableStringify(manifest, true) }] : []),
    { relativePath: 'import-report.json', content: stableStringify(report, true) },
    { relativePath: 'import-quarantine.json', content: stableStringify(quarantine, true) },
  ];
  const checksums = { schemaVersion: 'source-image-checksums-v0.1', packageId, files: outputFiles.map((file) => ({ path: file.relativePath, checksum: typeof file.content === 'string' ? checksumText(file.content) : checksumBytes(file.content) })).sort((a, b) => a.path.localeCompare(b.path)) };
  outputFiles.push({ relativePath: 'checksums.json', content: stableStringify(checksums, true) });
  if (!args.dryRun) {
    for (const file of outputFiles) {
      const fullPath = path.join(args.out, ...file.relativePath.split('/'));
      await mkdir(path.dirname(fullPath), { recursive: true });
      await writeFile(fullPath, file.content);
    }
  }
  const output = { ...report, dryRun: args.dryRun, outputDir: args.out, entryCount: entries.length, readyCount: entries.filter((entry) => entry.importStatus === 'ready_for_template_analysis').length, quarantineCount: quarantine.items.length, writtenFiles: args.dryRun ? [] : outputFiles.map((file) => file.relativePath).sort() };
  if (args.json) process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  else process.stdout.write(`source-image-import:${output.entryCount}:ready=${output.readyCount}:readiness=${manifest.readiness}\n`);
  if (args.strict && (manifest.readiness === 'blocked' || quarantine.blockingCount > 0)) process.exitCode = 1;
};

run().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
