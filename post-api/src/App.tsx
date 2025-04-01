import { ChangeEvent, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from "react-bootstrap";

interface Post{
    readonly id?:number;
    title:string;
    author:string;
}

declare global{
    interface Window{
        api:{
            //, 안써도 개행으로 해결된다
            getPosts: () => Promise<Post[]> // 글 목록을 받아오는 기능
            addPost: (a:Post) => Promise<Post> //글 추가 하는 기능
            deletePost:(a:number | undefined)=>Promise<Post>
        }
    }
}

function App() {
    //글 목록
    const [posts, setPosts] = useState<Post[]>([]);

    //입력한 내용을 상태값으로 관리
    const [newPost, setNewPost] = useState<Post>({
        title:"",
        author:""
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
        setNewPost({
            ...newPost,
            [e.target.name]:e.target.value
        });
    }

    //글 목록을 받아오는 함수
    const load = async ()=>{
        //getPosts() 는 Promise 를 리턴해주기 떄문에 await 를 할 수 있고
        //Peomise 의 generic 이 Post[] 이기 때문에 리턴 type 이 Post[] 이다다
        const posts:Post[] = await window.api.getPosts();
        setPosts(posts);
        //console.log(posts);
    }
 
    useEffect(()=>{
        //글 목록을 받아와서 state 에 반영
        load();
    },[])

    const add = async ()=>{
        const post:Post =  await window.api.addPost(newPost);
        //console.log(post);
        //입력창 초기화
        setNewPost({
            title:"",
            author:""
        });
        //리프레쉬
        load();
    }

    const deldel = async (postId:number | undefined) =>{
        //console.log(postId);
        const post:Post = await window.api.deletePost(postId);
        console.log(post);
        load();
    }

    return (
        <div className="container">
            <h1>게시글 (Spring Boot + Electron)</h1>
            <input type="text" placeholder="제목" name="title" onChange={handleChange} value={newPost.title}/>
            <input type="text" placeholder="작성자" name="author" onChange={handleChange} value={newPost.author}/>
            <button onClick={add}>추가</button>
            <table className="table table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>아이디</th>
                        <th>제목</th>
                        <th>작성자자</th>
                        <th>삭제제</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(item=>(
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>{item.author}</td>
                            <td><button onClick={()=> deldel(item.id)}>x</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default App
