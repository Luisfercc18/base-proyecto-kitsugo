const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    irA: (url) => ipcRenderer.send('navegar-a', url),
    atras: () => ipcRenderer.send('navegar-atras'),
    adelante: () => ipcRenderer.send('navegar-adelante'),
    home: () => ipcRenderer.send('navegar-home'),
    navegarA: (url) => ipcRenderer.send('navegar-a', url),
    onUrlCambiada: (callback) => ipcRenderer.on('url-cambiada', (_e, url) => callback(url))
});
