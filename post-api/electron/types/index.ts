
export interface Post{
    readonly id?:number; //읽기 전용, optional
    title:string;
    author:string;
}