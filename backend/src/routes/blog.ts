import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,decode, verify} from 'hono/jwt'
import { createBlogInput,updateBlogInput } from "@kulsoham/medium-common";

const blogRouter  = new Hono<{
    Bindings:{
      DATABASE_URL:string
      JWT_SECRET:string
    },
    Variables:{
      userId:string
    }
  }>()

  // middleware for user verification
blogRouter.use( "/*" ,async(c,next)=>{
  const authHeader = c.req.header('authorization')||"";
  const user = await verify(authHeader, c.env.JWT_SECRET)
  if(user){
    c.set("userId",user.id)
  }
  else{
    c.status(403);
    return c.json({
      msg:"You are not logged in"
    })
  }
  await next();
})


blogRouter.post('/', async(c) => {
  const body = await c.req.json();
  const authorId = c.get("userId")
  const {success} =  createBlogInput.safeParse(body);

  if(!success){
    return c.json({
      msg:"Incorrect inputs"
    })
  }
  const prisma = new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL
  }).$extends(withAccelerate())

  try {
    const blogPost = await prisma.blog.create({
      data:{
        content:body.content,
        title:body.title,
        authorId:Number(authorId),
      }
    })
    if(blogPost){
      c.status(200);
      return c.json({
        blog: blogPost,
        msg:"blog created succesfully"
      })
    }
  } catch (error) {
    c.status(403)
    return c.json({
      error:error,
      msg:"error while posting the blog"
    })
  }
  
  })



blogRouter.put('/', async(c) => {
  const body = await c.req.json();
  const {success} = updateBlogInput.safeParse(body)
  if(!success){
    return c.json({
      msg:"invalid inputs update failed"
    })
  }
  const prisma = new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL
  }).$extends(withAccelerate())

  try {
    const blogPost = await prisma.blog.update({
      where:{
        id:body.id
      },
      data:{
        title:body.title,
        content:body.content,
      }
    })
    if(blogPost){
      c.status(200)
      return c.json({
        blogId:blogPost.id,
        msg:"Blog updated successfully"
      })
    }
  } catch (error) {
    c.status(403)
    return c.json({
      error:error,
      msg:"error while updating the blog"
    })
  }
  })


  
  blogRouter.get("/bulk",async(c)=>{
    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
  
    try {
      const allBlogs = await prisma.blog.findMany({
        select:{
          content:true,
          title:true,
          id:true,
          author:{
            select:{
              username:true
            }
          }
        }
      })
      if(allBlogs){
        c.status(200)
        return c.json({
          blogs:allBlogs,
        })
      }
    } catch (error) {
      c.status(403)
      return c.json({
        error:error,
        msg:"Error while fetching the blogs"
      })
    }
  })


  
blogRouter.get("/:id",async(c)=>{
    const id = c.req.param('id') ;
    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
  
    try {
      const blogPost = await prisma.blog.findFirst({
        where:{
          id:parseInt(id)
        },
        select:{
          id:true,
          author:{
            select:{
              username:true
            }
          },
          content:true,
          title:true,
        }
      })
      if(blogPost){
        c.status(200)
        return c.json({
          blog:blogPost
        })
      }
    } catch (error) {
      c.status(403)
      return c.json({
        error:error,
        msg:"error while fetching the blog"
      })
    }
  }
  )
  

export {blogRouter}