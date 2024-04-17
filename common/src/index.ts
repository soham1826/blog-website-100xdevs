import z from "zod";

export const signUpInput= z.object(
    {
        username:z.string(),
        email:z.string().email(),
        password:z.string().min(8)
    }
) 

export const signInInput= z.object(
    {
        email:z.string().email(),
        password:z.string().min(8)
    }
) 

export const createBlogInput= z.object(
    {
       title:z.string(),
       content:z.string()
    }
) 
export const updateBlogInput= z.object(
    {
       title:z.string(),
       content:z.string(),
       id:z.number()
    }
) 

export type signUpInput = z.infer<typeof signUpInput>
export type signInInput = z.infer<typeof signInInput>
export type updateBlogInput = z.infer<typeof updateBlogInput>
export type createBlogInput = z.infer<typeof createBlogInput>

