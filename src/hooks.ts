import type { GetSession, Handle } from "@sveltejs/kit";
import { prisma } from "./routes/api/login";
import { parse } from 'cookie'

const cache = new Map<string, boolean>()

export function forgetUser(id: string) {
    cache.delete(id)
    console.log(cache)
}

export const handle: Handle = async ({ event, resolve }) => {
    if(event.url.pathname === '/api/logout')
        return await resolve(event)
    
    const header = event.request.headers.get("cookie");
    const cookies = parse(header || '')

    if(cache.get(event.clientAddress)) {
        event.locals.user = { authenticated: true }
        return await resolve(event)
    }

    if (!cookies.code)
        return await resolve(event)

    const session = await prisma.user.findFirst({
        where: {
            access_code: cookies.code
        }
    })

    if(!cache.get(event.clientAddress)) {
        cache.set(event.clientAddress, true)
    }

    if (!session)
        return await resolve(event)

    event.locals.user = { authenticated: true }
    return await resolve(event)
}

export const getSession: GetSession = ({ locals }) => {
    if(!locals.user) return {}

    return {
        user: {
            authenticated: locals.user.authenticated
        }
    }
}