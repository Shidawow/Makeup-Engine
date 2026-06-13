import {
  createDefaultUserAppAnonymousTrialPostLaunchEvidenceHandoff,
  createUserAppAnonymousTrialPostLaunchHandoff,
} from '../../user-app/userAppAnonymousTrialPostLaunchHandoff';
import { userAppAnonymousTrialLaunchReadinessReadyExample } from './user-app-anonymous-trial-launch-readiness.example';

export const userAppAnonymousTrialPostLaunchHandoffReadyExample =
  createUserAppAnonymousTrialPostLaunchHandoff({
    launchReadiness: userAppAnonymousTrialLaunchReadinessReadyExample,
  });

export const userAppAnonymousTrialPostLaunchHandoffWithEvidenceGapsExample =
  createUserAppAnonymousTrialPostLaunchHandoff({
    launchReadiness: userAppAnonymousTrialLaunchReadinessReadyExample,
    evidenceHandoff: {
      ...createDefaultUserAppAnonymousTrialPostLaunchEvidenceHandoff(),
      evidenceGaps: ['缺少推荐有用性聚合摘要', '缺少试用流程卡点汇总'],
    },
  });

export const userAppAnonymousTrialPostLaunchHandoffStoppedSessionExample =
  createUserAppAnonymousTrialPostLaunchHandoff({
    launchReadiness: userAppAnonymousTrialLaunchReadinessReadyExample,
    evidenceHandoff: {
      ...createDefaultUserAppAnonymousTrialPostLaunchEvidenceHandoff(),
      stoppedSessionReason: '参与者主动提出上传妆容照片，管理员按 stop condition 暂停记录。',
    },
  });

export const userAppAnonymousTrialPostLaunchHandoffPrivacyIncidentExample =
  createUserAppAnonymousTrialPostLaunchHandoff({
    launchReadiness: userAppAnonymousTrialLaunchReadinessReadyExample,
    evidenceHandoff: {
      ...createDefaultUserAppAnonymousTrialPostLaunchEvidenceHandoff(),
      privacyIncidents: ['记录草稿中出现联系方式线索，已停止并移除。'],
    },
  });
