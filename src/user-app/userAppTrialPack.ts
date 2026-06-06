export const USER_APP_TRIAL_PACK_SCHEMA_VERSION = 'user-app-trial-pack-v0.1' as const;

export type UserAppTrialTaskId =
  | 'open_shell'
  | 'browse_recommendation'
  | 'select_template'
  | 'read_template_detail'
  | 'start_guidance'
  | 'complete_three_steps'
  | 'view_tools_products'
  | 'view_region_guidance'
  | 'set_or_skip_preferences'
  | 'read_privacy_notice'
  | 'restore_local_progress';

export type UserAppTrialPackStatus = 'ready' | 'warning' | 'blocked';

export interface UserAppTrialInstruction {
  instructionId: string;
  title: string;
  body: string;
  localOnly: true;
}

export interface UserAppTrialTask {
  taskId: UserAppTrialTaskId;
  order: number;
  title: string;
  successCriteria: string;
  estimatedMinutes: number;
  required: boolean;
  userPath: true;
  localOnly: true;
}

export interface UserAppTrialChecklist {
  checklistId: string;
  title: string;
  items: string[];
  required: boolean;
}

export interface UserAppTrialScenario {
  scenarioId: string;
  title: string;
  audience: 'internal' | 'small_scope_trial';
  templateCoverage: string[];
  instructions: UserAppTrialInstruction[];
  tasks: UserAppTrialTask[];
  checklist: UserAppTrialChecklist;
  localOnly: true;
  deterministic: true;
}

export interface UserAppTrialIssue {
  issueId: string;
  area: 'tasks' | 'scenario' | 'privacy' | 'boundary';
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppTrialPack {
  schemaVersion: typeof USER_APP_TRIAL_PACK_SCHEMA_VERSION;
  packId: string;
  title: string;
  status: UserAppTrialPackStatus;
  scenario: UserAppTrialScenario;
  checklist: UserAppTrialChecklist;
  issues: UserAppTrialIssue[];
  localOnly: true;
  deterministic: true;
  productionApp: false;
  usesBackend: false;
  uploadsData: false;
  usesCamera: false;
  usesAr: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppTrialPackInput {
  packId?: string;
  title?: string;
  tasks?: UserAppTrialTask[];
  templateCoverage?: string[];
  privacyCopyReady?: boolean;
  boundaryReady?: boolean;
}

const requiredTaskIds: UserAppTrialTaskId[] = [
  'open_shell',
  'browse_recommendation',
  'select_template',
  'read_template_detail',
  'start_guidance',
  'complete_three_steps',
  'view_tools_products',
  'view_region_guidance',
  'set_or_skip_preferences',
  'read_privacy_notice',
  'restore_local_progress',
];

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 29);

const issue = (input: Omit<UserAppTrialIssue, 'issueId'>): UserAppTrialIssue => ({
  ...input,
  issueId: `trial-pack-${input.area}-${input.severity}-${Math.abs(hashText(input.message))}`,
});

export const createDefaultUserAppTrialTasks = (): UserAppTrialTask[] => [
  {
    taskId: 'open_shell',
    order: 1,
    title: '打开移动 Web MVP 壳',
    successCriteria: '用户能看到今日妆容练习入口和本地隐私提示。',
    estimatedMinutes: 1,
    required: true,
    userPath: true,
    localOnly: true,
  },
  {
    taskId: 'browse_recommendation',
    order: 2,
    title: '浏览当前推荐妆容',
    successCriteria: '用户能说出推荐妆容大致适合什么场景。',
    estimatedMinutes: 1,
    required: true,
    userPath: true,
    localOnly: true,
  },
  {
    taskId: 'select_template',
    order: 3,
    title: '选择一个妆容模板',
    successCriteria: '用户能从发现妆容或列表中选中一个模板。',
    estimatedMinutes: 2,
    required: true,
    userPath: true,
    localOnly: true,
  },
  {
    taskId: 'read_template_detail',
    order: 4,
    title: '阅读模板详情',
    successCriteria: '用户能理解难度、时长、场景和安全提示。',
    estimatedMinutes: 2,
    required: true,
    userPath: true,
    localOnly: true,
  },
  {
    taskId: 'start_guidance',
    order: 5,
    title: '开始分步跟练',
    successCriteria: '用户能找到并点击开始分步指导。',
    estimatedMinutes: 1,
    required: true,
    userPath: true,
    localOnly: true,
  },
  {
    taskId: 'complete_three_steps',
    order: 6,
    title: '完成至少 3 个步骤',
    successCriteria: '用户能用上一步、下一步、标记完成、跳过完成本地进度。',
    estimatedMinutes: 6,
    required: true,
    userPath: true,
    localOnly: true,
  },
  {
    taskId: 'view_tools_products',
    order: 7,
    title: '查看工具和产品建议',
    successCriteria: '用户能判断自己需要哪些工具或产品。',
    estimatedMinutes: 2,
    required: true,
    userPath: true,
    localOnly: true,
  },
  {
    taskId: 'view_region_guidance',
    order: 8,
    title: '查看上妆区域说明',
    successCriteria: '用户能理解每个区域画在哪里和怎么晕染。',
    estimatedMinutes: 2,
    required: true,
    userPath: true,
    localOnly: true,
  },
  {
    taskId: 'set_or_skip_preferences',
    order: 9,
    title: '设置或跳过本地偏好',
    successCriteria: '用户知道偏好是本地、非敏感、可跳过的。',
    estimatedMinutes: 2,
    required: true,
    userPath: true,
    localOnly: true,
  },
  {
    taskId: 'read_privacy_notice',
    order: 10,
    title: '查看隐私说明',
    successCriteria: '用户能复述不上传、不启用照片/相机/AR、不会用于训练。',
    estimatedMinutes: 1,
    required: true,
    userPath: true,
    localOnly: true,
  },
  {
    taskId: 'restore_local_progress',
    order: 11,
    title: '退出后恢复本地进度',
    successCriteria: '用户能保存、加载或理解本地进度恢复提示。',
    estimatedMinutes: 2,
    required: true,
    userPath: true,
    localOnly: true,
  },
];

export const validateUserAppTrialPack = (
  pack: UserAppTrialPack,
): UserAppTrialIssue[] => {
  const taskIds = pack.scenario.tasks.map((task) => task.taskId);
  const missingTasks = requiredTaskIds.filter((taskId) => !taskIds.includes(taskId));
  const ordered = pack.scenario.tasks.every((task, index, tasks) =>
    index === 0 ? task.order === 1 : task.order > tasks[index - 1].order,
  );
  const issues: UserAppTrialIssue[] = [];

  if (missingTasks.length > 0) {
    issues.push(
      issue({
        area: 'tasks',
        severity: 'blocking',
        message: `试用任务不完整，缺少：${missingTasks.join(', ')}`,
        recommendation: '补齐打开、发现、详情、跟练、工具、区域、偏好、隐私和恢复任务。',
      }),
    );
  }

  if (!ordered) {
    issues.push(
      issue({
        area: 'tasks',
        severity: 'blocking',
        message: '试用任务顺序不连续或不递增。',
        recommendation: '按用户实际路径从打开 shell 到恢复本地进度排序。',
      }),
    );
  }

  if (pack.scenario.templateCoverage.length === 0) {
    issues.push(
      issue({
        area: 'scenario',
        severity: 'warning',
        message: '试用场景没有声明模板覆盖范围。',
        recommendation: '至少声明 daily/work/evening 或 beginner/warning-state 覆盖。',
      }),
    );
  }

  if (!pack.localOnly || pack.usesBackend || pack.uploadsData || pack.usesCamera || pack.usesAr) {
    issues.push(
      issue({
        area: 'boundary',
        severity: 'blocking',
        message: '试用包越过了 local-only / no backend / no upload / no camera / no AR 边界。',
        recommendation: '试用包只能描述本地任务和示例反馈，不收集或上传真实用户数据。',
      }),
    );
  }

  if (pack.writesTrainingInput || pack.writesProjectStateUserRecords) {
    issues.push(
      issue({
        area: 'privacy',
        severity: 'blocking',
        message: '试用包不能写入训练输入或 project-state 用户记录。',
        recommendation: '只保留文档化结构和 mock/example 数据。',
      }),
    );
  }

  return issues;
};

const statusFromIssues = (issues: readonly UserAppTrialIssue[]): UserAppTrialPackStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'warning';
  return 'ready';
};

