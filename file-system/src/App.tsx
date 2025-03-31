import { useEffect, useRef, useState} from "react"
//bootstrap css 로딩딩
import 'bootstrap/dist/css/bootstrap.css'

declare global{
    interface Window{
        api:{
            save:(msg:string)=>void,
            load:()=>void,
            onLoad:(callback:(msg:string)=>void)=>void;
        },
    }
}



function App() {
    const [content, setContent] = useState<string>("");

    useEffect(()=>{
        window.api.onLoad((savedContent:string)=>{
            setContent(savedContent);
        });
    },[]);  

    const textRef = useRef<HTMLTextAreaElement>(null);

    return (
      <div className="container">
        <h1>메모장</h1>
        <textarea className='form-control mb-2' style={{height:"300px"}}
            ref={textRef} placeholder="입력이요~~"></textarea>
        <button className='btn btn-primary me-2' onClick={()=>{
            //입력한 문자열
            const msg = textRef.current?.value;
            window.api.save(msg || "");
            alert("저장 성공이요~~~");
        }}>전송</button>
        <button className="btn btn-success" onClick={()=>{
            window.api.load()
        }}>불러오기</button>
      </div>
    )
}

export default App
