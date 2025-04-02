"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  //main promise 에 get-posts 요청을 한다.
  getPosts: () => electron.ipcRenderer.invoke("get-posts"),
  //main proccess 에 add-post 요청을 하면서 매개변수에 전달된 추가할 글정보를 전달한다
  addPost: (newPost) => electron.ipcRenderer.invoke("add-post", newPost),
  deletePost: (postId) => electron.ipcRenderer.invoke("delete-post", postId),
  updatePost: (post) => electron.ipcRenderer.invoke("update-post", post)
});
