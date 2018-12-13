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
(async () => {
  await app.disableHardwareAcceleration();
  await app.commandLine.appendArgument('disable-gpu');
  await app.commandLine.appendArgument('enable-transparent-visuals');
})();
app.on('ready', async () => {
  // prepare next renderer
  setTimeout(async () => {
    await prepareNext('./renderer')
    const primaryDisplay = electron.screen.getPrimaryDisplay();
    const { size, workArea } = primaryDisplay;
    const mainWindow = new BrowserWindow({
      y: workArea.y,
      x: workArea.x,
      width: 1,
      height: size.height,
      resizable: false,
      // alwaysOnTop: true,
      // focusable: false,
      frame: false,
      // skipTaskbar: true,
      // backgroundColor: '#00FFFFFF',
      transparent: true,
      // titleBarStyle: 'hidden',
      webPreferences: {
        directWrite: true,
        subpixelFontScaling: true,
        preload: path.join(__dirname, './inject.js'),
      }
    });
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.setFullScreenable(false);
    mainWindow.setPosition(workArea.x, workArea.y);
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
  }, 2000);
});

// Quit the app once all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});
