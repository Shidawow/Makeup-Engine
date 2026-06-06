import {
  createUserAppPwaReadinessReport,
  type UserAppPwaReadinessReport,
} from '../../user-app';

export const userAppPwaReadyExampleReport = createUserAppPwaReadinessReport();

export const userAppPwaMissingManifestExampleReport: UserAppPwaReadinessReport =
  createUserAppPwaReadinessReport({
    metadata: {
      manifestPath: '',
      hasManifestLink: false,
      iconPaths: [],
    },
  });

export const userAppPwaBoundaryBlockedExampleReport: UserAppPwaReadinessReport =
  createUserAppPwaReadinessReport({
    boundaryFlags: {
      hasServiceWorker: true,
      hasBackend: true,
      hasAnalytics: true,
      localOnlyBoundary: false,
    },
  });
