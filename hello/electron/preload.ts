import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  onMessage : (callback: (msg: string)=>void) =>{
    ipcRenderer.on("ping",(_event, message)=>callback(message));
  }
})
