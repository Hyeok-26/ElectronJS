import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
  screenCapture:()=>ipcRenderer.invoke("screen-capture"),
  onGetImage:(callback:()=>string)=>{
    //Control+s 를 눌렀을 때 main 프로세스에서 발생할 이벤트에 귀를 기울인다
    ipcRenderer.on("get-image",()=>{
      //callback() 함수를 호출하면 App.tsx 가 가지고 있는 이미지 data 를 리턴받는다
      const imageData = callback();
      //이벤트를 발생시키면서 이미지 데이터를 main 프로세스에 전한다
      ipcRenderer.send("save-image", imageData);
    });
  }
})
