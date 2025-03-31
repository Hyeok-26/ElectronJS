"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  save: (content) => {
    console.log("save!");
    electron.ipcRenderer.send("saveMemo", content);
  },
  load: () => {
    electron.ipcRenderer.send("loadMemo");
  },
  onLoad: (callback) => {
    electron.ipcRenderer.on("loaded", (_event, content) => {
      callback(content);
    });
  },
  load2: () => {
    return electron.ipcRenderer.invoke("loadMemo2");
  },
  load3: () => electron.ipcRenderer.invoke("loadMemo3"),
  onSave: (callback) => {
    electron.ipcRenderer.on("saveContent", (_event, data) => {
      const content = callback();
      console.log("현자까지 입력한 문자열" + content);
      data.content = content;
      electron.ipcRenderer.send("saveContent", data);
    });
  }
});
