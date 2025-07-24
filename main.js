const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

let ventana;
let vista;
const rutaInicio = path.join(__dirname, 'index.html'); // <- definido globalmente

function crearVentana() {
  ventana = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, 'assets', 'kitsugo-logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  ventana.loadFile('interfaz.html');

  vista = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  vista.setBounds({ x: 0, y: 60, width: 1000, height: 740 });
  vista.setAutoResize({ width: true, height: true });
  ventana.setBrowserView(vista);
  vista.webContents.loadFile(rutaInicio);

  vista.webContents.on('did-navigate', (event, url) => {
    ventana.webContents.send('url-cambiada', url);
  });

  vista.webContents.on('did-navigate-in-page', (event, url) => {
    ventana.webContents.send('url-cambiada', url);
  });

  ventana.on('resize', () => {
    const { width, height } = ventana.getBounds();
    vista.setBounds({ x: 0, y: 60, width, height: height - 60 });
  });

  ipcMain.on('navegar-atras', () => {
    if (vista.webContents.canGoBack()) vista.webContents.goBack();
  });

  ipcMain.on('navegar-adelante', () => {
    if (vista.webContents.canGoForward()) vista.webContents.goForward();
  });

  ipcMain.on('navegar-a', (_event, url) => {
    if (!ventana.getBrowserView()) ventana.setBrowserView(vista);
    vista.webContents.loadURL(url);
  });

  ipcMain.on('navegar-home', async () => {
    const actual = vista.webContents.getURL();
    const esperada = `file://${rutaInicio.replace(/\\/g, '/')}`;

    if (actual === esperada) {
      vista.webContents.reload();
    } else {
      vista.webContents.loadFile(rutaInicio);
    }
  });
  ipcMain.on('recargar-vista', () => {
    if (vista && vista.webContents) {
      vista.webContents.reload();
    }
  });
}

app.whenReady().then(crearVentana);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
