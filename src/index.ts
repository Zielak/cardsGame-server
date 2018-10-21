import * as path from 'path'
import express from 'express'
import serveIndex from 'serve-index'
import * as http from 'http'
import * as colyseus from 'colyseus'
import { GameRoom } from './gameRoom'

require('./consoleColors')

export const CreateGameServer = (rooms: typeof GameRoom[]): colyseus.Server => {

  const port = parseInt('' + process.env.PORT) || 2657
  const app = express()

  // Create HTTP Server
  const httpServer = http.createServer(app)

  // Attach WebSocket Server on HTTP Server.
  const gameServer = new colyseus.Server({ server: httpServer })

  // Register each room
  rooms.forEach((gameRoom) => {
    console.info(`Registering game room named: ${gameRoom.name}`)
    gameServer.register(gameRoom.name, gameRoom).
      on('create', room => console.log('room created:', room.roomId)).
      on('dispose', room => console.log('room disposed:', room.roomId)).
      on('join', (room, client) => console.log(client.id, 'joined', room.roomId)).
      on('leave', (room, client) => console.log(client.id, 'left', room.roomId));
  })

  app.use(express.static(path.join(__dirname, 'static')))
  app.use('/', serveIndex(path.join(__dirname, 'static'), { 'icons': true }))

  gameServer.listen(port)

  console.log(`Listening on http://localhost:${port}`)

  return gameServer
}

export { Base } from './base'
export { BaseCard } from './baseCard'
export { ClassicCard } from './classicCard'
export { Command, ICommand, IComandConstructor, IExecutable } from './command'

import * as _DefaultCommands from './commands/index'
export { _DefaultCommands as DefaultCommands }

export { Condition } from './conditions/condition'
import { OR } from './conditions/condition'
import isClientPlaying from './conditions/isClientPlaying'
import isPlayersTurn from './conditions/isPlayersTurn'
import canStartGame from './conditions/canStartGame'
import isOwner from './conditions/isOwner'
export const Conditions = {
  OR, isClientPlaying, isPlayersTurn, canStartGame, isOwner
}

export { Container } from './container'
export { Deck } from './containers/deck'
export { Hand } from './containers/hand'
export { Pile } from './containers/pile'
export { Row } from './containers/row'
export { Spread } from './containers/spread'

export { GameState } from './gameState'
export { GameRoom } from './gameRoom'
export { Player } from './player'
import * as Presets from './presets'
export { PlayerEventRaw, PlayerEvent } from './events/playerEvent'
export { Presets }
export { Table } from './table'
