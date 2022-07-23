import { PrismaClient } from '@prisma/client'
import type { RequestHandler } from './__types/login'

const prisma = new PrismaClient()

type OutputType = { authenticated: boolean }

export const POST: RequestHandler<OutputType> = async ({ request }) => {
    const code = (await request.json())?.code

    if (!code)
        return { body: { authenticated: false } }

    const response = await prisma.user.findFirst({
        where: {
            access_code: code
        }
    })

    if (!response)
        return { body: { authenticated: false } }

    return {
        body: {
            authenticated: true
        }
    }
}