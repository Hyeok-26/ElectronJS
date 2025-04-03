import { useEffect, useRef, useState } from "react";


function App2() {
    const canvasStyle = {
        border:"1px dotted red",
        curser:"crosshair",
        width:window.innerWidth,
        height:window.innerHeight
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    //현재 그리기 모드인지 여부
    const [isDrawing, setIsDrawing] = useState(false);
    //선택한 사각형 영역을 state 로 관리하기
    const [state, setState] = useState({
        startX : 0,
        startY : 0,
        endX : 0,
        endY : 0
    });

    useEffect(()=>{
        if(canvasRef.current){
            const ctx = canvasRef.current.getContext("2d");
            ctxRef.current = ctx;
        }
    },[isDrawing]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDrawing(true);
        const rect = canvasRef.current!.getBoundingClientRect();
    
        const scaleX = canvasRef.current!.width / rect.width;
        const scaleY = canvasRef.current!.height / rect.height;
    
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        setState({
          startX: x,
          startY: y,
          endX: x,
          endY: y,
        });
       
      };
    
      const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const rect = canvasRef.current!.getBoundingClientRect();
    
        const scaleX = canvasRef.current!.width / rect.width;
        const scaleY = canvasRef.current!.height / rect.height;
    
        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;
       
        const { startX, startY } = state;
    
        const x = Math.min(startX, currentX);
        const y = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
    
        const ctx = ctxRef.current;
    
        if (ctx) {
          ctx.clearRect(0, 0, canvasStyle.width, canvasStyle.height);
          ctx.fillStyle = 'rgba(255, 255, 255, 0)';
          ctx.fillRect(x, y, width, height);
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
        }
    
        setState((prev) => ({
          ...prev,
          endX: currentX,
          endY: currentY,
        }));
        
      };
    
      const handleMouseUp = async () => {
        setIsDrawing(false);
      };

    //canvas 는 숫자로 직접 높이 넓이를 설정해줘야 한다다
    //canvas 의 참조값을 통해 그림을 그릴 수 있다
    return (
        <div>
            <canvas style={canvasStyle}
                width={canvasStyle.width}
                height={canvasStyle.height}
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                >
                
            </canvas>
        </div>
    );
}

export default App2;