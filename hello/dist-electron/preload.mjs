"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  onMessage: (callback) => {
    electron.ipcRenderer.on("ping", (_event, message) => callback(message));
  }
});
