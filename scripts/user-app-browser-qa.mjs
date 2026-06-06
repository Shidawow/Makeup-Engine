#!/usr/bin/env node
import { spawn, execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CREATED_AT = '2026-01-01T00:00:00.000Z';

const parseArgs = (argv) => {
  const args = {
    host: '127.0.0.1',
    port: 5177,
    timeoutMs: 20000,
    out: '',
    json: false,
    skipServer: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--host') args.host = argv[++index] ?? args.host;
    else if (arg === '--port') args.port = Number(argv[++index] ?? args.port);
    else if (arg === '--timeout-ms') args.timeoutMs = Number(argv[++index] ?? args.timeoutMs);
    else if (arg === '--out') args.out = argv[++index] ?? '';
    else if (arg === '--json') args.json = true;
    else if (arg === '--skip-server') args.skipServer = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
};

const helpText = `User App browser/mobile QA smoke

Usage:
  node scripts/user-app-browser-qa.mjs [options]

Options:
  --host <host>          Dev server host. Default: 127.0.0.1
  --port <port>          Dev server port. Default: 5177
  --timeout-ms <ms>      Wait timeout for HTTP smoke. Default: 20000
  --out <file>           Optional report output path.
  --json                 Print machine-readable JSON.
  --skip-server          Do not start Vite; only run source copy checks.
  --help                 Show this help.

Boundary:
  Local HTTP smoke only. No backend, database, camera, AR, training, OpenAI API,
  external API, screenshot capture, or browser automation dependency.
`;

const stableStringify = (value, pretty = true) => {
  const normalize = (item) => {
    if (Array.isArray(item)) return item.map(normalize);
    if (item && typeof item === 'object') {
      return Object.fromEntries(
        Object.entries(item)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([key, nested]) => [key, normalize(nested)]),
      );
    }
    return item;
  };

  return JSON.stringify(normalize(value), null, pretty ? 2 : 0);
};

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const fetchWithTimeout = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const waitForHttp = async (url, timeoutMs) => {
  const startedAt = Date.now();
  let lastError = null;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetchWithTimeout(url, 3000);
      const text = await response.text();
      return { ok: true, status: response.status, text, error: null };
    } catch (error) {
      lastError = error;
      await sleep(300);
    }
  }

  return {
    ok: false,
    status: 0,
    text: '',
    error: lastError instanceof Error ? lastError.message : String(lastError),
  };
};

const stopServer = (child) => {
  if (!child || child.killed) return;
  if (process.platform === 'win32' && child.pid) {
    try {
      execFileSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
      return;
    } catch {
      // Fall back to normal kill below.
    }
  }
  child.kill('SIGTERM');
};

const readUserAppCopy = async () => {
  const files = [
    'src/components/user-app/UserAppShell.tsx',
    'src/components/user-app/UserAppMobileHome.tsx',
    'src/components/user-app/UserTemplateDetail.tsx',
    'src/components/user-app/UserMakeupStepGuide.tsx',
    'src/components/user-app/UserAppPwaInstallPanel.tsx',
    'src/components/user-app/UserAppMvpPolishChecklist.tsx',
    'src/components/user-app/UserAppReadinessPanel.tsx',
    'src/components/user-app/UserAppMobileQaPanel.tsx',
    'src/components/user-app/UserAppInteractionChecklist.tsx',
    'src/components/user-app/UserPrivacyNotice.tsx',
  ];
  const parts = [];
  for (const file of files) {
    parts.push(await readFile(path.resolve(file), 'utf8'));
  }
  return parts.join('\n');
};

const requiredCopy = [
  '今日妆容练习',
  '跟练',
  '发现妆容',
  '我的准备',
  '我的偏好',
  '本地进度',
  'PWA 检查',
  'MVP 打磨',
  '管理员检查',
  'App 就绪度',
  '移动端 QA',
  '交互检查',
  '隐私说明',
  '开始分步指导',
  '上一步',
  '下一步',
  '标记完成',
  '跳过',
];

const requiredPrivacyCopy = [
  '不采集真实用户照片',
  '不上传照片',
  '不会把用户照片、偏好、会话或推荐记录用于训练',
  '不会用于训练',
];

const forbiddenTokens = [
  'blob:',
  'data:image/',
  'C:\\',
  '/Users/',
  'imageBytes',
  'photoBytes',
  'faceEmbedding',
  'biometricId',
];

const mojibakePatterns = [
  /灏辩华|绉诲姩|鐢ㄦ埛|妯℃澘|闅愮|姝ラ|閫氳繃|鎻愰啋/,
  /鍙|杩涘|褰撳|鏈|涓嶆|浜や/,
];

const statusFromIssues = (blocking, warnings = []) => {
  if (blocking.length > 0) return 'blocked';
  if (warnings.length > 0) return 'passed_with_warnings';
  return 'passed';
};