export const createUserAppTrialPack = (
  input: CreateUserAppTrialPackInput = {},
): UserAppTrialPack => {
  const tasks = input.tasks ?? createDefaultUserAppTrialTasks();
  const checklist: UserAppTrialChecklist = {
    checklistId: 'trial-flow-checklist-v0',
    title: 'MVP 试用流程 checklist',
    items: tasks
      .sort((a, b) => a.order - b.order)
      .map((task) => `${task.order}. ${task.title}`),
    required: true,
  };
  const scenario: UserAppTrialScenario = {
    scenarioId: 'internal-small-scope-mobile-web-trial',
    title: '小范围移动 Web 跟练试用',
    audience: 'small_scope_trial',
    templateCoverage: input.templateCoverage ?? ['daily', 'work', 'evening', 'beginner'],
    instructions: [
      {
        instructionId: 'prepare-local-shell',
        title: '试用前准备',
        body: '使用本地移动 Web MVP 壳和示例妆容包，不登录、不上传、不启用相机或 AR。',
        localOnly: true,
      },
      {
        instructionId: 'observe-user-understanding',
        title: '观察重点',
        body: '观察用户是否理解推荐、详情、步骤、工具、区域、隐私和恢复进度。',
        localOnly: true,
      },
    ],
    tasks,
    checklist,
    localOnly: true,
    deterministic: true,
  };
  const draft: UserAppTrialPack = {
    schemaVersion: USER_APP_TRIAL_PACK_SCHEMA_VERSION,
    packId: input.packId ?? 'user-app-mvp-trial-pack-v0',
    title: input.title ?? 'User App MVP Trial Pack',
    status: 'ready',
    scenario,
    checklist,
    issues: [],
    localOnly: true,
    deterministic: true,
    productionApp: false,
    usesBackend: false,
    uploadsData: false,
    usesCamera: false,
    usesAr: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
  const issues = validateUserAppTrialPack(draft);

  return {
    ...draft,
    status: statusFromIssues(issues),
    issues,
  };
};

export const summarizeUserAppTrialPack = (pack: UserAppTrialPack): string =>
  JSON.stringify({
    schemaVersion: pack.schemaVersion,
    status: pack.status,
    taskCount: pack.scenario.tasks.length,
    coverage: pack.scenario.templateCoverage,
    localOnly: pack.localOnly,
    productionApp: pack.productionApp,
    usesBackend: pack.usesBackend,
    uploadsData: pack.uploadsData,
    usesCamera: pack.usesCamera,
    usesAr: pack.usesAr,
    writesTrainingInput: pack.writesTrainingInput,
  });
