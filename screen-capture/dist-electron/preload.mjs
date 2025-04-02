"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  screenCapture: () => electron.ipcRenderer.invoke("screen-capture")
});
