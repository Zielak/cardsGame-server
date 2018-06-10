import * as path from 'path'
import express from 'express'
import serveIndex from 'serve-index'
import * as http from 'http'
import * as colyseus from 'colyseus'

require('./consoleColors')

// Require ChatRoom handler
const rooms = {
    warGame: require('./warGame/index')
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
gameServer.register('warGame', rooms.warGame)

app.use(express.static(path.join(__dirname, 'static')))
app.use('/', serveIndex(path.join(__dirname, 'static'), { 'icons': true }))

gameServer.listen(port)

console.log(`Listening on http://localhost:${port}`)
