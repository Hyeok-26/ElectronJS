import { useEffect, useRef, useState } from 'react'


declare global{
  interface Window{
    api:{
      screenCapture : ()=>Promise<string>,
      onGetImage:(a:()=>string | undefined)=>void
    }
  }
}

function App() {

  const [imageData, setImageData] = useState<string>();

  const imageDataRef = useRef<string>();

  useEffect(()=>{
    //이미지 데이터가 변경될 때마다 해당 값을 imageDataRef 에 새로 등록된다
    imageDataRef.current = imageData;
  },[imageData]);

  useEffect(()=>{
    //imageDataRef 객체를 참조하도록 리턴해준다
    window.api.onGetImage(()=>imageDataRef.current);
  },[]);

  const handleCapture = async()=>{
    //result 는 캡쳐된 이미지의 data url 의 문자열
    const result = await window.api.screenCapture();
    setImageData(result);
  }


  return (
    <div>
      <h1>화면 캡쳐 예제</h1>
      <button onClick={handleCapture}>화면캡쳐</button>
      {imageData && <img src={imageData}/>}
    </div>
  )
}

export default App
