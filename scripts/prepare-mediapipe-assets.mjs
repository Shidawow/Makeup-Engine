#!/usr/bin/env node
import { createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { copyFile } from 'node:fs/promises';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task';
const REQUIRED_WASM_FILES = [
  'vision_wasm_internal.js',
  'vision_wasm_internal.wasm',
  'vision_wasm_module_internal.js',
  'vision_wasm_module_internal.wasm',
  'vision_wasm_nosimd_internal.js',
  'vision_wasm_nosimd_internal.wasm',
];

const parseArgs = (argv) => {
  const options = {
    check: false,
    downloadModel: false,
    json: false,
    modelUrl: DEFAULT_MODEL_URL,
    projectRoot: DEFAULT_PROJECT_ROOT,
    tasksVisionDir: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--check') {
      options.check = true;
    } else if (arg === '--download-model') {
      options.downloadModel = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--project-root') {
      options.projectRoot = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--tasks-vision-dir') {
      options.tasksVisionDir = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--model-url') {
      options.modelUrl = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
};

const formatBytes = (bytes) => {
  if (bytes > 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  if (bytes > 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
};

const downloadFile = (url, targetPath) =>
  new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode ?? 0)) {
        response.resume();
        const nextUrl = response.headers.location;
        if (!nextUrl) {
          reject(new Error(`Redirect without location for ${url}`));
          return;
        }
        downloadFile(new URL(nextUrl, url).toString(), targetPath).then(resolve, reject);
        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Download failed for ${url}: HTTP ${response.statusCode}`));
        return;
      }

      const file = createWriteStream(targetPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
      file.on('error', reject);
    });

    request.on('error', reject);
  });

const collectStatus = ({ projectRoot, tasksVisionDir }) => {
  const mediapipeDir = path.join(projectRoot, 'public', 'mediapipe');
  const wasmDir = path.join(mediapipeDir, 'wasm');
  const modelPath = path.join(mediapipeDir, 'face_landmarker.task');
  const sourceWasmDir =
    tasksVisionDir ?? path.join(projectRoot, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm');
  const targetWasmFiles = REQUIRED_WASM_FILES.map((fileName) => path.join(wasmDir, fileName));
  const missing = [];
  const present = [];

  if (!existsSync(modelPath)) {
    missing.push('public/mediapipe/face_landmarker.task');
  } else {
    present.push({
      path: 'public/mediapipe/face_landmarker.task',
      sizeBytes: statSync(modelPath).size,
    });
  }

  for (const [index, targetPath] of targetWasmFiles.entries()) {
    const relativePath = `public/mediapipe/wasm/${REQUIRED_WASM_FILES[index]}`;
    if (!existsSync(targetPath)) {
      missing.push(relativePath);
    } else {
      present.push({
        path: relativePath,
        sizeBytes: statSync(targetPath).size,
      });
    }
  }

  return {
    mediapipeDir,
    missing,
    modelPath,
    present,
    sourceWasmDir,
    wasmDir,
  };
};

const copyWasmAssets = async ({ sourceWasmDir, wasmDir }) => {
  if (!existsSync(sourceWasmDir)) {
    throw new Error(`Missing @mediapipe/tasks-vision wasm directory: ${sourceWasmDir}`);
  }

  mkdirSync(wasmDir, { recursive: true });

  const copied = [];
  for (const fileName of REQUIRED_WASM_FILES) {
    const sourcePath = path.join(sourceWasmDir, fileName);
    const targetPath = path.join(wasmDir, fileName);

    if (!existsSync(sourcePath)) {
      throw new Error(`Missing wasm source file: ${sourcePath}`);
    }

    await copyFile(sourcePath, targetPath);
    copied.push(`public/mediapipe/wasm/${fileName}`);
  }

  return copied;
};

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  const projectRoot = path.resolve(options.projectRoot);
  let status = collectStatus({
    projectRoot,
    tasksVisionDir: options.tasksVisionDir,
  });
  const copied = [];
  let downloadedModel = false;

  if (!options.check) {
    mkdirSync(status.mediapipeDir, { recursive: true });
    copied.push(
      ...(await copyWasmAssets({
        sourceWasmDir: status.sourceWasmDir,
        wasmDir: status.wasmDir,
      })),
    );

    if (!existsSync(status.modelPath) && options.downloadModel) {
      await downloadFile(options.modelUrl, status.modelPath);
      downloadedModel = true;
    }

    status = collectStatus({
      projectRoot,
      tasksVisionDir: options.tasksVisionDir,
    });
  }

  const result = {
    ok: status.missing.length === 0,
    checkOnly: options.check,
    copied,
    downloadedModel,
    modelUrl: options.modelUrl,
    missing: status.missing,
    present: status.present.map((item) => ({
      ...item,
      size: formatBytes(item.sizeBytes),
    })),
    requiredWasmFiles: REQUIRED_WASM_FILES,
    sourceWasmDir: status.sourceWasmDir,
    nextSteps: status.missing.length
      ? [
          'Run npm run mediapipe:prepare to copy wasm files and download the official model.',
          `If network download is unavailable, manually place the official model at public/mediapipe/face_landmarker.task from ${options.modelUrl}`,
          'Do not commit public/mediapipe/** to GitHub.',
        ]
      : ['Local MediaPipe assets are ready. Do not commit public/mediapipe/** to GitHub.'],
  };

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result.ok ? 'Local MediaPipe assets are ready.' : 'Local MediaPipe assets are incomplete.');
    if (copied.length) {
      console.log(`Copied wasm files: ${copied.length}`);
    }
    if (downloadedModel) {
      console.log(`Downloaded model: ${options.modelUrl}`);
    }
    if (result.present.length) {
      console.log('Present:');
      for (const item of result.present) {
        console.log(`- ${item.path} (${item.size})`);
      }
    }
    if (result.missing.length) {
      console.log('Missing:');
      for (const item of result.missing) {
        console.log(`- ${item}`);
      }
      console.log('Next steps:');
      for (const item of result.nextSteps) {
        console.log(`- ${item}`);
      }
    }
  }

  process.exitCode = result.ok ? 0 : 1;
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
