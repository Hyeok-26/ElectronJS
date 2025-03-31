import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
//파일 시스템을 사용할 수 있는 객체 import (java 의 File 객체와 비슷)
import fs from 'node:fs'

const require = createRequire(import.meta.url)
//현재 실행되는 폴더의 위치
const __dirname = path.dirname(fileURLToPath(import.meta.url))
/*
//콘솔창에 경로 출력하기기
console.log(__dirname);
//memo.txt 파일 만들 경로 구성하기
const filePath = path.join(__dirname, "../file/memo.txt");
//구성된 경로에 폴더와 파일을 만든다다
fs.mkdirSync(path.dirname(filePath), {recursive: true});
//파일에 hello~ 문자열 출력하기기
fs.writeFileSync(filePath, "hello~", "utf-8");
//파일로 부터 문자열 읽어들이기
const result = fs.readFileSync(filePath, "utf-8");
//읽은 내용 콘솔에 출력하기
console.log(result);
*/
 
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
  if(!app.isPackaged){
    win?.webContents.openDevTools();
  }

  ipcMain.on("saveMemo", (_event, msg:string)=>{
    const filePath = path.join(__dirname, "../file/myMemo.txt");
    fs.writeFileSync(filePath, msg, "utf-8");
    const result = fs.readFileSync(filePath, "utf-8");
    //읽은 내용 콘솔에 출력하기
    console.log(result);
  })
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

app.whenReady().then(createWindow)
