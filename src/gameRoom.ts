import * as colyseus from 'colyseus'
import { GameState } from './gameState'
import { PlayerEvent } from './events/playerEvent'
import { Game, CommandsMap } from './game'

export interface IGameRoom {
  game: Game
  setupGame(): void
  getGameState(): typeof GameState
  getCommands(): CommandsMap
}

export class GameRoom<T extends GameState> extends colyseus.Room<T> {

  name = 'Example Game'
  game: Game

  setupGame() { }
  getGameState(): typeof GameState {
    return GameState
  }
  getCommands(): CommandsMap {
    return new Map([])
  }

  onInit(options) {
    this.setState(new (this.getGameState())({
      minClients: options.minClients || 1,
      maxClients: options.maxClients || 2,
      host: options.host,
    }))

    this.setupGame()
    this.game = new Game({
      actions: this.getCommands()
    })

    console.log('WarGame room created!', options)
  }

  requestJoin(options, isNew) {
    const res = this.clients.length < this.state.maxClients
    if (!res) {
      console.log('rejected new client!')
    }
    return this.clients.length < this.state.maxClients
  }

  onJoin(client: colyseus.Client, options, auth) {
    console.log('JOINED: ', client.id)
    this.state.addClient(client.id)
    if (!this.state.host) {
      this.state.host = client.id
    }
  }

  onLeave(client: colyseus.Client) {
    this.state.removeClient(client.id)
    // TODO: Handle leave when the game is running
    // Timeout => end game? Make player able to go back in?
  }

  onMessage(client: colyseus.Client, data: PlayerEvent) {
    console.log('MSG: ', JSON.stringify(data))

    // TODO: Handle "StartGame" as - let all agree to start the game
    // if(data.action)

    this.game.performAction(client, this.state, data)
      .then(status => {
        console.log('action resolved!', status)
      })
      .catch(status => {
        this.broadcast({
          event: 'game.error',
          data: `Client "${client.id}" failed to perform "${data.action}" action.
          Details: ${status}`
        })
        console.warn(`Client "${client.id}" failed to perform "${data.action}" action.
        Details: ${status}`)
      })
  }

  onDispose() {
    console.log('Dispose game')
    console.log('===========================')
  }
}
