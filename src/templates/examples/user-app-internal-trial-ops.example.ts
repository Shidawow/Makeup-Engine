import {
  createUserAppInternalTrialOpsPack,
  type UserAppInternalTrialOpsPack,
} from '../../user-app/userAppInternalTrialOps';

export const userAppInternalTrialOpsReadyExample: UserAppInternalTrialOpsPack =
  createUserAppInternalTrialOpsPack();

export const userAppInternalTrialOpsIncompleteParticipantCoverageExample: UserAppInternalTrialOpsPack =
  createUserAppInternalTrialOpsPack({
    packId: 'internal-trial-ops-incomplete-participants',
    participantTypes: ['complete_beginner', 'internal_product_reviewer'],
  });

export const userAppInternalTrialOpsUnsafeCollectionExample: UserAppInternalTrialOpsPack =
  createUserAppInternalTrialOpsPack({
    packId: 'internal-trial-ops-unsafe-collection',
    collectsRealName: true,
    collectsContact: true,
    collectsPhoto: true,
    collectsHealthInfo: true,
    writesTrainingInput: true,
    writesProjectStateUserRecords: true,
  });
