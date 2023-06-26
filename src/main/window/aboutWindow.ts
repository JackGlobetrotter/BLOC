import path from 'path';
import { BrowserWindow, app, shell } from 'electron';
import { resolveHtmlPath } from '../util';

// eslint-disable-next-line import/no-mutable-exports
let aboutWindow: BrowserWindow | null = null;

export default function openAboutWindow() {
  aboutWindow = new BrowserWindow({
    show: false,
    modal: false,
    minimizable: false,
    useContentSize: true,
    maximizable: false,
    skipTaskbar: true,
    parent: BrowserWindow.getFocusedWindow()!,
    webPreferences: {
      devTools: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../../.erb/dll/preload.js'),
    },
  });

  aboutWindow.loadURL(resolveHtmlPath('aboutWindow.html'));

  aboutWindow.on('ready-to-show', () => {
    if (!aboutWindow) {
      throw new Error('"aboutWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      aboutWindow.minimize();
    } else {
      aboutWindow.show();
    }
  });

  aboutWindow.on('closed', () => {
    aboutWindow = null;
  });

  // Open urls in the user's browser
  aboutWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
}

export { aboutWindow, openAboutWindow };
