const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

require('dotenv').config()
require('./backend/server.js')

const isDev = process.env.NODE_ENV === 'development'

let store

async function inicializarStore() {
  const { default: Store } = await import('electron-store')
  store = new Store({ encryptionKey: 'doit_store_key_2026' })
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