const { notarize } = require('@electron/notarize');
const { build } = require('../../package.json');

exports.default = async function notarizeMacos(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (process.env.CI !== 'true') {
    console.warn('Skipping notarizing step. Packaging is not running in CI');
    return;
  }

  if (
    !(
      'APPLE_ID' in process.env &&
      'APPLE_APP_SPECIFIC_PASSWORD' in process.env &&
      'TEAM_ID' in process.env
    ) ||
    !('KEYCHAIN_PROFILE' in process.env)
  ) {
    console.warn(
      'Skipping notarizing step. Either APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD and TEAM_ID or KEYCHAIN_PROFILE env variables must be set'
    );
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  if ('KEYCHAIN_PROFILE' in process.env) {
    console.log(
      `Notarizing ${appName} in ${appOutDir} for ${process.env.KEYCHAIN_PROFILE}`
    );
    await notarize({
      appPath: `${appOutDir}/${appName}.app`,
      keychainProfile: process.env.KEYCHAIN_PROFILE,
      tool: 'notarytool',
    });
  } else {
    console.log(
      `Notarizing ${appName} in ${appOutDir} for ${process.env.APPLE_ID}`
    );
    await notarize({
      appBundleId: build.appId,
      appPath: `${appOutDir}/${appName}.app`,
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.TEAM_ID,
    });
  }
};
