const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();

// 빌드 시 주석
// process.env.MODE='dev';

app.whenReady().then(() => {
  const winOptions = {
    width: 870,  
    height: 550,
    minWidth: 870,
    minHeight: 395,
    show: false,
    webPreferences: {  
      nodeIntegration: true, 
      contextIsolation : false
    } 
  };

  winOptions.autoHideMenuBar = true;

  const win = new BrowserWindow(winOptions);

  require('@electron/remote/main').enable(win.webContents);

  if (process.env.MODE === 'dev') {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadURL(
      `file://${path.join(__dirname, '../build/index.html')}`
    );
    win.loadFile(
      `${path.join(__dirname, '../build/index.html')}`
    );
  }

  const splash = new BrowserWindow({
    width: 1200,  
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    alwaysOnTop: true,
    transparent: true
  });

  splash.center();
  if (process.env.MODE === 'dev') {
    splash.loadFile(
      `${path.join(__dirname, 'splash.html')}`
    );
  } else {
    splash.loadFile(
      `${path.join(__dirname, '../build/splash.html')}`
    );
  }

  setTimeout(() => {
    splash.close();
    win.show();
  }, 7000);
});

app.on('window-all-closed', () => {
  app.quit();
});


if(process.env.MODE !== 'dev') {
  app.on('browser-window-focus', function () {
    globalShortcut.register("CommandOrControl+R", () => {
        console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    });
    globalShortcut.register("F5", () => {
        console.log("F5 is pressed: Shortcut Disabled");
    });
  });
  
  app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('F5');
  });
  
}
