import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("api", {
  save:(msg:string)=>{
    ipcRenderer.send("saveMemo", msg);
  }
})
