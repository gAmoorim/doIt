const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

require('dotenv').config()
require('./backend/server.js')

const isDev = process.env.NODE_ENV === 'development'

let store
let dbPath

async function inicializarStore() {
  const { default: Store } = await import('electron-store')
  store = new Store({ encryptionKey: 'doit_store_key_2026' })
  dbPath = path.join(app.getPath('userData'), 'data', 'todolist.db')
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    title: 'DoIt',
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'electron/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    backgroundColor: '#0f0f13'
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, 'frontend/dist/index.html'))
  }
}

// IPC handlers para o token
ipcMain.handle('token:salvar', (_, token, usuario) => {
  if (!store) return false
  store.set('token', token)
  store.set('usuario', usuario)
  store.set('tokenSalvoEm', Date.now())
  return true
})

ipcMain.handle('token:carregar', () => {
  if (!store) return null
  const token = store.get('token')
  const usuario = store.get('usuario')
  const salvoEm = store.get('tokenSalvoEm')

  if (!token || !salvoEm) return null

  const cincoDiasMs = 5 * 24 * 60 * 60 * 1000
  if (Date.now() - salvoEm > cincoDiasMs) {
    store.delete('token')
    store.delete('usuario')
    store.delete('tokenSalvoEm')
    return null
  }

  return { token, usuario }
})

ipcMain.handle('token:limpar', () => {
  if (!store) return false
  store.delete('token')
  store.delete('usuario')
  store.delete('tokenSalvoEm')
  return true
})

// IPC handlers para backup
ipcMain.handle('backup:exportar', async () => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Exportar backup',
    defaultPath: `doit_backup_${new Date().toISOString().slice(0,10)}.db`,
    filters: [{ name: 'Banco de dados', extensions: ['db'] }]
  })

  if (!filePath) return { sucesso: false, mensagem: 'Cancelado' }

  try {
    fs.copyFileSync(dbPath, filePath)
    return { sucesso: true, mensagem: 'Backup exportado com sucesso!' }
  } catch (err) {
    return { sucesso: false, mensagem: 'Erro ao exportar: ' + err.message }
  }
})

ipcMain.handle('backup:importar', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Importar backup',
    filters: [{ name: 'Banco de dados', extensions: ['db'] }],
    properties: ['openFile']
  })

  if (!filePaths?.length) return { sucesso: false, mensagem: 'Cancelado' }

  try {
    fs.copyFileSync(filePaths[0], dbPath)
    return { sucesso: true, mensagem: 'Backup importado! Reinicie o app para aplicar.' }
  } catch (err) {
    return { sucesso: false, mensagem: 'Erro ao importar: ' + err.message }
  }
})

app.whenReady().then(async () => {
  await inicializarStore()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})