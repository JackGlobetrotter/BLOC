import { app, ipcMain } from 'electron';
import {
  createLineWindow,
  getCurrentLineEnv,
  lineWindow,
} from '../window/lineWindow';
import {
  getAllMonitors,
  getMonitorById,
  getPrimaryMonitor,
} from '../screenHelper';
import { mainWindow } from '../window/mainWindow';
import { aboutWindow } from '../window/aboutWindow';

export default function initIPC() {
  ipcMain.on('open-line-screen', (_event, data) => {
    /*      screenSize,
      id: selectedMonitor,
      runMode,
      generationMode, */
    const monitor = getMonitorById(data.id);
    if (!monitor) return;
    createLineWindow(
      monitor,
      data.screenSize,
      data.runMode,
      data.generationMode,
      data.count
    );
  });

  ipcMain.handle('get-monitors', () => {
    return getAllMonitors();
  });
  ipcMain.handle('get-primary-monitor', () => {
    return getPrimaryMonitor();
  });

  ipcMain.handle('get-runtime-settings', (_event, data) => {
    return getCurrentLineEnv(data[0].size);
  });

  ipcMain.on('runmode-change', (_event, data) => {
    if (_event.sender.id === lineWindow?.webContents.id) {
      mainWindow?.webContents.send('runmode-change', data);
      if (!data) lineWindow?.close();
    } else if (_event.sender.id === aboutWindow?.webContents.id) {
      if (!data) aboutWindow.close();
    } else if (_event.sender.id === mainWindow?.webContents.id) {
      if (!data) lineWindow?.close();
    }
  });

  ipcMain.on('current-line', (_event, data) => {
    mainWindow?.webContents.send('current-line', data);
  });

  ipcMain.handle('get-app-version', () => {
    return {
      app: app.getVersion(),
      electron: process.versions.electron,
      node: process.versions.node,
      chrome: process.versions.chrome,
    };
  });

  ipcMain.on('resize', (event, data) => {
    if (event.sender.id === aboutWindow?.webContents.id) {
      aboutWindow.setSize(data.width, data.heigth + 30);
    }
  });
}
