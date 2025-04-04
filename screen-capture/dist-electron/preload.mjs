"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  screenCapture: () => electron.ipcRenderer.invoke("screen-capture"),
  onGetImage: (callback) => {
    electron.ipcRenderer.on("get-image", () => {
      const imageData = callback();
      electron.ipcRenderer.send("save-image", imageData);
    });
  },
  onCaptureStart: (callback) => {
    electron.ipcRenderer.on("capture-start", () => {
      callback();
    });
  },
  selectCapture: (area) => {
    electron.ipcRenderer.send("select-capture", area);
  },
  onCaptureData: (callback) => {
    electron.ipcRenderer.on("captured-data", (_event, data) => {
      callback(data);
    });
  }
});
