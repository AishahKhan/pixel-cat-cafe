const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;


app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-zero-copy');


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 480,
    resizable: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false 
    }
  });

  mainWindow.loadFile('views/home.html');


  ipcMain.on('go-to-menu', () => {
    mainWindow.setSize(900, 550);
    mainWindow.center();
    mainWindow.loadFile('views/menu.html');
  });
}


app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
