import type { RequestHandler } from './__types/logout'
import { serialize } from 'cookie'
import { forgetUser } from '../../hooks'

export const GET: RequestHandler = async ({ request, clientAddress }) => {
    forgetUser(clientAddress)
    return {
        status: 303,
        headers: {
            'Set-Cookie': serialize('code', '', {
                path: '/',
                expires: new Date(0),
            })
        }
    }
}