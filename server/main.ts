import createServer from './server.js'

const port = 3000

export async function main(vite: any = null) {
    const {
        app,
        server,
        socket,
    } = await createServer(vite)
    
    
    if(!vite) {
        server.listen(port)
        console.log(`Server listening on port ${port}`)
    }
}