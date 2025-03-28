import { useEffect, useRef, useState } from "react"

declare global{
    interface Window{
        api: {
            onGreet:(callback:(msg:string)=>void)=>void;
            sendGreet:(msg?:string)=>void
        }
    }
}

function App() {

    const [message, setMessage] = useState("");

    useEffect(()=>{
        //위에서 선언한 api 객체 사용하기
        window.api.onGreet((msg)=>{
            setMessage(msg);
        });
    },[]);

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <h1>Event 처리하기</h1>
            <p>main 프로세스가 전달한 문자열 : <strong>{message}</strong></p>
            <input type="text" ref={inputRef} placeholder="eletcron 으로 보낼 메세지 입력..."/>
            <button onClick={()=>{
                //입력한 메세지
                const msg = inputRef.current?.value;
                window.api.sendGreet(msg);
            }}>전송</button>
        </div>
    )
}

export default App
