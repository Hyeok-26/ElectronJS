import { app, BrowserWindow, dialog, globalShortcut } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import "./ipc-handler"

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    // transparent:true,
    // frame:false,
    // fullscreen: true,
    // alwaysOnTop: true,
    // skipTaskbar: true,
    // resizable : false
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

//app 이 초기화 되고 준비가 완료 되었을 때 호출되는 함수 등록
app.whenReady().then(()=>{
  //BrowerWindow 를 만들고
  createWindow();
})

//BrowserWindow 의 focus 가 왔을 때 실행할 함수
app.on("browser-window-focus",()=>{
  //control+t 를 누르면 개발 tool 이 열리도록 한다
  globalShortcut.register("Control+t", ()=>{
    win?.webContents.openDevTools()
  });

  //Control+s 를 누르면 파일 시스템에 저장이 되도록 한다.
  globalShortcut.register("Control+s", async()=>{
    win?.webContents.send("get-image");
  })
});
//BrowserWindow 의 focus 를 잃었을 때 실행할 함수
app.on("browser-window-blur",()=>{
  globalShortcut.unregisterAll();
});
//앱 종료시
app.on("will-quit",()=>{
  globalShortcut.unregisterAll();
})