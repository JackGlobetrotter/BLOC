import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { SemVer } from 'semver';
import { aboutWindow } from './aboutWindow';

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

const installExtensions = async () => {
  // eslint-disable-next-line global-require
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch((ex: any) => console.log(ex));
};

class AppUpdater {
  currentVersion: SemVer = new SemVer('1.0.0');

  newVersion: SemVer = new SemVer('1.0.0');

  isDownloaded = false;

  ready = false;

  failed = false;

  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    this.handleCallbacks();
    autoUpdater.checkForUpdatesAndNotify();
  }

  private handleCallbacks() {
    autoUpdater.on('update-available', (res) => {
      this.newVersion = new SemVer(res.version);
      this.currentVersion = autoUpdater.currentVersion;
      this.ready = true;
    });

    autoUpdater.on('update-not-available', (res) => {
      this.currentVersion = new SemVer(res.version);
      this.newVersion = new SemVer(res.version);
      this.ready = true;
    });

    autoUpdater.on('update-downloaded', () => {
      this.isDownloaded = true;
      aboutWindow?.webContents.send('update-handler', {
        currentVersion: this.currentVersion,
        newVersion: this.newVersion,
        hasUpdate: this.hasUpdate(),
        isDownloaded: this.isDownloaded,
        failed: this.failed,
      });
    });

    autoUpdater.on('error', (error) => {
      this.failed = true;
      aboutWindow?.webContents.send('update-handler', {
        currentVersion: this.currentVersion,
        newVersion: this.newVersion,
        hasUpdate: this.hasUpdate(),
        isDownloaded: this.isDownloaded,
        failed: this.failed,
      });
      console.warn(error);
    });
  }

  hasUpdate() {
    return this.currentVersion.version !== this.newVersion.version;
  }
}

export { isDebug, installExtensions, AppUpdater };
