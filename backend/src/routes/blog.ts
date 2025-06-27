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
    next();
})

blogRouter.get('/:id', (c) => {
	return c.text('get blog route')
})

blogRouter.post('/blog', (c) => {

	return c.text('signin route')
})

blogRouter.put('/blog', (c) => {
	return c.text('signin route')
})

blogRouter.get('/blogbulk', (c) => {
	return c.text('signin route')
})