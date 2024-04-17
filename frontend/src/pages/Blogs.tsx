
import AppBar from "../components/AppBar"
import BlogCard from "../components/BlogCard"
import { useBlogs } from "../hooks"

const Blogs = () => {
    const{loading, blogs} = useBlogs();
    console.log(blogs);

    if(loading){
        return <div>
            loading...
        </div>
    }

    return (
    <div className="overflow-x-hidden">
    <AppBar/>
    <div className="w-screen flex items-center justify-center">
        <div className="flex flex-col w-full md:max-w-6xl" >
        {blogs.map((blog,index)=><BlogCard key={index} id={blog.id} username={blog.author.username} title={blog.title} publishedDate="Mar 12,2024"  content={blog.content}/>)}
        
        </div>
    </div>
    </div>
  )
}

export default Blogs