import { PrismaClient } from '@prisma/client'
import type { RequestHandler } from './__types/login'
import { serialize } from 'cookie'
import { loadEnv } from 'vite'

export const prisma = new PrismaClient()

type OutputType = { authenticated: boolean, error: string | null }

//implement a treshhold per login attempt
const treshold = 5
const loginTreshold = new Map<string, boolean>()

export const POST: RequestHandler<OutputType> = async ({ request, clientAddress }) => {
    const code = (await request.json())?.code

    if(loginTreshold.get(clientAddress) || false) {
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

    console.log(serialize('code', code, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: import.meta.env.PROD === true,
        maxAge: 60 * 60 * 24 * 7,
    }))
    return {
        headers: {
            'Set-Cookie': serialize('code', code, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: import.meta.env.PROD,
                maxAge: 60 * 60 * 24 * 7,
            })
        },
        body: {
            authenticated: true,
            error: null
        }
    }
}