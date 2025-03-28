import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("api", {
    //api 로 부터 전달받은 함수가 여기에 전달된다
    onGreet:(callback:(msg:string)=>void)=>{
      console.log("preload.ts 에 onGreet() 함수가 호출됨");
      ipcRenderer.on("greet", (_event, msg)=> {
        console.log("ipcRender 에 greet 이벤트가 발생함");
        callback(msg);
      });
    }, 
    sendGreet:(msg:string)=>{
      // renderer 프로세스에서 "greetFromReact" 이벤트 발생시키면서 문자열 전달
      ipcRenderer.send("greetFromReact", msg);
    }
})
