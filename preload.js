const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  irA: (url) => ipcRenderer.send('navegar-a', url),
  atras: () => ipcRenderer.send('navegar-atras'),
  adelante: () => ipcRenderer.send('navegar-adelante'),
  home: () => ipcRenderer.send('navegar-home'),
  recargar: () => ipcRenderer.send('recargar-vista'),
  onUrlCambiada: (callback) => ipcRenderer.on('url-cambiada', (_e, url) => callback(url)),
  minimizar: () => ipcRenderer.send('ventana-minimizar'),
  maximizar: () => ipcRenderer.send('ventana-maximizar'),
  cerrar: () => ipcRenderer.send('ventana-cerrar'),
  ajustarAltura: (altura) => ipcRenderer.send('ajustar-altura', altura),
});
