const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

let ventana;
let vista;

function crearVentana() {
  ventana = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  
  ventana.loadFile('index.html');

  
  vista = new BrowserView();
ventana.setBrowserView(vista);
vista.setBounds({ x: 0, y: 60, width: 1000, height: 740 });
vista.setAutoResize({ width: true, height: true });
vista.webContents.loadURL('https://www.google.com');


vista.webContents.on('did-navigate', (event, url) => {
  ventana.webContents.send('url-cambiada', url);
});


vista.webContents.on('did-navigate-in-page', (event, url) => {
  ventana.webContents.send('url-cambiada', url);
});

  
  ventana.on('resize', () => {
    const { width, height } = ventana.getBounds();
    const alturaVisible = height - 60;
    vista.setBounds({ x: 0, y: 60, width, height: alturaVisible });
  });

  
  ipcMain.on('navegar-atras', () => {
    if (vista.webContents.canGoBack()) vista.webContents.goBack();
  });

  ipcMain.on('navegar-adelante', () => {
    if (vista.webContents.canGoForward()) vista.webContents.goForward();
  });

  ipcMain.on('navegar-home', () => {
    vista.webContents.loadURL('https://www.google.com');
  });

  ipcMain.on('navegar-a', (_evento, url) => {
    vista.webContents.loadURL(url);
  });
}
app.whenReady().then(crearVentana);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
