import { ipcMain, screen, desktopCapturer, clipboard, dialog, app, BrowserWindow, globalShortcut } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
ipcMain.handle("screen-capture", async () => {
  const display = screen.getPrimaryDisplay();
  const { bounds } = display;
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: { width: bounds.width, height: bounds.height }
  });
  if (sources.length > 0) {
    const screen2 = sources[0];
    const thumbnail = screen2.thumbnail;
    const dataUrl = thumbnail.toDataURL();
    clipboard.writeImage(thumbnail);
    return dataUrl;
  }
  throw new Error("Error!");
});
ipcMain.on("save-image", async (_event, imageData) => {
  if (!imageData) return;
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "캡쳐된 이미지 저장",
    defaultPath: "capture.png",
    filters: [{ name: "Images", extensions: ["png"] }]
  });
  if (!canceled) {
    const data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(data, "base64");
    fs.writeFile(filePath, buffer, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(filePath + " save success");
        dialog.showMessageBox({
          type: "info",
          title: "저장 완료",
          message: "이미지가 성공적으로 저장되었습니다.",
          buttons: ["확인"]
        });
      }
    });
  }
});
let mainWindow$1 = null;
let overlayWindow$1 = null;
function setBrowserWindow(main, overlay) {
  mainWindow$1 = main;
  overlayWindow$1 = overlay;
}
ipcMain.on("select-capture", async (_event, area) => {
  const display = screen.getPrimaryDisplay();
  const { bounds } = display;
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: { width: bounds.width, height: bounds.height }
  });
  if (sources.length > 0) {
    const screenSource = sources[0];
    const thumbnail = screenSource.thumbnail;
    if (!thumbnail.isEmpty()) {
      const croppedImage = thumbnail.crop(area);
      overlayWindow$1 == null ? void 0 : overlayWindow$1.hide();
      mainWindow$1 == null ? void 0 : mainWindow$1.show();
      mainWindow$1 == null ? void 0 : mainWindow$1.webContents.send("captured-data", croppedImage.toDataURL());
      clipboard.writeImage(croppedImage);
      return;
    }
  }
  throw new Error("No screen sources found.");
});
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let mainWindow = null;
let overlayWindow = null;
function createWindows() {
  mainWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    },
    show: true,
    resizable: false
  });
  overlayWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    },
    // transparent:true,
    // frame:false, //두개를 모두 설정해야 투명해진다.
    // fullscreen: true,
    // alwaysOnTop: true,
    // skipTaskbar: true,
    // resizable : false
    transparent: true,
    // transparent:true 와 frame:false 를 모두 설정해야 투명해진다.
    frame: false,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    fullscreen: true
  });
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    overlayWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
    overlayWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  setBrowserWindow(mainWindow, overlayWindow);
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
    overlayWindow = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});
app.whenReady().then(() => {
  createWindows();
});
app.on("browser-window-focus", () => {
  globalShortcut.register("Control+1", () => {
    mainWindow == null ? void 0 : mainWindow.hide();
    overlayWindow == null ? void 0 : overlayWindow.show();
    overlayWindow == null ? void 0 : overlayWindow.webContents.send("capture-start");
  });
  globalShortcut.register("Escape", () => {
    mainWindow == null ? void 0 : mainWindow.show();
    overlayWindow == null ? void 0 : overlayWindow.hide();
  });
  globalShortcut.register("Control+t", () => {
    mainWindow == null ? void 0 : mainWindow.webContents.openDevTools();
  });
  globalShortcut.register("Control+s", async () => {
    mainWindow == null ? void 0 : mainWindow.webContents.send("get-image");
  });
});
app.on("browser-window-blur", () => {
  globalShortcut.unregisterAll();
});
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
