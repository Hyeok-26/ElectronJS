"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  screenCapture: () => electron.ipcRenderer.invoke("screen-capture"),
  onGetImage: (callback) => {
    electron.ipcRenderer.on("get-image", () => {
      const imageData = callback();
      electron.ipcRenderer.send("save-image", imageData);
    });
  }
});
