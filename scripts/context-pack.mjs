import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const readText = (relativePath) => {
  const absolutePath = path.resolve(relativePath);
  try {
    return readFileSync(absolutePath, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Missing or unreadable context file at ${absolutePath}: ${message}`);
  }
};

const readJson = (relativePath) => {
  const raw = readText(relativePath);
  try {
    return JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${path.resolve(relativePath)}: ${message}`);
  }
};

const buildContextPack = () => {
  const snapshot = readJson('project-state/project-state.snapshot.json');
  const providerHandoff = readJson('project-state/provider-handoff.json');
  const activeTask = readJson('project-state/active-task.json');
  const executionProfile = readJson('project-state/execution-profile.json');
  const testStatus = readJson('project-state/test-status.json');
  const guardrailState = readJson('project-state/guardrails.json');
  const nextActionDocument = readText('docs/status/NEXT_ACTION.md');

  return {
    project: {
      name: snapshot.projectName,
      role: snapshot.projectRole,
      isUserFacingApp: snapshot.projectIsUserFacingApp,
    },
    currentPhase: {
      id: snapshot.currentPhaseId,
      name: snapshot.currentPhase,
      lastCompletedPhase: snapshot.lastCompletedPhase,
      lastCompletedBusinessPhase: snapshot.lastCompletedBusinessPhase,
      nextRecommendedPhase: snapshot.nextRecommendedPhase,
      nextRecommendedPhaseName: snapshot.nextRecommendedPhaseName,
    },
    nextAction: snapshot.nextAction,
    nextActionDocumentPath: 'docs/status/NEXT_ACTION.md',
    nextActionDocumentSummary: nextActionDocument
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .slice(0, 8)
      .join('\n'),
    requiredReadFiles: providerHandoff.nextRequiredReadFiles ?? snapshot.recoveryEntryFiles,
    guardrails: [
      ...(guardrailState.guardrails ?? []).map((guardrail) => guardrail.rule),
      ...(snapshot.forbiddenActions ?? []),
    ],
    providerHandoff,
    activeTask,
    executionProfile,
    lastValidation: testStatus.lastValidation ?? snapshot.lastValidation,
  };
};

const printHumanContext = (contextPack) => {
  const lines = [
    'Makeup Engine 上下文包',
    '',
    '项目定位:',
    `- ${contextPack.project.name}: ${contextPack.project.role}`,
    `- 用户侧 App: ${contextPack.project.isUserFacingApp ? 'yes' : 'no'}`,
    '',
    '当前阶段:',
    `- ${contextPack.currentPhase.id}: ${contextPack.currentPhase.name}`,
    `- 上个完成阶段: ${contextPack.currentPhase.lastCompletedPhase}`,
    `- 上个业务阶段: ${contextPack.currentPhase.lastCompletedBusinessPhase}`,
    `- 下一建议阶段: ${contextPack.currentPhase.nextRecommendedPhase} - ${contextPack.currentPhase.nextRecommendedPhaseName}`,
    '',
    `下一步: ${contextPack.nextAction}`,
    '',
    '必须先读:',
    ...contextPack.requiredReadFiles.map((filePath) => `- ${filePath}`),
    '',
    '禁止事项:',
    ...contextPack.guardrails.map((guardrail) => `- ${guardrail}`),
    '',
    '当前测试状态:',
    `- typecheck: ${contextPack.lastValidation.typecheck ?? 'unknown'}`,
    `- test: ${contextPack.lastValidation.test ?? 'unknown'}`,
    `- build: ${contextPack.lastValidation.build ?? 'unknown'}`,
    `- project:status: ${contextPack.lastValidation.projectStatus ?? 'unknown'}`,
    `- project:context: ${contextPack.lastValidation.projectContext ?? 'unknown'}`,
    `- test files: ${contextPack.lastValidation.testFiles ?? 'unknown'}`,
    `- tests: ${contextPack.lastValidation.tests ?? 'unknown'}`,
    '',
    'Provider handoff 摘要:',
    `- activeProvider: ${contextPack.providerHandoff.activeProvider}`,
    `- lastProvider: ${contextPack.providerHandoff.lastProvider}`,
    `- currentTask: ${contextPack.providerHandoff.currentTask}`,
    `- taskStatus: ${contextPack.providerHandoff.taskStatus}`,
    `- recommendedProfile: ${contextPack.executionProfile.recommendedProfile}`,
  ];

  process.stdout.write(`${lines.join('\n')}\n`);
};

const main = () => {
  const args = new Set(process.argv.slice(2));
  const contextPack = buildContextPack();

  if (args.has('--json')) {
    process.stdout.write(`${JSON.stringify(contextPack, null, 2)}\n`);
    return;
  }

  printHumanContext(contextPack);
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
