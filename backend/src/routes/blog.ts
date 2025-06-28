import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from '@daddyonyx/monotype-common';

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string;
    }
}>();

blogRouter.use("/*", async (c, next) => {
    try{
        const authHeader = c.req.header("authorization") || "";
        const token = authHeader.split(" ")[1];
        const user = await verify(token, c.env.JWT_SECRET);
        if (user){
        c.set("userId", String(user.id));
            await next();
        } else{
            c.status(403);
            return c.json({
            msg: "You are not logged in"
        })
    }
    } catch(e){
        c.status(403);
        return c.json({
            "msg" : "you are not logged in"
        })
    }
})


blogRouter.post('/', async (c) => {

    const body = await c.req.json();

    const { success } = createBlogInput.safeParse(body);
      if(!success){
        c.status(411);
        return c.json({
          msg : "Inputs are incorrect"
        })
      }

    const authorId = c.get("userId");
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const post = await prisma.post.create({
    data:{
        title : body.title,
        content : body.content,
        authorId :  authorId
    }
  }) 

	return c.json({
        id : post.id
    })
})


blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    
     const { success } = updateBlogInput.safeParse(body);
      if(!success){
        c.status(411);
        return c.json({
          msg : "Inputs are incorrect"
        })
      }

    const authorId = c.get("userId")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const post = await prisma.post.update({
        where :{
            id: body.id
        },
        data:{
            title : body.title,
            content : body.content,
            authorId :  authorId
        }
    })
    
	return c.json({
        id : post.id
    })
})

// Add pagination
blogRouter.get('/bulk', async (c) => {
     const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blogs = await prisma.post.findMany();

  return c.json({
    blogs
  }) 
})

blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");

    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try{
    const post = await prisma.post.findFirst({
        where : {
            id: id
        }
    })
    return c.json({
        post
    })
  } catch(e){
    c.status(411)
    return c.text('Error while fetching post')
  }
  
})


export default blogRouter