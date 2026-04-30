const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('env', {
  baseUrl: 'http://localhost:' + (process.env.PORT || 3100)
})

contextBridge.exposeInMainWorld('tokenStore', {
  salvar: (token, usuario) => ipcRenderer.invoke('token:salvar', token, usuario),
  carregar: () => ipcRenderer.invoke('token:carregar'),
  limpar: () => ipcRenderer.invoke('token:limpar')
})