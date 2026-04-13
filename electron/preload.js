const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('env', {
  baseUrl: 'http://localhost:' + (process.env.PORT || 3000)
})