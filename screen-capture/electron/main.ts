import { app, BrowserWindow, globalShortcut } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
//import "./ipc-handler"
import { setBrowserWindow } from './ipc-handler'

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

let mainWindow: BrowserWindow | null = null;
let overlayWindow: BrowserWindow | null = null;

function createWindows() {
  mainWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    show:true,
    resizable:false
  });

  overlayWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    // transparent:true,
    // frame:false, //두개를 모두 설정해야 투명해진다.
    // fullscreen: true,
    // alwaysOnTop: true,
    // skipTaskbar: true,
    // resizable : false
    transparent:true, // transparent:true 와 frame:false 를 모두 설정해야 투명해진다.
    frame:false,
    resizable:true,
    alwaysOnTop:true,
    skipTaskbar:true,
    show:false,
    fullscreen:true
  })

  //만일 개발중이라면 vite 서버가 제공해주는 url 로딩딩
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
    overlayWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {//배포된 상태면 index.html 을 로딩
    // win.loadFile('dist/index.html')
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
    overlayWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
  //ipc-handler 에 BrowserWindow 객체 2개를 전달한다.
  setBrowserWindow(mainWindow, overlayWindow);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  //맥인 경우 수정을 좀 해야 한다
  if (process.platform !== 'darwin') {
    app.quit()
    mainWindow = null
    overlayWindow = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows()
  }
})

//app 이 초기화 되고 준비가 완료 되었을 때 호출되는 함수 등록
app.whenReady().then(()=>{
  //BrowerWindow 를 만들고 
  createWindows();
})

//BrowserWindow 의 focus 가 왔을 때 실행할 함수
app.on("browser-window-focus",()=>{
  globalShortcut.register("Control+1", ()=>{ 
    mainWindow?.hide();
    overlayWindow?.show();
    overlayWindow?.webContents.send("capture-start");
  });

  globalShortcut.register("Escape", ()=>{
    mainWindow?.show();
    overlayWindow?.hide();
  });

  //control+t 를 누르면 개발 tool 이 열리도록 한다
  globalShortcut.register("Control+t", ()=>{
    mainWindow?.webContents.openDevTools()
  });

  //Control+s 를 누르면 파일 시스템에 저장이 되도록 한다.
  globalShortcut.register("Control+s", async()=>{
    mainWindow?.webContents.send("get-image");
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