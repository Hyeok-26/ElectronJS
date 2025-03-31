"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  save: (msg) => {
    electron.ipcRenderer.send("saveMemo", msg);
  }
});
