import path from 'path';
import { BrowserWindow, app, shell, Display } from 'electron';
import { LineEnvironnement } from '../../common/lineEnvironnement';
import { resolveHtmlPath } from '../util';
import { mainWindow } from './mainWindow';

// eslint-disable-next-line import/no-mutable-exports
let lineWindow: BrowserWindow | null = null;
let lineEnv: LineEnvironnement | null = null;
let monitor: Display | null = null;
let screenSize: number | null = null;
let runMode: number | null = null;
let generationMode: number | null = null;
let maxLineCount: number | null = null;

const getCurrentLineEnv = (size: number) => {
  if (generationMode === undefined || generationMode === null || !size)
    return undefined;
  lineEnv = new LineEnvironnement(size);
  if (monitor && screenSize)
    lineEnv.getLayout(monitor.workArea, monitor.bounds, screenSize);
  return { env: lineEnv, generationMode, runMode, count: maxLineCount };
};

const createLineWindow = async (
  mon: Display,
  size: number,
  runmode: number,
  generation: number,
  count: number
) => {
  monitor = mon;
  screenSize = size;
  runMode = runmode;
  generationMode = generation;
  maxLineCount = count;

  lineWindow = new BrowserWindow({
    show: false,
    fullscreen: true,
    alwaysOnTop: true,
    frame: false,
    backgroundColor: '#E8E8E8',
    webPreferences: {
      devTools: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../../.erb/dll/preload.js'),
    },
    x: mon ? mon.bounds.x + 50 : 0,
    y: mon ? mon.bounds.y + 50 : 0,
  });

  lineWindow.loadURL(resolveHtmlPath('lineScreen.html'));
  lineWindow.setVisibleOnAllWorkspaces(true);

  lineWindow.on('ready-to-show', () => {
    if (!lineWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      lineWindow.minimize();
    } else {
      lineWindow.show();
    }
  });

  lineWindow.on('show', () => {
    lineWindow?.focus();
  });

  lineWindow.on('closed', () => {
    mainWindow?.webContents.send('runmode-change', false);
    lineWindow = null;
  });

  lineWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyUp') {
      switch (input.key) {
        case 'Escape':
          lineWindow?.close();
          event.preventDefault();
          break;
        default:
          break;
      }
    }
  });

  // Open urls in the user's browser
  lineWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

export { createLineWindow, lineWindow, getCurrentLineEnv };
