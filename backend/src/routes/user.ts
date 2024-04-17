import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,decode, verify} from 'hono/jwt'
import { signUpInput,signInInput } from "@kulsoham/medium-common";

const userRouter  = new Hono<{
    Bindings:{
      DATABASE_URL:string
      JWT_SECRET:string
    }
  }>()


userRouter.post("signup",async(c) => {
    const body  = await c.req.json();
    const {success} = signInInput.safeParse(body)

    if(!success){
      return c.json({
        msg:"Incorrect Inputs"
      })
    }
    // We have to initialize prisma client for each route because we are using cloudflare workers i.e serveless workings and hence the DATABASE_URL is only available through the "C" which is only in routes
    const prisma  = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
  
    try {
      const user  = await prisma.user.create({
        data:{
          username:body.username,
          email:body.email,
          password:body.password
        }
        
      })
      const jwt  = await sign({id:user.id,username:user.username},c.env.JWT_SECRET)
  
      return c.json({user:{username:user.username,email:user.email,id:user.id,token:jwt}, msg:"Signup successfull"},200)
    } catch (error) {
      return c.json(error,411)
    }
    })

userRouter.post('signin',async(c) => {
        const body = await c.req.json();
        const{success} = signInInput.safeParse(body)
        const email = body.email;
        const password = body.password;
        if(!success){
          return c.json({
            msg:"Incorrect Inputs"
          })
        }
      
        const prisma = new PrismaClient({
          datasourceUrl:c.env.DATABASE_URL,
        }).$extends(withAccelerate())
      
        try {
          const user = await prisma.user.findFirst({
            where:{
              email:email,
              password:password
            },
          })
          if(!user){
            c.status(403)
            return c.json({
              err:"User Not found"
            })
          }
          const jwt =  await sign(
            {
              id:user.id,
              username:user.username
            },
            c.env.JWT_SECRET
          )
      
          c.status(200);
          return c.json({
            user:{
              username:user.username,
              email:user.email
            },
            msg:"signIn successfull",
            token:jwt
          })
        } catch (error) {
          
        }
      
      })

      export {userRouter}