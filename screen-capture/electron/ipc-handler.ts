import { BrowserWindow, clipboard, desktopCapturer, dialog, ipcMain, screen } from "electron";
//동기처리
import fs from "node:fs";

ipcMain.handle("screen-capture", async ()=>{
    //Display 객체 얻어내기
    const display = screen.getPrimaryDisplay();
    //화면의 크기 정보
    const {bounds} = display;
    //원하는 크기로 capture 하기
    const sources = await desktopCapturer.getSources({
        types:["screen"],
        thumbnailSize:{width:bounds.width, height:bounds.height}
    });
    if(sources.length > 0){
        const screen = sources[0];
        const thumbnail = screen.thumbnail;
        //캡쳐된 이미지 객체를 dataUrl 문자열로 얻어내서 리턴하다
        const dataUrl = thumbnail.toDataURL();
        //클립보드에 넣기
        clipboard.writeImage(thumbnail);
        return dataUrl;
    }
    throw new Error("Error!");
});
//renderer 프로세스에서 발생시키는 "save-image" 이벤트 처리
ipcMain.on("save-image", async(_event, imageData)=>{
    if(!imageData)return;
    //취소되었는지 여부와 저장할 파일의 경로를 얻어낸다
    const {canceled, filePath} = await dialog.showSaveDialog({
        title:"캡쳐된 이미지 저장",
        defaultPath:"capture.png",
        filters:[{name:"Images", extensions:["png"]}]
    });
    if(!canceled){
        //실제 이미지가 될려면 base64 열을 뺀 뒤 데이터만 저장해야 한다
        //data url 에서 앞에 있는 필요없는 문자열 제거 (실제 png 이미지로 저장하기 위해)
        const data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(data, "base64");
        fs.writeFile(filePath, buffer, (error)=>{
            if(error){
                console.log(error)
            }else{
                console.log(filePath+" save success");
                dialog.showMessageBox({
                    type: 'info',
                    title: '저장 완료',
                    message: '이미지가 성공적으로 저장되었습니다.',
                    buttons: ['확인']
                });
            }
        });
    }
});
/*
    main.ts 에 있는 BrowserWindow 의 참조값을 주입 받을 함수를 export 해준다
*/
let mainWindow:BrowserWindow|null = null;
let overlayWindow:BrowserWindow|null = null;

export function setBrowserWindow(main:BrowserWindow, overlay:BrowserWindow){
  mainWindow=main;
  overlayWindow=overlay;
}

//reanderer 프로세스에서 발생시키는 "save-image"이벤트 처리
ipcMain.on("select-capture", async(_event, area)=>{
    const display = screen.getPrimaryDisplay();
    const { bounds } = display;
  
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: bounds.width, height: bounds.height },
    });
  
    if (sources.length > 0) {
      const screenSource = sources[0];
      const thumbnail = screenSource.thumbnail;
  
      if (!thumbnail.isEmpty()) {
        //thumbnail (전체 화면 이미지) 에서 area 만 잘라내서 가져오기
        const croppedImage = thumbnail.crop(area);
        overlayWindow?.hide();
        mainWindow?.show();
        //렌더러 프로세스에 "captured-data" 이벤트 발생시키면서 켭쳐된 이미지의 data url 전달하기기
        mainWindow?.webContents.send('captured-data', croppedImage.toDataURL());
        //capture 된 이미지를 클립보ㅡ에 복사하기
        clipboard.writeImage(croppedImage);
        return ;
      }
    }
  
    throw new Error('No screen sources found.');
});