import axios from "axios";
import { ipcMain } from "electron";
import { Post } from "./types";
import api from "./api";
//main.ts 에서 이 파일을 import 해야 동작이 준비된다

//renderer 에서 "get-posts" 를 invoke 하면 실행할 함수 등록
ipcMain.handle("get-posts", async ()=>{
    const response = await api.get<Post[]>("/v1/posts");
    //여가서 라턴해주는 response.data 는 Post[] type 이다
    //리턴된 data 는 Promise 객체에 포장이 되어서 리턴된다.
    return response.data;
});

ipcMain.handle("add-post", async (_event, newPost)=>{
    const response = await api.post<Post>("/v1/posts",newPost);
    return response.data;
})

ipcMain.handle("delete-post", async(_event, postId)=>{
    const response = await api.delete<Post>(`/v1/posts/${postId}`);
    return response.data;
})

ipcMain.handle("update-post", async(_event, post)=>{
    const response = await api.put<Post>(`/v1/posts/${post.id}`, post);
    return response.data; 
})