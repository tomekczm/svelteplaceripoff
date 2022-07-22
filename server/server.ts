import type { ViteDevServer } from "vite";
import fs from 'fs'
import { Server } from 'socket.io'
import express from 'express'
import { createServer as createHttpServer } from "http";
import { handler } from '../build/handler.js'
 
/*
This function allowes us to create server during production and development.
*/
export default async function createServer(vite: ViteDevServer | null) {
    if (vite)
        return createViteServer(vite)

    console.log("Creating normal server")
    const app = express()

    app.use(handler)

    const server = createHttpServer(app)
    const socket = new Server(server)

    return {
        app: app,
        server: server,
        socket: socket
    }
    

}
  
function createViteServer(vite: ViteDevServer) {

    if(!vite.httpServer)
        throw new Error('This shouldn\'t happen?')

    const socket = new Server(vite.httpServer)
    const app = express()
    app.use(vite.middlewares)
    
    return {
        socket: socket,
        server: vite.httpServer,
        app: app
    }
}
