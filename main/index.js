// Native
const path = require('path');
const { format } = require('url');

// Packages
const electron = require('electron');
const isDev = require('electron-is-dev');
const prepareNext = require('electron-next');
const { resolve } = require('app-root-path');

const {
  BrowserWindow,
  app,
  ipcMain,
} = electron;

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  // disableHardwareAcceleration for animation
  // app.disableHardwareAcceleration();
  // prepare next renderer
  await prepareNext('./renderer')
  const primaryDisplay = electron.screen.getPrimaryDisplay();
  const { size } = primaryDisplay;
  const mainWindow = new BrowserWindow({
    y: 0,
    x: 0,
    width: 1,
    height: size.height,
    resizable: false,
    alwaysOnTop: true,
    focusable: false,
    frame: false,
    transparent: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, './inject.js'),
    }
  });
  const windows = {};
  ipcMain.on('notification', (e, notification) => {
    console.log(notification.from);
    mainWindow.webContents.send('notification', notification);
  });
  ipcMain.on('openApp', (e, app) => {
    let appWindow = windows[app.name]
    if (appWindow) {
      appWindow.setSkipTaskbar(true);
      if (appWindow.isFocused()) {
         appWindow.hide();
      } else if (appWindow.isVisible()) {
        appWindow.focus();
      } else {
        appWindow.show();
      }
      return appWindow.setSkipTaskbar(true);
    }
    appWindow = windows[app.name] = new BrowserWindow({
      title: app.name,
      height: size.height,
      width: (size.width / 2).toFixed(0),
      y: 0,
      x: size.width,
      webPreferences: {
        preload: path.join(__dirname, './inject.js'),
        allowRunningInsecureContent: false,
        nodeIntegrationInWorker: false,
        nodeIntegration: false,
        webSecurity: true,
      },
      show: false,
      skipTaskbar: true,
    });
    appWindow.setMenuBarVisibility(false);
    appWindow.loadURL(app.url);
    appWindow.once('ready-to-show', () => {
      appWindow.show();
    });
    appWindow.on('close', (e) => {
      e.preventDefault();
      appWindow.hide();
    });
  });
  const devPath = 'http://localhost:8000/start'
  const prodPath = format({
    pathname: resolve('renderer/out/start/index.html'),
    protocol: 'file:',
    slashes: true
  })
  const url = isDev ? devPath : prodPath
  mainWindow.loadURL(url);
  // mainWindow.webContents.openDevTools({
  //   detach: true,
  // });
})

// Quit the app once all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});
