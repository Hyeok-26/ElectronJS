import { ipcRenderer, contextBridge } from 'electron'

// 여기는 renderer 프로세스
contextBridge.exposeInMainWorld('api', {
  save:(content:string)=>{
    console.log("save!");
    // main 프로세스에 이벤트를 발생시키면서 저장할 문자열을 전달한다.
    ipcRenderer.send("saveMemo", content);
    
  },
  load:()=>{
    ipcRenderer.send("loadMemo");
  },
  onLoad:(callback:(a:string)=>void)=>{

    //이 이벤트는 여기에 실행의 흐름이 와야 등록이 된다.
    ipcRenderer.on("loaded", (_event, content)=>{
      callback(content);
    })
  },
  load2:()=>{
    //invoke == 리턴 타입이 Promise 인 요청 함수
    return ipcRenderer.invoke("loadMemo2");
  },
  load3:()=>ipcRenderer.invoke("loadMemo3"),
  onSave:(callback:()=>string)=>{
    ipcRenderer.on("saveContent",(_event, data)=>{
      //현재까지 입력한 문자열
      const content = callback();
      console.log("현자까지 입력한 문자열"+content);
      data.content=content;
      //main 프로세스에 이벤트 발생 시키면서 전달하기
      ipcRenderer.send("saveContent", data);
    })
  }
})
