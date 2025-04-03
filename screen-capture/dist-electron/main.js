import { ipcMain, screen, desktopCapturer, dialog, app, BrowserWindow, globalShortcut } from "electron";
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
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
});
app.on("browser-window-focus", () => {
  globalShortcut.register("Control+t", () => {
    win == null ? void 0 : win.webContents.openDevTools();
  });
  globalShortcut.register("Control+s", async () => {
    win == null ? void 0 : win.webContents.send("get-image");
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
