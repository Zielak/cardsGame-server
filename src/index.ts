import * as path from 'path'
import express from 'express'
import serveIndex from 'serve-index'
import * as http from 'http'
import * as colyseus from 'colyseus'

import WarGame from './warGame/index'

require('./consoleColors')

// Require ChatRoom handler
const rooms = {
  WarGame
  // lobby: require('./lobby')
}

const port = parseInt('' + process.env.PORT) || 2657
const app = express()

// Create HTTP Server
const httpServer = http.createServer(app)

// Attach WebSocket Server on HTTP Server.
const gameServer = new colyseus.Server({ server: httpServer })

// Register Lobby as 'lobby'
// gameServer.register('lobby', Lobby)
gameServer.register('warGame', rooms.WarGame).
  on('create', room => console.log('room created:', room.roomId)).
  on('dispose', room => console.log('room disposed:', room.roomId)).
  on('join', (room, client) => console.log(client.id, 'joined', room.roomId)).
  on('leave', (room, client) => console.log(client.id, 'left', room.roomId));

app.use(express.static(path.join(__dirname, 'static')))
app.use('/', serveIndex(path.join(__dirname, 'static'), { 'icons': true }))

gameServer.listen(port)

console.log(`Listening on http://localhost:${port}`)
