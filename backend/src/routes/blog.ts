import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

blogRouter.use("/*", (c, next) => {
    //extracts the user id
    // passes it down to the route handler
    next();
})


blogRouter.post('/', async (c) => {

    const body = await c.req.json();

    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const post = await prisma.post.create({
    data:{
        title : body.title,
        content : body.content,
        authorId :  "1"
    }
  }) 

	return c.json({
        id : post.id
    })
})


blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    
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
            authorId :  "1"
        }
    })
    
	return c.json({
        id : post.id
    })
})

blogRouter.get('/', async (c) => {
    const body = await c.req.json();

    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try{
    const post = await prisma.post.findFirst({
        where :{
        id: body.id
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


// Add pagination
blogRouter.get('/bulk', async (c) => {
     const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blogs = await prisma.post.findMany();

  return c.json({
    blogs
  })
	return c.text('signin route')
})