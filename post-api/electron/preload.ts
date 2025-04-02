import { ipcRenderer, contextBridge } from 'electron'
import { Post } from './types'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
  //main promise 에 get-posts 요청을 한다.
  getPosts : ()=>ipcRenderer.invoke("get-posts"),
  //main proccess 에 add-post 요청을 하면서 매개변수에 전달된 추가할 글정보를 전달한다
  addPost : (newPost: Post)=>ipcRenderer.invoke("add-post", newPost) ,
  deletePost : (postId:number)=>ipcRenderer.invoke("delete-post", postId),
  updatePost : (post:Post)=>ipcRenderer.invoke("update-post", post)
})
