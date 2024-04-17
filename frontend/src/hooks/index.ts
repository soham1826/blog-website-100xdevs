import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../../config";


export const useBlogs =  () =>{
    const[loading , setLoading] = useState(true);
    const[blogs,setBlogs] = useState([]);

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/blog/bulk`,{
            headers:{
                Authorization:localStorage.getItem("token")
            }
        }).then(response=>{
            setBlogs(response.data.blogs)
            setLoading(false);
        }
        )
    },[])

    return {
        loading,
        blogs
    }
}

export const useGetBlog = ({id}:{id:number}) =>{
    const [loading,setLoading] = useState(true);
    const[blog, setBlog] = useState(null);

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/blog/${id}`,{
            headers:{
                Authorization:localStorage.getItem("token")
            }
        }).then(response=>{
            setBlog(response.data.blog);
            setLoading(false);
        })
    },[id])

    return{
        blog,
        loading
    }
}