import { BrowserWindow, screen } from 'electron';

const getAllMonitors = () => {
  const all = screen.getAllDisplays();

  return all;
};

const getPrimaryMonitor = () => {
  const all = screen.getPrimaryDisplay();

  return all;
};

const getMonitorById = (id: number) => {
  return screen.getAllDisplays().find((mon) => mon.id === id);
};

const getCurrentMonitorFromWindow = (window: BrowserWindow) => {
  const winBounds = window.getBounds();
  const whichScreen = screen.getDisplayNearestPoint({
    x: winBounds.x,
    y: winBounds.y,
  });
  return whichScreen;
};

const getDimensions = () => {};

export {
  getAllMonitors,
  getDimensions,
  getPrimaryMonitor,
  getCurrentMonitorFromWindow,
  getMonitorById,
};
