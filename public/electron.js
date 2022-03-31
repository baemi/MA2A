const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');

process.env.MODE='dev';

app.whenReady().then(() => {
  const winOptions = {
    width: 800,  
    height: 600,
    minWidth: 750,
    minHeight: 600,
    webPreferences: {  
      nodeIntegration: true, 
      contextIsolation : false, 
    } 
  };

  if(process.env.MODE !== 'dev') {
    winOptions.autoHideMenuBar = true;
  }

  const win = new BrowserWindow(winOptions);

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
});

app.on('window-all-closed', () => {
  app.quit();
});

// app.on('browser-window-focus', function () {
//   // 글로벌로 동작하여 다른 크롬 브라우저도 새로고침이 안먹는 현상 발생(수정 예정)
//   globalShortcut.register("CommandOrControl+R", () => {
//       console.log("CommandOrControl+R is pressed: Shortcut Disabled");
//   });
//   globalShortcut.register("F5", () => {
//       console.log("F5 is pressed: Shortcut Disabled");
//   });
// });
