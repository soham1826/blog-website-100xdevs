import { useParams } from "react-router-dom"
import AppBar from "../components/AppBar"
import Avatar from "../components/Avatar"
import { useGetBlog } from "../hooks";

const Blog = () => {
  const{id} = useParams();
  const{loading, blog} = useGetBlog({
    id:id
  })

  if(loading){
    return <div>loading...</div>
  }
  return (
    <div>
      <AppBar/>
      <div className="w-screen flex justify-center items-center">
        <div className="grid grid-cols-12 max-w-8xl sm:p-10  p-5">
          <div className="col-span-12 w-full sm:col-span-8 flex flex-col sm:border-r-2 pr-3">
              <div className="font-bold text-5xl mb-5">
                {blog.title}
              </div>
              <div className="text-xl text-slate-500 mb-5">
                Posted on August 24,2023
              </div>
              <div className="text-lg text-gray-600">
              {blog.content}
              </div>


          </div>
          <div className="hidden sm:col-span-4 sm:flex pl-2">
              <div className="w-full flex flex-col">
              <div className="text-lg font-semibold">Author</div>
              <div className="flex flex-row items-center gap-4">
                <Avatar size="small" username={blog.author.username}/>
                <div className="flex flex-col text-left">
                  <p className="text-2xl font-bold">{blog.author.username}</p>
                  <p>Some random information about the author coming from the discription</p>
                </div>
              </div>
             

              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog