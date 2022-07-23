import { PrismaClient } from '@prisma/client'
import type { RequestHandler } from './__types/login'

const prisma = new PrismaClient()

type OutputType = { authenticated: boolean, error: string | null }

//implement a treshhold per login attempt
const treshold = 5
const loginTreshold = new Map<string, boolean>()

export const POST: RequestHandler<OutputType> = async ({ request, clientAddress }) => {
    const code = (await request.json())?.code

    if(loginTreshold.get(clientAddress) || false) {
        console.log('login treshold reached')
        return { body : { authenticated: false, error: 'Too many login attempts' } }
    }

    loginTreshold.set(clientAddress, true)

    setTimeout(() => {
        loginTreshold.set(clientAddress, false)
    }, treshold * 1000)


    if (!code)
        return { body: { authenticated: false, error: 'Invalid code!' } }

    const response = await prisma.user.findFirst({
        where: {
            access_code: code
        }
    })

    if (!response)
        return { body: { authenticated: false, error: 'Invalid code!' } }

    return {
        body: {
            authenticated: true,
            error: null
        }
    }
}