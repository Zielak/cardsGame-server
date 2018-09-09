import * as colyseus from 'colyseus'
import { GameState } from './state'
import { PlayerEvent } from './events/playerEvent'
import { Game, ObjectWithCommands } from './game'

interface IGameRoom {
  game: Game
  actions: ObjectWithCommands

  setupGame(): void
  setActions(): ObjectWithCommands
}

export class GameRoom extends colyseus.Room<GameState> implements IGameRoom {

  name = 'Example Game'
  game: Game
  actions: ObjectWithCommands

  setupGame() { }
  setActions(): ObjectWithCommands { return {} }

  onInit(options) {
    this.setState(new GameState({
      minClients: options.minClients || 1,
      maxClients: options.maxClients || 2,
      host: options.host,
    }))

    this.actions = this.setActions()
    this.setupGame()
    this.game = new Game({
      actions: this.actions
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
    this.state.clients.add(client.id)
    if (!this.state.host) {
      this.state.host = client.id
    }
  }

  onLeave(client: colyseus.Client) {
    this.state.clients.remove(client.id)
    // TODO: Handle leave when the game is running
    // Timeout => end game? Make player able to go back in?
  }

  onMessage(client: colyseus.Client, data: PlayerEvent) {
    console.log('MSG: ', JSON.stringify(data))
    this.game.performAction(client, data, this.state)
      .then(status => {
        console.log('action resolved!', status)
      })
      .catch(status => {
        this.broadcast({
          event: 'game.error',
          data: `Client "${client.id}" failed to perform "${data.action}" action.
          Details: ${status}`
        })
      })
  }

  onGameStart() {

  }

  onDispose() {
    console.log('Dispose game')
    console.log('===========================')
  }
}
