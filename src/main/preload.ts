// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'get-monitors'
  | 'get-primary-monitor'
  | 'open-line-screen'
  | 'keypress'
  | 'current-line'
  | 'runmode-change'
  | 'get-runtime-settings'
  | 'get-app-version'
  | 'resize'
  | 'get-app-update'
  | 'update-handler';

const validChannels = [
  'get-monitors',
  'get-primary-monitor',
  'open-line-screen',
  'keypress',
  'get-runtime-settings',
  'runmode-changed',
  'runmode-change',
  'get-app-version',
  'resize',
  'get-app-update',
  'update-handler',
];

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke: (channel: Channels, ...data: any): Promise<any> => {
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
      return Promise.resolve(-1);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
