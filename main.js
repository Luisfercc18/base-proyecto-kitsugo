const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

let ventana;
let vista;
let ALTURA_BARRAS = 0; // Se ajustará dinámicamente desde el renderer
const rutaInicio = path.join(__dirname, 'index.html');

function crearVentana() {
  ventana = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, 'assets', 'kitsugo-logo.ico'),
    frame: false,
    backgroundColor: '#0f0a1f',
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

  vista.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    const errorPagePath = `file://${path.join(__dirname, 'error.html')}?errorCode=${encodeURIComponent(errorCode)}&errorDescription=${encodeURIComponent(errorDescription)}`;
    vista.webContents.loadURL(errorPagePath);

    ipcMain.once('get-error-info', (event) => {
      event.sender.send('error-info', errorCode, errorDescription, validatedURL);
    });
  });

  const { width, height } = ventana.getBounds();
  vista.setBounds({ x: 0, y: ALTURA_BARRAS, width, height: height - ALTURA_BARRAS });
  vista.setAutoResize({ width: true, height: true });
  ventana.setBrowserView(vista);
  vista.webContents.loadFile(rutaInicio);

  vista.webContents.on('did-navigate', (_event, url) => {
    ventana.webContents.send('url-cambiada', url);
  });

  vista.webContents.on('did-navigate-in-page', (_event, url) => {
    ventana.webContents.send('url-cambiada', url);
  });

  ventana.on('resize', () => {
    const { width, height } = ventana.getBounds();
    vista.setBounds({ x: 0, y: ALTURA_BARRAS, width, height: height - ALTURA_BARRAS });
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

  ipcMain.on('navegar-home', () => {
    const actual = vista.webContents.getURL();
    const esperada = `file://${rutaInicio.replace(/\\/g, '/')}`;
    if (actual === esperada) {
      vista.webContents.reload();
    } else {
      vista.webContents.loadFile(rutaInicio);
    }
  });

  ipcMain.on('recargar-vista', () => {
    if (vista && vista.webContents) vista.webContents.reload();
  });

  ipcMain.on('ventana-minimizar', () => {
    if (ventana) ventana.minimize();
  });

  ipcMain.on('ventana-maximizar', () => {
    if (ventana) {
      ventana.isMaximized() ? ventana.unmaximize() : ventana.maximize();
    }
  });

  ipcMain.on('ventana-cerrar', () => {
    ventana.close();
  });
}

ipcMain.on("ajustar-altura", (_e, altura) => {
  ALTURA_BARRAS = altura;
  if (ventana && vista) {
    const { width, height } = ventana.getBounds();
    vista.setBounds({ x: 0, y: ALTURA_BARRAS, width, height: height - ALTURA_BARRAS });
  }
});

app.whenReady().then(crearVentana);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
