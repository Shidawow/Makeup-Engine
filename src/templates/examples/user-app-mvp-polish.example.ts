import { createUserAppMvpPolishReport } from '../../user-app';
import {
  userAppPwaMissingManifestExampleReport,
  userAppPwaReadyExampleReport,
} from './user-app-pwa-polish.example';

export const userAppMvpPolishReadyExampleReport = createUserAppMvpPolishReport({
  pwaReport: userAppPwaReadyExampleReport,
});

export const userAppMvpPolishMissingManifestExampleReport = createUserAppMvpPolishReport({
  pwaReport: userAppPwaMissingManifestExampleReport,
});

export const userAppMvpPolishUserCopyWarningExampleReport = createUserAppMvpPolishReport({
  hidesInternalTermsFromUserPath: false,
  userPathInternalTerms: ['contract', 'schema', 'readiness gate', 'package'],
});