const createReport = ({ url, httpResult, sourceText, skippedServer }) => {
  const httpBlocking = skippedServer
    ? []
    : [
        ...(httpResult.status >= 200 && httpResult.status < 300
          ? []
          : [`HTTP status is ${httpResult.status || 'unavailable'}`]),
        ...(httpResult.text.includes('<div id="root"></div>') || httpResult.text.includes('id="root"')
          ? []
          : ['Vite HTML did not include root mount element']),
      ];
  const copyMissing = requiredCopy.filter((snippet) => !sourceText.includes(snippet));
  const privacyMissing = requiredPrivacyCopy.filter((snippet) => !sourceText.includes(snippet));
  const forbiddenHits = forbiddenTokens.filter((token) => sourceText.includes(token));
  const mojibakeHits = mojibakePatterns
    .filter((pattern) => pattern.test(sourceText))
    .map((pattern) => pattern.source);
  const checks = [
    {
      checkId: 'browser-http-smoke',
      status: statusFromIssues(httpBlocking),
      evidence: [
        `url: ${url}`,
        `httpStatus: ${httpResult.status}`,
        `skipServer: ${String(skippedServer)}`,
      ],
      issues: httpBlocking,
    },
    {
      checkId: 'critical-copy',
      status: statusFromIssues([], copyMissing.map((snippet) => `Missing copy: ${snippet}`)),
      evidence: [`requiredCopy: ${requiredCopy.length}`, `missingCopy: ${copyMissing.length}`],
      issues: copyMissing.map((snippet) => `Missing copy: ${snippet}`),
    },
    {
      checkId: 'privacy-copy',
      status: statusFromIssues(
        forbiddenHits.map((token) => `Forbidden token in user copy: ${token}`),
        privacyMissing.map((snippet) => `Missing privacy copy: ${snippet}`),
      ),
      evidence: [
        `forbiddenTokenHits: ${forbiddenHits.length}`,
        `missingPrivacyCopy: ${privacyMissing.length}`,
      ],
      issues: [
        ...forbiddenHits.map((token) => `Forbidden token in user copy: ${token}`),
        ...privacyMissing.map((snippet) => `Missing privacy copy: ${snippet}`),
      ],
    },
    {
      checkId: 'chinese-copy',
      status: statusFromIssues(
        mojibakeHits.map((pattern) => `Mojibake pattern found: ${pattern}`),
      ),
      evidence: [`mojibakePatternHits: ${mojibakeHits.length}`],
      issues: mojibakeHits.map((pattern) => `Mojibake pattern found: ${pattern}`),
    },
  ];
  const statuses = checks.map((check) => check.status);
  const status = statuses.includes('blocked')
    ? 'blocked'
    : statuses.includes('passed_with_warnings')
      ? 'passed_with_warnings'
      : 'passed';

  return {
    schemaVersion: 'user-app-browser-smoke-report-v0.1',
    createdAt: CREATED_AT,
    status,
    url,
    browserSmokeStatus: checks[0].status,
    criticalPathStatus: checks[1].status,
    privacyCopyStatus: checks[2].status,
    chineseCopyStatus: checks[3].status,
    checks,
    localOnly: true,
    deterministic: true,
    productionApp: false,
    usesBackend: false,
    usesCamera: false,
    usesAr: false,
    usesTraining: false,
    usesExternalApi: false,
    nextRecommendation:
      status === 'blocked'
        ? 'Fix blocking browser/mobile QA issues before Phase 8B completion.'
        : 'Browser/mobile smoke is sufficient for Phase 8B local PWA/mobile polish evidence.',
  };
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(helpText);
    return;
  }

  const url = `http://${args.host}:${args.port}/`;
  let child = null;
  let httpResult = { ok: true, status: 200, text: '<div id="root"></div>', error: null };

  try {
    if (!args.skipServer) {
      const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      child = spawn(
        npmCommand,
        ['run', 'dev', '--', '--host', args.host, '--port', String(args.port)],
        {
          cwd: process.cwd(),
          env: { ...process.env, BROWSER: 'none' },
          stdio: ['ignore', 'ignore', 'pipe'],
        },
      );

      httpResult = await waitForHttp(url, args.timeoutMs);
    }

    const sourceText = await readUserAppCopy();
    const report = createReport({
      url,
      httpResult,
      sourceText,
      skippedServer: args.skipServer,
    });

    if (args.out) {
      await writeFile(path.resolve(args.out), `${stableStringify(report)}\n`, 'utf8');
    }

    if (args.json) {
      process.stdout.write(`${stableStringify(report)}\n`);
    } else {
      process.stdout.write(
        `user-app-browser-qa:${report.status}:http=${report.browserSmokeStatus}:copy=${report.chineseCopyStatus}\n`,
      );
    }

    if (report.status === 'blocked') {
      process.exitCode = 1;
    }
  } finally {
    stopServer(child);
  }
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
