import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const snapshotPath = path.resolve('project-state/project-state.snapshot.json');

const readSnapshot = () => {
  try {
    const raw = readFileSync(snapshotPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Missing or unreadable project state snapshot at ${snapshotPath}: ${message}`);
  }
};

const toStatusPayload = (snapshot) => ({
  currentPhase: snapshot.currentPhase,
  currentPhaseId: snapshot.currentPhaseId,
  lastCompletedPhase: snapshot.lastCompletedPhase,
  lastCompletedBusinessPhase: snapshot.lastCompletedBusinessPhase,
  nextRecommendedPhase: snapshot.nextRecommendedPhase,
  nextRecommendedPhaseName: snapshot.nextRecommendedPhaseName,
  lastValidation: snapshot.lastValidation,
  mainModules: snapshot.mainModules,
  legacyFrozenModules: snapshot.legacyFrozenModules,
  knownLimitations: snapshot.knownLimitations,
  nextAction: snapshot.nextAction,
});

const printHumanStatus = (status) => {
  const lines = [
    'Makeup Engine 项目状态',
    '',
    `当前阶段: ${status.currentPhaseId ?? 'unknown'} - ${status.currentPhase ?? 'unknown'}`,
    `上个完成阶段: ${status.lastCompletedPhase ?? 'unknown'}`,
    ...(status.lastCompletedBusinessPhase ? [`上个业务阶段: ${status.lastCompletedBusinessPhase}`] : []),
    `下一建议阶段: ${status.nextRecommendedPhase ?? 'unknown'} - ${status.nextRecommendedPhaseName ?? 'unknown'}`,
    '',
    '最近验证:',
    `- typecheck: ${status.lastValidation?.typecheck ?? 'unknown'}`,
    `- test: ${status.lastValidation?.test ?? 'unknown'}`,
    `- build: ${status.lastValidation?.build ?? 'unknown'}`,
    `- test files: ${status.lastValidation?.testFiles ?? 'unknown'}`,
    `- tests: ${status.lastValidation?.tests ?? 'unknown'}`,
    '',
    '主线模块:',
    ...status.mainModules.map((moduleName) => `- ${moduleName}`),
    '',
    'Legacy / frozen 模块:',
    ...status.legacyFrozenModules.map((moduleName) => `- ${moduleName}`),
    '',
    '当前限制:',
    ...status.knownLimitations.map((limitation) => `- ${limitation}`),
    '',
    `下一步: ${status.nextAction ?? 'unknown'}`,
  ];

  process.stdout.write(`${lines.join('\n')}\n`);
};

const main = () => {
  const args = new Set(process.argv.slice(2));
  const snapshot = readSnapshot();
  const status = toStatusPayload(snapshot);

  if (args.has('--json')) {
    process.stdout.write(`${JSON.stringify(status, null, 2)}\n`);
    return;
  }

  printHumanStatus(status);
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
