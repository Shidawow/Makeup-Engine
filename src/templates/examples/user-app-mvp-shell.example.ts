import type { UserAppTemplatePackage } from '../schema/user-app-template-contract.schema';
import { userAppMultiTemplatePackageExample } from './user-app-template-package-qa-fixtures.example';

const clonePackage = (packageData: UserAppTemplatePackage): UserAppTemplatePackage =>
  JSON.parse(JSON.stringify(packageData)) as UserAppTemplatePackage;

export const userAppMvpShellExamplePackage: UserAppTemplatePackage = {
  ...clonePackage(userAppMultiTemplatePackageExample),
  packageId: 'user-app-mvp-shell-example-v0',
  packageName: 'User App MVP Shell Example Package',
  exportNotes: [
    'Phase 7A MVP shell fixture',
    'local contract data only',
    'no object URLs',
    'no local absolute paths',
    'no large image bytes',
  ],
};
