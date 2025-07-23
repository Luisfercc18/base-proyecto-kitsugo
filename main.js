const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

let ventana;
let vista;

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

  // Cargar la barra del navegador (interfaz fija)
  ventana.loadFile('interfaz.html');

  // Crear el BrowserView
  vista = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
  vista.setBounds({ x: 0, y: 60, width: 1000, height: 740 });
  vista.setAutoResize({ width: true, height: true });

  // Insertar el BrowserView en la ventana
  ventana.setBrowserView(vista);

  // Cargar la página de inicio (con el logo y buscador)
  const rutaInicio = path.join(__dirname, 'index.html');
  vista.webContents.loadFile(rutaInicio);

  // Actualizar input de URL cuando cambia
  vista.webContents.on('did-navigate', (event, url) => {
    ventana.webContents.send('url-cambiada', url);
  });

  vista.webContents.on('did-navigate-in-page', (event, url) => {
    ventana.webContents.send('url-cambiada', url);
  });

  // Ajustar el tamaño del BrowserView al redimensionar
  ventana.on('resize', () => {
    const { width, height } = ventana.getBounds();
    const alturaVisible = height - 60;
    vista.setBounds({ x: 0, y: 60, width, height: alturaVisible });
  });

  // Navegación básica
  ipcMain.on('navegar-atras', () => {
    if (vista.webContents.canGoBack()) vista.webContents.goBack();
  });

  ipcMain.on('navegar-adelante', () => {
    if (vista.webContents.canGoForward()) vista.webContents.goForward();
  });

  ipcMain.on('navegar-a', (_event, url) => {
    if (!ventana.getBrowserView()) {
      ventana.setBrowserView(vista);
    }
    vista.webContents.loadURL(url);
  });

  ipcMain.on('navegar-home', () => {
    if (!ventana.getBrowserView()) {
      ventana.setBrowserView(vista);
    }
    const rutaInicio = path.join(__dirname, 'index.html');
    vista.webContents.loadFile(rutaInicio);
  });
}

app.whenReady().then(crearVentana);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
