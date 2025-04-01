import axios from "axios";
import { ipcMain } from "electron";
import { Post } from "./types";
//main.ts 에서 이 파일을 import 해야 동작이 준비된다

//renderer 에서 "get-posts" 를 invoke 하면 실행할 함수 등록
ipcMain.handle("get-posts", async ()=>{
    const response = await axios.get<Post[]>("http://localhost:9000/v1/posts");
    //여가서 라턴해주는 response.data 는 Post[] type 이다
    //리턴된 data 는 Promise 객체에 포장이 되어서 리턴된다.
    return response.data;
});

ipcMain.handle("add-post", async (_event, newPost)=>{
    const response = await axios.post<Post>("http://localhost:9000/v1/posts",newPost);
    return response.data;
})

ipcMain.handle("delete-post", async(_event, postId)=>{
    const response = await axios.delete<Post>(`http://localhost:9000/v1/posts/${postId}`);
    return response.data;
})