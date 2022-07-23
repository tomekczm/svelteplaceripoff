import createServer from './server.js'
import { colors } from '../src/lib/shared'
import { prisma } from '../src/routes/api/login'

const canvas = new Array(100).fill(0).map(
    () => new Array(100).fill(0))

const port = 3000

export async function main(vite: any = null) {
    const {
        app,
        server,
        socket,
    } = await createServer(vite)

    socket.on('connection', (client) => {
        console.log('a user connected')
        client.emit('init_packet', {
            pixels: canvas
        })

        client.on('place_pixel', (data) => {

            if(data.x > 99 || data.y > 99 ||
                data.x < 0 || data.y < 0 ||
                data.color < 0 || data.color > colors.length
            ) return
                
            
            const code = data.code

            if(!code) 
                return

            const result = prisma.user.findFirst({
                where: {
                    access_code: code
                }
            })

            if(!result) 
                return

            canvas[data.y][data.x] = data.color

            socket.emit('place_pixel', {
                x: data.x,
                y: data.y,
                color: data.color
            })
        })
    })


    
    if(!vite) {
        server.listen(port)
        console.log(`Server listening on port ${port}`)
    }
}